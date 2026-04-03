import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, Filter, Briefcase, Mail, Phone, CheckCircle2, XCircle, MoreVertical, Building2, ExternalLink, ArrowUpRight, Ban } from "lucide-react";

interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: string;
  plan: string;
  totalPackages: number;
  openBalance: number;
}

const MOCK_CLIENTS: Client[] = [
  { id: "CL-501", companyName: "TechStore Argentina", contactName: "Martín López", email: "logistica@techstore.com.ar", phone: "+54 9 11 5555-1234", status: "Activo", plan: "Corporativo", totalPackages: 14500, openBalance: 45200 },
  { id: "CL-502", companyName: "Moda rápida S.A.", contactName: "Carla Gómez", email: "envios@modarapida.com.ar", phone: "+54 9 11 4444-9876", status: "Activo", plan: "Pyme", totalPackages: 3200, openBalance: 12500 },
  { id: "CL-503", companyName: "ElectroMundo", contactName: "Juan Pérez", email: "depositos@electromundo.com", phone: "+54 9 11 2222-3333", status: "Prospecto", plan: "Sin asignar", totalPackages: 0, openBalance: 0 },
  { id: "CL-504", companyName: "Distribuidora Sur", contactName: "Diego Armando", email: "d.armando@distrisur.com.ar", phone: "+54 9 11 1111-2222", status: "Suspendido", plan: "Pyme", totalPackages: 850, openBalance: 124000 },
  { id: "CL-505", companyName: "Librerías Ateneo", contactName: "Sofía Castro", email: "ecommerce@ateneo.com", phone: "+54 9 11 9999-8888", status: "Activo", plan: "Corporativo", totalPackages: 24700, openBalance: 0 },
];

export default function AdminClients() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = MOCK_CLIENTS.filter(client => 
    client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cuentas Corrientes y Clientes</h1>
          <p className="text-sm text-black/60">Gestiona los vendedores y corporaciones que utilizan LogiTrack.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-10 px-4 py-2 text-sm rounded-xl">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar Clientes
          </Button>
          <Button className="h-10 px-4 py-2 text-sm rounded-xl bg-[#0066CC] hover:bg-[#0052a3] text-white">
            <Building2 className="w-4 h-4 mr-2" />
            Alta de Cliente
          </Button>
        </div>
      </div>

      {/* Resumen Superior */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-[#0066CC]">
          <div className="text-sm font-medium text-black/60 mb-1">Clientes Activos</div>
          <div className="text-2xl font-bold">482</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="text-sm font-medium text-black/60 mb-1">Paquetes Totales (Mes)</div>
          <div className="text-2xl font-bold text-emerald-600">42.5k</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="text-sm font-medium text-black/60 mb-1">Deuda Total Pendiente</div>
          <div className="text-2xl font-bold text-amber-600">$18.9M</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-orange-500 bg-orange-50/50">
          <div className="text-sm font-medium text-black/60 mb-1">Nuevos Contratos</div>
          <div className="text-2xl font-bold text-orange-600">12</div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-black/5 bg-black/[0.01]">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <Input 
              placeholder="Buscar por Empresa, ID o Contacto..." 
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
                <th className="px-6 py-4 font-medium">Empresa</th>
                <th className="px-6 py-4 font-medium">Contacto Principal</th>
                <th className="px-6 py-4 font-medium border-l border-black/5">Estado / Plan</th>
                <th className="px-6 py-4 font-medium text-right border-l border-black/5">Envíos Históricos</th>
                <th className="px-6 py-4 font-medium text-right">Saldo Actual</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-black/[0.01] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#0066CC] hover:underline cursor-pointer flex items-center gap-1.5">
                      {client.companyName} <ExternalLink className="w-3 h-3 text-black/30" />
                    </div>
                    <div className="text-xs text-black/50 mt-0.5">ID: {client.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-black/80">{client.contactName}</div>
                    <div className="text-xs text-black/50 mt-1 flex flex-col gap-0.5">
                       <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-black/40"/> {client.email}</span>
                       <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-black/40"/> {client.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-l border-black/5">
                    <div className="flex flex-col gap-2">
                      <StatusBadge status={client.status} />
                      <span className="text-xs font-medium text-black/60 bg-black/5 w-max px-2 py-0.5 rounded-full border border-black/10">
                        {client.plan}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-black/80 border-l border-black/5">
                    {client.totalPackages > 0 ? (
                      client.totalPackages >= 1000 ? `${(client.totalPackages / 1000).toFixed(1)}k` : client.totalPackages
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-semibold text-black/90">
                      ${client.openBalance.toLocaleString()}
                    </div>
                    {client.openBalance > 100000 && (
                      <div className="text-[10px] text-red-600 font-bold uppercase mt-1">
                        Deuda Crítica
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button variant="outline" size="sm" className="h-8 px-2 text-xs text-[#0066CC] border-[#0066CC]/20 hover:bg-[#0066CC]/5">
                         Operaciones <ArrowUpRight className="w-3 h-3 ml-1" />
                       </Button>
                       <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-black/40 hover:text-black">
                         <MoreVertical className="w-4 h-4" />
                       </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClients.length === 0 && (
            <div className="p-8 text-center text-black/50 flex flex-col items-center">
              <Ban className="w-8 h-8 mb-2 opacity-20" />
              <p>No se encontraron clientes con ese criterio de búsqueda.</p>
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
    'Prospecto': 'bg-[#0066CC]/10 text-[#0066CC] border-[#0066CC]/20 flex items-center gap-1.5 w-max',
    'Suspendido': 'bg-red-100/50 text-red-700 border-red-200 flex items-center gap-1.5 w-max',
  };

  const icons: Record<string, React.ReactNode> = {
    'Activo': <CheckCircle2 className="w-3 h-3" />,
    'Prospecto': <Briefcase className="w-3 h-3" />,
    'Suspendido': <XCircle className="w-3 h-3" />
  };

  return (
    <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {icons[status] || <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 block mr-0.5" />}
      {status}
    </div>
  );
}
