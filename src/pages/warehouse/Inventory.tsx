import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Search, Filter, ArrowUpDown, PackageSearch, PackageOpen, LayoutGrid, List, CheckSquare, Square, QrCode, MoreHorizontal, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

type PkgItem = {
  id: string;
  sender: string;
  destZone: string;
  storageLoc: string;
  dateIn: string;
  days: number;
  status: "por_asignar" | "listo_chofer" | "alerta_tiempo";
};

const MOCK_INVENTORY: PkgItem[] = [
  { id: "LT-9001", sender: "TechStore Argentina", destZone: "CABA Norte (Belgrano)", storageLoc: "Pasillo A - Estante 12", dateIn: "Hoy 10:30", days: 0, status: "por_asignar" },
  { id: "LT-9002", sender: "Moda Online SRL", destZone: "CABA Sur (Barracas)", storageLoc: "Pasillo B - Estante 05", dateIn: "Ayer 16:00", days: 1, status: "listo_chofer" },
  { id: "LT-8750", sender: "Librería Central", destZone: "GBA Oeste (Morón)", storageLoc: "Jaula Central", dateIn: "Haces 6 días", days: 6, status: "alerta_tiempo" },
  { id: "LT-9003", sender: "TechStore Argentina", destZone: "CABA Centro (Recoleta)", storageLoc: "Pasillo A - Estante 12", dateIn: "Hoy 11:15", days: 0, status: "por_asignar" },
  { id: "LT-9004", sender: "Cosmética Rosa", destZone: "CABA Norte (Palermo)", storageLoc: "Mesa de Clasificación 2", dateIn: "Hoy 14:20", days: 0, status: "listo_chofer" },
];

