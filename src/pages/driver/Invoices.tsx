import React from "react";
import { Card } from "@/components/ui/Card";
import { DollarSign, Wallet, ArrowDownToLine, Package, Store, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

type ActivityLog = {
  id: string;
  date: string;
  type: "pickup" | "delivery";
  description: string;
  volume: number;
  rate: number;
  total: number;
};

const MOCK_DRIVER_EARNINGS: ActivityLog[] = [
  { id: "mov-01", date: "Hoy, 14:30", type: "delivery", description: "Entregas finalizadas - Recoleta", volume: 15, rate: 1500, total: 22500 },
  { id: "mov-02", date: "Hoy, 10:15", type: "pickup", description: "Recolección a Depósito (TechStore)", volume: 1, rate: 5000, total: 5000 },
  { id: "mov-03", date: "Ayer", type: "delivery", description: "Entregas finalizadas - Palermo", volume: 20, rate: 1500, total: 30000 },
  { id: "mov-04", date: "Ayer", type: "pickup", description: "Recolección a Depósito (Moda Online)", volume: 2, rate: 4000, total: 8000 },
];

export default function DriverInvoices() {
  const totalPickups = MOCK_DRIVER_EARNINGS.filter(m => m.type === 'pickup').reduce((acc, m) => acc + m.total, 0);
  const totalDeliveries = MOCK_DRIVER_EARNINGS.filter(m => m.type === 'delivery').reduce((acc, m) => acc + m.total, 0);
  const totalEarnings = totalPickups + totalDeliveries;
  const totalWithdrawn = 0;
  const balanceAvailable = totalEarnings - totalWithdrawn;

  return (
    <div className="space-y-6 pb-24 h-full flex flex-col">
      {/* HEADER: UBER / GIG ECONOMY STYLE */}
      <div className="flex flex-col items-center justify-center p-8 bg-[#00A650] rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 opacity-10 pointer-events-none">
          <TrendingUp className="w-64 h-64" />
        </div>
        
        <p className="text-white/80 font-bold uppercase tracking-widest text-sm mb-2 relative z-10">Balance Disponible</p>
        <h1 className="text-6xl sm:text-7xl font-black tabular-nums tracking-tighter relative z-10">
          ${balanceAvailable.toLocaleString()}
        </h1>
        <div className="mt-8 relative z-10 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <Button className="flex-1 bg-white hover:bg-white/90 text-[#00A650] font-black h-14 rounded-2xl text-lg shadow-xl shadow-black/10">
            Retirar Dinero
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Desglose de ganancias */}
        <div className="lg:col-span-1 space-y-4">
           <h3 className="font-semibold text-black/80 flex items-center gap-2 px-1">
             <Wallet className="w-5 h-5 opacity-60"/> Desglose Semanal
           </h3>
           
           <Card className="p-5 border border-black/10 bg-white">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100">
                    <Store className="w-6 h-6 text-amber-600" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-black/60">Recolecciones (Pickups)</p>
                    <p className="font-black text-xl text-black">${totalPickups.toLocaleString()}</p>
                 </div>
              </div>
              <p className="text-xs text-black/50 leading-relaxed border-t border-black/5 pt-3">
                Operaciones de búsqueda desde el vendedor hacia el depósito base. Generan un valor de <strong>Tarifa Plana</strong> por comercio visitado.
              </p>
           </Card>

           <Card className="p-5 border border-black/10 bg-white">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 bg-[#0066CC]/10 rounded-xl flex items-center justify-center border border-[#0066CC]/20">
                    <Package className="w-6 h-6 text-[#0066CC]" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-black/60">Entregas Finales</p>
                    <p className="font-black text-xl text-black">${totalDeliveries.toLocaleString()}</p>
                 </div>
              </div>
              <p className="text-xs text-black/50 leading-relaxed border-t border-black/5 pt-3">
                Distribución capilar final agrupada por Zona o Barrio. Cálculo variable enfocado en <strong>Cantidad de Paquetes</strong> exitosos.
              </p>
           </Card>

           <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800">
             <AlertCircle className="w-5 h-5 shrink-0" />
             <p className="text-xs font-semibold">Tu cuenta se liquida semanalmente. Los retiros manuales pueden demorar hasta 24h hábiles.</p>
           </div>
        </div>

        {/* RIGHT COLUMN: Historial de Actividad Cobrada */}
        <div className="lg:col-span-2 space-y-4">
           <div className="flex justify-between items-end px-1">
             <h3 className="font-semibold text-black/80 flex items-center gap-2">
               <Calendar className="w-5 h-5 opacity-60"/> Historial de Trabajos
             </h3>
             <span className="text-xs font-bold bg-black/5 px-3 py-1 rounded-full text-black/50 uppercase tracking-widest">Esta Semana</span>
           </div>
           
           <Card className="border border-black/10 bg-white shadow-sm overflow-hidden">
              <div className="divide-y divide-black/5">
                 {MOCK_DRIVER_EARNINGS.map((mov) => (
                    <div key={mov.id} className="p-4 sm:p-5 hover:bg-black/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                       <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-2xl flex items-center justify-center shrink-0 border ${
                             mov.type === 'pickup' 
                               ? 'bg-amber-50 border-amber-100 text-amber-600' 
                               : 'bg-[#0066CC]/10 border-[#0066CC]/20 text-[#0066CC]'
                          }`}>
                             {mov.type === 'pickup' ? <Store className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                          </div>
                          <div>
                             <p className="text-xs font-bold text-black/40 uppercase mb-1">{mov.date}</p>
                             <h4 className="font-bold text-black text-sm">{mov.description}</h4>
                             
                             {/* Detalle interno de la matemática según tipo de trabajo */}
                             <p className="text-xs font-medium mt-1 inline-flex bg-black/5 px-2 py-0.5 rounded text-black/60">
                                {mov.type === 'pickup' 
                                   ? `${mov.volume} locales auditados (Valor Pleno)` 
                                   : `${mov.volume} bultos entregados x $${mov.rate.toLocaleString()}`
                                }
                             </p>
                          </div>
                       </div>
                       
                       <div className="text-right sm:pl-4 sm:border-l border-black/5">
                          <p className="text-[10px] uppercase font-bold text-emerald-600/70 tracking-widest mb-0.5">Acreditado</p>
                          <p className="font-black text-xl text-emerald-600 tabular-nums">
                            +${mov.total.toLocaleString()}
                          </p>
                       </div>
                    </div>
                 ))}
              </div>
           </Card>
        </div>

      </div>
    </div>
  );
}
