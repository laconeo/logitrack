import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, Download, CreditCard } from "lucide-react";
import { Invoice } from "@/types";

const MOCK_INVOICES: Invoice[] = [
  { id: "INV-2026-003", period: "Marzo 2026 (1ra Quincena)", amount: 45200, status: "Pendiente de Pago", due_date: "2026-03-25" },
  { id: "INV-2026-002", period: "Febrero 2026 (2da Quincena)", amount: 38500, status: "Pagada", due_date: "2026-03-10" },
  { id: "INV-2026-001", period: "Febrero 2026 (1ra Quincena)", amount: 41000, status: "Pagada", due_date: "2026-02-25" },
];

export default function Invoices() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Facturación</h1>
        <p className="text-sm text-black/60">Historial de facturas y pagos (Integración ARCA).</p>
      </div>

      <div className="grid gap-4">
        {MOCK_INVOICES.map((invoice) => (
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
                  <Button className="h-9 px-4 text-xs rounded-lg flex-1 sm:flex-none bg-[#0066CC] hover:bg-[#0055AA]">
                    <CreditCard className="w-4 h-4 mr-2" /> Pagar
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
