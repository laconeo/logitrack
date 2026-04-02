import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, Download, CreditCard, ShieldCheck, CheckCircle2, Loader2, X, Wallet, ChevronRight } from "lucide-react";
import { Invoice } from "@/types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_INVOICES: Invoice[] = [
  { id: "INV-2026-003", period: "Marzo 2026 (1ra Quincena)", amount: 45200, status: "Pendiente de Pago", due_date: "2026-03-25" },
  { id: "INV-2026-002", period: "Febrero 2026 (2da Quincena)", amount: 38500, status: "Pagada", due_date: "2026-03-10" },
  { id: "INV-2026-001", period: "Febrero 2026 (1ra Quincena)", amount: 41000, status: "Pagada", due_date: "2026-02-25" },
];

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentStep, setPaymentStep] = useState<"checkout" | "processing" | "success">("checkout");

  const handleOpenPayment = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setPaymentStep("checkout");
    setIsPaymentModalOpen(true);
  };

  const handleProcessPayment = () => {
    setPaymentStep("processing");
    setTimeout(() => {
      setPaymentStep("success");
      
      // Update local invoice state
      if (selectedInvoice) {
        setInvoices(prev => prev.map(inv => 
          inv.id === selectedInvoice.id ? { ...inv, status: "Pagada" } : inv
        ));
      }
    }, 2000);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Facturación</h1>
        <p className="text-sm text-black/60">Historial de facturas y pagos (Integración ARCA).</p>
      </div>

      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                invoice.status === 'Pagada' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
              }`}>
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{invoice.period}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm">
                  <span className="text-black/60">Factura {invoice.id}</span>
                  <span className="text-black/30">•</span>
                  <span className={`font-medium ${
                    invoice.status === 'Pagada' ? 'text-emerald-600' : 'text-orange-600'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
                {invoice.status === 'Pendiente de Pago' && (
                  <div className="text-xs text-black/50 mt-1">
                    Vence el {invoice.due_date}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-3">
              <div className="text-2xl font-semibold tracking-tight">
                ${invoice.amount.toLocaleString('es-AR')}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" className="h-9 px-3 text-xs rounded-lg flex-1 sm:flex-none">
                  <Download className="w-4 h-4 mr-2" /> PDF
                </Button>
                {invoice.status === 'Pendiente de Pago' && (
                  <Button onClick={() => handleOpenPayment(invoice)} className="h-9 px-4 text-xs rounded-lg flex-1 sm:flex-none bg-[#009EE3] hover:bg-[#0089C7] text-white border-none">
                    <CreditCard className="w-4 h-4 mr-2" /> Pagar ahora
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {isPaymentModalOpen && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={paymentStep === 'success' ? closePaymentModal : undefined}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#f5f5f5] rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              {paymentStep === "checkout" && (
                <>
                  {/* MercadoPago Header */}
                  <div className="bg-[#009EE3] flex items-center justify-between px-4 py-3 text-white">
                    <button onClick={closePaymentModal} className="p-1 hover:bg-white/20 rounded-full transition-colors"><X className="w-5 h-5"/></button>
                    <div className="font-semibold tracking-tight">Mercado Pago</div>
                    <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center text-xs font-bold">M</div>
                  </div>

                  <div className="bg-white px-6 py-8 flex flex-col items-center border-b border-black/5">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                      <FileText className="w-8 h-8 text-[#009EE3]" />
                    </div>
                    <p className="text-sm font-medium text-black/60">LogiTrack Facturación</p>
                    <h2 className="text-3xl font-bold mt-1 text-black/80">${selectedInvoice.amount.toLocaleString('es-AR')}</h2>
                  </div>

                  <div className="p-6 space-y-4">
                    <p className="text-sm font-semibold text-black/60 uppercase tracking-widest mb-2 px-1">¿Cómo quieres pagar?</p>
                    
                    <button className="w-full bg-white p-4 rounded-xl border border-black/10 shadow-sm flex flex-col gap-1 hover:border-[#009EE3] transition-colors relative">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#009EE3]/10 flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-[#009EE3]"/>
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-semibold text-sm">Dinero en cuenta</p>
                          <p className="text-xs text-black/50">Disponible: $92,500</p>
                        </div>
                        <div className="w-5 h-5 border-[6px] border-[#009EE3] rounded-full flex items-center justify-center bg-white shadow-sm ring-1 ring-black/10" />
                      </div>
                    </button>

                    <button className="w-full bg-white p-4 rounded-xl border border-black/10 shadow-sm flex items-center justify-between hover:bg-black/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-black/60"/>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-sm">Nueva tarjeta</p>
                          <p className="text-xs text-black/50">Crédito o débito</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-black/40"/>
                    </button>
                    
                    <div className="pt-4 flex items-center justify-center gap-1.5 text-xs text-black/50">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> Pagos procesados de forma segura
                    </div>
                  </div>

                  <div className="bg-white p-4 border-t border-black/10">
                    <Button onClick={handleProcessPayment} className="w-full h-12 bg-[#009EE3] hover:bg-[#0089C7] text-white text-base rounded-xl border-none font-semibold">
                      Pagar ${selectedInvoice.amount.toLocaleString('es-AR')}
                    </Button>
                  </div>
                </>
              )}

              {paymentStep === "processing" && (
                <div className="p-16 flex flex-col items-center justify-center text-center bg-white">
                  <Loader2 className="w-12 h-12 text-[#009EE3] animate-spin mb-6" />
                  <h3 className="text-lg font-semibold text-black/80">Procesando tu pago...</h3>
                  <p className="text-black/50 text-sm mt-2 max-w-[200px]">Por favor, no cierres esta ventana.</p>
                </div>
              )}

              {paymentStep === "success" && (
                <div className="p-12 flex flex-col items-center justify-center text-center bg-white">
                  <div className="w-20 h-20 bg-[#00A650] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#00A650]/30 animate-in zoom-in spin-in-12 duration-500">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-black/90 tracking-tight">¡Listo! Se acreditó tu pago</h3>
                  <p className="text-black/60 text-sm mt-2 mb-8">En tu resumen verás el cargo como "MercadoPago LogiTrack".</p>
                  
                  <div className="w-full bg-gray-50 rounded-xl p-4 mb-8 text-sm text-left border border-black/5 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-black/60">Monto total pagado</span>
                      <span className="font-semibold">${selectedInvoice.amount.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/60">Medio de pago</span>
                      <span className="font-semibold">Dinero en cuenta</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/60">Operación</span>
                      <span className="font-semibold">#940294829</span>
                    </div>
                  </div>

                  <Button onClick={closePaymentModal} className="w-full h-12 bg-[#00A650] hover:bg-[#008C42] text-white font-semibold rounded-xl border-none">
                    Volver al inicio
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
