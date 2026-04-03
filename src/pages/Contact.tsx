import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Truck, MessageSquare, Phone, Building, User, Mail, Sparkles, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           className="p-12 sm:p-20 bg-white/80 backdrop-blur-2xl rounded-[3rem] border border-white shadow-2xl max-w-2xl"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-black mb-4">¡Solicitud Recibida!</h1>
          <p className="text-xl text-black/50 leading-relaxed font-medium mb-10 max-w-md mx-auto">
             Gracias por tu interés. Un representante de cuentas corporativas te contactará en las próximas 24hs hábiles para coordinar la firma del contrato.
          </p>
          <Link to="/">
            <Button variant="primary" className="px-10 py-5 rounded-2xl text-lg font-bold">Volver al Inicio</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-start p-6 pt-20 relative overflow-hidden">
      {/* Abstract Background for Premium Feel */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0066CC]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none rotate-45" />

      <Link to="/" className="mb-16 flex items-center gap-2 relative z-10 transition-transform hover:scale-105">
        <div className="w-10 h-10 bg-[#0066CC] rounded-xl flex items-center justify-center shadow-lg shadow-[#0066CC]/20">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-2xl tracking-tighter text-[#1D1D1F]">LogiTrack <span className="text-[#0066CC] italic ml-1">Enterprise</span></span>
      </Link>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-12 relative z-10 items-center justify-center">
        {/* Value Proposition Left Side */}
        <div className="lg:col-span-2 space-y-12 pr-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066CC]/10 text-[#0066CC] font-bold text-xs uppercase tracking-widest mb-6 border border-[#0066CC]/20">
              <Sparkles className="w-3.5 h-3.5" /> Plan Corporativo
            </div>
            <h1 className="text-5xl font-bold tracking-tighter leading-tight mb-6">
               Eleva tu negocio<br /> al siguiente nivel.
            </h1>
            <p className="text-lg text-black/50 leading-relaxed font-medium">
              Obtén acceso a una red logística de alto volumen con beneficios exclusivos para firmas corporativas.
            </p>
          </motion.div>

          <div className="space-y-6">
            <FeatureItem icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} text="Tarifas preferenciales por zona logisítica." />
            <FeatureItem icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} text="Esquema de pagos a 30 días fijados por contrato." />
            <FeatureItem icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} text="Seguro de carga incluido y prioridad de sorting." />
          </div>
        </div>

        {/* Consulting Form Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3 h-full flex flex-col justify-center"
        >
          <Card className="p-10 sm:p-14 bg-white/80 backdrop-blur-3xl shadow-2xl border border-white">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
               <MessageSquare className="w-6 h-6 text-[#0066CC]" />
               Hablar con un representante
            </h2>

            <form onSubmit={handleContact} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputGroup label="Nombre y Apellido" icon={<User className="w-4 h-4" />} placeholder="Ej: Roberto Sánchez" />
                <InputGroup label="Empresa" icon={<Building className="w-4 h-4" />} placeholder="Tu Razón Social" />
                <InputGroup label="Email Corporativo" icon={<Mail className="w-4 h-4" />} placeholder="ejemplo@empresa.com" />
                <InputGroup label="Teléfono / WhatsApp" icon={<Phone className="w-4 h-4" />} placeholder="+54 9 11 5555-0000" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-black/40 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Truck className="w-3.5 h-3.5 opacity-40"/> Volumen mensual estimado
                    </label>
                    <select className="w-full h-11 px-4 py-2 text-sm rounded-xl border border-black/10 bg-white/50 backdrop-blur-md focus:ring-2 focus:ring-[#0066CC] outline-none">
                       <option>500 - 1,000 paquetes</option>
                       <option>1,000 - 5,000 paquetes</option>
                       <option>5,000+ paquetes</option>
                    </select>
                 </div>
                 <InputGroup label="Zonas de interés" icon={<MapPin className="w-4 h-4" />} placeholder="Ej: GBA Norte, CABA" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-black/40 uppercase tracking-widest ml-1">Comentarios adicionales</label>
                <textarea 
                  className="w-full h-24 p-4 rounded-xl border border-black/10 bg-white/50 focus:ring-2 focus:ring-[#0066CC] outline-none text-sm"
                  placeholder="Cuéntanos más sobre tus necesidades logísticas..."
                />
              </div>

              <Button type="submit" className="w-full py-7 text-lg rounded-2xl shadow-xl shadow-[#0066CC]/20 hover:scale-[1.02] transition-transform">
                Solicitar Consultoría Inicial
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function InputGroup({ label, icon, placeholder }: { label: string, icon: React.ReactNode, placeholder: string }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-black/40 uppercase tracking-widest ml-1 flex items-center gap-1.5 font-black">
        <span className="opacity-40">{icon}</span>
        {label}
      </label>
      <Input placeholder={placeholder} className="h-11 rounded-xl bg-white/50 backdrop-blur-md" required />
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-10 h-10 rounded-xl bg-white border border-black/5 shadow-sm flex items-center justify-center transition-transform group-hover:scale-110">
        {icon}
      </div>
      <span className="text-sm font-semibold text-black/70">{text}</span>
    </div>
  );
}
