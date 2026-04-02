import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Search, Filter, Download, Plus, QrCode, X, Camera, Eye, Phone, Truck, CheckCircle2, Package as PackageIcon, Clock, Calendar, MapPin as MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Package } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapPin } from 'lucide-react';

function LocationMarker({ position, setPosition, customIcon }: { 
  position: [number, number], 
  setPosition: (pos: [number, number]) => void,
  customIcon: L.DivIcon
}) {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    },
  });
  
  return (
    <Marker 
      position={position} 
      icon={customIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition([pos.lat, pos.lng]);
          map.flyTo(pos, map.getZoom());
        }
      }}
    />
  );
}

const MOCK_PACKAGES: Package[] = [
  { id: "1", tracking_number: "LT-982374", status: "Entregado", address: "Av. Cabildo 2040, CABA", recipient: "Juan Pérez", created_at: "2026-03-20", updated_at: "2026-03-20 14:30" },
  { id: "2", tracking_number: "LT-982375", status: "En Distribución", address: "Santa Fe 3200, CABA", recipient: "María Gómez", created_at: "2026-03-20", updated_at: "2026-03-20 10:15" },
  { id: "3", tracking_number: "LT-982376", status: "Recogido", address: "Belgrano 120, Martínez", recipient: "Carlos López", created_at: "2026-03-20", updated_at: "2026-03-20 09:00" },
  { id: "4", tracking_number: "LT-982377", status: "Intento Fallido", address: "San Martín 450, Florida", recipient: "Ana Silva", created_at: "2026-03-19", updated_at: "2026-03-20 11:45" },
  { id: "5", tracking_number: "LT-982378", status: "En Depósito", address: "Libertador 1000, Vicente López", recipient: "Pedro Ruiz", created_at: "2026-03-19", updated_at: "2026-03-19 18:20" },
];

const BARRIOS = [
  { name: "", zone: "", price: 0 },
  { name: "Palermo", zone: "Zona 1 (CABA)", price: 2500 },
  { name: "Belgrano", zone: "Zona 1 (CABA)", price: 2500 },
  { name: "Caballito", zone: "Zona 1 (CABA)", price: 2500 },
  { name: "Vicente López", zone: "Zona 2 (Norte)", price: 4200 },
  { name: "San Isidro", zone: "Zona 2 (Norte)", price: 4200 },
  { name: "Avellaneda", zone: "Zona 3 (Sur)", price: 3800 },
  { name: "Lomas de Zamora", zone: "Zona 3 (Sur)", price: 4500 },
  { name: "San Martín", zone: "Zona 4 (Oeste)", price: 3900 },
  { name: "Morón", zone: "Zona 4 (Oeste)", price: 4100 },
];

