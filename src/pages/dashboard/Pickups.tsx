import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Package as PackageIcon, 
  CheckCircle2, 
  AlertCircle, 
  CalendarX2, 
  WifiOff,
  Loader2,
  TestTube,
  Plus, Eye, X, Phone, ArrowLeft
} from "lucide-react";


type FormStatus = "idle" | "submitting" | "success" | "error_address" | "error_nodrivers" | "error_connection" | "checkout";

export default function Pickups() {
  const [isRequestingMode, setIsRequestingMode] = useState(false);
  const [scenario, setScenario] = useState<MockScenario>("success");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [address, setAddress] = useState("Av. Corrientes 1234, CABA");
  const [date, setDate] = useState("2026-03-21");
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(new Set(["LT-91223"]));
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState<any>(null);
  const [isMercadoPagoOpen, setIsMercadoPagoOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);

  const pastPickups = [
    { id: "PK-1029", date: "Hoy 16:30", count: 3, status: "Programado", payment: "Pagado" },
    { id: "PK-1028", date: "Ayer 10:00", count: 8, status: "Realizado", payment: "Cuenta Corriente" },
    { id: "PK-1020", date: "Lunes 14:00", count: 12, status: "Realizado", payment: "Pagado" },
  ];

  const togglePackage = (id: string, st: string) => {
    if (st !== 'Listo para recolectar') return;
    const newSet = new Set(selectedPackages);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedPackages(newSet);
  };

  const handleOpenPickupDetails = (pick: any) => {
    setSelectedPickup(pick);
    setExpandedPackage(null);
    setIsDetailsModalOpen(true);
  };

  // Paquetes pendientes mock (Para mostrar el listado a la derecha)
  const pendingPackages = [
    { id: "LT-91223", size: "Grande", status: "Listo para recolectar" },
    { id: "LT-91224", size: "Mediano", status: "Listo para recolectar" },
    { id: "LT-91225", size: "Pequeño", status: "En preparación" },
    { id: "LT-91226", size: "Grande", status: "En preparación" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Simulamos la latencia de red y el comportamiento según el escenario elegido
    setTimeout(() => {
      switch (scenario) {
        case "success":
          setStatus("checkout");
          break;
        case "A1_address":
          setStatus("error_address");
          break;
        case "B1_drivers":
          setStatus("error_nodrivers");
          break;
        case "E1_connection":
          setStatus("error_connection");
          break;
      }
    }, 1500);
  };

  const resetForm = () => {
    setStatus("idle");
  };

  // Calcula una fecha alternativa (simulada) para el error B1
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
  const suggestedDate = nextDate.toISOString().split('T')[0];

  const handleMercadoPagoFlow = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsMercadoPagoOpen(false);
      setStatus("success");
    }, 2000);
  };

  if (!isRequestingMode) {
    return (
      <div className="space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Pickups</h1>
            <p className="text-sm text-black/60">Gestiona tus recolecciones solicitadas.</p>
          </div>
          <Button onClick={() => setIsRequestingMode(true)} className="h-10 px-4 py-2 text-sm rounded-xl bg-[#0066CC] hover:bg-[#0052a3] text-white">
            <Plus className="w-4 h-4 mr-2" /> Solicitar Pickup
          </Button>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-black/50 uppercase bg-black/[0.02] border-b border-black/5">
                <tr>
                  <th className="px-6 py-4 font-medium">ID Pickup</th>
                  <th className="px-6 py-4 font-medium">Fecha Programada</th>
                  <th className="px-6 py-4 font-medium">Cant. Paquetes</th>
                  <th className="px-6 py-4 font-medium">Modo de Pago</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {pastPickups.map((pick) => (
                  <tr key={pick.id} className="hover:bg-black/[0.01] transition-colors">
                    <td className="px-6 py-4 font-medium text-[#0066CC]">{pick.id}</td>
                    <td className="px-6 py-4">{pick.date}</td>
                    <td className="px-6 py-4 font-semibold">{pick.count}</td>
                    <td className="px-6 py-4">
                      {pick.payment === 'Pagado' ? (
                        <span className="font-bold text-emerald-600 text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Pagado</span>
                      ) : (
                        <span className="font-bold text-black/50 text-xs flex items-center gap-1"><Clock className="w-3 h-3 text-amber-500" /> Cta. Corriente</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${pick.status === 'Realizado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {pick.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" className="h-8 text-xs px-3" onClick={() => handleOpenPickupDetails(pick)}>
                        <Eye className="w-3.5 h-3.5 mr-1.5" /> Detalles
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal Detalles del Pickup */}
        <AnimatePresence>
          {isDetailsModalOpen && selectedPickup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setIsDetailsModalOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                {expandedPackage ? (
                   <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-gray-50/50">
                        <button onClick={() => setExpandedPackage(null)} className="flex items-center gap-2 text-sm font-semibold text-[#0066CC] hover:text-blue-800 transition-colors">
                          <ArrowLeft className="w-4 h-4"/> Volver al Pickup
                        </button>
                      </div>
                      <div className="p-6 overflow-y-auto space-y-6">
                         <div className="flex items-start justify-between bg-white border border-black/5 p-4 rounded-xl shadow-sm">
                           <div>
                              <p className="text-xl font-bold tracking-tight text-black">{expandedPackage}</p>
                              <p className="text-sm text-black/50 mt-1">Destino: <strong>Av. Santa Fe 3200, Recoleta</strong></p>
                              <p className="text-sm text-black/50">Cliente Final: <strong>Martín Gómez</strong></p>
                           </div>
                           <div className="text-right">
                              <span className="inline-flex bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Demorado</span>
                           </div>
                         </div>
                         
                         <div>
                            <h3 className="text-xs font-bold text-black/50 uppercase tracking-wider mb-4">Hoja de Ruta (Tracking)</h3>
                            <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-black/10">
                               <div className="relative z-10 flex gap-4">
                                  <div className="w-6 h-6 rounded-full bg-amber-100 border-2 border-amber-500 relative -left-[30px] shrink-0" />
                                  <div className="-mt-1">
                                    <p className="font-bold text-sm text-black">Intento de Entrega Fallido</p>
                                    <p className="text-xs text-black/50 mb-1">Ayer, 16:45 hs</p>
                                    <div className="bg-amber-50/50 border border-amber-200/50 rounded-lg p-3 mt-1">
                                      <p className="text-xs text-amber-900 italic">"No había nadie en el domicilio. Toqué timbre 3 veces al departamento 2B." - Reporte del Chofer Roberto S.</p>
                                    </div>
                                  </div>
                               </div>
                               <div className="relative z-10 flex gap-4">
                                  <div className="w-6 h-6 rounded-full bg-[#0066CC] border-2 border-white shadow-sm relative -left-[30px] shrink-0" />
                                  <div className="-mt-1">
                                    <p className="font-bold text-sm text-black">Asignado a Chofer y en Ruta</p>
                                    <p className="text-xs text-black/50">Ayer, 08:30 hs</p>
                                  </div>
                               </div>
                               <div className="relative z-10 flex gap-4">
                                  <div className="w-6 h-6 rounded-full bg-black/20 border-2 border-white shadow-sm relative -left-[30px] shrink-0" />
                                  <div className="-mt-1">
                                    <p className="font-bold text-sm text-black/60">Recibido en Depósito LogiTrack</p>
                                    <p className="text-xs text-black/40">Hace 2 días</p>
                                  </div>
                               </div>
                               <div className="relative z-10 flex gap-4">
                                  <div className="w-6 h-6 rounded-full bg-black/20 border-2 border-white shadow-sm relative -left-[30px] shrink-0" />
                                  <div className="-mt-1">
                                    <p className="font-bold text-sm text-black/60">Pickup recolectado con éxito</p>
                                    <p className="text-xs text-black/40">Hace 2 días (Incluido en Pick {selectedPickup.id})</p>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-gray-50/50">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        Detalles del Pickup <span className="text-[#0066CC]">{selectedPickup.id}</span>
                      </h2>
                      <button onClick={() => setIsDetailsModalOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/50">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6 overflow-y-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xs font-bold text-black/50 uppercase tracking-wider mb-3">Información General</h3>
                          <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-black/5 text-sm">
                            <div className="flex justify-between">
                              <span className="text-black/60">Estado</span>
                              <span className="font-semibold">{selectedPickup.status}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-black/60">Fecha Programada</span>
                              <span className="font-semibold">{selectedPickup.date}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-black/60">Cantidad Paquetes</span>
                              <span className="font-semibold">{selectedPickup.count}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-xs font-bold text-black/50 uppercase tracking-wider mb-3">Chofer Asignado</h3>
                          {selectedPickup.status === 'Pendiente' ? (
                            <div className="p-4 rounded-xl border border-dashed border-amber-300 bg-amber-50 text-sm flex gap-3 text-amber-800">
                               <Clock className="w-5 h-5 text-amber-500 shrink-0"/>
                               <div>Buscando repartidor disponible para esta recolección.</div>
                            </div>
                          ) : (
                            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#0066CC] text-white flex items-center justify-center font-bold">
                                  RS
                                </div>
                                <div>
                                  <p className="font-semibold text-sm">Roberto Sánchez</p>
                                  <p className="text-xs text-black/60">Camioneta Renault Kangoo</p>
                                </div>
                              </div>
                              <a href="tel:+5491144445555" className="flex items-center gap-2 text-sm text-[#0066CC] font-medium pt-2 border-t border-blue-200/50 hover:underline">
                                <Phone className="w-4 h-4"/> +54 9 11 4444-5555
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                         <h3 className="text-xs font-bold text-black/50 uppercase tracking-wider mb-3">Paquetes para recoger</h3>
                         <div className="space-y-2 max-h-[300px] pr-2 overflow-y-auto">
                            {[...Array(selectedPickup.count)].map((_, i) => (
                               <button 
                                 key={i} 
                                 onClick={() => setExpandedPackage(`LT-912${20 + i}`)}
                                 className="w-full bg-white border text-sm border-black/10 hover:border-[#0066CC]/50 rounded-xl p-3 flex items-center gap-3 shadow-sm text-left transition-colors cursor-pointer group"
                               >
                                 <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors"><PackageIcon className="w-4 h-4 text-black/50 group-hover:text-[#0066CC]" /></div>
                                 <div className="flex-1">
                                   <h4 className="font-semibold text-black group-hover:text-[#0066CC] transition-colors">LT-912{20 + i}</h4>
                                   <p className="text-black/50 text-xs">Tamaño: {i % 2 === 0 ? 'Mediano' : 'Grande'}</p>
                                 </div>
                                 <div className="text-black/30 group-hover:text-[#0066CC] pr-2">
                                   <Eye className="w-4 h-4" />
                                 </div>
                               </button>
                            ))}
                         </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col items-start gap-1">
          <button onClick={() => setIsRequestingMode(false)} className="text-xs text-black/40 hover:text-black transition-colors mb-1 flex items-center gap-1 font-medium"><X className="w-3 h-3"/> Volver a Pickups</button>
          <h1 className="text-2xl font-semibold tracking-tight">Solicitar Pickup</h1>
          <p className="text-sm text-black/60">Programa una recolección en tu depósito o local.</p>
        </div>
        
        {/* Selector de Escenarios para el Mock */}
        <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-3 flex flex-col gap-2 shadow-sm shrink-0">
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <TestTube className="w-4 h-4" /> Simulador de Casos de Uso
          </div>
          <select 
            value={scenario}
            onChange={(e) => setScenario(e.target.value as MockScenario)}
            className="text-sm border-0 border-b border-blue-200 bg-transparent text-blue-900 font-medium focus:ring-0 focus:outline-none pb-1"
          >
            <option value="success">Flujo Principal (Éxito)</option>
            <option value="A1_address">A1 - Dirección Inexistente</option>
            <option value="B1_drivers">B1 - Sin Repartidores (Carga/Zona)</option>
            <option value="E1_connection">E1 - Falla de Conexión</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <Card className="p-8 relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* ESTADO DE ÉXITO */}
            {status === "success" && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-inner border border-emerald-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 tracking-tight">¡Solicitud Confirmada!</h3>
                <p className="text-black/60 max-w-md mb-8 leading-relaxed">
                  Hemos registrado tu solicitud de pickup con estado <strong>Pendiente</strong>. El Administrador ha sido notificado y pronto se asignará a un repartidor en tu zona.
                </p>
                <Button onClick={resetForm} variant="secondary">Solicitar otro pickup</Button>
              </motion.div>
            )}

            {/* ESTADO DE CHECKOUT (FACTURACIÓN) */}
            {status === "checkout" && (
              <motion.div 
                key="checkout"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col h-full"
              >
                <div className="flex items-center gap-3 border-b border-black/5 pb-4 mb-6">
                  <PackageIcon className="w-6 h-6 text-[#0066CC]" />
                  <h3 className="text-xl font-bold tracking-tight">Confirmación de Facturación</h3>
                </div>
                
                <div className="bg-gray-50 border border-black/5 rounded-2xl p-6 mb-8 space-y-4">
                   <div className="flex justify-between items-center text-sm font-medium text-black/60">
                      <span>Tarifa Plana de Recolección</span>
                      <span>$5,000</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-medium text-black/60">
                      <span>Paquetes Incluidos ({selectedPackages.size})</span>
                      <span>Bonificado</span>
                   </div>
                   <div className="pt-4 border-t border-black/10 flex justify-between items-end">
                      <span className="font-bold text-black text-lg">Total a Facturar</span>
                      <span className="text-3xl font-black text-black">$5,000</span>
                   </div>
                </div>

                <div className="space-y-4 mt-auto">
                   <p className="text-sm font-semibold text-black/80">Selecciona el método de cargo:</p>
                   
                   <Button onClick={() => setIsMercadoPagoOpen(true)} className="w-full h-14 bg-[#00A650] hover:bg-emerald-600 font-bold text-white shadow-lg text-lg flex items-center justify-center gap-2">
                     Pagar Ahora (MercadoPago)
                   </Button>
                   
                   <Button onClick={() => setStatus("success")} variant="outline" className="w-full h-14 font-bold border-2 border-black/10 hover:bg-black/5 text-black">
                     Añadir a Cuenta Corriente (30 Días)
                   </Button>

                   <p className="text-xs text-black/40 text-center px-4 leading-relaxed mt-4">
                     * Cuenta Corriente acumulará este cargo a tu liquidación mensual de manera unificada.
                   </p>
                </div>
              </motion.div>
            )}

            {/* ESTADO DE CARGA O FORMULARIO NORMAL */}
            {status !== "success" && status !== "checkout" && (
              <motion.div 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* ERRORES CONDICIONALES */}
                  <AnimatePresence>
                    {status === "error_address" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-red-800 text-sm">Dirección no encontrada (A1)</h4>
                          <p className="text-red-700/80 text-sm mt-1">El geocodificador no pudo ubicar la dirección ingresada en el mapa. Por favor, revisa la calle o mueve el pin en el mapa.</p>
                        </div>
                      </motion.div>
                    )}
                    {status === "error_nodrivers" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                        <CalendarX2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-amber-800 text-sm">Sin repartidores disponibles (B1)</h4>
                          <p className="text-amber-700/80 text-sm mt-1">La flota de tu zona ya está a máxima capacidad para la fecha seleccionada.</p>
                          <div className="mt-3">
                            <Button size="sm" type="button" onClick={() => { setDate(suggestedDate); setStatus("idle"); }} className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-none">
                              Cambiar al día {suggestedDate}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {status === "error_connection" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
                        <WifiOff className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm">Falla de conexión (E1)</h4>
                          <p className="text-slate-600 text-sm mt-1">No pudimos conectar con el servidor para registrar el pickup. Revisa tu internet e intenta de nuevo.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b border-black/5 pb-2">Datos de Recolección</h3>
                    
                    <div className="space-y-1.5 relative">
                      <label className="text-sm font-medium text-black/80 ml-1 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-black/50" /> Dirección de Origen
                      </label>
                      <Input 
                        value={address} 
                        onChange={(e) => { setAddress(e.target.value); setStatus("idle"); }}
                        required 
                        className={status === "error_address" ? "border-red-300 ring-2 ring-red-100" : ""}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-black/80 ml-1 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-black/50" /> Fecha
                        </label>
                        <Input 
                          type="date" 
                          required 
                          value={date} 
                          onChange={(e) => { setDate(e.target.value); setStatus("idle"); }}
                          className={status === "error_nodrivers" ? "border-amber-300 ring-2 ring-amber-100" : ""}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-black/80 ml-1 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-black/50" /> Rango Horario
                        </label>
                        <select onChange={() => setStatus("idle")} className="flex w-full rounded-2xl border border-black/10 bg-white/50 backdrop-blur-md px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC]">
                          <option>Mañana (09:00 - 13:00)</option>
                          <option>Tarde (14:00 - 18:00)</option>
                          <option>Día Completo (09:00 - 18:00)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-black/80 ml-1 flex items-center gap-2">
                        <PackageIcon className="w-4 h-4 text-black/50" /> Cantidad a Recolectar
                      </label>
                      <div className="flex w-full rounded-2xl border border-black/10 bg-black/5 px-4 py-3 text-sm font-bold text-black items-center">
                        {selectedPackages.size} {selectedPackages.size === 1 ? "paquete seleccionado" : "paquetes seleccionados"} (Cálculo automático)
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-black/80 ml-1">Observaciones (Opcional)</label>
                      <textarea 
                        onChange={() => setStatus("idle")}
                        className="flex w-full rounded-2xl border border-black/10 bg-white/50 backdrop-blur-md px-4 py-3 text-sm transition-colors placeholder:text-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC] min-h-[100px] resize-none"
                        placeholder="Instrucciones extas (ej: tocar timbre 2B, preguntar por seguridad)..."
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" className="px-8 min-w-[200px]" disabled={status === "submitting" || selectedPackages.size === 0}>
                      {status === "submitting" ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Procesando
                        </span>
                      ) : (
                        "Avanzar al Checkout"
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </Card>

        {/* MODAL SIMULADOR MERCADOPAGO */}
        <AnimatePresence>
          {isMercadoPagoOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="bg-[#009EE3] p-6 text-white text-center flex flex-col items-center">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-[#009EE3]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                   </div>
                   <h3 className="font-black text-xl tracking-tight leading-none mb-1">Mercado Pago</h3>
                   <p className="text-white/80 text-sm font-medium">LogiTrack Argentina SRL</p>
                </div>
                
                <div className="p-6 text-center border-b border-black/5">
                   <p className="text-xs font-bold uppercase tracking-wider text-black/40 mb-1">Total a pagar</p>
                   <p className="text-4xl font-black text-black tracking-tighter tabular-nums">$5,000</p>
                </div>

                <div className="p-6 bg-gray-50 flex flex-col gap-3">
                   <Button 
                      onClick={handleMercadoPagoFlow}
                      disabled={isProcessingPayment}
                      className="w-full h-14 bg-[#009EE3] hover:bg-blue-600 text-white font-bold text-lg rounded-xl shadow-md border border-blue-400"
                   >
                     {isProcessingPayment ? (
                       <span className="flex items-center gap-2 justify-center"><Loader2 className="w-5 h-5 animate-spin" /> Procesando pago...</span>
                     ) : (
                       "Pagar"
                     )}
                   </Button>
                   <Button 
                      onClick={() => setIsMercadoPagoOpen(false)}
                      variant="ghost"
                      disabled={isProcessingPayment}
                      className="w-full h-12 font-semibold text-black/50 hover:text-black hover:bg-black/5 rounded-xl"
                   >
                     Cancelar operación
                   </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* PACKAGES TO PICK UP CARD */}
        <Card className="p-6 border border-black/10 shadow-sm bg-gray-50/30">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-1">
            <PackageIcon className="w-5 h-5 text-[#0066CC]" /> 
            Listado de Paquetes
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Paquetes asociados a esta ubicación que requieren ser incluidos en este pickup.
          </p>

          <div className="space-y-3">
            {pendingPackages.map(pkg => (
              <label 
                key={pkg.id} 
                className={`bg-white border text-sm rounded-xl p-4 flex items-center gap-4 shadow-sm transition-colors cursor-pointer ${pkg.status !== 'Listo para recolectar' ? 'opacity-60 bg-gray-50 border-gray-200 cursor-not-allowed' : selectedPackages.has(pkg.id) ? 'border-[#0066CC] ring-1 ring-[#0066CC]/20' : 'border-black/10 hover:border-black/20'}`}
              >
                <div className="shrink-0 flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={selectedPackages.has(pkg.id)}
                    onChange={() => togglePackage(pkg.id, pkg.status)}
                    disabled={pkg.status !== 'Listo para recolectar'}
                    className="w-4 h-4 text-[#0066CC] border-black/20 rounded focus:ring-[#0066CC] disabled:opacity-50 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#0066CC]">{pkg.id}</h4>
                  <p className="text-black/60 text-xs mt-0.5">Tamaño: {pkg.size}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${pkg.status === 'Listo para recolectar' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {pkg.status}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed">
              Recuerda que debes confirmar que todos los paquetes estén listos en el rango horario seleccionado o el pickup podría ser reprogramado.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

