import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Camera, ScanLine, QrCode, CheckCircle2, AlertCircle, Smartphone, Package as PackageIcon, ArrowLeft, RefreshCw, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

type Status = "pendiente" | "entregado" | "demorado";

type Pkg = {
  id: string;
  address: string;
  recipient: string;
  sender?: string;
  weight?: string;
  dimensions?: string;
  deliveryNotes?: string;
  status: Status;
  observation?: string;
};

export default function DriverDeliveries() {
  const [isScanning, setIsScanning] = useState(true);
  const [scannedPkg, setScannedPkg] = useState<Pkg | null>(null);
  
  // "entregado" se usa para el feedback (QR), "demorado" se usa para el form de observaciones
  const [actionIntent, setActionIntent] = useState<"entregado" | "demorado" | null>(null);
  
  // Historial de la sesión de hoy
  const [sessionHistory, setSessionHistory] = useState<Pkg[]>([]);

  const handleSimulateScan = () => {
    setIsScanning(false);
    setScannedPkg({ 
      id: `LT-${Math.floor(1000 + Math.random() * 9000)}`, 
      address: "Av. Cabildo 2040, Piso 2, Depto B, CABA", 
      recipient: "Juan López", 
      sender: "TechStore Argentina",
      weight: "2.5 kg",
      dimensions: "30x20x15 cm",
      deliveryNotes: "Dejar en portería si no atiende el 2B.",
      status: "pendiente" 
    });
  };

  const handleMarkStatusAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedPkg || !actionIntent) return;

    const val = (e.currentTarget.elements.namedItem('obs') as HTMLTextAreaElement).value;
    
    const finalPkg = { ...scannedPkg, status: actionIntent, observation: val };
    setScannedPkg(finalPkg); // Updates view to show QR if entregado
    setActionIntent(null);   // Closes the form

    // Si fue demorado, esperar 1.5s mostrando el cartel y resetear
    if (actionIntent === 'demorado') {
       setTimeout(() => resetScanner(finalPkg), 1500);
    }
  };

  const resetScanner = (pkgToSave?: Pkg) => {
    const finalPkg = pkgToSave || scannedPkg;
    if (finalPkg && finalPkg.status !== 'pendiente') {
      setSessionHistory(prev => [finalPkg, ...prev]);
    }
    setScannedPkg(null);
    setActionIntent(null);
    setIsScanning(true);
  };

  return (
    <div className="h-full flex flex-col pb-20">
      
      {/* HEADER ESCÁNER */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-black flex items-center gap-2">
          <Camera className="w-6 h-6 text-[#00A650]" /> Escáner de Entrega
        </h1>
        <p className="text-sm text-black/60">Apunta tu cámara al código de barras del paquete para registrar su destino.</p>
      </div>

      <AnimatePresence mode="wait">
        {/* VISTA 1: CÁMARA ACTIVA */}
        {isScanning && (
          <motion.div 
            key="scanner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-4"
          >
            <div className="relative bg-[#1A1A1A] rounded-3xl h-[60vh] min-h-[400px] border-4 border-slate-800 shadow-xl overflow-hidden flex flex-col items-center justify-center">
               
               <div className="absolute top-6 left-0 right-0 text-center">
                 <p className="text-white/60 font-medium text-sm tracking-widest uppercase">Escaneando Envíos</p>
               </div>

               {/* Cuadro de escaneo central */}
               <div className="relative w-64 h-64 border-2 border-white/20 rounded-3xl flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  {/* Esquinas */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl"></div>
                  
                  <QrCode className="w-24 h-24 text-emerald-400/20" />
                  
                  {/* Animación Láser */}
                  <div className="absolute top-0 left-0 right-0 w-full flex justify-center scanner-animation" style={{ animation: "scan 2s infinite ease-in-out" }}>
                    <div className="w-[90%] h-0.5 bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.8)] glow" />
                  </div>
               </div>

               <style>{`@keyframes scan { 0% { top: 10%; } 50% { top: 90%; } 100% { top: 10%; } }`}</style>
               
               <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                  <Button onClick={handleSimulateScan} size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-lg border border-emerald-400/50 font-bold px-8 h-12 w-[85%] max-w-[300px]">
                     Simular Lectura de Paquete
                  </Button>
               </div>
            </div>

            {sessionHistory.length > 0 && (
              <div className="mt-4">
                 <h3 className="text-sm font-bold text-black/40 uppercase tracking-widest mb-3">Historial de Hoy</h3>
                 <div className="space-y-2">
                   {sessionHistory.map((h, i) => (
                     <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-black/5 shadow-sm">
                        <div className="flex items-center gap-3">
                           {h.status === 'entregado' ? <CheckCircle2 className="w-5 h-5 text-emerald-500"/> : <AlertCircle className="w-5 h-5 text-amber-500"/>}
                           <div>
                              <p className={`text-sm font-bold ${h.status === 'entregado' ? 'text-emerald-700' : 'text-amber-700'}`}>{h.id}</p>
                              <p className="text-xs text-black/50 truncate w-40">{h.address}</p>
                           </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-black/5 px-2 py-1 rounded text-black/50">{h.status}</span>
                     </div>
                   ))}
                 </div>
              </div>
            )}
          </motion.div>
        )}

        {/* VISTA 2: PAQUETE ESCANEADO / ACCIÓN INMEDIATA */}
        {!isScanning && scannedPkg && (
          <motion.div 
            key="package-detail"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="flex-1 flex flex-col"
          >
             <button onClick={() => resetScanner()} className="text-xs font-semibold text-black/50 flex items-center gap-1 hover:text-black mb-4 w-fit">
               <ArrowLeft className="w-4 h-4"/> Cancelar y volver al escáner
             </button>

             <Card className={`overflow-hidden border transition-colors shadow-lg ${
               scannedPkg.status === 'entregado' ? 'border-emerald-300' : 
               scannedPkg.status === 'demorado' ? 'border-amber-300' : 'border-[#0066CC]/30'
             }`}>
               {/* INFO GENERAL AMPLIADA */}
               <div className={`p-6 border-b ${
                 scannedPkg.status === 'entregado' ? 'bg-emerald-50' : 
                 scannedPkg.status === 'demorado' ? 'bg-amber-50' : 'bg-[#0066CC]/5'
               }`}>
                 <div className="flex justify-between items-start mb-4">
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-black/5">
                     <PackageIcon className="w-8 h-8 text-black/40" />
                   </div>
                   {(scannedPkg.weight || scannedPkg.dimensions) && (
                     <div className="text-right">
                       <span className="inline-block bg-white border border-black/10 text-black/60 text-xs font-bold px-2 py-1 rounded shadow-sm">
                         {scannedPkg.weight} • {scannedPkg.dimensions}
                       </span>
                     </div>
                   )}
                 </div>

                 <h2 className="text-3xl font-black tracking-tight text-black mb-2">{scannedPkg.id}</h2>
                 
                 <div className="space-y-2 mt-4 bg-white p-4 rounded-xl border border-black/5 shadow-sm">
                   <p className="text-sm font-medium text-black/80 flex items-start gap-2">
                     <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#0066CC]"/> 
                     <span><span className="block text-[10px] uppercase text-black/40 tracking-wider mb-0.5">Destino final</span>{scannedPkg.address}</span>
                   </p>
                   <div className="border-t border-black/5 my-2"></div>
                   <p className="text-sm font-medium text-black/80 flex items-center gap-2">
                     <span className="w-4 flex justify-center text-black/40">•</span>
                     <span><span className="text-black/50 text-xs mr-1">Recibe:</span> <strong>{scannedPkg.recipient}</strong></span>
                   </p>
                   {scannedPkg.sender && (
                     <p className="text-sm font-medium text-black/80 flex items-center gap-2">
                       <span className="w-4 flex justify-center text-black/40">•</span>
                       <span><span className="text-black/50 text-xs mr-1">Remitente:</span> {scannedPkg.sender}</span>
                     </p>
                   )}
                 </div>

                 {scannedPkg.deliveryNotes && (
                   <div className="mt-3 p-3 bg-amber-50/50 border border-amber-200/50 rounded-xl">
                     <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">📋 Instrucciones de Entrega</p>
                     <p className="text-sm text-black/70 italic">"{scannedPkg.deliveryNotes}"</p>
                   </div>
                 )}
               </div>

               {/* ESTADO PENDIENTE - DECISIÓN */}
               {scannedPkg.status === 'pendiente' && !actionIntent && (
                 <div className="p-6 grid grid-cols-2 gap-4 bg-white">
                   <Button onClick={() => setActionIntent("entregado")} className="h-16 text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-sm border-none flex-col gap-1">
                     <CheckCircle2 className="w-6 h-6" /> Entregado
                   </Button>
                   <Button onClick={() => setActionIntent("demorado")} variant="outline" className="h-16 text-sm font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl flex-col gap-1 border-none shadow-sm">
                     <AlertCircle className="w-6 h-6" /> Demorado
                   </Button>
                 </div>
               )}

               {/* FORMULARIO DE ACCIÓN */}
               <AnimatePresence>
                 {actionIntent && (
                   <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden bg-white">
                      <form onSubmit={handleMarkStatusAndSave} className={`p-6 border-t ${actionIntent === 'demorado' ? 'bg-amber-50/30' : 'bg-emerald-50/30'}`}>
                         <h3 className={`font-bold text-sm tracking-wide mb-3 flex items-center gap-2 ${actionIntent === 'demorado' ? 'text-amber-800' : 'text-emerald-800'}`}>
                           {actionIntent === 'demorado' ? <AlertCircle className="w-5 h-5"/> : <CheckCircle2 className="w-5 h-5"/>}
                           {actionIntent === 'demorado' ? 'Justificar Demora Obligatoria' : 'Observación de Entrega (Opcional)'}
                         </h3>
                         <textarea 
                           name="obs" 
                           required={actionIntent === 'demorado'} 
                           placeholder={actionIntent === 'demorado' ? "Describe puntualmente por qué no se pudo entregar..." : "Aclaraciones (Ej: Dejado en garita)..."}
                           className="w-full text-sm bg-white border border-black/10 rounded-xl p-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50 shadow-sm mb-4 resize-none"
                         />
                         <div className="flex gap-3">
                           <Button type="button" variant="ghost" onClick={() => setActionIntent(null)} className="h-12 px-6">Atrás</Button>
                           <Button type="submit" className={`h-12 flex-1 font-bold text-white border-none shadow-md ${actionIntent === 'demorado' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                             {actionIntent === 'demorado' ? 'Guardar Relato' : 'Firmar y Generar QR'}
                           </Button>
                         </div>
                      </form>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* ESTADO FINAL: DEMORADO */}
               {scannedPkg.status === 'demorado' && (
                 <div className="p-8 bg-white flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-amber-800 text-lg">Envío marcado en Demora</h3>
                    <p className="text-sm text-black/50 mt-1">Guardando registro volverás a la cámara...</p>
                 </div>
               )}

               {/* ESTADO FINAL: ENTREGADO & VERIFICADO POR QR */}
               {scannedPkg.status === 'entregado' && (
                 <div className="p-8 bg-white flex flex-col items-center text-center">
                    <h5 className="font-bold text-emerald-700 text-lg flex items-center gap-2 mb-2">
                       <Smartphone className="w-5 h-5"/> Verificación de Cliente
                    </h5>
                    <p className="text-xs text-black/50 mb-6 max-w-[250px] leading-relaxed">
                      El receptor (<span className="font-semibold text-black">{scannedPkg.recipient}</span>) debe escanear este código con su celular para firmar.
                    </p>
                    
                    <div className="bg-white p-4 rounded-3xl border-4 border-emerald-100 shadow-sm mb-8 inline-block animate-in zoom-in spin-in-12 duration-500">
                       <QrCode className="w-32 h-32 text-emerald-800" />
                    </div>

                    <Button onClick={() => resetScanner(scannedPkg)} className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-2xl shadow-xl flex gap-2">
                      <RefreshCw className="w-5 h-5" /> Siguiente Entrega
                    </Button>
                 </div>
               )}

             </Card>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
