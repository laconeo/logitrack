import React from "react";
import { Card } from "@/components/ui/Card";
import { Package, Truck, AlertCircle, DollarSign, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Overview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Hola, TechStore 👋</h1>
        <p className="text-black/60">Aquí tienes un resumen de tu operación logística hoy.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Paquetes Activos" 
          value="142" 
          trend="+12% vs ayer"
          icon={<Package className="w-5 h-5 text-[#0066CC]" />}
        />
        <StatCard 
          title="Pickups Pendientes" 
          value="2" 
          trend="Para hoy"
          icon={<Truck className="w-5 h-5 text-orange-500" />}
        />
        <StatCard 
          title="Intentos Fallidos" 
          value="3" 
          trend="Requieren atención"
          icon={<AlertCircle className="w-5 h-5 text-red-500" />}
        />
        <StatCard 
          title="Facturación del Mes" 
          value="$45,200" 
          trend="1 factura pendiente"
          icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Actividad Reciente</h3>
            <Link to="/dashboard/packages" className="text-sm text-[#0066CC] hover:underline font-medium flex items-center">
              Ver todos <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { id: "LT-982374", status: "Entregado", time: "Hace 10 min", address: "Av. Cabildo 2040, CABA" },
              { id: "LT-982375", status: "En Distribución", time: "Hace 45 min", address: "Santa Fe 3200, CABA" },
              { id: "LT-982376", status: "Recogido", time: "Hace 2 horas", address: "Tu depósito (Villa Crespo)" },
              { id: "LT-982377", status: "Intento Fallido", time: "Hace 3 horas", address: "Belgrano 120, Martínez" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black/[0.02] border border-black/[0.03]">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    item.status === 'Entregado' ? 'bg-emerald-500' : 
                    item.status === 'Intento Fallido' ? 'bg-red-500' : 
                    'bg-[#0066CC]'
                  }`} />
                  <div>
                    <div className="font-medium text-sm">{item.id}</div>
                    <div className="text-xs text-black/50">{item.address}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{item.status}</div>
                  <div className="text-xs text-black/50">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Acciones Rápidas</h3>
          <div className="space-y-3">
            <Link to="/dashboard/pickups" className="flex items-center p-4 rounded-2xl bg-[#0066CC]/5 hover:bg-[#0066CC]/10 border border-[#0066CC]/10 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm mr-4 group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5 text-[#0066CC]" />
              </div>
              <div>
                <div className="font-medium text-sm text-[#0066CC]">Solicitar Pickup</div>
                <div className="text-xs text-black/50">Programa una recolección</div>
              </div>
            </Link>
            <Link to="/dashboard/invoices" className="flex items-center p-4 rounded-2xl bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.05] transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm mr-4 group-hover:scale-105 transition-transform">
                <DollarSign className="w-5 h-5 text-black/70" />
              </div>
              <div>
                <div className="font-medium text-sm">Pagar Factura</div>
                <div className="text-xs text-black/50">Vence en 2 días</div>
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
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-semibold tracking-tight mb-1">{value}</div>
        <div className="text-sm font-medium text-black/60">{title}</div>
        <div className="text-xs text-black/40 mt-2">{trend}</div>
      </div>
    </Card>
  );
}
