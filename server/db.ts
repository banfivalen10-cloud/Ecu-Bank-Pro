import { desc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  driveFiles,
  DriveFile,
  InsertDriveFile,
  InsertModule,
  InsertUser,
  modules,
  Module,
  purchases,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserMembership(userId: number, membershipStatus: "free" | "vip_lifetime" | "vip_monthly") {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(users).set({
    membershipStatus,
    updatedAt: new Date(),
  }).where(eq(users.id, userId));

  return getUserById(userId);
}

export async function getModules(): Promise<Module[]> {
  const db = await getDb();
  if (!db) return [];
  await ensureSeedData();
  return db.select().from(modules).orderBy(modules.orderIndex);
}

export async function getModuleById(id: string): Promise<Module | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  await ensureSeedData();
  const result = await db.select().from(modules).where(eq(modules.id, id)).limit(1);
  return result[0];
}

export async function getFilesByModule(moduleId?: string, search?: string): Promise<DriveFile[]> {
  const db = await getDb();
  if (!db) return [];
  await ensureSeedData();

  if (moduleId && search) {
    const pattern = `%${search.toLowerCase()}%`;
    return db
      .select()
      .from(driveFiles)
      .where(
        sql`${driveFiles.moduleId} = ${moduleId} AND (${driveFiles.name} LIKE ${pattern} OR ${driveFiles.brand} LIKE ${pattern} OR ${driveFiles.ecuType} LIKE ${pattern} OR ${driveFiles.tags} LIKE ${pattern})`
      )
      .orderBy(desc(driveFiles.createdAt));
  }

  if (moduleId) {
    return db
      .select()
      .from(driveFiles)
      .where(eq(driveFiles.moduleId, moduleId))
      .orderBy(desc(driveFiles.createdAt));
  }

  if (search) {
    const pattern = `%${search.toLowerCase()}%`;
    return db
      .select()
      .from(driveFiles)
      .where(
        or(
          like(driveFiles.name, pattern),
          like(driveFiles.brand, pattern),
          like(driveFiles.ecuType, pattern),
          like(driveFiles.tags, pattern),
          like(driveFiles.category, pattern)
        )
      )
      .orderBy(desc(driveFiles.createdAt));
  }

  return db.select().from(driveFiles).orderBy(desc(driveFiles.createdAt));
}

