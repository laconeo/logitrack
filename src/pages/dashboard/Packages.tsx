import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Package } from "@/types";

const MOCK_PACKAGES: Package[] = [
  { id: "1", tracking_number: "LT-982374", status: "Entregado", address: "Av. Cabildo 2040, CABA", recipient: "Juan Pérez", created_at: "2026-03-20", updated_at: "2026-03-20 14:30" },
  { id: "2", tracking_number: "LT-982375", status: "En Distribución", address: "Santa Fe 3200, CABA", recipient: "María Gómez", created_at: "2026-03-20", updated_at: "2026-03-20 10:15" },
  { id: "3", tracking_number: "LT-982376", status: "Recogido", address: "Belgrano 120, Martínez", recipient: "Carlos López", created_at: "2026-03-20", updated_at: "2026-03-20 09:00" },
  { id: "4", tracking_number: "LT-982377", status: "Intento Fallido", address: "San Martín 450, Florida", recipient: "Ana Silva", created_at: "2026-03-19", updated_at: "2026-03-20 11:45" },
  { id: "5", tracking_number: "LT-982378", status: "En Depósito", address: "Libertador 1000, Vicente López", recipient: "Pedro Ruiz", created_at: "2026-03-19", updated_at: "2026-03-19 18:20" },
];

export default function Packages() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mis Paquetes</h1>
          <p className="text-sm text-black/60">Gestiona y rastrea todos tus envíos.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 px-4 py-2 text-sm rounded-xl">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          <Button variant="outline" className="h-10 px-4 py-2 text-sm rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-black/5 bg-black/[0.01]">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <Input 
              placeholder="Buscar por número de seguimiento o destinatario..." 
              className="pl-9 h-10 rounded-xl bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-black/50 uppercase bg-black/[0.02] border-b border-black/5">
              <tr>
                <th className="px-6 py-4 font-medium">Tracking</th>
                <th className="px-6 py-4 font-medium">Destinatario</th>
                <th className="px-6 py-4 font-medium">Dirección</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Última Act.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {MOCK_PACKAGES.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-black/[0.01] transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-medium text-[#0066CC]">{pkg.tracking_number}</td>
                  <td className="px-6 py-4">{pkg.recipient}</td>
                  <td className="px-6 py-4 text-black/70">{pkg.address}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={pkg.status} />
                  </td>
                  <td className="px-6 py-4 text-black/50">{pkg.updated_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Entregado': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'En Distribución': 'bg-blue-100 text-blue-700 border-blue-200',
    'Recogido': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'En Depósito': 'bg-purple-100 text-purple-700 border-purple-200',
    'Intento Fallido': 'bg-red-100 text-red-700 border-red-200',
  };

  const defaultStyle = 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || defaultStyle}`}>
      {status}
    </span>
  );
}
