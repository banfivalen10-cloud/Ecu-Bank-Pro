import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Check,
  Crown,
  ShieldCheck,
  Zap,
  Lock,
  Sparkles,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

export default function Pricing() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: plans } = trpc.membership.plans.useQuery();
  const [selectedPlan, setSelectedPlan] = useState<string>("vip-lifetime");
  const [isProcessing, setIsProcessing] = useState(false);

  const purchaseMutation = trpc.membership.simulatePurchase.useMutation({
    onSuccess: (data) => {
      utils.auth.me.invalidate();
      setIsProcessing(false);
      toast.success("¡Pago completado con éxito!", {
        description: `Referencia: ${data.reference}. Tu cuenta ahora tiene acceso ilimitado a todos los módulos y descargas.`,
      });
      setLocation("/");
    },
    onError: (err) => {
      setIsProcessing(false);
      toast.error("Error al procesar la compra", {
        description: err.message,
      });
    },
  });

  const isVip = user?.membershipStatus === "vip_lifetime" || user?.membershipStatus === "vip_monthly";

  const handleBuy = (plan: { name: string; priceUsd: number }) => {
    if (!isAuthenticated) {
      toast.info("Inicia sesión primero", {
        description: "Necesitas iniciar sesión para que el acceso quede vinculado permanentemente a tu usuario.",
      });
      setLocation("/login");
      return;
    }

    setIsProcessing(true);
    purchaseMutation.mutate({
      planName: plan.name,
      amountUsd: plan.priceUsd,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex-1 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-4">
            <Crown className="h-4 w-4 text-amber-400" />
            Acceso Exclusivo a Profesionales
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Planes de Acceso y Compra
          </h1>
          <p className="text-base text-slate-300 mt-3">
            Elige el formato de suscripción o pago único. El acceso queda enlazado de forma inmediata e intransferible a tu usuario.
          </p>
        </div>

        {isVip && (
          <div className="mb-10 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center max-w-xl mx-auto flex items-center justify-center gap-3">
            <CheckCircle2 className="h-6 w-6 shrink-0" />
            <div className="text-sm font-semibold">
              ¡Tu usuario ya cuenta con membresía activa ({user.membershipStatus})! Tienes acceso total a las descargas.
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans?.map((plan) => {
            const isLifetime = plan.id === "vip-lifetime";

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 relative flex flex-col justify-between transition-all ${
                  isLifetime
                    ? "bg-slate-900/90 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/10"
                    : "bg-slate-900/50 border border-white/10"
                }`}
              >
                {isLifetime && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md">
                    Más Popular • Pago Único
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <Badge variant="outline" className="border-white/10 text-slate-400">
                      {plan.badge}
                    </Badge>
                  </div>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white">
                      ${plan.priceUsd}
                    </span>
                    <span className="text-sm text-slate-400">
                      {isLifetime ? "USD pago único" : "USD / mes"}
                    </span>
                  </div>

                  <div className="space-y-3 mb-8">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                        <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Button
                    disabled={isProcessing}
                    onClick={() => handleBuy(plan)}
                    className={`w-full h-12 font-bold rounded-xl text-sm ${
                      isLifetime
                        ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20"
                        : "bg-white/10 hover:bg-white/15 text-white"
                    }`}
                  >
                    {isProcessing ? (
                      "Procesando acceso..."
                    ) : isVip ? (
                      "Ya Tienes Acceso Activo"
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Comprar y Vincular a mi Cuenta
                      </>
                    )}
                  </Button>

                  <p className="text-[11px] text-slate-500 text-center mt-3">
                    Activación instantánea y vinculación con carpetas protegidas.
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security / FAQ Banner */}
        <div className="mt-16 p-6 rounded-2xl bg-white/[0.02] border border-white/5 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Acceso Único y Blindado</div>
              <div className="text-xs text-slate-400">
                Cada credencial se asocia a la sesión del usuario. Luego cuando conectes tu carpeta de Google Drive, las descargas solo se abrirán para usuarios validados.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
