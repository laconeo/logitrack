import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, Filter, MapPin, Building2, Package, Users, Activity, ExternalLink, ShieldAlert, ArrowUpRight, Plus } from "lucide-react";

interface Warehouse {
  id: string;
  name: string;
  zone: string;
  manager: string;
  phone: string;
  status: string;
  capacityLimit: number;
  currentPackages: number;
  activeDrivers: number;
}

const MOCK_WAREHOUSES: Warehouse[] = [
  { id: "WH-101", name: "Hub Central CABA", zone: "CABA Centro", manager: "Roberto Méndez", phone: "+54 9 11 3333-1111", status: "Operativo", capacityLimit: 10000, currentPackages: 6540, activeDrivers: 45 },
  { id: "WH-102", name: "Depósito Zona Norte", zone: "GBA Norte", manager: "Silvina Paz", phone: "+54 9 11 3333-2222", status: "Alerta Capacidad", capacityLimit: 5000, currentPackages: 4920, activeDrivers: 28 },
  { id: "WH-103", name: "Nodo Sur Avellaneda", zone: "GBA Sur", manager: "Carlos Torres", phone: "+54 9 11 3333-3333", status: "Operativo", capacityLimit: 4000, currentPackages: 1250, activeDrivers: 15 },
  { id: "WH-104", name: "Centro Logístico Oeste", zone: "GBA Oeste", manager: "Mariana Luna", phone: "+54 9 11 3333-4444", status: "Mantenimiento", capacityLimit: 8000, currentPackages: 0, activeDrivers: 0 },
  { id: "WH-105", name: "Punto Express Belgrano", zone: "CABA Norte", manager: "Fernando Ruiz", phone: "+54 9 11 3333-5555", status: "Operativo", capacityLimit: 1500, currentPackages: 1100, activeDrivers: 8 },
];

export default function AdminWarehouses() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWarehouses = MOCK_WAREHOUSES.filter(wh => 
    wh.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    wh.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wh.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCapacity = MOCK_WAREHOUSES.reduce((acc, curr) => acc + curr.capacityLimit, 0);
  const totalPackagesInNetwork = MOCK_WAREHOUSES.reduce((acc, curr) => acc + curr.currentPackages, 0);
  const globalCapacityPercent = Math.round((totalPackagesInNetwork / totalCapacity) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#0066CC]" /> Red de Depósitos
          </h1>
          <p className="text-sm text-black/60">Gestiona la capacidad y el estado de todos tus hubs logísticos.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-10 px-4 py-2 text-sm rounded-xl">
            <Filter className="w-4 h-4 mr-2" />
            Flitrar Zonas
          </Button>
          <Button className="h-10 px-4 py-2 text-sm rounded-xl bg-[#0066CC] hover:bg-[#0052a3] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Depósito
          </Button>
        </div>
      </div>

      {/* Resumen Superior */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-[#0066CC]">
          <div className="text-sm font-medium text-black/60 mb-1">Nodos Operativos</div>
          <div className="text-2xl font-bold flex items-end gap-2">
            4 <span className="text-sm font-medium text-black/40 mb-1">/ 5 totales</span>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-indigo-500">
          <div className="text-sm font-medium text-black/60 mb-1">Capacidad Red Global</div>
          <div className="text-2xl font-bold text-indigo-600">{globalCapacityPercent}%</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="text-sm font-medium text-black/60 mb-1">Paquetes Almacenados</div>
          <div className="text-2xl font-bold text-emerald-600">{(totalPackagesInNetwork / 1000).toFixed(1)}k</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500 bg-red-50/50">
          <div className="text-sm font-medium text-black/60 mb-1">Alertas de Cuello de Botella</div>
          <div className="text-2xl font-bold text-red-600">1</div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-black/5 bg-black/[0.01]">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <Input 
              placeholder="Buscar depósito, zona o identificador..." 
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
                <th className="px-6 py-4 font-medium">Depósito / Hub</th>
                <th className="px-6 py-4 font-medium">Responsable / Contacto</th>
                <th className="px-6 py-4 font-medium border-l border-black/5">Estado Operativo</th>
                <th className="px-6 py-4 font-medium border-l border-black/5 w-64 text-center">Capacidad Ocupada (%)</th>
                <th className="px-6 py-4 font-medium text-center">Repartidores Activos</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredWarehouses.map((wh) => {
                const occupancyRate = wh.capacityLimit > 0 ? (wh.currentPackages / wh.capacityLimit) * 100 : 0;
                
                return (
                  <tr key={wh.id} className="hover:bg-black/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-black/90 flex items-center gap-1.5">
                        {wh.name}
                      </div>
                      <div className="text-xs text-black/50 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#0066CC]/70" /> {wh.zone} • {wh.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-black/80">{wh.manager}</div>
                      <div className="text-xs text-black/50 mt-0.5">{wh.phone}</div>
                    </td>
                    <td className="px-6 py-4 border-l border-black/5">
                      <StatusBadge status={wh.status} />
                    </td>
                    <td className="px-6 py-4 border-l border-black/5">
                      <div className="flex flex-col justify-center gap-2">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className={`${occupancyRate > 90 ? 'text-red-600' : 'text-emerald-700'}`}>
                            {occupancyRate.toFixed(1)}% Lleno
                          </span>
                          <span className="text-black/50">{wh.currentPackages}/{wh.capacityLimit} <Package className="w-3 h-3 inline mb-0.5"/></span>
                        </div>
                        <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              occupancyRate >= 90 ? 'bg-red-500' : 
                              occupancyRate >= 70 ? 'bg-amber-400' : 
                              'bg-emerald-500'
                            }`}
                            style={{ width: `${occupancyRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center gap-1.5 bg-black/[0.03] px-3 py-1 rounded-lg border border-black/5">
                        <Users className="w-3.5 h-3.5 text-black/50" />
                        <span className="font-semibold text-black/80">{wh.activeDrivers}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <Button variant="outline" size="sm" className="h-8 px-2 text-xs text-[#0066CC] border-[#0066CC]/20 hover:bg-[#0066CC]/5">
                           Inventario <ArrowUpRight className="w-3 h-3 ml-1" />
                         </Button>
                         <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-black/40 hover:text-black">
                           <ExternalLink className="w-4 h-4" />
                         </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredWarehouses.length === 0 && (
            <div className="p-8 text-center text-black/50 flex flex-col items-center">
              <Building2 className="w-8 h-8 mb-2 opacity-20" />
              <p>No se encontraron depósitos con ese criterio de búsqueda.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Operativo': 'bg-emerald-100/50 text-emerald-700 border-emerald-200 flex items-center gap-1.5 w-max',
    'Alerta Capacidad': 'bg-red-100/50 text-red-700 border-red-200 flex items-center gap-1.5 w-max animate-pulse',
    'Mantenimiento': 'bg-amber-100/50 text-amber-700 border-amber-200 flex items-center gap-1.5 w-max',
  };

  const icons: Record<string, React.ReactNode> = {
    'Operativo': <Activity className="w-3 h-3" />,
    'Alerta Capacidad': <ShieldAlert className="w-3 h-3 text-red-600" />,
    'Mantenimiento': <Building2 className="w-3 h-3" />
  };

  return (
    <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {icons[status] || <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 block mr-0.5" />}
      {status}
    </div>
  );
}
