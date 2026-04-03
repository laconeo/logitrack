import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, Filter, Truck, CheckCircle2, XCircle, Star, MoreVertical, Eye, FileCheck, ShieldBan } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  type: string;
  status: string;
  zone: string;
  rating: number;
  deliveries: number;
}

const MOCK_DRIVERS: Driver[] = [
  { id: "DRV-101", name: "Roberto Sánchez", phone: "+54 9 11 4444-5555", vehicle: "Renault Kangoo 2021", type: "Furgoneta", status: "En Ruta", zone: "CABA Norte", rating: 4.8, deliveries: 1240 },
  { id: "DRV-102", name: "Marcos Del Valle", phone: "+54 9 11 2222-3333", vehicle: "Peugeot Partner", type: "Furgoneta", status: "Activo", zone: "GBA Sur", rating: 4.9, deliveries: 856 },
  { id: "DRV-103", name: "Lucía Fernández", phone: "+54 9 11 8888-9999", vehicle: "Honda Titan 150", type: "Moto", status: "Pendiente", zone: "CABA Centro", rating: 0, deliveries: 0 },
  { id: "DRV-104", name: "Carlos Ruiz", phone: "+54 9 11 7777-6666", vehicle: "Fiat Fiorino", type: "Furgoneta", status: "Inactivo", zone: "GBA Oeste", rating: 4.2, deliveries: 312 },
  { id: "DRV-105", name: "Ana Martínez", phone: "+54 9 11 1111-2222", vehicle: "Yamaha YBR", type: "Moto", status: "Bloqueado", zone: "CABA Sur", rating: 3.1, deliveries: 54 },
];

export default function AdminDrivers() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDrivers = MOCK_DRIVERS.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    driver.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gestión de Flota (Repartidores)</h1>
          <p className="text-sm text-black/60">Administra, aprueba y monitorea a todos los choferes de la red.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-10 px-4 py-2 text-sm rounded-xl">
            <Filter className="w-4 h-4 mr-2" />
            Flitrar por estado
          </Button>
          <Button className="h-10 px-4 py-2 text-sm rounded-xl bg-orange-600 hover:bg-orange-700 text-white">
            <FileCheck className="w-4 h-4 mr-2" />
            Aprobar Solicitudes (1)
          </Button>
        </div>
      </div>

      {/* Resumen Superior */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-[#0066CC]">
          <div className="text-sm font-medium text-black/60 mb-1">Total Choferes</div>
          <div className="text-2xl font-bold">156</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="text-sm font-medium text-black/60 mb-1">En Ruta / Activos hr</div>
          <div className="text-2xl font-bold text-emerald-600">84</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-orange-500 bg-orange-50/50">
          <div className="text-sm font-medium text-black/60 mb-1">Pendientes de Aprobación</div>
          <div className="text-2xl font-bold text-orange-600">8</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="text-sm font-medium text-black/60 mb-1">Cuentas Bloqueadas</div>
          <div className="text-2xl font-bold text-red-600">3</div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-black/5 bg-black/[0.01]">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <Input 
              placeholder="Buscar por ID, nombre o teléfono..." 
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
                <th className="px-6 py-4 font-medium">Repartidor</th>
                <th className="px-6 py-4 font-medium">Vehículo / Zona</th>
                <th className="px-6 py-4 font-medium border-l border-black/5">Estado</th>
                <th className="px-6 py-4 font-medium text-center border-l border-black/5">Entregas</th>
                <th className="px-6 py-4 font-medium text-center">Rating</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-black/[0.01] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-black/90">{driver.name}</div>
                    <div className="text-xs text-black/50">{driver.id} • {driver.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-black/80 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-black/40" />
                      {driver.vehicle}
                    </div>
                    <div className="text-xs text-black/50 mt-0.5">{driver.zone}</div>
                  </td>
                  <td className="px-6 py-4 border-l border-black/5">
                    <StatusBadge status={driver.status} />
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-black/70 border-l border-black/5">
                    {driver.deliveries > 0 ? driver.deliveries : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {driver.rating > 0 ? (
                        <>
                          <Star className={`w-4 h-4 ${driver.rating >= 4.5 ? 'text-amber-400 fill-amber-400' : 'text-amber-400'}`} />
                          <span className="font-medium">{driver.rating}</span>
                        </>
                      ) : (
                        <span className="text-black/30">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {driver.status === 'Pendiente' && (
                         <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-7 px-2 text-xs">
                           Aprobar
                         </Button>
                       )}
                       {driver.status === 'Pendiente' && (
                         <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 h-7 px-2 text-xs border-red-200 hover:bg-red-50">
                           Rechazar
                         </Button>
                       )}
                       {driver.status !== 'Pendiente' && (
                         <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                           <Eye className="w-4 h-4 text-black/60" />
                         </Button>
                       )}
                       <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-black/40 hover:text-black">
                         <MoreVertical className="w-4 h-4" />
                       </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDrivers.length === 0 && (
            <div className="p-8 text-center text-black/50 flex flex-col items-center">
              <ShieldBan className="w-8 h-8 mb-2 opacity-20" />
              <p>No se encontraron repartidores con ese criterio de búsqueda.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Activo': 'bg-emerald-100/50 text-emerald-700 border-emerald-200 flex items-center gap-1.5 w-max',
    'En Ruta': 'bg-[#0066CC]/10 text-[#0066CC] border-[#0066CC]/20 flex items-center gap-1.5 w-max',
    'Inactivo': 'bg-gray-100 text-gray-700 border-gray-200 flex items-center gap-1.5 w-max',
    'Pendiente': 'bg-orange-100/50 text-orange-700 border-orange-200 flex items-center gap-1.5 w-max',
    'Bloqueado': 'bg-red-100/50 text-red-700 border-red-200 flex items-center gap-1.5 w-max',
  };

  const icons: Record<string, React.ReactNode> = {
    'Activo': <CheckCircle2 className="w-3 h-3" />,
    'En Ruta': <Truck className="w-3 h-3" />,
    'Pendiente': <FileCheck className="w-3 h-3" />,
    'Bloqueado': <XCircle className="w-3 h-3" />
  };

  return (
    <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {icons[status] || <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 block mr-0.5" />}
      {status}
    </div>
  );
}
