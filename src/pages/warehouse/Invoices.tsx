import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { DollarSign, FileText, CheckCircle2, TrendingUp, Package, Clock, AlertCircle, Calendar, Filter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

type PastInvoice = {
  id: string;
  period: string;
  amount: number;
  status: "cobrado" | "pendiente";
  dateEmit: string;
};

type ClientBilling = {
  id: string;
  name: string;
  packages: { id: string; daysStored: number; isActive: boolean }[];
  pastInvoices: PastInvoice[];
};

const DAILY_RATE = 250; // $250 por día por paquete alojado

const INITIAL_MOCK: ClientBilling[] = [
  {
    id: "cl-01",
    name: "TechStore Argentina",
    packages: [
      { id: "LT-8810", daysStored: 14, isActive: true },
      { id: "LT-8811", daysStored: 5, isActive: true },
    ],
    pastInvoices: [
      { id: "FAC-9012", period: "Marzo 2026", amount: 48500, status: "cobrado", dateEmit: "2026-03-31" },
      { id: "FAC-8899", period: "Febrero 2026", amount: 32000, status: "cobrado", dateEmit: "2026-02-28" },
    ]
  },
  {
    id: "cl-02",
    name: "Moda Online SRL",
    packages: [
      { id: "LT-9901", daysStored: 2, isActive: true },
    ],
    pastInvoices: [
      { id: "FAC-9013", period: "Marzo 2026", amount: 15500, status: "pendiente", dateEmit: "2026-03-31" },
      { id: "FAC-8700", period: "Enero 2026", amount: 20000, status: "cobrado", dateEmit: "2026-01-31" },
    ]
  }
];

export default function WarehouseInvoices() {
  const [data, setData] = useState(INITIAL_MOCK);
  const [activeTab, setActiveTab] = useState<"ciclo_abierto" | "historial">("historial");
  
  // States for Ciclo Abierto
  const [selectedClient, setSelectedClient] = useState<string>(INITIAL_MOCK[0].id);
  const [isClosingCycle, setIsClosingCycle] = useState(false);

  // States for Historial
  const [filterPeriod, setFilterPeriod] = useState<string>("Todos");

  // --- LOGIC: CICLO ABIERTO ---
  const clientInfo = data.find(c => c.id === selectedClient);
  const totalPackagesStored = clientInfo?.packages.length || 0;
  const totalDaysCombined = clientInfo?.packages.reduce((acc, p) => acc + p.daysStored, 0) || 0;
  const currentProjection = totalDaysCombined * DAILY_RATE;

  const handleCloseCycle = () => {
    setIsClosingCycle(true);
    setTimeout(() => {
      setData(prev => prev.map(c => {
        if (c.id === selectedClient) {
          const newInvoice: PastInvoice = {
             id: `FAC-${Math.floor(1000 + Math.random() * 9000)}`,
             period: "Abril 2026 (Adelantado)",
             amount: currentProjection,
             status: "pendiente",
             dateEmit: new Date().toISOString().split('T')[0]
          };
          return { ...c, packages: [], pastInvoices: [newInvoice, ...c.pastInvoices] };
        }
        return c;
      }));
      setIsClosingCycle(false);
    }, 1500);
  };

  // --- LOGIC: HISTORIAL GLOBAL ---
  // Aplanar todas las facturas en un solo array con nombre de cliente
  const allInvoices = data.flatMap(c => 
    c.pastInvoices.map(inv => ({ ...inv, clientName: c.name, clientId: c.id }))
  ).sort((a, b) => new Date(b.dateEmit).getTime() - new Date(a.dateEmit).getTime());

  // Extraer periodos únicos para el select
  const uniquePeriods = Array.from(new Set(allInvoices.map(inv => inv.period)));

  const filteredInvoices = filterPeriod === "Todos" 
    ? allInvoices 
    : allInvoices.filter(inv => inv.period === filterPeriod);

  const totalFilteredAmount = filteredInvoices.reduce((acc, inv) => acc + inv.amount, 0);
  const totalCobrado = filteredInvoices.filter(i => i.status === 'cobrado').reduce((acc, inv) => acc + inv.amount, 0);
  const totalPendiente = filteredInvoices.filter(i => i.status === 'pendiente').reduce((acc, inv) => acc + inv.amount, 0);
  const totalGlobalCobrado = allInvoices.filter(i => i.status === 'cobrado').reduce((acc, inv) => acc + inv.amount, 0);

  return (
    <div className="space-y-6 pb-24 h-full flex flex-col">
      {/* HEADER PRINCIPAL - BALANCE OMNIPRESENTE */}
      <div className="flex flex-col items-center justify-center p-8 bg-[#00A650] rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 opacity-10 pointer-events-none">
          <TrendingUp className="w-64 h-64" />
        </div>
        
        <p className="text-white/80 font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-2 relative z-10 text-center">Facturación de Alojamiento (Balance Cobrado Total)</p>
        <h1 className="text-5xl sm:text-7xl font-black tabular-nums tracking-tighter relative z-10">
          ${totalGlobalCobrado.toLocaleString()}
        </h1>
        <div className="mt-8 relative z-10 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <Button className="flex-1 bg-white hover:bg-white/90 text-[#00A650] font-black h-14 rounded-2xl text-lg shadow-xl shadow-black/10">
            Retirar Dinero
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-black/10 shadow-sm mt-2">
        <p className="text-sm text-black/60 font-medium">Control de cobranzas, historial global y liquidación de ciclos activos por vendedor.</p>
        <div className="bg-black/5 px-4 py-2 rounded-xl border border-black/5 flex items-center gap-3 w-fit">
           <p className="text-xs text-black/50 font-bold uppercase tracking-wider">Tarifa Unificada:</p>
           <p className="font-bold text-base text-[#0066CC]">${DAILY_RATE} <span className="text-xs font-medium text-black/50">/ paquete / día</span></p>
        </div>
      </div>

      {/* TABS DE NAVEGACIÓN */}
      <div className="flex bg-black/5 p-1 rounded-xl w-full sm:w-fit">
         <button 
           onClick={() => setActiveTab('historial')} 
           className={`flex-1 sm:px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'historial' ? 'bg-white shadow-sm text-black' : 'text-black/50 hover:text-black'}`}
         >
           Historial y Cobranzas
         </button>
         <button 
           onClick={() => setActiveTab('ciclo_abierto')} 
           className={`flex-1 sm:px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'ciclo_abierto' ? 'bg-white shadow-sm text-black' : 'text-black/50 hover:text-black'}`}
         >
           Proyección y Cierre (Mes en curso)
         </button>
      </div>

      {/* VISTA 1: HISTORIAL Y COBRANZAS (GLBOAL) */}
      {activeTab === 'historial' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
           {/* TABLERO DE RESULTADOS FILTRADOS */}
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-black/10 shadow-sm">
              <div className="flex items-center gap-4 w-full md:w-auto">
                 <Filter className="w-5 h-5 text-black/40" />
                 <select 
                   value={filterPeriod} 
                   onChange={(e) => setFilterPeriod(e.target.value)}
                   className="w-full md:w-64 border border-black/10 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A650]/50"
                 >
                   <option value="Todos">Facturación Histórica Total</option>
                   {uniquePeriods.map(p => <option key={p} value={p}>Periodo: {p}</option>)}
                 </select>
              </div>
              <div className="flex gap-6 w-full md:w-auto mt-4 md:mt-0 border-t md:border-0 pt-4 md:pt-0 border-black/5">
                 <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-black/40 tracking-widest">Ya Cobrado</p>
                    <p className="font-bold text-lg text-emerald-600">${totalCobrado.toLocaleString()}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-black/40 tracking-widest">En Mora / Pendiente</p>
                    <p className="font-bold text-lg text-amber-600">${totalPendiente.toLocaleString()}</p>
                 </div>
                 <div className="text-right pl-6 border-l border-black/10 hidden sm:block">
                    <p className="text-[10px] uppercase font-bold text-black/40 tracking-widest">Total del Período</p>
                    <p className="font-black text-2xl text-black">${totalFilteredAmount.toLocaleString()}</p>
                 </div>
              </div>
           </div>

           {/* GRILLA DE FACTURAS */}
           <Card className="border border-black/10 bg-white overflow-hidden shadow-sm">
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-black/5 bg-gray-50/50 text-xs font-bold text-black/50 uppercase tracking-wider items-center">
                 <div className="col-span-2">ID Factura</div>
                 <div className="col-span-3">Cliente Vendedor</div>
                 <div className="col-span-2">Período</div>
                 <div className="col-span-2">Monto</div>
                 <div className="col-span-2">Estado</div>
                 <div className="col-span-1 text-right"></div>
              </div>

              <div className="divide-y divide-black/5">
                 {filteredInvoices.length === 0 ? (
                    <div className="p-8 text-center text-black/40 text-sm">No hay registros para este filtro.</div>
                 ) : (
                    filteredInvoices.map((inv) => (
                      <div key={inv.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 items-center hover:bg-black/[0.02] transition-colors">
                         <div className="col-span-2 font-semibold text-black/80 flex items-center gap-2">
                           <FileText className="w-4 h-4 text-black/30" /> {inv.id}
                         </div>
                         <div className="col-span-3">
                           <span className="font-bold text-sm block">{inv.clientName}</span>
                           <span className="text-xs text-black/40">{inv.clientId}</span>
                         </div>
                         <div className="col-span-2 text-sm font-medium text-black/60 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 opacity-50"/> {inv.period}
                         </div>
                         <div className="col-span-2 font-black text-black">
                            ${inv.amount.toLocaleString()}
                         </div>
                         <div className="col-span-2">
                            {inv.status === 'cobrado' ? (
                               <span className="inline-flex text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md uppercase border border-emerald-200 gap-1 items-center">
                                 <CheckCircle2 className="w-3 h-3" /> Cobrado
                               </span>
                            ) : (
                               <span className="inline-flex text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded-md uppercase border border-amber-200 gap-1 items-center">
                                 <AlertCircle className="w-3 h-3" /> Pendiente
                               </span>
                            )}
                         </div>
                         <div className="col-span-1 text-right">
                            <Button variant="ghost" size="sm" className="h-8 text-xs text-[#0066CC]">Ver PDF</Button>
                         </div>
                      </div>
                    ))
                 )}
              </div>
           </Card>
        </div>
      )}

      {/* VISTA 2: PROYECCIÓN Y CIERRE DE CICLOS ABIERTOS */}
      {activeTab === 'ciclo_abierto' && clientInfo && (
        <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="lg:col-span-1 space-y-4">
             <h3 className="font-semibold text-black/80">Seleccionar Cuenta</h3>
             <div className="space-y-2">
                {data.map(client => (
                   <button 
                     key={client.id} onClick={() => setSelectedClient(client.id)}
                     className={`w-full text-left p-4 rounded-xl border transition-all ${
                       selectedClient === client.id ? 'bg-black shadow-lg text-white border-black' : 'bg-white text-black hover:border-black/30 border-black/10 shadow-sm'
                     }`}
                   >
                     <p className="font-bold">{client.name}</p>
                     <p className={`text-xs mt-1 ${selectedClient === client.id ? 'text-white/60' : 'text-black/50'}`}>
                        {client.packages.length} paquetes activos
                     </p>
                   </button>
                ))}
             </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
             <Card className="border border-black/10 bg-white overflow-hidden shadow-sm">
                <div className="p-6 bg-gray-50/50 border-b border-black/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                   <div>
                      <h2 className="text-xl font-bold">{clientInfo.name}</h2>
                      <p className="text-sm font-medium text-black/50 mt-0.5">Auditoría en tiempo real para generar nueva Liquidación.</p>
                   </div>
                   {clientInfo.packages.length > 0 && (
                     <Button onClick={handleCloseCycle} disabled={isClosingCycle} className="bg-[#0066CC] hover:bg-blue-700 text-white font-bold h-11 shrink-0">
                       {isClosingCycle ? 'Registrando...' : 'Emitir y Cerrar Ciclo'}
                     </Button>
                   )}
                </div>

                {clientInfo.packages.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center opacity-50">
                     <CheckCircle2 className="w-12 h-12 mb-3 text-emerald-500" />
                     <h3 className="font-bold text-lg">Ciclo limpio</h3>
                     <p className="text-sm">No hay paquetes activos contabilizando estadía para facturar.</p>
                  </div>
                ) : (
                  <div className="p-6">
                     <div className="flex flex-col md:flex-row gap-6 mb-8">
                       <div className="flex-1 bg-amber-50/50 border border-amber-200/50 rounded-2xl p-5">
                          <Clock className="w-6 h-6 text-amber-600 mb-2"/>
                          <p className="text-sm font-semibold text-black/60">Días Acumulados Totales</p>
                          <p className="text-2xl font-black">{totalDaysCombined}</p>
                       </div>
                       <div className="flex-1 bg-emerald-50/50 border border-emerald-200/50 rounded-2xl p-5 relative overflow-hidden">
                          <TrendingUp className="w-32 h-32 text-emerald-100 absolute -right-6 -bottom-6 opacity-50" />
                          <div className="relative z-10">
                             <p className="text-sm font-semibold text-emerald-800">A Facturar Hoy</p>
                             <p className="text-3xl font-black text-emerald-600 tabular-nums">${currentProjection.toLocaleString()}</p>
                          </div>
                       </div>
                     </div>

                     <h4 className="text-xs font-bold uppercase tracking-wider text-black/40 mb-3">Auditoría (Línea por línea)</h4>
                     <div className="border border-black/5 rounded-xl overflow-hidden">
                        {clientInfo.packages.map(p => (
                          <div key={p.id} className="flex justify-between items-center p-3 border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                             <div className="flex items-center gap-3">
                                <Package className="w-4 h-4 text-black/30" />
                                <span className="font-bold text-sm tracking-wide">{p.id}</span>
                             </div>
                             <div className="flex items-center gap-6">
                                <span className="text-xs font-medium text-black/60">{p.daysStored} días</span>
                                <span className="font-bold text-sm text-[#0066CC] w-20 text-right">+${(p.daysStored * DAILY_RATE).toLocaleString()}</span>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                )}
             </Card>
          </div>
        </div>
      )}
    </div>
  );
}
