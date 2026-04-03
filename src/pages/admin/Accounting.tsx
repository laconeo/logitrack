import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Truck, 
  Building2, 
  Download, 
  Search, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle,
  CheckCircle2,
  Clock,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabType = 'overview' | 'clients' | 'drivers' | 'warehouses' | 'expenses';

export default function AdminAccounting() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: 'overview', label: 'Resumen Financiero', icon: PieChart },
    { id: 'clients', label: 'Cobranzas (Clientes)', icon: Users },
    { id: 'drivers', label: 'Pagos a Choferes', icon: Truck },
    { id: 'warehouses', label: 'Pagos a Depósitos', icon: Building2 },
    { id: 'expenses', label: 'Gastos y Comisiones', icon: TrendingDown },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Contabilidad y Finanzas</h1>
          <p className="text-black/60">Control total de ingresos, gastos y flujos de caja de la red.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl h-11 px-4 text-sm font-semibold border-black/10">
            <Download className="w-4 h-4 mr-2" />
            Descargar Reporte Anual
          </Button>
          <Button className="rounded-xl h-11 px-4 text-sm font-semibold bg-[#0066CC] hover:bg-[#0052a3] text-white">
            <DollarSign className="w-4 h-4 mr-2" />
            Liquidar Periodo
          </Button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Cobrado (Efectivo/Digital)" 
          value="$14,250,500" 
          trend="+12% mes actual" 
          type="up"
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
        />
        <KPICard 
          title="Por Cobrar (Pendiente)" 
          value="$4,120,300" 
          trend="8 facturas vencidas" 
          type="down"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
        />
        <KPICard 
          title="Gasto Total (Pagado)" 
          value="$8,940,200" 
          trend="Comisiones + Fijos" 
          type="neutral"
          icon={<TrendingDown className="w-5 h-5 text-red-600" />}
        />
        <KPICard 
          title="Ganancia Neta (Estimada)" 
          value="$9,430,600" 
          trend="Resultado Operativo" 
          type="up"
          color="bg-[#0066CC]/5"
          icon={<TrendingUp className="w-5 h-5 text-[#0066CC]" />}
        />
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-black/[0.03] border border-black/5 rounded-2xl w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all",
              activeTab === tab.id 
                ? "bg-white text-black shadow-sm ring-1 ring-black/5" 
                : "text-black/40 hover:text-black/70"
            )}
          >
            <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-[#0066CC]" : "text-black/30")} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="mt-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'clients' && <ClientsTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
        {activeTab === 'drivers' && <DriversTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
        {activeTab === 'warehouses' && <WarehousesTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
        {activeTab === 'expenses' && <ExpensesTab />}
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, type, icon, color }: { title: string, value: string, trend: string, type: 'up' | 'down' | 'neutral', icon: React.ReactNode, color?: string }) {
  return (
    <Card className={cn("p-6", color)}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-black/[0.03] flex items-center justify-center border border-black/5">
          {icon}
        </div>
        <div className={cn(
          "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1",
          type === 'up' ? "bg-emerald-100 text-emerald-700" : 
          type === 'down' ? "bg-red-100 text-red-700" : "bg-black/5 text-black/50"
        )}>
          {trend}
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold tracking-tight text-black/90">{value}</div>
        <div className="text-xs font-semibold text-black/40 mt-1 uppercase tracking-widest">{title}</div>
      </div>
    </Card>
  );
}

{/* TAB: OVERVIEW */}
function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-8 h-full">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Ingresos por Servicio
        </h3>
        <div className="space-y-6">
          <RevenueItem label="Servicio de Courier Express" amount="$8,400,000" percent={60} />
          <RevenueItem label="E-commerce Fullfilment" amount="$4,200,000" percent={30} />
          <RevenueItem label="Logística Inversa (Devoluciones)" amount="$1,650,500" percent={10} />
        </div>
        <div className="mt-12 p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
          <p className="text-sm font-semibold text-emerald-900 mb-2">Recaudación Proyectada</p>
          <div className="text-2xl font-black text-emerald-700">$18.5M <span className="text-xs font-normal opacity-70">Este mes</span></div>
        </div>
      </Card>

      <Card className="p-8 h-full">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <History className="w-5 h-5 text-[#0066CC]" />
          Últimos Movimientos Notables
        </h3>
        <div className="space-y-4">
          {[
            { tag: 'Ingreso', desc: 'TechStore - Pago Factura #F4522', amount: '+$45,200', date: 'Hace 20 min' },
            { tag: 'Egreso', desc: 'Pago Liquidación Quincenal - Flota', amount: '-$1,200,400', date: 'Hace 2 horas' },
            { tag: 'Egreso', desc: 'Pago Alquiler Hub Central CABA', amount: '-$850,000', date: 'Hace 5 horas' },
            { tag: 'Ingreso', desc: 'Moda Rápida S.A. - Adelanto de Saldo', amount: '+$120,000', date: 'Ayer' },
          ].map((mov, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black/[0.02] border border-black/[0.04]">
              <div className="flex items-center gap-4">
                <span className={cn(
                  "text-[10px] font-bold uppercase rounded p-1",
                  mov.tag === 'Ingreso' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                )}>{mov.tag}</span>
                <div>
                  <div className="text-sm font-bold text-black/80">{mov.desc}</div>
                  <div className="text-[11px] text-black/40 font-medium">{mov.date}</div>
                </div>
              </div>
              <div className={cn("text-sm font-black", mov.tag === 'Ingreso' ? "text-emerald-600" : "text-black/80")}>
                {mov.amount}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function RevenueItem({ label, amount, percent }: { label: string, amount: string, percent: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-bold text-black/70">{label}</span>
        <span className="font-black text-black">{amount}</span>
      </div>
      <div className="w-full bg-black/5 h-2.5 rounded-full overflow-hidden">
        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

{/* TAB: CLIENTS */}
function ClientsTab({ searchTerm, setSearchTerm }: { searchTerm: string, setSearchTerm: (v: string) => void }) {
  const data = [
    { name: "TechStore Argentina", status: "Pago", amount: "$452,100", method: "Transferencia", date: "2026-03-22" },
    { name: "Moda rápida S.A.", status: "Pendiente", amount: "$124,500", method: "MercadoPago", date: "Vence 25/03" },
    { name: "Librerías Ateneo", status: "Pago", amount: "$892,000", method: "Efectivo", date: "2026-03-21" },
    { name: "Distribuidora Sur", status: "Vencido", amount: "$1,240,000", method: "Cheque", date: "10/03" },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-black/5 bg-black/[0.01]">
         <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <Input 
              placeholder="Buscar por cliente o factura..." 
              className="pl-9 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] text-black/50 uppercase bg-black/[0.02] border-b border-black/5 font-black tracking-widest">
            <tr>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Importe</th>
              <th className="px-6 py-4">Medio de Pago</th>
              <th className="px-6 py-4">Fecha/Venc</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {data.map((c, i) => (
              <tr key={i} className="hover:bg-black/[0.01]">
                <td className="px-6 py-4 font-bold text-black/80">{c.name}</td>
                <td className="px-6 py-4">
                  <div className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold w-max",
                    c.status === 'Pago' ? "bg-emerald-100 text-emerald-700" : 
                    c.status === 'Pendiente' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                  )}>{c.status}</div>
                </td>
                <td className="px-6 py-4 font-black">{c.amount}</td>
                <td className="px-6 py-4 text-black/50 font-medium">{c.method}</td>
                <td className="px-6 py-4 text-black/40 tabular-nums">{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

{/* TAB: DRIVERS */}
function DriversTab({ searchTerm, setSearchTerm }: { searchTerm: string, setSearchTerm: (v: string) => void }) {
  const data = [
    { name: "Roberto Sánchez", deliveries: 142, payout: "$56,800", status: "Transferencia Exitosa", date: "20/03" },
    { name: "Marcos Del Valle", deliveries: 89, payout: "$35,600", status: "Pendiente Liquidar", date: "Pendiente" },
    { name: "Carlos Ruiz", deliveries: 210, payout: "$84,000", status: "Transferencia Exitosa", date: "15/03" },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-black/5 bg-black/[0.01]">
         <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <Input placeholder="Buscar por chofer..." className="pl-9 bg-white" />
         </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] text-black/50 uppercase bg-black/[0.02] border-b border-black/5 font-black tracking-widest">
            <tr>
              <th className="px-6 py-4">Chofer</th>
              <th className="px-6 py-4">Paquetes Entregados</th>
              <th className="px-6 py-4">Liquidación Final</th>
              <th className="px-6 py-4">Estado Pago</th>
              <th className="px-6 py-4">Fecha Pago</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {data.map((d, i) => (
              <tr key={i} className="hover:bg-black/[0.01]">
                <td className="px-6 py-4 font-bold text-black/80">{d.name}</td>
                <td className="px-6 py-4 font-semibold text-black/60 text-center">{d.deliveries}</td>
                <td className="px-6 py-4 font-black">{d.payout}</td>
                <td className="px-6 py-4">
                   <div className={cn(
                    "flex items-center gap-1.5 text-[10px] font-bold",
                    d.status.includes('Existosa') || d.status.includes('Exitosa') ? "text-emerald-600" : "text-amber-600"
                  )}>
                    {d.status.includes('Exitosa') ? <CheckCircle2 className="w-3 h-3"/> : <Clock className="w-3 h-3"/>}
                    {d.status}
                   </div>
                </td>
                <td className="px-6 py-4 text-black/40 tabular-nums">{d.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

{/* TAB: WAREHOUSES */}
function WarehousesTab({ searchTerm, setSearchTerm }: { searchTerm: string, setSearchTerm: (v: string) => void }) {
  const data = [
    { name: "Hub Central CABA", area: "CABA", services: "Sorting + Storage", payout: "$850,000", status: "Pago Realizado", invoice: "INV-WH-011" },
    { name: "Depósito Zona Norte", area: "GBA Norte", services: "Sorting", payout: "$420,000", status: "Pendiente", invoice: "INV-WH-012" },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="p-6 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((w, i) => (
             <div key={i} className="p-6 rounded-3xl border border-black/5 bg-black/[0.01] space-y-4">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-black/5">
                         <Building2 className="w-5 h-5 text-[#0066CC]" />
                      </div>
                      <div>
                         <div className="font-bold text-black/80">{w.name}</div>
                         <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest">{w.area}</div>
                      </div>
                   </div>
                   <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                    w.status === 'Pendiente' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                   )}>{w.status}</div>
                </div>
                <div className="pt-4 border-t border-black/5 flex justify-between items-end">
                   <div>
                      <div className="text-[10px] text-black/40 font-bold uppercase mb-1">Monto de Alquiler / Servicio</div>
                      <div className="text-xl font-black text-black/80">{w.payout}</div>
                   </div>
                   <Button size="sm" variant="outline" className="text-[11px] h-8 rounded-lg">Ver Factura</Button>
                </div>
             </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

{/* TAB: EXPENSES */}
function ExpensesTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <Card className="p-8 md:col-span-1">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
             <AlertCircle className="w-5 h-5 text-red-500" />
             Gastos Fijos
          </h3>
          <div className="space-y-4">
             <ExpenseLine label="Sueldos Administracion" amount="$1,500,000" />
             <ExpenseLine label="Mantenimiento IT / Servidores" amount="$240,000" />
             <ExpenseLine label="Software / Licencias" amount="$120,000" />
             <ExpenseLine label="Oficinas Centrales" amount="$350,000" />
             <div className="pt-4 border-t border-black/5 mt-4">
                <ExpenseLine label="TOTAL FIJOS" amount="$2,210,000" font="font-black text-black/90" />
             </div>
          </div>
       </Card>

       <Card className="p-8 md:col-span-2">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
             <TrendingDown className="w-5 h-5 text-amber-600" />
             Cálculo de Comisiones de Red
          </h3>
          <div className="space-y-8">
             <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-xs font-bold text-black/40 uppercase mb-2">Comisión Repartidores (Directa)</div>
                  <div className="text-2xl font-black text-black/80">$5,240,000</div>
                  <p className="text-[11px] text-black/50 mt-1 leading-relaxed">Calculado sobre 45,290 entregas realizadas este periodo promedio $280/paq.</p>
                </div>
                <div>
                  <div className="text-xs font-bold text-black/40 uppercase mb-2">Comisión Depósitos / Hubs (Cross)</div>
                  <div className="text-2xl font-black text-black/80">$1,490,200</div>
                  <p className="text-[11px] text-black/50 mt-1 leading-relaxed">Liquidado por volumen de sorting y resguardo quincenal.</p>
                </div>
             </div>
             
             <div className="p-6 bg-black/[0.02] border border-black/5 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                   <div className="text-xs font-bold text-black/40 uppercase">Estructura Retributiva</div>
                   <ArrowUpRight className="w-4 h-4 text-black/20" />
                </div>
                <div className="flex gap-4 h-6 rounded-lg overflow-hidden">
                   <div className="bg-[#0066CC] h-full" style={{ width: '70%' }} />
                   <div className="bg-emerald-500 h-full" style={{ width: '20%' }} />
                   <div className="bg-amber-400 h-full" style={{ width: '10%' }} />
                </div>
                <div className="flex gap-8 mt-4">
                   <LegendItem color="bg-[#0066CC]" label="Choferes" />
                   <LegendItem color="bg-emerald-500" label="Hubs" />
                   <LegendItem color="bg-amber-400" label="Margen Op" />
                </div>
             </div>
          </div>
       </Card>
    </div>
  );
}

function ExpenseLine({ label, amount, font }: { label: string, amount: string, font?: string }) {
  return (
    <div className="flex justify-between items-center py-1">
       <span className="text-sm font-bold text-black/60">{label}</span>
       <span className={cn("text-sm font-semibold tabular-nums", font)}>{amount}</span>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
       <div className={cn("w-3 h-3 rounded-sm", color)} />
       <span className="text-[10px] font-bold text-black/50 uppercase">{label}</span>
    </div>
  );
}
