import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Truck, CheckCircle2, User, Building, Mail, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0066CC]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <Link to="/" className="mb-12 flex items-center gap-2 relative z-10 transition-transform hover:scale-105">
        <div className="w-10 h-10 bg-[#0066CC] rounded-xl flex items-center justify-center shadow-lg shadow-[#0066CC]/20">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-2xl tracking-tighter text-[#1D1D1F]">LogiTrack</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl relative z-10"
      >
        <Card className="p-8 sm:p-12 overflow-hidden shadow-2xl shadow-black/5 bg-white/80 backdrop-blur-xl border border-white">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#1D1D1F] mb-1">
                {step === 1 ? "Registro Gratuito" : "Configura tu negocio"}
              </h1>
              <p className="text-black/50 text-sm font-medium">Empieza a enviar con LogiTrack en minutos.</p>
            </div>
            <div className="flex gap-1.5">
              <div className={cn("w-8 h-1.5 rounded-full transition-all", step === 1 ? "bg-[#0066CC]" : "bg-black/10")} />
              <div className={cn("w-8 h-1.5 rounded-full transition-all", step === 2 ? "bg-[#0066CC]" : "bg-black/10")} />
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {step === 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
                <InputWrapper label="Nombre Completo" icon={<User className="w-4 h-4" />}>
                  <Input placeholder="Ej: Juan Pérez" required />
                </InputWrapper>
                <InputWrapper label="Correo corporativo" icon={<Mail className="w-4 h-4" />}>
                  <Input type="email" placeholder="ejemplo@empresa.com" required />
                </InputWrapper>
                <InputWrapper label="Empresa / Vendedor" icon={<Building className="w-4 h-4" />}>
                  <Input placeholder="Nombre de tu tienda" required />
                </InputWrapper>
                <InputWrapper label="Contraseña" icon={<Lock className="w-4 h-4" />}>
                  <Input type="password" placeholder="••••••••" required />
                </InputWrapper>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-6 bg-[#0066CC]/5 border border-[#0066CC]/10 rounded-3xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#0066CC] flex items-center justify-center shadow-lg shadow-[#0066CC]/30">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0066CC] uppercase tracking-widest">Plan PyME Seleccionado</h4>
                    <p className="text-[13px] text-black/60 leading-tight mt-1">Sin costos de mantenimiento. Paga solo lo que envías vía Mercado Pago.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputWrapper label="CUIT / CUIL (Opcional)" icon={<Building className="w-4 h-4" />}>
                    <Input placeholder="30-XXXXXX-X" />
                  </InputWrapper>
                  <InputWrapper label="Teléfono / WhatsApp" icon={<Mail className="w-4 h-4" />}>
                    <Input placeholder="+54 9 11 5555-0000" />
                  </InputWrapper>
                </div>
                <div className="pt-4 border-t border-black/5">
                   <div className="flex items-center gap-2 text-xs font-semibold text-black/40 mb-4">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Acepto los términos de servicio y políticas de privacidad
                   </div>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full text-lg py-7 rounded-2xl shadow-xl shadow-[#0066CC]/20 hover:scale-[1.01] transition-transform">
              {step === 1 ? "Continuar" : "Crear mi cuenta gratis"}
            </Button>
          </form>

          <p className="mt-10 text-center text-sm text-black/50 font-medium">
            ¿Ya tienes una cuenta? <Link to="/login" className="text-[#0066CC] hover:underline font-bold">Inicia sesión</Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

function InputWrapper({ label, icon, children }: { label: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-black/40 uppercase tracking-widest ml-1 flex items-center gap-1.5">
        <span className="opacity-40">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
