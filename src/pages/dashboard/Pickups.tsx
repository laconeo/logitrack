import React, { useState } from "react";
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
  TestTube
} from "lucide-react";

type MockScenario = "success" | "A1_address" | "B1_drivers" | "E1_connection";
type FormStatus = "idle" | "submitting" | "success" | "error_address" | "error_nodrivers" | "error_connection";

export default function Pickups() {
  const [scenario, setScenario] = useState<MockScenario>("success");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [address, setAddress] = useState("Av. Corrientes 1234, CABA");
  const [date, setDate] = useState("2026-03-21");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Simulamos la latencia de red y el comportamiento según el escenario elegido
    setTimeout(() => {
      switch (scenario) {
        case "success":
          setStatus("success");
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

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
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

          {/* ESTADO DE CARGA O FORMULARIO NORMAL */}
          {status !== "success" && (
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
                        <p className="text-red-700/80 text-sm mt-1">El geocodificador no pudo ubicar la dirección ingresada en el mapa. Por favor, revisa la calle y la altura.</p>
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
                      <PackageIcon className="w-4 h-4 text-black/50" /> Cantidad Estimada de Paquetes
                    </label>
                    <Input type="number" min="1" placeholder="Ej: 15" required onChange={() => setStatus("idle")} />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-black/80 ml-1">Observaciones (Opcional)</label>
                    <textarea 
                      onChange={() => setStatus("idle")}
                      className="flex w-full rounded-2xl border border-black/10 bg-white/50 backdrop-blur-md px-4 py-3 text-sm transition-colors placeholder:text-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC] min-h-[100px] resize-none"
                      placeholder="Instrucciones para el repartidor (ej: tocar timbre 2B, preguntar por seguridad)..."
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" className="px-8 min-w-[200px]" disabled={status === "submitting"}>
                    {status === "submitting" ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Procesando
                      </span>
                    ) : (
                      "Confirmar Solicitud"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </Card>
    </div>
  );
}
