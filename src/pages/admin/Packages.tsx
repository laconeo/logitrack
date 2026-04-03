import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, Filter, Download, Package as PackageIcon, Building2, Truck, Clock, CheckCircle2, AlertCircle, MoreVertical, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminPackage {
  id: string;
  tracking: string;
  client: string;
  warehouse: string;
  status: string;
  updatedAt: string;
  destination: string;
}

const MOCK_PACKAGES: AdminPackage[] = [
  { id: "1", tracking: "LT-982374", client: "TechStore Argentina", warehouse: "Hub Central CABA", status: "Entregado", updatedAt: "2026-03-20 14:30", destination: "Av. Cabildo 2040, CABA" },
  { id: "2", tracking: "LT-982375", client: "Moda rápida S.A.", warehouse: "Depósito Zona Norte", status: "En Distribución", updatedAt: "2026-03-20 10:15", destination: "Santa Fe 3200, CABA" },
  { id: "3", tracking: "LT-982376", client: "ElectroMundo", warehouse: "Hub Central CABA", status: "Recogido", updatedAt: "2026-03-20 09:00", destination: "Belgrano 120, Martínez" },
  { id: "4", tracking: "LT-982377", client: "TechStore Argentina", warehouse: "Nodo Sur Avellaneda", status: "Intento Fallido", updatedAt: "2026-03-20 11:45", destination: "San Martín 450, Florida" },
  { id: "5", tracking: "LT-982378", client: "Librerías Ateneo", warehouse: "Punto Express Belgrano", status: "En Depósito", updatedAt: "2026-03-19 18:20", destination: "Libertador 1000, V. López" },
];

export default function AdminPackages() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPackages = MOCK_PACKAGES.filter(pkg => 
    pkg.tracking.toLowerCase().includes(searchTerm.toLowerCase()) || 
    pkg.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.warehouse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <PackageIcon className="w-6 h-6 text-[#0066CC]" /> Inventario Global de Paquetes
          </h1>
          <p className="text-sm text-black/60">Monitorea y gestiona cada envío dentro de la red secundaria.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-10 px-4 py-2 text-sm rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Descargar Manifiesto
          </Button>
          <Button className="h-10 px-4 py-2 text-sm rounded-xl bg-[#0066CC] hover:bg-[#0052a3] text-white">
            <Filter className="w-4 h-4 mr-2" />
            Búsqueda Avanzada
          </Button>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Stock Total" 
          value="42,912" 
          icon={<PackageIcon className="w-4 h-4 text-[#0066CC]" />}
        />
        <StatCard 
          title="En Movimiento" 
          value="1,245" 
          icon={<Truck className="w-4 h-4 text-emerald-500" />}
        />
        <StatCard 
          title="Pickups Pendientes" 
          value="342" 
          icon={<Clock className="w-4 h-4 text-amber-500" />}
        />
        <StatCard 
          title="Incidencias" 
          value="14" 
          icon={<AlertCircle className="w-4 h-4 text-red-500" />}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-black/5 bg-black/[0.01] flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <Input 
              placeholder="Buscar por tracking, cliente o depósito..." 
              className="pl-9 h-10 rounded-xl bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select className="h-10 px-3 py-2 text-sm rounded-xl border border-black/10 bg-white outline-none focus:ring-2 focus:ring-[#0066CC]">
              <option>Todos los depósitos</option>
              <option>Hub Central CABA</option>
              <option>Depósito Zona Norte</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-black/50 uppercase bg-black/[0.02] border-b border-black/5">
              <tr>
                <th className="px-6 py-4 font-medium text-[#0066CC]">Tracking</th>
                <th className="px-6 py-4 font-medium">Cliente Origen</th>
                <th className="px-6 py-4 font-medium">Ubicación Actual</th>
                <th className="px-6 py-4 font-medium border-l border-black/5">Estado</th>
                <th className="px-6 py-4 font-medium">Última Actualización</th>
                <th className="px-6 py-4 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-black/[0.01] transition-colors">
                  <td className="px-6 py-4 font-bold text-black/80">{pkg.tracking}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-black/90">{pkg.client}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-medium text-black/70">
                      <Building2 className="w-3.5 h-3.5 text-black/30" />
                      {pkg.warehouse}
                    </div>
                    <div className="text-[10px] text-black/40 truncate max-w-[180px]">{pkg.destination}</div>
                  </td>
                  <td className="px-6 py-4 border-l border-black/5">
                    <StatusBadge status={pkg.status} />
                  </td>
                  <td className="px-6 py-4 text-black/50 tabular-nums">
                    {pkg.updatedAt}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                         <Eye className="w-4 h-4 text-black/60" />
                       </Button>
                       <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                         <MoreVertical className="w-4 h-4 text-black/40" />
                       </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPackages.length === 0 && (
            <div className="p-12 text-center text-black/40">
              No se encontraron paquetes para esta búsqueda.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <Card className="p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center border border-black/5">
        {icon}
      </div>
      <div>
        <div className="text-lg font-bold text-black/90">{value}</div>
        <div className="text-[10px] font-semibold text-black/40 uppercase tracking-wider">{title}</div>
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Entregado': 'bg-emerald-100/50 text-emerald-700 border-emerald-200',
    'En Distribución': 'bg-blue-100/50 text-blue-700 border-blue-200',
    'Recogido': 'bg-indigo-100/50 text-indigo-700 border-indigo-200',
    'En Depósito': 'bg-purple-100/50 text-purple-700 border-purple-200',
    'Intento Fallido': 'bg-red-100/50 text-red-700 border-red-200',
  };

  const icons: Record<string, React.ReactNode> = {
    'Entregado': <CheckCircle2 className="w-3 h-3" />,
    'En Distribución': <Truck className="w-3 h-3" />,
    'Intento Fallido': <AlertCircle className="w-3 h-3" />
  };

  return (
    <div className={cn("px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 w-max", styles[status])}>
      {icons[status]}
      {status}
    </div>
  );
}
