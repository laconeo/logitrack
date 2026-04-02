import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Package, CalendarPlus, FileText, Settings, LogOut, Truck, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_ROLES = [
  "Administrador del Sistema",
  "Cliente Vendedor",
  "Repartidor / Chofer",
  "Candidato a Chofer",
  "Candidato a Depósito",
];

export default function DashboardLayout() {
  const location = useLocation();
  const [activeRole, setActiveRole] = useState("Cliente Vendedor");

  // Nav items para Cliente Vendedor
  const sellerNavItems = [
    { icon: LayoutDashboard, label: "Resumen", path: "/dashboard" },
    { icon: Package, label: "Mis Paquetes", path: "/dashboard/packages" },
    { icon: CalendarPlus, label: "Solicitar Pickup", path: "/dashboard/pickups" },
    { icon: FileText, label: "Facturación", path: "/dashboard/invoices" },
  ];

  const navItems = activeRole === "Cliente Vendedor" ? sellerNavItems : [];

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex">
      {/* Sidebar */}
      <aside className="w-64 fixed inset-y-0 left-0 bg-white/70 backdrop-blur-xl border-r border-black/5 flex flex-col z-10">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0066CC] rounded-xl flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">LogiTrack</span>
        </div>

        <div className="px-4 py-2 flex-1">
          {navItems.length > 0 && (
            <div className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-4 px-2">Menú Principal</div>
          )}
          <nav className="space-y-1">
            {navItems.length > 0 ? (
              navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-[#0066CC]/10 text-[#0066CC]" 
                        : "text-black/70 hover:bg-black/5 hover:text-black"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive ? "text-[#0066CC]" : "text-black/50")} />
                    {item.label}
                  </Link>
                );
              })
            ) : (
               <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-black/40">
                  Módulo no disponible
               </div>
            )}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-black/5">
          <nav className="space-y-1">
            <Link to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-black/70 hover:bg-black/5 transition-colors">
              <Settings className="w-5 h-5 text-black/50" />
              Configuración
            </Link>
            <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5 text-red-500" />
              Cerrar Sesión
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white/40 backdrop-blur-md border-b border-black/5 sticky top-0 z-10">
          <h2 className="text-lg font-medium text-black/80">
            {activeRole === "Cliente Vendedor" 
              ? navItems.find(i => i.path === location.pathname)?.label || "Dashboard" 
              : "Vista Preliminar"}
          </h2>
          <div className="flex items-center gap-6">
            
            {/* Switcher de Roles para Mock */}
            <div className="flex items-center gap-3 bg-white/60 p-1.5 rounded-xl border border-black/5 shadow-sm">
              <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest pl-2">Modo:</span>
              <select 
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value)}
                className="bg-transparent border-none text-sm font-semibold text-[#0066CC] outline-none cursor-pointer pr-2 hover:text-[#0052a3] transition-colors"
                style={{ WebkitAppearance: 'none' }}
              >
                {MOCK_ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="w-px h-6 bg-black/10 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-right hidden sm:block">
                <div className="font-medium text-black">
                  {activeRole === "Cliente Vendedor" ? "TechStore Argentina" : "Usuario Mock"}
                </div>
                <div className="text-black/50 text-xs font-medium">{activeRole}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0066CC] to-blue-400 text-white flex items-center justify-center font-semibold shadow-sm">
                {activeRole === "Cliente Vendedor" ? "TS" : "UM"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1 overflow-auto flex flex-col">
          <motion.div
            key={activeRole === "Cliente Vendedor" ? location.pathname : "development-placeholder"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`max-w-5xl mx-auto w-full ${activeRole !== "Cliente Vendedor" ? "flex-1 flex flex-col justify-center items-center" : ""}`}
          >
            {activeRole === "Cliente Vendedor" ? (
              <Outlet />
            ) : (
              <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto p-12 bg-white rounded-3xl border border-black/5 shadow-sm">
                <div className="w-16 h-16 bg-[#0066CC]/10 rounded-2xl flex items-center justify-center mb-6 text-[#0066CC]">
                  <Wrench className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 tracking-tight">Vista en Desarrollo</h3>
                <p className="text-black/60 leading-relaxed text-sm">
                  La vista para el rol de <span className="font-semibold text-black">{activeRole}</span> está actualmente en fase de diseño e implementación según los requisitos expuestos en el Project Charter.
                </p>
                <button 
                  onClick={() => setActiveRole("Cliente Vendedor")}
                  className="mt-8 text-sm font-semibold text-[#0066CC] hover:text-[#0052a3] px-6 py-2.5 rounded-xl bg-[#0066CC]/5 hover:bg-[#0066CC]/10 transition-colors"
                >
                  Volver a Cliente Vendedor
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
