import React from "react";
import { Card } from "@/components/ui/Card";
import { Package, Truck, Users, DollarSign, ArrowUpRight, ShieldCheck, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Panel de Control Global 🌍</h1>
        <p className="text-black/60">Monitoreo en tiempo real de toda la red LogiTrack.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Paquetes en Tránsito" 
          value="4,291" 
          trend="+18% vs ayer"
          icon={<Package className="w-5 h-5 text-[#0066CC]" />}
        />
        <StatCard 
          title="Repartidores Activos" 
          value="156" 
          trend="8 en espera de aprobación"
          icon={<Truck className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard 
          title="Tasa de Entrega" 
          value="98.2%" 
          trend="Objetivo: 98.0%"
          icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
        />
        <StatCard 
          title="Ingresos Estimados (Mes)" 
          value="$12.4M" 
          trend="+5% vs mes anterior"
          icon={<DollarSign className="w-5 h-5 text-purple-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Activity */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-black/70" />
              Monitor del Sistema
            </h3>
            <Link to="/dashboard/admin/packages" className="text-sm text-[#0066CC] hover:underline font-medium flex items-center">
              Auditoría completa <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { id: "SYS-001", type: "Alerta de Capacidad", priority: "Alta", time: "Hace 5 min", detail: "Depósito Norte al 95% de capacidad" },
              { id: "SYS-002", type: "Nuevo Cliente Alta", priority: "Media", time: "Hace 12 min", detail: "ElectroMundo SRL completó registro" },
              { id: "SYS-003", type: "Pico de Demanda", priority: "Baja", time: "Hace 22 min", detail: "Zona Habilitada CABA - +300% solicitudes" },
              { id: "SYS-004", type: "Falla de Integración", priority: "Alta", time: "Hace 1 hora", detail: "API de Mercado Libre con latencia alta" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black/[0.02] border border-black/[0.03]">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    item.priority === 'Alta' ? 'bg-red-500/10 text-red-600' : 
                    item.priority === 'Media' ? 'bg-orange-500/10 text-orange-600' : 
                    'bg-[#0066CC]/10 text-[#0066CC]'
                  }`}>
                    {item.priority === 'Alta' ? <AlertTriangle className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-black/90">{item.type}</div>
                    <div className="text-xs text-black/50">{item.detail}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-black/80">{item.id}</div>
                  <div className="text-xs text-black/50">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions Global */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-black/70" />
            Acciones de Administrador
          </h3>
          <div className="space-y-3">
            <Link to="/dashboard/admin/drivers" className="flex items-center p-4 rounded-2xl bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/10 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm mr-4 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-sm text-orange-700">Aprobar Repartidores</div>
                <div className="text-xs text-orange-700/60">8 solicitudes pendientes</div>
              </div>
            </Link>
            <Link to="/dashboard/admin/accounting" className="flex items-center p-4 rounded-2xl bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm mr-4 group-hover:scale-105 transition-transform">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-medium text-sm text-emerald-700">Liquidaciones Pendientes</div>
                <div className="text-xs text-emerald-700/60">Procesar pagos a repartidores</div>
              </div>
            </Link>
            <Link to="/dashboard/admin/settings" className="flex items-center p-4 rounded-2xl bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.05] transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm mr-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-black/70" />
              </div>
              <div>
                <div className="font-medium text-sm">Auditoría General</div>
                <div className="text-xs text-black/50">Revisar accesos y logs</div>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <Card className="p-6 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-black/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex items-start justify-between mb-4 relative">
        <div className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center shadow-sm border border-black/5">
          {icon}
        </div>
      </div>
      <div className="relative">
        <div className="text-3xl font-semibold tracking-tight mb-1 text-black/90">{value}</div>
        <div className="text-sm font-medium text-black/60">{title}</div>
        <div className="text-xs font-medium text-black/40 mt-2">{trend}</div>
      </div>
    </Card>
  );
}
