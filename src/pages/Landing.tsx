import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Box, Truck, FileText, ArrowRight, ScanLine, Smartphone, Wallet, Network, CheckCircle2, MessageSquare, CreditCard, Building, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import MapBackground from "@/components/MapBackground";
import CoverageMap from "@/components/CoverageMap";
import { cn } from "@/lib/utils";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] selection:bg-[#0066CC] selection:text-white relative">
      <MapBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0066CC] rounded-xl flex items-center justify-center shadow-lg shadow-[#0066CC]/20">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">LogiTrack</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-[#0066CC] transition-colors">Iniciar Sesión</Link>
          <Link to="/login">
            <Button variant="primary" className="px-4 py-2 h-auto text-xs shadow-md shadow-[#0066CC]/20">Comenzar</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 max-w-5xl mx-auto text-center z-10 flex flex-col items-center justify-center min-h-[85vh]">
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="bg-white/40 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-[3rem] p-12 md:p-20 w-full max-w-4xl"
           style={{
             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
           }}
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-semibold tracking-tighter leading-tight mb-6"
          >
            Logística inteligente.<br />
            <span className="text-[#0066CC]">Para vendedores exigentes.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-[#1D1D1F]/80 max-w-2xl mx-auto mb-10 font-medium"
          >
            Trazabilidad en tiempo real, autogestión de pickups y facturación integrada. Todo en una plataforma diseñada para escalar tu negocio.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/login">
              <Button className="w-full sm:w-auto text-lg px-8 py-4 shadow-xl shadow-[#0066CC]/20 hover:scale-105 transition-transform">
                Acceder al sistema
              </Button>
            </Link>
            <a href="#plans">
              <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4 group bg-white/50 backdrop-blur-md border border-white/60 hover:bg-white/70">
                Ver Planes y Tarifas
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-semibold tracking-tight mb-6"
          >
            Todo lo que necesitas para tu logística de última milla.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-black/60 font-medium leading-relaxed"
          >
            Olvídate de procesos manuales y couriers desvinculados. Con LogiTrack centralizas la operación, facturación, y el seguimiento en tiempo real.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Box className="w-6 h-6 text-[#0066CC]" />}
            title="Dashboard en Tiempo Real"
            description="Visibilidad instantánea para el vendedor. Conoce el estado exacto de cada paquete de tu flota en todo momento."
            delay={0.1}
          />
          <FeatureCard 
            icon={<ScanLine className="w-6 h-6 text-[#0066CC]" />}
            title="Captura Inteligente"
            description="Lee las etiquetas originales directamente con la cámara del celular. Sin necesidad de generar o reimprimir nuevos QRs."
            delay={0.2}
          />
          <FeatureCard 
            icon={<Truck className="w-6 h-6 text-[#0066CC]" />}
            title="Autogestión de Pickups"
            description="El vendedor solicita y programa recolecciones con un clic de forma autónoma, conectando directamente con la red."
            delay={0.3}
          />
          <FeatureCard 
            icon={<Smartphone className="w-6 h-6 text-[#0066CC]" />}
            title="PWA para Repartidores"
            description="El celular como herramienta principal. Gestión ágil de rutas, escaneo y reprogramación de entregas desde una sola app."
            delay={0.4}
          />
          <FeatureCard 
            icon={<Wallet className="w-6 h-6 text-[#0066CC]" />}
            title="Cobros y ARCA Integrados"
            description="Facturación electrónica directa y conciliación automatizada. Pasarelas de pago listas para MercadoPago o Pago a 30 días."
            delay={0.5}
          />
          <FeatureCard 
            icon={<Network className="w-6 h-6 text-[#0066CC]" />}
            title="Red Abierta y Escalable"
            description="Sistema preparado para escalar tu cobertura absorbiendo nuevos choferes, vehículos y depósitos externos de manera fluida."
            delay={0.6}
          />
        </div>
      </section>

      {/* Coverage Areas Section */}
      <section className="relative z-10 py-24 px-6 max-w-6xl mx-auto border-t border-black/5">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2 space-y-6">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-semibold tracking-tight leading-tight"
            >
              Nuestra zona de <span className="text-[#0066CC]">cobertura en expansión</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-black/60 font-medium leading-relaxed"
            >
              LogiTrack opera con un modelo logístico de anillos que nos permite optimizar rutas, tiempos y tarifas:
            </motion.p>
            <motion.ul 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-black/5 shadow-sm">
                <div className="w-4 h-4 rounded-full bg-[#0066CC]/30 border-2 border-[#0066CC] mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">Cordón 1: CABA</h4>
                  <p className="text-sm text-black/60 mt-1">Ciudad Autónoma de Buenos Aires. Entregas ultra-rápidas.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-black/5 shadow-sm">
                <div className="w-4 h-4 rounded-full bg-[#10B981]/30 border-2 border-[#10B981] mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">Cordón 2: GBA</h4>
                  <p className="text-sm text-black/60 mt-1">Municipios contiguos a la Capital Federal.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-black/5 shadow-sm">
                <div className="w-4 h-4 rounded-full bg-[#F59E0B]/30 border-2 border-[#F59E0B] border-dashed mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">Cordón 3: Ruta 6</h4>
                  <p className="text-sm text-black/60 mt-1">El anillo metropolitano extendido (hasta Ruta Provincial 6).</p>
                </div>
              </li>
            </motion.ul>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 relative"
          >
            <CoverageMap />
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION: COMience Hoy Mismo */}
      <section id="plans" className="relative z-10 py-32 px-6 max-w-7xl mx-auto border-t border-black/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#0066CC]/[0.02] to-transparent pointer-events-none" />
        
        <div className="text-center max-w-3xl mx-auto mb-20 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0066CC]/10 text-[#0066CC] font-bold text-xs uppercase tracking-widest mb-6"
          >
            <Zap className="w-3.5 h-3.5" /> Empieza Ahora
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-semibold tracking-tight mb-6"
          >
            Impulsa tu logística hoy mismo
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-black/50 font-medium"
          >
            Elige el plan que mejor se adapte al volumen de tu negocio.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto relative">
          {/* Plan 1: Personal / PyME */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-black/5 shadow-2xl relative flex flex-col group hover:border-[#0066CC]/30 transition-all hover:-translate-y-2"
          >
            <div className="w-16 h-16 bg-[#0066CC]/10 rounded-2xl flex items-center justify-center mb-8">
              <Smartphone className="w-8 h-8 text-[#0066CC]" />
            </div>
            <h3 className="text-3xl font-semibold mb-2">Libre / PyME</h3>
            <p className="text-black/50 mb-8 font-medium">Ideal para vendedores que recién comienzan o volumen variable.</p>
            
            <div className="space-y-4 mb-10 flex-1">
              <PlanFeature text="Sin costo de mantenimiento" />
              <PlanFeature text="Registro 100% gratuito e instantáneo" />
              <PlanFeature text="Abona x envío con Mercado Pago" />
              <PlanFeature text="Acceso completo al Dashboard" />
            </div>

            <Link to="/signup" className="w-full">
              <Button className="w-full py-6 text-lg rounded-2xl shadow-lg shadow-[#0066CC]/20">Registrarse Gratis</Button>
            </Link>
          </motion.div>

          {/* Plan 2: Corporativo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#1D1D1F] text-white rounded-[2.5rem] p-10 shadow-2xl relative flex flex-col hover:scale-[1.02] transition-all"
          >
            <div className="absolute top-8 right-8 px-4 py-1 rounded-full bg-white/10 text-white/70 text-[10px] font-black uppercase tracking-widest border border-white/10">Recomendado</div>
            
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-semibold mb-2">Corporativo</h3>
            <p className="text-white/40 mb-8 font-medium">Para empresas con volumen constante y necesidades a escala.</p>
            
            <div className="space-y-4 mb-10 flex-1">
              <PlanFeature dark text="Precio preferencial por envío" />
              <PlanFeature dark text="Pago a 30 días fijados por contrato" />
              <PlanFeature dark text="Descuentos en zonas seleccionadas" />
              <PlanFeature dark text="Ejecutivo de cuentas asignado" />
            </div>

            <Link to="/contact" className="w-full">
              <Button variant="secondary" className="w-full py-6 text-lg rounded-2xl bg-white text-black hover:bg-white/90">Hablar con un representante</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-black/5 text-center mt-12 bg-white/30 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
              <Truck className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold tracking-tight text-black/80">LogiTrack</span>
          </div>
          <p className="text-sm text-black/40 font-medium max-w-sm">
            © 2026 LogiTrack Logística Inteligente. Todos los derechos reservados. <br />
            Optimizado para la última milla en Argentina.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-xs font-bold text-black/30 hover:text-black transition-colors uppercase tracking-widest">Términos</a>
            <a href="#" className="text-xs font-bold text-black/30 hover:text-black transition-colors uppercase tracking-widest">Privacidad</a>
            <a href="#" className="text-xs font-bold text-black/30 hover:text-black transition-colors uppercase tracking-widest">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-white hover:border-[#0066CC]/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="w-14 h-14 bg-gradient-to-br from-[#0066CC]/10 to-[#0066CC]/5 rounded-2xl flex items-center justify-center mb-6 border border-[#0066CC]/10 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 tracking-tight text-[#1D1D1F]">{title}</h3>
      <p className="text-[#1D1D1F]/70 leading-relaxed text-sm font-medium">{description}</p>
    </motion.div>
  );
}

function PlanFeature({ text, dark }: { text: string, dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", dark ? "bg-white/10" : "bg-[#0066CC]/10")}>
        <CheckCircle2 className={cn("w-3 h-3", dark ? "text-white" : "text-[#0066CC]")} />
      </div>
      <span className={cn("text-sm font-medium", dark ? "text-white/80" : "text-black/70")}>{text}</span>
    </div>
  );
}
