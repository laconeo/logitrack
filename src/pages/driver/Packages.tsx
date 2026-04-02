import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { MapPin, Package as PackageIcon, CheckCircle2, ChevronDown, ChevronRight, AlertCircle, Warehouse, Search, DollarSign, Camera, QrCode, ScanLine, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

type Status = "pendiente" | "entregado" | "demorado" | "en_deposito";

type Pkg = {
  id: string;
  address: string;
  status: Status;
  observation?: string;
  deliveryFee: number;
};

type Neighborhood = {
  id: string;
  name: string;
  zone: string;
  packages: Pkg[];
};

const INITIAL_MY_ROUTE: Neighborhood[] = [
  {
    id: "nh-1",
    name: "Recoleta",
    zone: "CABA Centro",
    packages: [
      { id: "LT-9921", address: "Av. Santa Fe 1500, Piso 3A", status: "pendiente", deliveryFee: 11500 },
      { id: "LT-9922", address: "Callao 2000, PB", status: "pendiente", deliveryFee: 11500 },
    ]
  },
  {
    id: "nh-2",
    name: "Palermo",
    zone: "CABA Norte",
    packages: [
      { id: "LT-9931", address: "Gorriti 4500", status: "pendiente", deliveryFee: 11500 },
      { id: "LT-9932", address: "Honduras 5000", status: "pendiente", deliveryFee: 11500 },
    ]
  }
];

const INITIAL_WAREHOUSE: Neighborhood[] = [
  {
    id: "wh-1",
    name: "Belgrano",
    zone: "Zona Norte",
    packages: [
      { id: "LT-3010", address: "Cabildo 2040", status: "en_deposito", deliveryFee: 11500 },
      { id: "LT-3011", address: "Juramento 2100", status: "en_deposito", deliveryFee: 11500 },
      { id: "LT-3012", address: "Cuba 1800", status: "en_deposito", deliveryFee: 11500 },
    ]
  },
  {
    id: "wh-2",
    name: "Caballito",
    zone: "CABA Centro",
    packages: [
      { id: "LT-4010", address: "Rivadavia 5000", status: "en_deposito", deliveryFee: 11500 },
      { id: "LT-4011", address: "Acoyte 200", status: "en_deposito", deliveryFee: 11500 },
    ]
  }
];

export default function DriverPackages() {
  const [data, setData] = useState<Neighborhood[]>(INITIAL_MY_ROUTE);
  const [warehouseData, setWarehouseData] = useState<Neighborhood[]>(INITIAL_WAREHOUSE);
  
  const [isWarehouseMode, setIsWarehouseMode] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  
  // Accordion states
  const [expandedNh, setExpandedNh] = useState<Set<string>>(new Set(["nh-1"]));
  const [expandedWh, setExpandedWh] = useState<Set<string>>(new Set(["wh-1"]));

  // Interaction states
  const [delayedOpenFor, setDelayedOpenFor] = useState<string | null>(null);
  const [selectedWarehousePkgs, setSelectedWarehousePkgs] = useState<Set<string>>(new Set());

  // --- Helpers Modo Ruta ---
  const toggleNh = (id: string) => {
    const newSet = new Set(expandedNh);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedNh(newSet);
  };

  const updatePackageStatus = (nhId: string, pkgId: string, newStatus: Status, observation?: string) => {
    setData(prev => prev.map(nh => {
      if (nh.id !== nhId) return nh;
      return {
        ...nh,
        packages: nh.packages.map(p => {
          if (p.id !== pkgId) return p;
          return { ...p, status: newStatus, observation: observation !== undefined ? observation : p.observation };
        })
      };
    }));
    if (newStatus !== "demorado") setDelayedOpenFor(null);
  };

  // --- Helpers Modo Depósito ---
  const toggleWh = (id: string) => {
    const newSet = new Set(expandedWh);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedWh(newSet);
  };

  const toggleWhPackage = (pkgId: string) => {
    const newSet = new Set(selectedWarehousePkgs);
    if (newSet.has(pkgId)) newSet.delete(pkgId);
    else newSet.add(pkgId);
    setSelectedWarehousePkgs(newSet);
  };

  const simulateCameraScan = () => {
    // Tomamos el primer paquete no seleccionado de lo que esté visible (o el primero que exista)
    const availableToScan = warehouseData.flatMap(w => w.packages).find(p => !selectedWarehousePkgs.has(p.id));
    if (availableToScan) {
      toggleWhPackage(availableToScan.id);
      setCameraActive(false);
    }
  };

  const loadToTruck = () => {
    // Mover los seleccionados de warehouseData a data
    let newData = [...data];
    let newWh = [...warehouseData];

    selectedWarehousePkgs.forEach(pkgId => {
      // Find where it is
      let pObj: Pkg | undefined;
      let whNhToTakeFrom: Neighborhood | undefined;
      for (const w of newWh) {
        pObj = w.packages.find(p => p.id === pkgId);
        if (pObj) {
          whNhToTakeFrom = w;
          break;
        }
      }

      if (pObj && whNhToTakeFrom) {
        // Encontrar si este barrio ya existe en Mi Ruta
        const existingRouteNh = newData.find(n => n.name === whNhToTakeFrom!.name);
        pObj.status = "pendiente"; // Pasa a estar listo para entrega

        if (existingRouteNh) {
           existingRouteNh.packages.push(pObj);
        } else {
           newData.push({
             id: `nh-custom-${whNhToTakeFrom.name}`,
             name: whNhToTakeFrom.name,
             zone: whNhToTakeFrom.zone,
             packages: [pObj]
           });
        }
        
        // Remover del warehouse
        whNhToTakeFrom.packages = whNhToTakeFrom.packages.filter(p => p.id !== pkgId);
      }
    });

    setData(newData);
    setWarehouseData(newWh.filter(w => w.packages.length > 0)); // Limpiar vacíos
    setSelectedWarehousePkgs(new Set());
    setIsWarehouseMode(false);
  };

  // --- RENDER MODO DEPÓSITO ---
  if (isWarehouseMode) {
    const selectedCount = selectedWarehousePkgs.size;
    const estimatedPotential = Array.from(selectedWarehousePkgs).reduce((acc, pkgId) => {
      const p = warehouseData.flatMap(w => w.packages).find(x => x.id === pkgId);
      return acc + (p?.deliveryFee || 0);
    }, 0);

    return (
      <div className="space-y-4 pb-24">
        {/* Cabecera Depósito */}
        <div className="mb-6 flex flex-col items-start gap-3">
          <button onClick={() => setIsWarehouseMode(false)} className="text-xs font-semibold text-[#0066CC] flex items-center gap-1 hover:underline">
            <ArrowLeft className="w-3 h-3"/> Volver a mis entregas
          </button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black flex items-center gap-2">
              <Warehouse className="w-6 h-6 text-[#0066CC]"/> Depósito Principal
            </h1>
            <p className="text-sm text-black/60">Selecciona los paquetes que llevarás en tu vehículo para entregar.</p>
          </div>
          <Button onClick={() => setCameraActive(!cameraActive)} className="w-full bg-slate-800 hover:bg-slate-700 text-white shadow-sm flex items-center gap-2">
             <Camera className="w-5 h-5"/> {cameraActive ? "Apagar Cámara" : "Escanear Paquetes"}
          </Button>
        </div>

        {/* MOCK DE CÁMARA */}
        <AnimatePresence>
          {cameraActive && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="relative bg-black rounded-2xl h-64 border-4 border-slate-800 flex items-center justify-center mb-4">
                 <ScanLine className="w-24 h-24 text-emerald-400 absolute opacity-50 scanner-animation" style={{ animation: "scan 2s infinite ease-in-out" }} />
                 <QrCode className="w-32 h-32 text-emerald-500/20" />
                 <style>{`@keyframes scan { 0% { transform: translateY(-50px); } 50% { transform: translateY(50px); } 100% { transform: translateY(-50px); } }`}</style>
                 
                 <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <Button onClick={simulateCameraScan} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg border-2 border-emerald-400 font-bold">
                       Simular Escaneo Exitoso
                    </Button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Listado Depósito */}
        <div className="space-y-4">
          {warehouseData.map(wh => {
            const isExpanded = expandedWh.has(wh.id);
            const pkgCount = wh.packages.length;
            const whPotential = wh.packages.reduce((a, b) => a + b.deliveryFee, 0);

            return (
              <Card key={wh.id} className="overflow-hidden border border-black/10 bg-white">
                <div 
                  className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${isExpanded ? 'bg-black/5' : 'hover:bg-black/[0.02]'}`}
                  onClick={() => toggleWh(wh.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base flex items-center gap-2">{wh.name} <span className="text-[10px] bg-black/10 px-2 py-0.5 rounded-full text-black/60 font-bold">{wh.zone}</span></h3>
                      <p className="text-xs font-medium text-black/60 mt-0.5">
                        {pkgCount} envíos libres • <span className="text-emerald-600 font-bold">+${whPotential.toLocaleString()}</span> aprox.
                      </p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-black/40" /> : <ChevronRight className="w-5 h-5 text-black/40" />}
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                      className="border-t border-black/5 bg-gray-50/50 overflow-hidden"
                    >
                      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {wh.packages.map(pkg => {
                          const isChecked = selectedWarehousePkgs.has(pkg.id);
                          return (
                            <label key={pkg.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? 'bg-[#0066CC]/10 border-[#0066CC] ring-1 ring-[#0066CC]/20' : 'bg-white border-black/10'}`}>
                              <div className="flex items-center gap-3">
                                <input 
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleWhPackage(pkg.id)}
                                  className="w-5 h-5 rounded border-black/20 text-[#0066CC] focus:ring-[#0066CC] cursor-pointer"
                                />
                                <div>
                                  <p className="font-semibold text-sm">{pkg.id}</p>
                                  <p className="text-xs text-black/60 truncate max-w-[150px]">{pkg.address}</p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                +${pkg.deliveryFee}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>

        {/* Floating Bar para Depósito */}
        <AnimatePresence>
          {selectedCount > 0 && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-[80px] md:bottom-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-40 bg-[#0066CC] rounded-2xl shadow-xl text-white p-4 flex items-center justify-between"
            >
              <div>
                  <p className="text-xs font-medium text-white/80">{selectedCount} paquetes al camión</p>
                  <p className="font-bold text-lg flex items-center gap-1"><DollarSign className="w-5 h-5"/>{estimatedPotential.toLocaleString()}</p>
              </div>
              <button onClick={loadToTruck} className="bg-white text-[#0066CC] px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-transform">
                  Cargar Vehículo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --- RENDER MODO MI RUTA DE ENTREGAS ---
  return (
    <div className="space-y-6 pb-24">
      {/* Botón Superior */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/5 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black">Mis Paquetes (Entregas)</h1>
          <p className="text-sm text-black/60">Gestiona la entrega final de paquetes agrupados por barrio.</p>
        </div>
        <Button onClick={() => setIsWarehouseMode(true)} className="bg-[#009EE3] hover:bg-[#007AC3] text-white rounded-xl shadow-sm h-11 px-6 border-none w-full sm:w-auto">
          <Warehouse className="w-4 h-4 mr-2" /> Levantar del Depósito
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="p-12 text-center border rounded-2xl bg-white border-black/5 flex flex-col items-center">
            <PackageIcon className="w-12 h-12 text-black/20 mb-2"/>
            <p className="text-black/50 font-medium">No tienes paquetes cargados para entregar.</p>
            <Button onClick={() => setIsWarehouseMode(true)} variant="outline" className="mt-4">Ir al Depósito</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map(nh => {
            const isExpanded = expandedNh.has(nh.id);
            const pkgCount = nh.packages.length;
            const completedCount = nh.packages.filter(p => p.status === 'entregado').length;
            const delayedCount = nh.packages.filter(p => p.status === 'demorado').length;
            const pendingCount = pkgCount - completedCount - delayedCount;

            const revenuePotential = nh.packages.reduce((a, b) => a + b.deliveryFee, 0);

            return (
              <Card key={nh.id} className="overflow-hidden border border-black/10 bg-white">
                <div 
                  className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${isExpanded ? 'bg-black/5' : 'hover:bg-black/[0.02]'}`}
                  onClick={() => toggleNh(nh.id)}
                >
                  <div className="flex flex-col flex-1 mr-4">
                    <div className="flex items-start justify-between w-full">
                       <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-black/10">
                           <MapPin className="w-6 h-6 text-white" />
                         </div>
                         <div>
                           <h3 className="font-bold text-lg text-black leading-tight">{nh.name}</h3>
                           <p className="text-sm font-semibold text-black/50 mt-0.5">
                             {pkgCount} {pkgCount === 1 ? 'paquete' : 'paquetes'}
                           </p>
                         </div>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] uppercase font-bold tracking-widest text-[#00A650] mb-0.5 opacity-90">Por cobrar</p>
                         <h2 className="text-2xl font-black text-[#00A650] tabular-nums tracking-tighter">
                           ${revenuePotential.toLocaleString()}
                         </h2>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 border-l border-black/5 pl-4 shrink-0">
                    <div className="hidden sm:flex gap-1 flex-col">
                      {completedCount > 0 && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md text-right">{completedCount} Listo</span>}
                      {pendingCount > 0 && <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md text-right">{pendingCount} Pends</span>}
                    </div>
                    <div className="mt-auto p-1 bg-black/5 rounded-full">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-black/60" /> : <ChevronRight className="w-4 h-4 text-black/60" />}
                    </div>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-black/5 bg-gray-50/30 overflow-hidden"
                    >
                      <div className="p-4 space-y-3">
                        {nh.packages.map(pkg => (
                          <div key={pkg.id} className={`p-4 rounded-xl border transition-all ${
                            pkg.status === 'entregado' ? 'bg-emerald-50/50 border-emerald-200' :
                            pkg.status === 'demorado' ? 'bg-amber-50/50 border-amber-200' :
                            'bg-white border-black/10 shadow-sm hover:border-black/20'
                          }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1">
                                 <div className="mt-0.5">
                                   {pkg.status === 'entregado' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                                    pkg.status === 'demorado' ? <AlertCircle className="w-5 h-5 text-amber-500" /> :
                                    <PackageIcon className="w-5 h-5 text-black/30" />}
                                 </div>
                                 <div className="flex-1">
                                    <div className="flex justify-between items-center sm:block">
                                        <h4 className={`font-semibold text-sm flex items-center gap-2 ${pkg.status==='entregado'?'text-emerald-700':''}`}>
                                           {pkg.id} 
                                           {pkg.status === 'pendiente' && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">+${pkg.deliveryFee}</span>}
                                        </h4>
                                    </div>
                                    <p className="text-xs text-black/60 mt-0.5">{pkg.address}</p>
                                    
                                    {pkg.status === 'demorado' && pkg.observation && (
                                      <div className="mt-2 text-xs font-medium text-amber-800 bg-amber-100/50 p-2 rounded-lg border border-amber-200/50">
                                        <span className="font-bold uppercase text-[10px] tracking-wider block mb-0.5 text-amber-600">Nota de Demora:</span>
                                        {pkg.observation}
                                      </div>
                                    )}
                                 </div>
                              </div>
                              
                              <div className="flex items-center gap-2 mt-2 sm:mt-0 shrink-0 border-t border-black/5 pt-3 sm:border-0 sm:pt-0">
                                 {pkg.status !== 'entregado' && (
                                   <Button 
                                     size="sm" 
                                     variant={pkg.status === 'demorado' ? "outline" : "default"}
                                     className={`h-8 text-xs ${pkg.status !== 'demorado' ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-none' : ''}`}
                                     onClick={() => setDelayedOpenFor(prev => prev === pkg.id ? null : pkg.id)}
                                   >
                                     <AlertCircle className="w-3.5 h-3.5 mr-1" /> Demorado
                                   </Button>
                                 )}

                                 {pkg.status !== 'entregado' && (
                                   <Button 
                                     size="sm" 
                                     className="h-8 text-xs bg-emerald-500 hover:bg-emerald-600 text-white border-none"
                                     onClick={() => updatePackageStatus(nh.id, pkg.id, "entregado")}
                                   >
                                     <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Entregado
                                   </Button>
                                 )}

                                 {pkg.status === 'entregado' && (
                                   <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 uppercase tracking-wide">
                                     Completado
                                   </span>
                                 )}
                              </div>
                            </div>

                            <AnimatePresence>
                              {delayedOpenFor === pkg.id && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0, mt: 0 }} animate={{ opacity: 1, height: 'auto', mt: 12 }} exit={{ opacity: 0, height: 0, mt: 0 }}
                                  className="overflow-hidden"
                                >
                                  <form 
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      const val = (e.currentTarget.elements.namedItem('obs') as HTMLTextAreaElement).value;
                                      updatePackageStatus(nh.id, pkg.id, "demorado", val);
                                    }}
                                    className="bg-amber-50 rounded-xl p-3 border border-amber-200"
                                  >
                                    <label className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-2 block">
                                      Motivo de Demora u Observación
                                    </label>
                                    <textarea 
                                      name="obs" required placeholder="Ej: No atiende el timbre, dirección incorrecta, etc..."
                                      className="w-full text-sm bg-white/50 border border-amber-200 rounded-lg p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-amber-400 mb-3"
                                    />
                                    <div className="flex justify-end gap-2">
                                      <Button type="button" variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setDelayedOpenFor(null)}>
                                        Cancelar
                                      </Button>
                                      <Button type="submit" size="sm" className="h-8 text-xs bg-amber-500 hover:bg-amber-600 text-white">
                                        Guardar Estado
                                      </Button>
                                    </div>
                                  </form>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
