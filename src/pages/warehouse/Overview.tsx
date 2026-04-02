import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Package, Truck, CheckCircle2, DollarSign, TrendingUp, Archive, BarChart3, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function WarehouseOverview() {
  const STATS = [
    { label: "Ocupación Actual (Stock)", value: "3,450", sub: "Paquetes guardados", icon: Archive, color: "text-[#0066CC]", bg: "bg-[#0066CC]/10" },
    { label: "Salida Pendiente", value: "842", sub: "Listos para choferes", icon: Truck, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Completados de hoy", value: "1,205", sub: "Despachados", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Facturación Mensual Est.", value: "$1.8M", sub: "Por almacenaje", icon: DollarSign, color: "text-[#00A650]", bg: "bg-[#00A650]/10" },
  ];

  const CAPACIDAD = 75; // 75%
  
  const [unsortedCount, setUnsortedCount] = useState(14);
  const [isSortingMode, setIsSortingMode] = useState(false);

  const RECENT_ACTIVITY = [
    { id: 1, type: "receipt", text: "Ingresaron 45 paquetes desde TechStore Argentina", time: "Hace 10 mins", status: "ok" },
    { id: 2, type: "dispatch", text: "Chofer Roberto S. retiró 120 paquetes (Ruta Norte)", time: "Hace 25 mins", status: "ok" },
    { id: 3, type: "alert", text: "Alerta de capacidad en Estante A4 (Casi Lleno)", time: "Hace 45 mins", status: "warning" },
    { id: 4, type: "receipt", text: "Ingresaron 12 paquetes desde Moda Online SRL", time: "Hace 1 hora", status: "ok" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">Centro de Control</h1>
          <p className="text-black/60 mt-1">Supervisa el flujo de mercadería y facturación del depósito.</p>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-5 flex flex-col justify-between h-full border border-black/5 hover:border-black/10 transition-colors bg-white">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold tracking-tight text-black mb-1">{stat.value}</h3>
                <p className="text-sm font-semibold text-black/80">{stat.label}</p>
                <p className="text-xs text-black/50 mt-1">{stat.sub}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRÁFICO DE CAPACIDAD (DUMMY) */}
        <Card className="lg:col-span-2 p-6 border border-black/5 bg-white">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg flex items-center gap-2"><BarChart3 className="w-5 h-5 text-black/50"/> Capacidad de Almacenaje</h3>
              <span className="text-xs font-bold bg-black/5 px-2 py-1 rounded text-black/60">Actualizado hace 5 mins</span>
           </div>

           <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="w-40 h-40 relative flex items-center justify-center shrink-0">
                 {/* Circulo SVG Fake */}
                 <svg className="w-full h-full transform -rotate-90">
                   <circle cx="80" cy="80" r="70" className="stroke-current text-black/5" strokeWidth="15" fill="none" />
                   <circle cx="80" cy="80" r="70" className="stroke-current text-[#0066CC]" strokeWidth="15" fill="none" strokeDasharray="440" strokeDashoffset={440 - (440 * CAPACIDAD) / 100} strokeLinecap="round" />
                 </svg>
                 <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black">{CAPACIDAD}%</span>
                    <span className="text-[10px] uppercase font-bold text-black/40">Ocupado</span>
                 </div>
              </div>
              
              <div className="flex-1 w-full space-y-4">
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-black/70">Zonas de Almacenaje</span>
                      <span className="font-bold text-black">8,500 m² ocupados</span>
                    </div>
                    <div className="w-full bg-black/5 rounded-full h-2">
                       <div className="bg-[#0066CC] h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-black/70">Mesa 1 (CABA Norte: Recoleta, Palermo)</span>
                      <span className="font-bold text-black">Casi Llena</span>
                    </div>
                    <div className="w-full bg-black/5 rounded-full h-2">
                       <div className="bg-amber-400 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-black/70">Mesa 2 (Zona Sur: Avellaneda, Lanús)</span>
                      <span className="font-bold text-black">Estable</span>
                    </div>
                    <div className="w-full bg-black/5 rounded-full h-2">
                       <div className="bg-[#0066CC] h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                 </div>
              </div>
           </div>
        </Card>

        {/* MÓDULO DE CLASIFICACIÓN RÁPIDA (NUEVO) */}
        <Card className="lg:col-span-1 p-6 border border-black/10 bg-[#0066CC] text-white flex flex-col justify-between relative overflow-hidden shadow-sm">
           <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Archive className="w-32 h-32" />
           </div>
           
           <div className="relative z-10">
              <h3 className="font-bold text-lg mb-1">Clasificación a Mesas</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Tienes paquetes en la estación de ingreso. Escanéalos para ordenarlos hacia la Mesa (Zona de Envío) correspondiente.
              </p>
           </div>
           
           <div className="relative z-10 flex flex-col items-center flex-1 justify-center mt-2 mb-6">
              <span className="text-6xl font-black">{unsortedCount}</span>
              <span className="text-white/70 text-sm uppercase font-bold tracking-widest mt-1">Sin clasificar</span>
           </div>

           <Button onClick={() => setIsSortingMode(true)} disabled={unsortedCount === 0} className="w-full bg-white text-[#0066CC] hover:bg-gray-100 font-bold h-12 shadow-sm rounded-xl relative z-10">
              Comenzar Sorteo (Sorting)
           </Button>
        </Card>

        {/* MODAL DE SORTEO (SORTING) */}
        {isSortingMode && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
               <div className="p-4 bg-gray-50 border-b border-black/5 flex justify-between items-center">
                  <h3 className="font-bold text-black text-lg">Distribuyendo hacia Rutas</h3>
                  <button onClick={() => setIsSortingMode(false)} className="text-black/40 hover:text-black font-bold text-xl px-2">&times;</button>
               </div>
               
               <div className="p-6">
                  {unsortedCount > 0 ? (
                    <>
                      <div className="bg-[#0066CC]/5 border border-[#0066CC]/20 rounded-2xl p-6 text-center mb-6">
                         <p className="text-xs font-bold text-black/50 uppercase tracking-wider mb-2">Siguiente Paquete en escáner</p>
                         <h2 className="text-4xl font-black text-black">LT-9{unsortedCount}44</h2>
                         <div className="mt-4 bg-white border border-black/10 rounded-xl p-3 inline-block">
                            <p className="text-xs text-black/50 mb-0.5">Destino leido en etiqueta:</p>
                            <p className="font-bold text-black text-lg">Av. Cabildo 1500, Belgrano</p>
                         </div>
                      </div>

                      <h4 className="text-sm font-bold text-black/80 mb-3">Asignar a Mesa de Zona:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         <button 
                           onClick={() => setUnsortedCount(prev => prev - 1)}
                           className="bg-white border-2 border-black/10 hover:border-[#0066CC] hover:bg-[#0066CC]/5 rounded-xl p-4 text-left transition-colors"
                         >
                            <p className="font-black text-[#0066CC]">Mesa 1</p>
                            <p className="text-xs font-semibold text-black/60 mt-1 leading-tight">CABA Norte (Belgrano, Palermo, Recoleta)</p>
                         </button>
                         <button 
                           onClick={() => setUnsortedCount(prev => prev - 1)}
                           className="bg-white border-2 border-black/10 hover:border-[#0066CC] hover:bg-[#0066CC]/5 rounded-xl p-4 text-left transition-colors"
                         >
                            <p className="font-black text-[#0066CC]">Mesa 2</p>
                            <p className="text-xs font-semibold text-black/60 mt-1 leading-tight">Zona Sur (Avellaneda, Lanús, Quilmes)</p>
                         </button>
                         <button 
                           onClick={() => setUnsortedCount(prev => prev - 1)}
                           className="bg-white border-2 border-black/10 hover:border-[#0066CC] hover:bg-[#0066CC]/5 rounded-xl p-4 text-left transition-colors"
                         >
                            <p className="font-black text-[#0066CC]">Mesa 3</p>
                            <p className="text-xs font-semibold text-black/60 mt-1 leading-tight">GBA Oeste (Morón, Ramos Mejía)</p>
                         </button>
                         <button 
                           onClick={() => setUnsortedCount(prev => prev - 1)}
                           className="bg-white border-2 border-black/10 hover:border-[#0066CC] hover:bg-[#0066CC]/5 rounded-xl p-4 text-left transition-colors"
                         >
                            <p className="font-black text-[#0066CC]">Mesa 4</p>
                            <p className="text-xs font-semibold text-black/60 mt-1 leading-tight">Microcentro (San Telmo, Retiro)</p>
                         </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                       <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                         <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                       </div>
                       <h3 className="text-2xl font-bold">¡Playa limpia!</h3>
                       <p className="text-black/50 mt-2">Todos los paquetes han sido clasificados en su ruta correspondiente.</p>
                       <Button onClick={() => setIsSortingMode(false)} className="mt-6 font-bold">Volver al Resumen</Button>
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