export default function Packages() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedSuccess, setScannedSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    destinatario: "",
    direccion: "",
    barrio: "",
    telefono: "",
    contacto: "",
    horario: "",
    tieneEtiqueta: false,
    codigoPaquete: "",
    observaciones: "",
  });

  const [position, setPosition] = useState<[number, number]>([-34.6037, -58.3816]);

  const mapPinHtml = renderToStaticMarkup(<MapPin color="#0066CC" size={24} strokeWidth={2.5} />);

  const customIcon = useMemo(() => L.divIcon({
    html: `<div style="background-color: white; border-radius: 50%; padding: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;">${mapPinHtml}</div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  }), [mapPinHtml]);

  const selectedBarrioInfo = useMemo(() => {
    return BARRIOS.find(b => b.name === formData.barrio) || BARRIOS[0];
  }, [formData.barrio]);

  const handleOpenModal = () => {
    setFormData({
      destinatario: "",
      direccion: "",
      barrio: "",
      telefono: "",
      contacto: "",
      horario: "",
      tieneEtiqueta: false,
      codigoPaquete: "",
      observaciones: "",
    });
    setIsModalOpen(true);
    setScannedSuccess(false);
  };

  const handleScanQR = () => {
    setIsScanning(true);
    setScannedSuccess(false);
    setTimeout(() => {
      setIsScanning(false);
      setScannedSuccess(true);
      setFormData(prev => ({
        ...prev,
        codigoPaquete: "EXT-84930211",
        observaciones: "Etiqueta externa capturada correctamente."
      }));
      setTimeout(() => setScannedSuccess(false), 2500);
    }, 2000);
  };

  const handleOpenDetails = (pkg: Package) => {
    setSelectedPkg(pkg);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mis Paquetes</h1>
          <p className="text-sm text-black/60">Gestiona y rastrea todos tus envíos.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-10 px-4 py-2 text-sm rounded-xl">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          <Button variant="outline" className="h-10 px-4 py-2 text-sm rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Button onClick={handleOpenModal} className="h-10 px-4 py-2 text-sm rounded-xl bg-[#0066CC] hover:bg-[#0052a3] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo
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
                <th className="px-6 py-4 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {MOCK_PACKAGES.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-black/[0.01] transition-colors">
                  <td className="px-6 py-4 font-medium text-[#0066CC]">{pkg.tracking_number}</td>
                  <td className="px-6 py-4">{pkg.recipient}</td>
                  <td className="px-6 py-4 text-black/70">{pkg.address}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={pkg.status} />
                  </td>
                  <td className="px-6 py-4 text-black/50">{pkg.updated_at}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDetails(pkg)} className="h-8 text-xs px-3">
                      <Eye className="w-3.5 h-3.5 mr-1.5" /> Detalles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Formulario de Paquete */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-gray-50/50">
                <h2 className="text-lg font-semibold">Detalles del Paquete</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <form className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-black/80 ml-1">Destinatario</label>
                      <Input 
                        value={formData.destinatario} 
                        onChange={(e) => setFormData({...formData, destinatario: e.target.value})} 
                        placeholder="Nombre completo o Empresa"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-black/80 ml-1">Teléfono</label>
                      <Input 
                        value={formData.telefono} 
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})} 
                        placeholder="Ej: 11-1234-5678"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-black/80 ml-1">Barrio / Localidad</label>
                      <select 
                        value={formData.barrio}
                        onChange={(e) => setFormData({...formData, barrio: e.target.value})}
                        className="flex w-full rounded-2xl border border-black/10 bg-white/50 backdrop-blur-md px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC]"
                      >
                        <option value="" disabled>Seleccionar barrio...</option>
                        {BARRIOS.filter(b => b.name).map((b, i) => (
                          <option key={i} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                      {formData.barrio && (
                        <p className="text-xs text-[#0066CC] font-medium ml-1 mt-1">
                          {selectedBarrioInfo.zone} • Tarifa tabulada: ${selectedBarrioInfo.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-black/80 ml-1">Dirección de Entrega</label>
                      <Input 
                        value={formData.direccion} 
                        onChange={(e) => setFormData({...formData, direccion: e.target.value})} 
                        placeholder="Calle y altura, piso, depto..."
                      />
                    </div>
                  </div>

                  {/* MAP CONTAINER IN MODAL */}
                  <div className="space-y-1.5 border border-black/10 rounded-xl overflow-hidden h-48 relative z-0">
                    <div className="absolute top-2 left-2 z-[400] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-black/10 shadow-sm text-xs font-medium text-black/80 flex items-center gap-1.5 pointer-events-none">
                      <MapPin className="w-3.5 h-3.5 text-[#0066CC]" /> Afina la ubicación en destino
                    </div>
                    <MapContainer 
                      center={position} 
                      zoom={14} 
                      style={{ width: '100%', height: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png"
                      />
                      <LocationMarker position={position} setPosition={setPosition} customIcon={customIcon} />
                    </MapContainer>
                  </div>

                  {/* Campos de contacto (siempre visibles como primarios) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-4 border-b border-black/5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-black/80 ml-1">Nombre persona de contacto</label>
                      <Input 
                        value={formData.contacto} 
                        onChange={(e) => setFormData({...formData, contacto: e.target.value})} 
                        placeholder="Quién entrega/recibe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-black/80 ml-1">Horario de contacto</label>
                      <Input 
                        value={formData.horario} 
                        onChange={(e) => setFormData({...formData, horario: e.target.value})} 
                        placeholder="Ej: L a V de 9 a 18hs"
                      />
                    </div>
                  </div>

                  {/* Checkbox de Etiqueta Externa */}
                  <div className="space-y-1.5 p-4 border border-black/10 rounded-xl bg-black/[0.02]">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.tieneEtiqueta}
                        onChange={(e) => setFormData({...formData, tieneEtiqueta: e.target.checked})}
                        className="w-4 h-4 mt-0.5 text-[#0066CC] border-black/20 rounded focus:ring-[#0066CC]"
                      />
                      <span className="text-sm font-medium text-black/80 leading-snug">
                        ¿Este paquete ya tiene una etiqueta (generada por otro sistema de envio) y desea mantener esta etiqueta?
                      </span>
                    </label>
                  </div>

                  <AnimatePresence>
                    {formData.tieneEtiqueta && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-4 mb-2">
                          <div className="flex flex-col gap-5 items-center border-b border-amber-200/60 pb-5 mb-4">
                            <div className="text-center">
                              <h4 className="text-sm font-semibold text-amber-900 mb-1">Emparejar Teléfono Móvil</h4>
                              <p className="text-xs text-amber-800/80 max-w-sm mx-auto">
                                Escanea este código QR con la cámara de tu celular para enlazarlo y tomar la foto de la etiqueta directamente desde tu dispositivo.
                              </p>
                            </div>
                            
                            <div className="p-3 bg-white rounded-xl shadow-sm border border-amber-200 inline-block">
                              <img 
                                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://logitrack.example.com/mobile-sync/ABC123XYZ&color=78350f" 
                                alt="Código QR para emparejar" 
                                className="w-28 h-28 object-contain"
                              />
                            </div>
                            
                            <Button 
                              type="button"
                              onClick={handleScanQR} 
                              disabled={isScanning} 
                              className="shrink-0 bg-transparent text-amber-700 hover:bg-amber-100 border border-amber-300 shadow-sm text-xs h-8"
                            >
                              {isScanning ? (
                                <span className="flex items-center gap-2"><Camera className="w-3.5 h-3.5 animate-pulse" /> Esperando foto desde móvil...</span>
                              ) : (
                                <span className="flex items-center gap-2"><QrCode className="w-3.5 h-3.5" /> Simular Escaneo Exitoso</span>
                              )}
                            </Button>
                          </div>

                          {scannedSuccess && (
                            <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-2">
                              ¡Etiqueta escaneada con éxito!
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-amber-900/70 ml-1">Código de paquete</label>
                              <Input 
                                value={formData.codigoPaquete} 
                                onChange={(e) => setFormData({...formData, codigoPaquete: e.target.value})} 
                                placeholder="Tracking / Código externo"
                                className="bg-white/70 border-amber-200"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-amber-900/70 ml-1">Observaciones</label>
                              <Input 
                                value={formData.observaciones} 
                                onChange={(e) => setFormData({...formData, observaciones: e.target.value})} 
                                placeholder="Notas (opcional)"
                                className="bg-white/70 border-amber-200"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>

              <div className="p-5 border-t border-black/5 bg-gray-50/50 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button onClick={() => setIsModalOpen(false)} className="bg-[#0066CC] hover:bg-[#0052a3] text-white">Guardar Paquete</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Detalles del Paquete (Línea de tiempo) */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedPkg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-gray-50/50">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    Detalles del Envío <span className="text-[#0066CC]">{selectedPkg.tracking_number}</span>
                  </h2>
                </div>
                <button onClick={() => setIsDetailsModalOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <div className="md:col-span-1 space-y-6">
                  {/* Info general */}
                  <div>
                    <h3 className="text-xs font-bold text-black/50 uppercase tracking-wider mb-3">Información General</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-black/50 mb-0.5">Destinatario</p>
                        <p className="text-sm font-medium">{selectedPkg.recipient}</p>
                      </div>
                      <div>
                        <p className="text-xs text-black/50 mb-0.5 flex items-center gap-1"><MapPinIcon className="w-3 h-3"/> Dirección</p>
                        <p className="text-sm font-medium">{selectedPkg.address}</p>
                      </div>

                      <div className="bg-gray-50 border border-black/5 p-3 rounded-xl grid grid-cols-2 gap-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-1 opacity-5">
                          <PackageIcon className="w-16 h-16" />
                        </div>
                        <div className="relative z-10">
                          <p className="text-[10px] text-black/50 uppercase font-bold tracking-widest mb-0.5">Peso</p>
                          <p className="text-sm font-medium text-black/80">3.5 kg</p>
                        </div>
                        <div className="relative z-10">
                          <p className="text-[10px] text-black/50 uppercase font-bold tracking-widest mb-0.5">Tamaño</p>
                          <p className="text-sm font-medium text-black/80">Mediano</p>
                        </div>
                        <div className="col-span-2 border-t border-black/5 pt-2 mt-1 relative z-10">
                          <p className="text-[10px] text-black/50 uppercase font-bold tracking-widest mb-0.5">Dimensiones</p>
                          <p className="text-sm font-medium text-black/80">35 x 25 x 15 cm</p>
                        </div>
                      </div>

                      <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-xl">
                        <p className="text-[10px] text-amber-600 uppercase font-bold tracking-widest mb-1 flex items-center gap-1"><PackageIcon className="w-3 h-3"/> Contenido & Notas</p>
                        <p className="text-sm font-medium text-black/80 mb-2">Componentes Electrónicos</p>
                        <div className="flex gap-2">
                           <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-[10px] rounded font-bold tracking-wider border border-red-200">FRÁGIL</span>
                           <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded font-bold tracking-wider border border-blue-200">NO APILAR</span>
                        </div>
                      </div>

                      <div className="p-3 bg-[#0066CC]/5 border border-[#0066CC]/10 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-black/60 flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/> Inicio</p>
                          <p className="text-sm font-medium">{selectedPkg.created_at}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-black/60 flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> Estimado</p>
                          <p className="text-sm font-medium">2026-03-24</p>
                        </div>
                      </div>
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                        <p className="text-xs text-emerald-700/70 mb-0.5">Costo Total (Tarifa + Zona)</p>
                        <p className="text-xl font-bold text-emerald-700">$4,200 <span className="text-xs font-normal">ARS</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-xs font-bold text-black/50 uppercase tracking-wider mb-4 border-b border-black/5 pb-2">Línea de Tiempo del Paquete</h3>
                  
                  <div className="relative pl-[26px] border-l-[3px] border-black/5 space-y-8 pb-4 mt-4">
                    
                    {/* Hito 1 */}
                    <div className="relative">
                      <div className="absolute -left-[38px] top-0 p-1 bg-white border-2 border-emerald-400 rounded-full shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-xs text-black/50 font-medium mb-0.5">{selectedPkg.created_at} - 09:15</p>
                        <h4 className="text-sm font-bold text-black/80 flex items-center gap-2">Recolección (Pick Up) Completada</h4>
                        <div className="mt-2 p-3 bg-gray-50 border border-black/5 rounded-xl text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <p><span className="font-medium text-black/70">Chofer:</span> Roberto Sánchez</p>
                            <a href="tel:+5491144445555" className="flex items-center gap-1 text-[#0066CC] font-medium hover:underline"><Phone className="w-3 h-3"/> +54 9 11 4444-5555</a>
                          </div>
                          <p className="text-black/60 italic pt-2 border-t border-black/5">"Los paquetes estaban listos en recepción y embalados."</p>
                        </div>
                      </div>
                    </div>

                    {/* Hito 2 */}
                    <div className="relative">
                      <div className="absolute -left-[38px] top-0 p-1 bg-white border-2 border-emerald-400 rounded-full shadow-sm">
                        <PackageIcon className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-xs text-black/50 font-medium mb-0.5">{selectedPkg.created_at} - 11:30</p>
                        <h4 className="text-sm font-bold text-black/80">En Depósito Base</h4>
                        <div className="mt-2 text-xs">
                          <p className="text-black/60">Paquete escaneado en almacén central e ingresado a distribución de zona norte.</p>
                        </div>
                      </div>
                    </div>

                    {/* Hito 3 */}
                    <div className="relative">
                      <div className="absolute -left-[38px] top-0 p-1 bg-white border-2 border-[#0066CC] rounded-full shadow-sm">
                        <Truck className="w-4 h-4 text-[#0066CC]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#0066CC] font-bold mb-0.5">Hoy - En progreso</p>
                        <h4 className="text-sm font-bold text-[#0066CC]">En Camino (Distribución)</h4>
                        <div className="mt-2 p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <p><span className="font-medium text-blue-900/70">Chofer en ruta:</span> Marcos Del Valle</p>
                            <a href="tel:+5491122223333" className="flex items-center gap-1 text-[#0066CC] font-medium hover:underline"><Phone className="w-3 h-3"/> +54 9 11 2222-3333</a>
                          </div>
                          <p className="text-blue-800/80 italic pt-2 border-t border-blue-200/50">"Saliendo para la zona, llegaré aproximadamente en 45 min."</p>
                        </div>
                      </div>
                    </div>

                    {/* Hito 4 (Futuro) */}
                    <div className="relative opacity-40">
                      <div className="absolute -left-[35px] top-0 p-1 bg-white border-[3px] border-black/10 rounded-full">
                        <div className="w-3 h-3 rounded-full bg-black/10" />
                      </div>
                      <div className="pt-0.5">
                        <h4 className="text-sm font-bold text-black/80">Entrega Exitosa</h4>
                        <p className="text-xs text-black/50 mt-1">Esperando confirmación final en destino...</p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
