import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { MapPin, Package, Calendar, CheckSquare, Square, Store, ArrowRight, DollarSign, Plus, CheckCircle2, Search, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

type PackageInfo = { id: string, size: string };
type PickupItem = { id: string, vendor: string, address: string, date: string, count: number, flatRate: number, packages: PackageInfo[] };

const INITIAL_AVAILABLE: PickupItem[] = [
  { 
    id: "PK-1052", vendor: "Moda Online SRL", address: "Santa Fe 3200, CABA", date: "Hoy 17:00", count: 2, flatRate: 4000,
    packages: [{ id: "LT-9911", size: "Pequeño" }, { id: "LT-9912", size: "Mediano" }]
  },
  { 
    id: "PK-1053", vendor: "Librería Central", address: "Florida 450, CABA", date: "Hoy 14:00 - 18:00", count: 4, flatRate: 6000,
    packages: [{ id: "LT-8821", size: "Grande" }, { id: "LT-8822", size: "Mediano" }, { id: "LT-8823", size: "Pequeño" }, { id: "LT-8824", size: "Pequeño" }]
  },
  { 
    id: "PK-1054", vendor: "Cosmética Rosa", address: "Cabildo 1100, CABA", date: "Mañana 09:00", count: 1, flatRate: 4000,
    packages: [{ id: "LT-7711", size: "Pequeño" }]
  },
];

const INITIAL_MY_PICKUPS: PickupItem[] = [
  { 
    id: "PK-1051", vendor: "TechStore Argentina", address: "Av. Corrientes 1234, CABA", date: "Hoy 16:30", count: 3, flatRate: 5000,
    packages: [{ id: "LT-9121", size: "Mediano" }, { id: "LT-9122", size: "Grande" }, { id: "LT-9123", size: "Pequeño" }]
  }
];

export default function DriverPickups() {
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  const [availablePickups, setAvailablePickups] = useState<PickupItem[]>(INITIAL_AVAILABLE);
  const [myPickups, setMyPickups] = useState<PickupItem[]>(INITIAL_MY_PICKUPS);
  
  // Selection in search mode
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Package checking in route mode
  const [scannedPackages, setScannedPackages] = useState<Set<string>>(new Set());

  // Funciones modo búsqueda
  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const assignPickups = () => {
    const toAssign = availablePickups.filter(p => selectedIds.has(p.id));
    setMyPickups(prev => [...prev, ...toAssign]);
    setAvailablePickups(prev => prev.filter(p => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
    setIsSearchMode(false);
  };

  const totalEarningsSearch = Array.from(selectedIds).reduce((acc, id) => {
    const p = availablePickups.find(x => x.id === id);
    return acc + (p?.flatRate || 0);
  }, 0);

  // Funciones modo mi ruta
  const togglePackage = (pkgId: string) => {
    const newSet = new Set(scannedPackages);
    if (newSet.has(pkgId)) newSet.delete(pkgId);
    else newSet.add(pkgId);
    setScannedPackages(newSet);
  };

  if (isSearchMode) {
    return (
      <div className="space-y-4 pb-24">
        <div className="mb-6 flex flex-col items-start gap-2">
          <button onClick={() => setIsSearchMode(false)} className="text-xs font-semibold text-[#0066CC] flex items-center gap-1 hover:underline">
            <ArrowLeft className="w-3 h-3"/> Volver a mi ruta
          </button>
          <h1 className="text-2xl font-semibold tracking-tight text-black">Buscar Nuevos Pickups</h1>
          <p className="text-sm text-black/60">Selecciona los locales que quieres agregar a tu ruta de hoy.</p>
        </div>

        {availablePickups.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-2xl border border-black/5">
            <p className="text-black/50 text-sm">No hay pickups disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
            {availablePickups.map((pick) => {
              const isSelected = selectedIds.has(pick.id);
              return (
                <Card 
                  key={pick.id} 
                  className={`overflow-hidden transition-all duration-200 cursor-pointer ${isSelected ? 'ring-2 ring-[#0066CC] border-[#0066CC]/50 bg-[#0066CC]/5' : 'border-black/5 hover:border-black/20'}`}
                  onClick={() => toggleSelection(pick.id)}
                >
                  <div className="p-4 flex gap-4">
                    <div className="shrink-0 flex items-center justify-center pt-1">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center border transition-colors ${isSelected ? 'bg-[#0066CC] border-[#0066CC]' : 'bg-white border-black/20'}`}>
                        {isSelected && <CheckSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />}
                        {!isSelected && <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-transparent" />}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1 gap-2">
                        <h3 className="font-semibold text-black/90 truncate flex items-center gap-1.5 text-[15px]">
                            <Store className="w-3.5 h-3.5 text-black/40 shrink-0"/> {pick.vendor}
                        </h3>
                        <span className="shrink-0 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md text-xs border border-emerald-100 flex items-center gap-0.5">
                            <DollarSign className="w-3 h-3"/>{pick.flatRate.toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-2 mt-3">
                        <p className="text-xs text-black/60 flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 opacity-70 shrink-0 text-[#0066CC]"/> {pick.address}
                        </p>
                        <p className="text-sm text-black/80 flex items-center gap-1.5 mt-1 font-medium bg-black/5 px-2 py-1 rounded w-fit">
                            <Package className="w-3.5 h-3.5 opacity-70 shrink-0"/> {pick.count} paquetes para llevar al depósito
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-[80px] md:bottom-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-40 bg-[#0066CC] rounded-2xl shadow-xl shadow-[#0066CC]/30 text-white p-4 flex items-center justify-between"
            >
              <div>
                  <p className="text-xs font-medium text-white/80">{selectedIds.size} locales seleccionados</p>
                  <p className="font-bold text-lg flex items-center">Tarifa Extra: ${totalEarningsSearch.toLocaleString()}</p>
              </div>
              <button onClick={assignPickups} className="bg-white text-[#0066CC] px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/90 active:scale-95 transition-all shadow-sm">
                  Sumar a mi Ruta <Plus className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // MODO MI RUTA (DEFAULT)
  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black">Mi Ruta de Recolección</h1>
          <p className="text-sm text-black/60">Pasa por los locales de los clientes y marca los paquetes físicos que recojas.</p>
        </div>
        <Button onClick={() => setIsSearchMode(true)} className="bg-[#009EE3] hover:bg-[#007AC3] text-white rounded-xl shadow-sm h-11 px-5 border-none">
          <Search className="w-4 h-4 mr-2" /> Buscar Más Pickups
        </Button>
      </div>

      {myPickups.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-black/5">
           <MapPin className="w-12 h-12 text-black/20 mb-3" />
           <p className="text-black/60 font-medium">No tienes pickups asignados.</p>
           <p className="text-black/40 text-sm mt-1 mb-4">Usa el botón superior para buscar locales.</p>
           <Button onClick={() => setIsSearchMode(true)} variant="outline">Buscar Pickups</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {myPickups.map(pickup => {
            const allChecked = pickup.packages.every(p => scannedPackages.has(p.id));
            
            return (
              <Card key={pickup.id} className={`overflow-hidden border transition-colors duration-300 ${allChecked ? 'border-emerald-200 bg-emerald-50/30' : 'border-black/5 bg-white'}`}>
                {/* Cabecera del Vendedor */}
                <div className={`p-4 border-b ${allChecked ? 'border-emerald-100 bg-emerald-100/50' : 'border-black/5 bg-gray-50/50'} flex justify-between items-center gap-4`}>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate flex items-center gap-2">
                      <Store className="w-4 h-4 text-black/50" /> {pickup.vendor}
                    </h3>
                    <div className="flex gap-4 mt-1.5 opacity-80 text-xs text-black/70 font-medium">
                       <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#0066CC]"/> {pickup.address}</span>
                       <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-black/40"/> {pickup.date}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    {allChecked ? (
                      <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4" /> LOCAL COMPLETADO
                      </span>
                    ) : (
                      <div className="text-xs font-bold text-[#0066CC] bg-[#0066CC]/10 px-3 py-1.5 rounded-full border border-[#0066CC]/20">
                        PENDIENTE
                      </div>
                    )}
                  </div>
                </div>

                {/* Listado de Paquetes (Columna anidada para Pickups) */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                   {pickup.packages.map(pkg => {
                     const isChecked = scannedPackages.has(pkg.id);
                     return (
                       <label 
                         key={pkg.id} 
                         className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none
                           ${isChecked 
                             ? 'bg-emerald-50/50 border-emerald-200 ring-1 ring-emerald-100' 
                             : 'bg-white border-black/10 hover:border-black/20 shadow-sm'
                           }`}
                       >
                         <div className="flex items-center gap-3">
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => togglePackage(pkg.id)}
                              className="w-5 h-5 rounded border-black/20 text-emerald-500 focus:ring-emerald-500 bg-transparent transition-all"
                            />
                            <div>
                               <p className={`font-semibold text-sm transition-colors ${isChecked ? 'text-emerald-800' : 'text-black'}`}>Paquete {pkg.id}</p>
                               <p className="text-[10px] uppercase font-bold text-black/40 tracking-wider">Tamaño: {pkg.size}</p>
                            </div>
                         </div>
                         <Package className={`w-5 h-5 ${isChecked ? 'text-emerald-400' : 'text-black/10'}`} />
                       </label>
                     );
                   })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
