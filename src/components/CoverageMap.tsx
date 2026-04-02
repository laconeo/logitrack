import { MapContainer, TileLayer, Polygon, Tooltip } from 'react-leaflet';

// Arrays de coordenadas aproximadas para dibujar los polígonos evitando el agua (Río de la Plata)

// CABA (Limitado por Gral Paz y Riachuelo)
const cordon1: [number, number][] = [
  [-34.54, -58.45], // Norte (Núñez)
  [-34.59, -58.37], // Centro / Retiro
  [-34.64, -58.35], // Sur (La Boca)
  [-34.68, -58.45], // Riachuelo / Puente La Noria
  [-34.65, -58.53], // Liniers / Gral Paz
  [-34.60, -58.53], // Gral Paz Oeste
  [-34.55, -58.48], // Gral Paz Norte
];

// GBA (Municipios contiguos) - Bordea la costa y se extiende al oeste/sur
const cordon2: [number, number][] = [
  [-34.47, -58.50], // San Isidro
  [-34.54, -58.45], // Empalma con CABA
  [-34.59, -58.37], 
  [-34.64, -58.35], 
  [-34.72, -58.25], // Quilmes
  [-34.80, -58.20], // Berazategui borde
  // Extensión interior
  [-34.85, -58.40], // Sur Alejandro Korn
  [-34.80, -58.60], // Ezeiza
  [-34.70, -58.75], // Merlo / Moreno
  [-34.50, -58.75], // San Miguel/Pilar Sur
  [-34.45, -58.65], // Tigre borde
];

// Ruta 6 (Campana, Luján, Cañuelas, La Plata)
const cordon3: [number, number][] = [
  // Costa desde Campana hasta La Plata
  [-34.15, -58.95], // Campana costa
  [-34.30, -58.75], // Escobar
  [-34.47, -58.50], // Empaima San Isidro
  [-34.54, -58.45], 
  [-34.59, -58.37], 
  [-34.64, -58.35], 
  [-34.72, -58.25], 
  [-34.85, -57.95], // La Plata costa
  // Arco perimetral interior por Ruta 6
  [-34.95, -58.05], // Afueras La Plata
  [-35.02, -58.42], // San Vicente
  [-35.05, -58.75], // Cañuelas
  [-34.75, -59.00], // Gral. Las Heras
  [-34.57, -59.10], // Luján
  [-34.30, -59.10], // Los Cardales
  [-34.15, -59.05]  // Vuelve a Campana por tierra
];

export default function CoverageMap() {
  return (
    <div className="w-full h-[500px] md:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-black/5 relative z-10">
      <MapContainer 
        center={[-34.65, -58.5]} 
        zoom={9} 
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Area 3: Ruta 6 (Anillo Exterior) */}
        <Polygon 
          positions={cordon3} 
          pathOptions={{ color: '#F59E0B', fillColor: '#F59E0B', fillOpacity: 0.1, weight: 2, dashArray: '5, 10' }} 
        >
          <Tooltip sticky direction="top" className="font-semibold text-sm">
            Cordón 3: Zona extendida (Ruta 6)
          </Tooltip>
        </Polygon>

        {/* Area 2: GBA (Municipios pegados a la ciudad) */}
        <Polygon 
          positions={cordon2} 
          pathOptions={{ color: '#10B981', fillColor: '#10B981', fillOpacity: 0.15, weight: 2 }} 
        >
          <Tooltip sticky direction="top" className="font-semibold text-sm">
            Cordón 2: Municipios del GBA (Primer y Segundo Cordón)
          </Tooltip>
        </Polygon>

        {/* Area 1: CABA */}
        <Polygon 
          positions={cordon1} 
          pathOptions={{ color: '#0066CC', fillColor: '#0066CC', fillOpacity: 0.3, weight: 3 }} 
        >
          <Tooltip sticky direction="top" className="font-semibold text-sm">
            Cordón 1: CABA (Ciudad Autónoma de Buenos Aires)
          </Tooltip>
        </Polygon>
      </MapContainer>
      
      {/* Legend Badge Overlay */}
      <div className="absolute bottom-6 left-6 z-[400] bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-black/5">
        <h4 className="font-semibold text-sm mb-3">Zonas de Cobertura</h4>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-sm bg-[#0066CC]/30 border-2 border-[#0066CC]" />
            <span className="text-xs font-medium">Cordón 1 (CABA)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-sm bg-[#10B981]/15 border-2 border-[#10B981]" />
            <span className="text-xs font-medium">Cordón 2 (GBA)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-sm bg-[#F59E0B]/10 border-2 border-[#F59E0B] border-dashed" />
            <span className="text-xs font-medium">Cordón 3 (Ruta 6)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