export async function recordPurchase(userId: number, planName: string, amountUsd: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const purchaseId = `tb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const reference = `TB-${Math.floor(100000 + Math.random() * 900000)}`;

  await db.insert(purchases).values({
    id: purchaseId,
    userId,
    planName,
    amountUsd,
    status: "completed",
    referenceCode: reference,
  });

  const status = planName.toLowerCase().includes("mes") ? "vip_monthly" : "vip_lifetime";
  await updateUserMembership(userId, status);

  return {
    purchaseId,
    reference,
    planName,
    amountUsd,
  };
}

export async function ensureSeedData() {
  const db = await getDb();
  if (!db) return;

  const existingFiles = await db.select({ id: driveFiles.id }).from(driveFiles).limit(1);
  if (existingFiles.length > 0) {
    return;
  }

  const existingModules = await db.select({ id: modules.id }).from(modules).limit(1);
  if (existingModules.length === 0) {
    const seedModules: InsertModule[] = [
      {
        id: "stage-damos",
        code: "MÓDULO 01",
        title: "Banco de Archivos, Stage, DAMOS, Mappacks",
        subtitle: "Biblioteca completa de recursos",
        description: "Acceso ilimitado al banco de archivos originales y modificados, Stages de potencia, archivos DAMOS y Mappacks organizados por marca y modelo.",
        icon: "Database",
        accentColor: "#38bdf8",
        tags: JSON.stringify(["ORIGINALES", "STAGE 1-3", "DAMOS", "MAPPACKS"]),
        fileCountEstimate: 14200,
        driveFolderId: "DRIVE_FOLDER_STAGE_DAMOS",
        orderIndex: 1,
        requiresVip: true,
      },
      {
        id: "curso-winols",
        code: "MÓDULO 02",
        title: "Curso WinOLS para Descarga",
        subtitle: "Formación completa paso a paso",
        description: "Curso profesional desde cero hasta nivel avanzado. Aprende a leer, editar y grabar centralitas con WinOLS de forma segura.",
        icon: "GraduationCap",
        accentColor: "#f59e0b",
        tags: JSON.stringify(["DESDE CERO", "CERTIFICADO", "PRÁCTICO"]),
        fileCountEstimate: 36,
        driveFolderId: "DRIVE_FOLDER_CURSO_WINOLS",
        orderIndex: 2,
        requiresVip: true,
      },
      {
        id: "winols-software",
        code: "MÓDULO 03",
        title: "WinOLS",
        subtitle: "Software profesional de reprogramación",
        description: "Guía de instalación, licenciamiento y uso avanzado de WinOLS, el estándar mundial para modificar centralitas electrónicas.",
        icon: "Cpu",
        accentColor: "#10b981",
        tags: JSON.stringify(["INSTALACIÓN", "CONFIGURACIÓN", "USO AVANZADO"]),
        fileCountEstimate: 18,
        driveFolderId: "DRIVE_FOLDER_WINOLS_SW",
        orderIndex: 3,
        requiresVip: true,
      },
      {
        id: "ecm-titanium",
        code: "MÓDULO 04",
        title: "ECM Titanium",
        subtitle: "Editor alternativo con drivers ilimitados",
        description: "Aprende a trabajar con ECM Titanium: instalación, drivers, edición de mapas y compatibilidad con las principales centralitas del mercado.",
        icon: "Zap",
        accentColor: "#8b5cf6",
        tags: JSON.stringify(["DRIVERS", "MAPAS", "COMPATIBILIDAD"]),
        fileCountEstimate: 24,
        driveFolderId: "DRIVE_FOLDER_ECM_TITANIUM",
        orderIndex: 4,
        requiresVip: true,
      },
      {
        id: "software-remap",
        code: "MÓDULO 05",
        title: "Paquete de Software Profesional para Remap",
        subtitle: "Suite completa de herramientas de reprogramación",
        description: "Incluye instaladores, activadores, generadores de contraseña y versión simplificada para taller. Todo lo necesario para empezar a remapar.",
        icon: "Box",
        accentColor: "#06b6d4",
        tags: JSON.stringify(["INSTALADORES", "ACTIVADORES", "ÚTILES"]),
        fileCountEstimate: 85,
        driveFolderId: "DRIVE_FOLDER_REMAP_SUITE",
        orderIndex: 5,
        requiresVip: true,
      },
      {
        id: "key-immo-airbag",
        code: "MÓDULO 06",
        title: "Key Code-v2 / Immo OFF / KM / Airbag / Servicio / Programador",
        subtitle: "Más de 170 softwares para servicios y reparación de módulos",
        description: "Más de 170 softwares para servicios de ajuste y reparación de módulos de varias marcas: Key Code, Inmo OFF, corrección de KM, reseteo de Airbag, Service y programadores.",
        icon: "Key",
        accentColor: "#ec4899",
        tags: JSON.stringify(["KEY CODE", "IMMO OFF", "KM", "AIRBAG", "PROGRAMADORES"]),
        fileCountEstimate: 174,
        driveFolderId: "DRIVE_FOLDER_KEY_IMMO",
        orderIndex: 6,
        requiresVip: true,
      },
    ];

    await db.insert(modules).values(seedModules);
  }

  const seedFiles: InsertDriveFile[] = [
    {
      id: "file-01",
      moduleId: "stage-damos",
      name: "VW_Golf_7_2.0TDI_EDC17C74_Stage1_PopBang.bin",
      category: "Stage 1 Remap",
      extension: "BIN",
      sizeBytes: 2097152,
      driveId: "1A2B3C4D_GOLF7_EDC17",
      driveWebLink: "https://drive.google.com/drive/folders/tunebank-stage-damos",
      downloadUrl: "#",
      brand: "Volkswagen",
      ecuType: "Bosch EDC17C74",
      softwareName: "WinOLS 4.51",
      version: "v1.4",
      description: "Archivo Stage 1 probado en banco +184HP/+400Nm con DPF/EGR safe.",
      tags: "vw, golf, tdi, edc17, stage1",
      isVerified: true,
    },
    {
      id: "file-02",
      moduleId: "stage-damos",
      name: "BMW_F30_320d_EDC17C50_DAMOS_FullMappack.a2l",
      category: "DAMOS & A2L",
      extension: "A2L",
      sizeBytes: 4194304,
      driveId: "1B3C4D5E_BMW_F30_A2L",
      driveWebLink: "https://drive.google.com/drive/folders/tunebank-stage-damos",
      downloadUrl: "#",
      brand: "BMW",
      ecuType: "Bosch EDC17C50",
      softwareName: "WinOLS",
      version: "v2.0",
      description: "Definición completa con mapas de inyección, rail y presión turbo.",
      tags: "bmw, f30, damos, a2l, mappack",
      isVerified: true,
    },
    {
      id: "file-03",
      moduleId: "stage-damos",
      name: "Audi_S3_8V_2.0TFSI_SIMOS18.1_Original_VR.bin",
      category: "Archivo Original",
      extension: "BIN",
      sizeBytes: 4194304,
      driveId: "1C4D5E6F_AUDI_S3_SIMOS18",
      driveWebLink: "https://drive.google.com/drive/folders/tunebank-stage-damos",
      downloadUrl: "#",
      brand: "Audi",
      ecuType: "Continental SIMOS 18.1",
      softwareName: "PCMFlash / KESS3",
      version: "OEM",
      description: "Lectura virtual verificada 100% original stock.",
      tags: "audi, simos18, original, tfsi",
      isVerified: true,
    },
    {
      id: "file-04",
      moduleId: "curso-winols",
      name: "Clase_01_Introduccion_WinOLS_Mapas_3D.mp4",
      category: "Video Formación",
      extension: "MP4",
      sizeBytes: 420000000,
      driveId: "DRIVE_WINOLS_C01",
      driveWebLink: "https://drive.google.com/drive/folders/tunebank-curso-winols",
      downloadUrl: "#",
      brand: "Universal",
      ecuType: "Metodología General",
      softwareName: "WinOLS",
      version: "HD 1080p",
      description: "Estructura del mapa, ejes de RPM, carga, interpolación y visualización.",
      tags: "curso, video, clase 1, basico",
      isVerified: true,
    },
    {
      id: "file-05",
      moduleId: "curso-winols",
      name: "Guia_Ejes_Checksum_Calculo_Seguro.pdf",
      category: "Documentación Técnica",
      extension: "PDF",
      sizeBytes: 8500000,
      driveId: "DRIVE_WINOLS_DOCS",
      driveWebLink: "https://drive.google.com/drive/folders/tunebank-curso-winols",
      downloadUrl: "#",
      brand: "Universal",
      ecuType: "Checksum",
      softwareName: "WinOLS Manual",
      version: "2026",
      description: "Procedimiento para corregir checksums antes de flashear.",
      tags: "manual, pdf, checksum, winols",
      isVerified: true,
    },
    {
      id: "file-06",
      moduleId: "winols-software",
      name: "WinOLS_Setup_v4.51_Full_Library.zip",
      category: "Instalador",
      extension: "ZIP",
      sizeBytes: 154000000,
      driveId: "DRIVE_WINOLS_SETUP",
      driveWebLink: "https://drive.google.com/drive/folders/tunebank-winols-setup",
      downloadUrl: "#",
      brand: "EVC",
      ecuType: "Universal",
      softwareName: "WinOLS",
      version: "4.51",
      description: "Paquete base con librerías y documentación de instalación.",
      tags: "winols, setup, evc, instalador",
      isVerified: true,
    },
    {
      id: "file-07",
      moduleId: "ecm-titanium",
      name: "ECM_Titanium_Drivers_Database_26000.zip",
      category: "Base de Drivers",
      extension: "ZIP",
      sizeBytes: 980000000,
      driveId: "DRIVE_ECM_DRIVERS",
      driveWebLink: "https://drive.google.com/drive/folders/tunebank-ecm-titanium",
      downloadUrl: "#",
      brand: "Alientech",
      ecuType: "Multi-marca",
      softwareName: "ECM Titanium",
      version: "26k Drivers",
      description: "Paquete de drivers listos para identificar tablas rápidamente.",
      tags: "ecm, alientech, drivers, titanium",
      isVerified: true,
    },
    {
      id: "file-08",
      moduleId: "software-remap",
      name: "Remap_Toolbox_Suite_2026_Utilities.rar",
      category: "Herramientas Taller",
      extension: "RAR",
      sizeBytes: 650000000,
      driveId: "DRIVE_REMAP_SUITE",
      driveWebLink: "https://drive.google.com/drive/folders/tunebank-remap-pack",
      downloadUrl: "#",
      brand: "Universal",
      ecuType: "Multi-marca",
      softwareName: "Toolbox Suite",
      version: "2026.1",
      description: "Generadores de scripts, calculadoras de DTC y utilidades automotrices.",
      tags: "remap, suite, dtc, utilidades",
      isVerified: true,
    },
    {
      id: "file-09",
      moduleId: "key-immo-airbag",
      name: "ImmoOff_AirbagReset_170_Softwares_Collection.iso",
      category: "Reparación Módulos",
      extension: "ISO",
      sizeBytes: 3200000000,
      driveId: "DRIVE_IMMO_AIRBAG_ISO",
      driveWebLink: "https://drive.google.com/drive/folders/tunebank-immo-airbag",
      downloadUrl: "#",
      brand: "Multi-marca",
      ecuType: "BSI / UCH / Airbag",
      softwareName: "170+ Suite",
      version: "Full Pack",
      description: "Colección para anulación de inmovilizador, reset de crash airbag y ajuste de cuadros.",
      tags: "immo off, airbag, km, key code, 170 software",
      isVerified: true,
    },
  ];

  await db.insert(driveFiles).values(seedFiles);
}
