import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { 
  Settings as SettingsIcon, 
  Building2, 
  Truck, 
  ShieldCheck, 
  Share2, 
  Bell, 
  MapPin, 
  Database, 
  Save, 
  ChevronRight,
  Globe,
  Lock,
  Mail,
  Zap,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

type SettingsSection = 'general' | 'logistics' | 'security' | 'integrations' | 'notifications';

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');

  const menuItems = [
    { id: 'general', label: 'Empresa y Perfil', icon: Building2 },
    { id: 'logistics', label: 'Tarifas y Logística', icon: Truck },
    { id: 'security', label: 'Seguridad y Roles', icon: ShieldCheck },
    { id: 'integrations', label: 'Integraciones / API', icon: Share2 },
    { id: 'notifications', label: 'Notificaciones y Avisos', icon: Bell },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Configuración del Sistema</h1>
          <p className="text-black/60">Personaliza y ajusta el comportamiento global de LogiTrack.</p>
        </div>
        <Button className="rounded-xl h-11 px-6 bg-[#0066CC] hover:bg-[#0052a3] text-white font-semibold shadow-lg shadow-[#0066CC]/20">
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
        {/* Sidebar Menu */}
        <aside className="md:col-span-1 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as SettingsSection)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all group",
                activeSection === item.id 
                  ? "bg-white text-[#0066CC] shadow-sm border border-black/5" 
                  : "text-black/50 hover:bg-black/5 hover:text-black"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", activeSection === item.id ? "text-[#0066CC]" : "text-black/30 group-hover:text-black/50")} />
                {item.label}
              </div>
              <ChevronRight className={cn("w-4 h-4 transition-transform", activeSection === item.id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0")} />
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          {activeSection === 'general' && <GeneralSettings />}
          {activeSection === 'logistics' && <LogisticsSettings />}
          {activeSection === 'security' && <SecuritySettings />}
          {activeSection === 'integrations' && <IntegrationsSettings />}
          {activeSection === 'notifications' && <NotificationsSettings />}
        </div>
      </div>
    </div>
  );
}

{/* GENERAL SETTINGS */}
function GeneralSettings() {
  return (
    <Card className="p-8 space-y-8">
      <SectionHeader title="Información de la Empresa" description="Datos legales y de contacto que aparecerán en remitos y facturas." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputGroup label="Nombre Comercial" placeholder="LogiTrack S.A." />
        <InputGroup label="CUIT / Identificación Fiscal" placeholder="30-71234567-8" />
        <InputGroup label="Email de Soporte" placeholder="hola@logitrack.com" />
        <InputGroup label="Teléfono Administrativo" placeholder="+54 11 5555-0000" />
      </div>
      <div className="pt-4">
        <label className="text-xs font-bold text-black/40 uppercase tracking-widest block mb-4">Dirección Sede Central</label>
        <div className="flex gap-4">
          <Input placeholder="Calle y número" className="flex-1" />
          <Input placeholder="Ciudad" className="w-1/3" />
        </div>
      </div>
    </Card>
  );
}

{/* LOGISTICS SETTINGS */}
function LogisticsSettings() {
  return (
    <Card className="p-8 space-y-8">
      <SectionHeader title="Políticas de Logística" description="Define tarifas base y tiempos estimados de entrega por defecto." />
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-[#0066CC]/5 border border-[#0066CC]/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#0066CC] flex items-center justify-center text-white">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0066CC]">Tarifas Zonales</p>
              <p className="text-xs text-[#0066CC]/70">Configura el precio base por distancia.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-white text-xs border-[#0066CC]/20">Configurar Mapa</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <label className="text-xs font-bold text-black/40 uppercase tracking-widest block">Límites de Peso (Kg)</label>
             <div className="flex items-center gap-3">
                <Input type="number" placeholder="25" className="w-24 text-center" />
                <span className="text-sm font-medium text-black/60">Peso máximo por paquete</span>
             </div>
          </div>
          <div className="space-y-4">
             <label className="text-xs font-bold text-black/40 uppercase tracking-widest block">Entrega Estimada (SLA)</label>
             <div className="flex items-center gap-3">
                <Input type="number" placeholder="24" className="w-24 text-center" />
                <span className="text-sm font-medium text-black/60">Horas promedio de entrega</span>
             </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

{/* SECURITY SETTINGS */}
function SecuritySettings() {
  return (
    <Card className="p-8 space-y-8">
      <SectionHeader title="Personal y Seguridad" description="Gestiona quién tiene acceso al panel de control y sus permisos." />
      <div className="space-y-4">
         {[
           { name: 'Roberto Admin', role: 'Super Admin', lastActive: 'Ahora' },
           { name: 'Silvina Finanzas', role: 'Contador', lastActive: 'Ayer' },
           { name: 'Marcos Logística', role: 'Gestor de Flota', lastActive: 'Hace 4h' },
         ].map((u, i) => (
           <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-black/5 hover:bg-black/[0.01] transition-colors">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center font-bold text-black/40">{u.name.charAt(0)}</div>
                 <div>
                    <div className="text-sm font-bold text-black/80">{u.name}</div>
                    <div className="text-xs text-black/40 font-medium">{u.role}</div>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{u.lastActive}</div>
                 <button className="text-xs font-bold text-[#0066CC] mt-1 hover:underline">Editar permisos</button>
              </div>
           </div>
         ))}
      </div>
      <Button variant="outline" className="w-full rounded-xl py-6 border-dashed border-black/20 hover:border-black/40 hover:bg-black/[0.01]">
         <PlusIcon className="w-4 h-4 mr-2" /> Invitar nuevo administrador
      </Button>
    </Card>
  );
}

{/* INTEGRATIONS SETTINGS */}
function IntegrationsSettings() {
  return (
    <Card className="p-8 space-y-8">
      <SectionHeader title="Conexiones Externas" description="Vincula LogiTrack con tus plataformas de venta y facturación." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <IntegrationItem name="Mercado Libre" icon={<Globe className="w-5 h-5"/>} connected />
         <IntegrationItem name="Mercado Pago" icon={<DollarSign className="w-5 h-5"/>} connected />
         <IntegrationItem name="Tienda Nube" icon={<Zap className="w-5 h-5"/>} />
         <IntegrationItem name="AFIP (Factura Elect.)" icon={<Database className="w-5 h-5"/>} />
      </div>
      <div className="pt-6 border-t border-black/5">
        <h4 className="text-sm font-bold text-black/80 mb-2">Claves de API de Desarrollador</h4>
        <div className="flex items-center gap-2">
           <Input readOnly value="sk_live_51Msz..." className="font-mono bg-black/[0.02] h-10" />
           <Button variant="outline" size="sm" className="h-10 text-xs">Revelar Clave</Button>
        </div>
      </div>
    </Card>
  );
}

{/* NOTIFICATIONS SETTINGS */}
function NotificationsSettings() {
  return (
    <Card className="p-8 space-y-8">
      <SectionHeader title="Plantillas y Avisos" description="Configura los mensajes automáticos que reciben tus clientes." />
      <div className="space-y-4">
         <NotificationToggle title="Email de Confirmación" desc="Se envía cuando el cliente da de alta un paquete." />
         <NotificationToggle title="WhatsApp: En Camino" desc="Aviso al receptor cuando el chofer inicia la ruta." active />
         <NotificationToggle title="WhatsApp: Entregado" desc="Confirmación final con link de comprobante." active />
         <NotificationToggle title="Alerta de Incidencia" desc="Aviso inmediato si hay un intento fallido." active />
      </div>
    </Card>
  );
}

{/* HELPER COMPONENTS */}
function SectionHeader({ title, description }: { title: string, description: string }) {
  return (
    <div className="border-b border-black/5 pb-6">
      <h3 className="text-xl font-bold text-black/90">{title}</h3>
      <p className="text-sm text-black/50 mt-1">{description}</p>
    </div>
  );
}

function InputGroup({ label, placeholder }: { label: string, placeholder: string }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-black/40 uppercase tracking-widest ml-1">{label}</label>
      <Input placeholder={placeholder} className="h-11 rounded-xl" />
    </div>
  );
}

function IntegrationItem({ name, icon, connected }: { name: string, icon: React.ReactNode, connected?: boolean }) {
  return (
    <div className={cn(
      "p-4 rounded-2xl border transition-all flex items-center justify-between",
      connected ? "bg-emerald-50/30 border-emerald-100" : "bg-white border-black/5 opacity-60"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          connected ? "bg-emerald-100 text-emerald-600" : "bg-black/5 text-black/30"
        )}>
          {icon}
        </div>
        <span className="text-sm font-bold text-black/80">{name}</span>
      </div>
      <span className={cn(
        "text-[10px] font-black uppercase tracking-wider",
        connected ? "text-emerald-600" : "text-black/30"
      )}>
        {connected ? 'Conectado' : 'Desconectado'}
      </span>
    </div>
  );
}

function NotificationToggle({ title, desc, active }: { title: string, desc: string, active?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-black/[0.01] border border-black/5 hover:border-[#0066CC]/20 hover:bg-[#0066CC]/[0.01] transition-all group">
      <div>
        <div className="text-sm font-bold text-black/80 group-hover:text-[#0066CC] transition-colors">{title}</div>
        <div className="text-xs text-black/40 font-medium">{desc}</div>
      </div>
      <div className={cn(
        "w-11 h-6 rounded-full relative transition-colors cursor-pointer",
        active ? "bg-[#0066CC]" : "bg-black/10"
      )}>
        <div className={cn(
          "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
          active ? "left-6" : "left-1"
        )} />
      </div>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
