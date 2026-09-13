# TuneBank | Arquitectura de la Plataforma y Guía de Conexión a Google Drive

Esta plataforma ha sido desarrollada con una arquitectura **full-stack moderna y modular** diseñada específicamente para la entrega segura de recursos de reprogramación automotriz, formación técnica y paquetes de software.

---

## 1. Características Implementadas en la Maqueta Base

1. **Diseño Visual Inspirado en la Referencia:**
   - Paleta de color oscura profunda (`#050811`), acentos cian/neón automotrices y tarjetas pulidas con efectos de elevación (*glow-card*).
   - Estructura de los **6 módulos principales** idéntica a la imagen de referencia (WinOLS, DAMOS/Mappacks, ECM Titanium, Software Remap, Key Code/Immo OFF/Airbag).
   - Selector visual de idioma (ES / EN) y etiquetas de metadatos automotrices (*STAGE 1-3*, *EDC17*, *A2L*, *DAMOS*).

2. **Control de Acceso y Membresía Vinculada:**
   - Estado de usuario con roles y categorías de membresía: `free`, `vip_lifetime`, `vip_monthly`.
   - Simulación interactiva de compra con referencia de facturación y asignación instantánea de acceso VIP sin recargar la página.
   - Restricción condicional: los archivos y carpetas muestran candado o botón de descarga según el estado de la cuenta.

3. **Buscador Indexado de Google Drive:**
   - Motor de búsqueda por texto libre, marca de vehículo (Volkswagen, BMW, Audi, etc.), tipo de ECU (Bosch EDC17, Continental SIMOS, etc.) y módulo de origen.
   - Cada archivo almacena su identificador único de Drive, enlace de navegación en nube y enlace de descarga directa.

4. **Vistas Individuales de Cada Módulo:**
   - Vista detallada (`/module/:id`) preparada para mostrar la estructura interna de archivos y subcarpetas cuando envíes las fotos de cada sección.

---

## 2. Cómo Conectar tu Carpeta de Google Drive

La base de datos relacional ya cuenta con los campos necesarios en la tabla `drive_files` y `modules`:

| Campo en Base de Datos | Descripción | Ejemplo de Google Drive |
|---|---|---|
| `driveFolderId` | ID de la carpeta principal del módulo en Drive | `1A2b3C4dEfGhIjKlMnOpQrStUv` |
| `driveId` | ID del archivo específico en Google Drive | `1Z9y8X7wVuTsRqPoNmLkJiHgFe` |
| `driveWebLink` | Enlace para previsualizar la carpeta en Drive | `https://drive.google.com/drive/folders/...` |
| `downloadUrl` | Enlace de descarga directa generado por Google API | `https://drive.google.com/uc?export=download&id=...` |

### Pasos Técnicos para la Sincronización Automática:
1. **Opción A (Sincronización por API Oficial de Google Drive):**
   - Habilitar el conector de **Google Workspace** en el proyecto.
   - El backend leerá la carpeta raíz de tu cuenta de Google Drive y poblará la tabla `drive_files` en tiempo real.
2. **Opción B (Importación por archivo CSV / JSON):**
   - Si descargas la carpeta localmente, podemos ejecutar un script de indexación local que lea los nombres de archivo y genere automáticamente la base de datos completa.

---

## 3. Rutas Disponibles en la Aplicación

- **Inicio / Catálogo:** `/`
- **Buscador de Archivos:** `/drive-explorer`
- **Detalle de Módulo:** `/module/:id` (ej. `/module/stage-damos`)
- **Planes y Compra:** `/pricing`
- **Inicio de Sesión y Credenciales:** `/login`