export default function WarehouseInventory() {
  const [data, setData] = useState<PkgItem[]>(MOCK_INVENTORY);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  
  // Reassign state
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [reassignType, setReassignType] = useState<"internal" | "driver">("driver");
  const [reassignValue, setReassignValue] = useState("");

  const handleSimulateIngreso = () => {
    const newId = `LT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry: PkgItem = {
      id: newId,
      sender: "Nuevo Cliente Autónomo",
      destZone: "Zona Central (Macrocentro)",
      storageLoc: "Estación de Clasificación (Recién llegado)",
      dateIn: "Hace un instante",
      days: 0,
      status: "por_asignar"
    };

    setData(prev => [newEntry, ...prev]);
    setIsScanning(false);
  };

  const handleReassign = () => {
    if (selectedIds.size === 0) {
      alert("Por favor, selecciona al menos un paquete para reasignar.");
      return;
    }
    setIsReassignModalOpen(true);
  };

  const executeReassign = () => {
    setData(prev => prev.map(p => {
      if (selectedIds.has(p.id)) {
        if (reassignType === "internal") {
          return { ...p, storageLoc: reassignValue || "N/A" };
        } else {
          return { ...p, status: "listo_chofer", destZone: reassignValue || "Chofer Asignado" };
        }
      }
      return p;
    }));
    setSelectedIds(new Set());
    setIsReassignModalOpen(false);
    setReassignValue("");
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.map(p => p.id)));
    }
  };

  const filtered = data.filter(p => 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sender.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.destZone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black flex items-center gap-2">
            <PackageSearch className="w-8 h-8 text-[#0066CC]" /> Control de Inventario
          </h1>
          <p className="text-black/60 mt-1">Gestión avanzada de paquetería alojada, ubicaciones físicas y antigüedad.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="bg-white" onClick={() => setIsScanning(true)}>
             <QrCode className="w-4 h-4 mr-2" /> Escanear Ingreso
           </Button>
           <Button className="bg-[#009EE3] hover:bg-[#007AC3] text-white" onClick={handleReassign}>
             Reasignar Lotes
           </Button>
        </div>
      </div>

      {isScanning && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="bg-[#1A1A1A] w-full max-w-lg rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl relative">
             <div className="p-4 bg-black/50 border-b border-white/10 flex justify-between items-center">
               <h3 className="text-white font-bold flex items-center gap-2"><QrCode className="w-5 h-5 text-emerald-400"/> Registrando Ingreso</h3>
               <button onClick={() => setIsScanning(false)} className="text-white/50 hover:text-white font-bold text-xl px-2">&times;</button>
             </div>
             
             <div className="h-80 flex items-center justify-center relative">
               {/* Cuadro de escaneo central */}
               <div className="relative w-48 h-48 border-2 border-white/20 rounded-3xl flex items-center justify-center">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl"></div>
                  
                  {/* Animación Láser */}
                  <div className="absolute top-0 left-0 right-0 w-full flex justify-center scanner-animation" style={{ animation: "scan 2s infinite ease-in-out" }}>
                    <div className="w-[90%] h-0.5 bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.8)] glow" />
                  </div>
               </div>
               <style>{`@keyframes scan { 0% { top: 10%; } 50% { top: 90%; } 100% { top: 10%; } }`}</style>
             </div>

             <div className="p-6 bg-black/50 border-t border-white/10 flex flex-col items-center">
                <Button onClick={handleSimulateIngreso} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-xl border border-emerald-400/50">
                  Simular Ingreso Exitoso
                </Button>
                <p className="text-white/40 text-xs mt-3">Apunta la cámara al número de guía del paquete</p>
             </div>
          </div>
        </div>
      )}

      {/* MODAL DE REASIGNACIÓN */}
      {isReassignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-black/10 overflow-hidden">
              <div className="p-4 border-b border-black/5 bg-gray-50 flex justify-between items-center">
                 <h3 className="font-bold text-lg text-black">Reasignar {selectedIds.size} Paquetes</h3>
                 <button onClick={() => setIsReassignModalOpen(false)} className="text-black/40 hover:text-black font-bold text-xl px-2">&times;</button>
              </div>
              <div className="p-6 space-y-4">
                 <div className="flex bg-black/5 rounded-lg p-1">
                    <button 
                      className={`flex-1 text-sm font-semibold py-2 rounded-md transition-colors ${reassignType === 'driver' ? 'bg-white shadow-sm text-black' : 'text-black/50 hover:text-black'}`}
                      onClick={() => setReassignType('driver')}
                    >A otro Chofer</button>
                    <button 
                      className={`flex-1 text-sm font-semibold py-2 rounded-md transition-colors ${reassignType === 'internal' ? 'bg-white shadow-sm text-black' : 'text-black/50 hover:text-black'}`}
                      onClick={() => setReassignType('internal')}
                    >Ubicación Interna</button>
                 </div>
                 
                 <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-black/50 mb-2 block">
                      {reassignType === 'driver' ? 'Seleccionar Chofer o Ruta Destino' : 'Nueva Ubicación Física (Jaula/Pasillo)'}
                    </label>
                    {reassignType === 'driver' ? (
                      <select 
                        value={reassignValue} onChange={e => setReassignValue(e.target.value)} 
                        className="w-full border border-black/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50"
                      >
                         <option value="">Seleccione un chofer...</option>
                         <option value="Roberto S. (Ruta Norte)">Roberto S. (Ruta Norte)</option>
                         <option value="Carlos G. (Ruta Sur)">Carlos G. (Ruta Sur)</option>
                         <option value="Maxi R. (CABA Centro)">Maxi R. (CABA Centro)</option>
                      </select>
                    ) : (
                      <input 
                        type="text" placeholder="Ej: Pasillo D - Estante 20"
                        value={reassignValue} onChange={e => setReassignValue(e.target.value)} 
                        className="w-full border border-black/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50"
                      />
                    )}
                 </div>
                 
                 <Button onClick={executeReassign} disabled={!reassignValue} className="w-full h-11 font-bold bg-[#0066CC] hover:bg-blue-700 text-white mt-4">
                    Confirmar Movimiento
                 </Button>
              </div>
           </div>
        </div>
      )}

      <Card className="border border-black/10 bg-white shadow-sm flex flex-col flex-1 overflow-hidden">
         {/* TOOLBAR */}
         <div className="p-4 border-b border-black/5 bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
            
            <div className="relative w-full sm:w-96">
               <Search className="w-4 h-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
               <input 
                 type="text" 
                 placeholder="Buscar por ID, Vendedor o Zona Destino..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-white border border-black/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50"
               />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
               <span className="text-xs font-bold uppercase tracking-wider text-black/40 mr-2">Vistas:</span>
               <button className="flex items-center gap-1.5 bg-white border border-black/10 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm whitespace-nowrap hover:bg-black/5">
                 <Filter className="w-3.5 h-3.5"/> Filtros
               </button>
               <button className="flex items-center gap-1.5 bg-white border border-black/10 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm whitespace-nowrap hover:bg-black/5">
                 <ArrowUpDown className="w-3.5 h-3.5"/> Antigüedad
               </button>
            </div>
         </div>

         {/* TABLE HEADER */}
         <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-black/5 bg-white text-xs font-bold text-black/50 uppercase tracking-wider items-center">
            <div className="col-span-1 flex justify-center">
               <button onClick={toggleAll} className="text-black/40 hover:text-black transition-colors">
                  {selectedIds.size === data.length && data.length > 0 ? <CheckSquare className="w-5 h-5 text-[#0066CC]"/> : <Square className="w-5 h-5" />}
               </button>
            </div>
            <div className="col-span-2">ID Paquete</div>
            <div className="col-span-2">Vendedor / Origen</div>
            <div className="col-span-2">Zona Logística Dest.</div>
            <div className="col-span-2">Ubicación Física (Slot)</div>
            <div className="col-span-2">Antigüedad (Stock)</div>
            <div className="col-span-1 text-center">Gestión</div>
         </div>

         {/* TABLE BODY */}
         <div className="flex-1 overflow-y-auto">
            {filtered.map((pkg, i) => {
              const isSelected = selectedIds.has(pkg.id);
              return (
                <div key={pkg.id} className={`grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 items-center border-b border-black/5 transition-colors cursor-pointer ${isSelected ? 'bg-[#0066CC]/5' : 'hover:bg-black/[0.02]'}`} onClick={() => toggleSelect(pkg.id)}>
                   
                   {/* MOBILE SELECT VISUAL (hidden on desktop usually, but let's keep it clean) */}
                   <div className="col-span-1 hidden lg:flex justify-center">
                      {isSelected ? <CheckSquare className="w-5 h-5 text-[#0066CC]"/> : <Square className="w-5 h-5 text-black/20" />}
                   </div>

                   <div className="col-span-12 lg:col-span-2 flex items-center gap-3">
                      <div className="lg:hidden">
                        {isSelected ? <CheckSquare className="w-5 h-5 text-[#0066CC]"/> : <Square className="w-5 h-5 text-black/20" />}
                      </div>
                      <div>
                         <span className="font-bold text-black flex items-center gap-1.5 text-sm">
                           <PackageSearch className="w-3.5 h-3.5 opacity-40"/> {pkg.id}
                         </span>
                         <span className="lg:hidden text-xs text-black/50 uppercase tracking-wider block mt-0.5">{pkg.status.replace('_', ' ')}</span>
                      </div>
                   </div>

                   <div className="col-span-12 lg:col-span-2 text-sm font-medium text-black/80">
                      {pkg.sender}
                   </div>

                   <div className="col-span-12 lg:col-span-2">
                       <span className="inline-flex text-xs font-bold bg-black/5 px-2.5 py-1 rounded-md text-black/70">
                         {pkg.destZone}
                       </span>
                   </div>

                   <div className="col-span-12 lg:col-span-2 text-sm font-semibold text-[#0066CC]">
                      {pkg.storageLoc}
                   </div>

                   <div className="col-span-12 lg:col-span-2 flex items-center gap-3">
                      <div className="flex-1 lg:flex-none">
                         <p className="text-sm font-bold text-black">{pkg.dateIn}</p>
                         <p className="text-xs text-black/50">{pkg.days} días de guardia</p>
                      </div>
                      {pkg.status === 'alerta_tiempo' && (
                         <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded uppercase">
                           <AlertTriangle className="w-3 h-3"/> Costo extra
                         </div>
                      )}
                   </div>

                   <div className="col-span-12 lg:col-span-1 flex justify-end lg:justify-center">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-black/40 hover:text-black">
                         <MoreHorizontal className="w-4 h-4" />
                      </Button>
                   </div>

                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="p-12 flex flex-col items-center justify-center text-center opacity-50">
                 <PackageOpen className="w-16 h-16 mb-4" />
                 <h2 className="text-lg font-bold">No hay paquetes que coincidan</h2>
                 <p className="text-sm">Prueba buscando con otro ID o vendedor.</p>
              </div>
            )}
         </div>

         {/* BULK ACTION BAR */}
         {selectedIds.size > 0 && (
            <div className="bg-[#0066CC] p-4 text-white flex items-center justify-between border-t border-[#0052a3]">
               <div className="flex items-center gap-4">
                  <span className="font-bold">{selectedIds.size} seleccionados</span>
                  <div className="hidden sm:flex gap-2">
                     <span className="text-xs bg-white/20 px-2 py-1 rounded font-medium">Asignación Masiva</span>
                     <span className="text-xs bg-white/20 px-2 py-1 rounded font-medium">Imprimir Etiquetas</span>
                  </div>
               </div>
               <Button onClick={handleReassign} className="bg-white text-[#0066CC] hover:bg-gray-100 font-bold shadow-sm h-9 flex gap-2">
                 Acciones <ArrowRight className="w-4 h-4" />
               </Button>
            </div>
         )}
      </Card>
    </div>
  );
}
