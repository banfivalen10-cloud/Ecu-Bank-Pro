import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return null;
      const fullUser = await db.getUserById(ctx.user.id);
      return fullUser ?? ctx.user;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  library: router({
    modules: publicProcedure.query(async () => {
      return db.getModules();
    }),
    moduleDetail: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const mod = await db.getModuleById(input.id);
        const files = await db.getFilesByModule(input.id);
        return {
          module: mod,
          files,
        };
      }),
    searchFiles: publicProcedure
      .input(
        z.object({
          moduleId: z.string().optional(),
          query: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return db.getFilesByModule(input.moduleId, input.query);
      }),
  }),

  membership: router({
    plans: publicProcedure.query(() => {
      return [
        {
          id: "vip-lifetime",
          name: "Acceso Total Vitalicio",
          priceUsd: 149,
          badge: "Recomendado",
          features: [
            "Acceso ilimitado a los 6 módulos",
            "Buscador completo de archivos por marca, centralita y software",
            "Banco de Stages, DAMOS y Mappacks",
            "Curso WinOLS completo paso a paso",
            "Pack de instaladores y 170+ softwares de reparación",
            "Enlace directo listo para sincronización con Google Drive",
          ],
        },
        {
          id: "vip-monthly",
          name: "Suscripción Mensual",
          priceUsd: 39,
          badge: "Flexible",
          features: [
            "Acceso completo durante 30 días",
            "Descarga de archivos verificados",
            "Actualizaciones de banco en tiempo real",
            "Soporte para enlaces a carpetas de Drive",
          ],
        },
      ];
    }),

    simulatePurchase: protectedProcedure
      .input(
        z.object({
          planName: z.string(),
          amountUsd: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return db.recordPurchase(ctx.user.id, input.planName, input.amountUsd);
      }),

    simulateDirectAccess: protectedProcedure
      .input(
        z.object({
          tier: z.enum(["vip_lifetime", "vip_monthly", "free"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return db.updateUserMembership(ctx.user.id, input.tier);
      }),
  }),
});

export type AppRouter = typeof appRouter;
