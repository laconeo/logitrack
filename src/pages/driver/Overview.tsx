import React from "react";
import { Card } from "@/components/ui/Card";
import { Package, MapPin, Truck, DollarSign, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

export default function DriverOverview() {
  const mapPinHtml = renderToStaticMarkup(<MapPin color="#0066CC" size={24} strokeWidth={2.5} />);

  const customIcon = L.divIcon({
    html: `<div style="background-color: white; border-radius: 50%; padding: 6px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;">${mapPinHtml}</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  const STATS = [
    { label: "Paquetes a entregar", value: "24", icon: Package, color: "text-[#0066CC]", bg: "bg-[#0066CC]/10" },
    { label: "Locales por recolectar", value: "5", icon: Truck, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Pickups de Depósito", value: "12", icon: MapPin, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: "A Cobrar Estimado", value: "$124k", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-100" },
  ];

  const TODAYS_ITINERARY = [
    { id: "step-1", type: "pickup", title: "Ir al Vendedor", desc: "Recoger 8 paquetes", address: "Av. Corrientes 1234, CABA", time: "10:00", status: "done" },
    { id: "step-2", type: "warehouse", title: "Depósito Central", desc: "Dejar recogidos y levantar ruta", address: "Av. Directorio 4300, CABA", time: "11:30", status: "active" },
    { id: "step-3", type: "delivery", title: "Entregas en Recoleta", desc: "Entregar 7 paquetes en el barrio", address: "Zona Recoleta", time: "13:00", status: "pending" },
    { id: "step-4", type: "delivery", title: "Entregas en Barracas", desc: "Entregar 10 paquetes en el barrio", address: "Zona Barracas", time: "15:30", status: "pending" },
  ];

  const mapPoints = [
    { id: 1, pos: [-34.6037, -58.3816], title: "📍 Vendedor (Recolección)" },
    { id: 2, pos: [-34.6465, -58.4812], title: "🏢 Depósito Central" },
    { id: 3, pos: [-34.5895, -58.3974], title: "📦 Entregas Recoleta" },
    { id: 4, pos: [-34.6383, -58.3831], title: "📦 Entregas Barracas" }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-black">Mi Turno Hoy</h1>
        <p className="text-sm text-black/60">Resumen y hoja de ruta actual.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-6">
        {STATS.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-4 flex flex-col gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-black">{stat.value}</p>
                <p className="text-xs font-medium text-black/50 leading-tight mt-1">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 border border-black/10 rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-black/5 flex items-center gap-2 bg-gray-50/50">
             <Clock className="w-4 h-4 text-[#0066CC]"/>
             <h3 className="font-semibold text-black/80 text-sm">Hoja de Ruta del Día</h3>
          </div>
          <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
             {TODAYS_ITINERARY.map((step) => (
               <div key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${step.status === 'done' ? 'bg-emerald-500 ring-4 ring-emerald-50' : step.status === 'active' ? 'bg-[#0066CC] ring-4 ring-blue-50 animate-pulse' : 'bg-gray-300 ring-4 ring-gray-50'}`} />
                    <div className={`w-0.5 h-full mt-1 ${step.status === 'done' ? 'bg-emerald-200' : 'bg-black/5'}`} />
                  </div>
                  <div className="pb-4">
                     <div className="flex items-center gap-2 mb-0.5">
                       <p className="text-xs text-black/50 font-bold">{step.time}</p>
                       {step.status === 'active' && <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">En Curso</span>}
                     </div>
                     <p className={`text-sm font-semibold ${step.status === 'pending' ? 'text-black/60' : 'text-black/90'}`}>{step.title}</p>
                     <p className={`text-xs mt-0.5 leading-tight ${step.status === 'pending' ? 'text-black/40' : 'text-[#0066CC] font-medium'}`}>{step.desc}</p>
                     <p className="text-[11px] text-black/40 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> {step.address}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="lg:col-span-2 border border-black/10 rounded-2xl bg-white shadow-sm overflow-hidden h-[300px] lg:h-[400px] flex flex-col">
          <div className="p-4 border-b border-black/5 flex items-center gap-2 bg-gray-50/50 shrink-0">
             <MapPin className="w-4 h-4 text-[#0066CC]"/>
             <h3 className="font-semibold text-black/80 text-sm">Próximos Destinos</h3>
          </div>
          <div className="flex-1 relative z-0">
             <MapContainer 
                center={[-34.6150, -58.4300]} 
                zoom={12} 
                style={{ width: '100%', height: '100%', zIndex: 0 }}
             >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png" />
                {mapPoints.map(pt => (
                   <Marker key={pt.id} position={pt.pos as [number, number]} icon={customIcon}>
                      <Popup className="font-sans !p-1 !m-0">
                         <div className="font-semibold text-sm text-center">{pt.title}</div>
                         <a href={`https://www.waze.com/ul?ll=${pt.pos[0]},${pt.pos[1]}&navigate=yes`} target="_blank" rel="noreferrer" className="block text-xs text-white bg-[#0066CC] px-3 py-1.5 rounded mt-2 text-center no-underline hover:bg-[#0055AA]">Navegar con Waze</a>
                      </Popup>
                   </Marker>
                ))}
             </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
