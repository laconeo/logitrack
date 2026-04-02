import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Truck } from 'lucide-react';

const truckHtml = renderToStaticMarkup(<Truck color="#0066CC" size={20} strokeWidth={2.5} />);

const createTruckIcon = () => L.divIcon({
  html: `<div style="background-color: white; border-radius: 50%; padding: 6px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center;">${truckHtml}</div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Defining precise paths that look like streets/avenues in Buenos Aires to prevent them from going into water.
// Each route is an array of [lat, lng] points that the truck will interpolate over.
const ROUTES = [
  // 9 de Julio (Retiro to Constitucion)
  [[-34.5930, -58.3816], [-34.6037, -58.3816], [-34.6100, -58.3816], [-34.6200, -58.3815]],
  // Corrientes (Puerto Madero to Almagro)
  [[-34.6020, -58.3700], [-34.6037, -58.3816], [-34.6050, -58.4000], [-34.6060, -58.4150]],
  // Cordoba (Centro to Palermo)
  [[-34.5980, -58.3750], [-34.5990, -58.3850], [-34.5980, -58.4000], [-34.5950, -58.4200]],
  // Santa Fe / Cabildo
  [[-34.5950, -58.3780], [-34.5900, -58.3900], [-34.5850, -58.4050], [-34.5800, -58.4200]],
  // Callao / Entre Rios
  [[-34.5880, -58.3920], [-34.5950, -58.3950], [-34.6050, -58.3950], [-34.6150, -58.3900], [-34.6250, -58.3850]],
  // Pueyrredon / Jujuy
  [[-34.5850, -58.4000], [-34.5950, -58.4050], [-34.6050, -58.4050], [-34.6150, -58.4000], [-34.6250, -58.3950]],
  // Belgrano
  [[-34.6100, -58.3700], [-34.6120, -58.3850], [-34.6150, -58.4050], [-34.6180, -58.4250]],
  // Rivadavia
  [[-34.6080, -58.3700], [-34.6090, -58.3850], [-34.6100, -58.4050], [-34.6120, -58.4250]],
  // Libertador 
  [[-34.5900, -58.3750], [-34.5850, -58.3850], [-34.5750, -58.3950], [-34.5650, -58.4050]],
  // Alem / Paseo Colon
  [[-34.5950, -58.3700], [-34.6050, -58.3680], [-34.6150, -58.3650], [-34.6250, -58.3630]],
];

type TruckData = {
  id: number;
  routeIndex: number; 
  segmentIndex: number;
  progress: number;
  speed: number;
  direction: 1 | -1;
};

const TRUCK_COUNT = 20;

export default function MapBackground() {
  const [trucks, setTrucks] = useState<TruckData[]>(() => {
    return Array.from({ length: TRUCK_COUNT }).map((_, i) => {
      const routeIndex = i % ROUTES.length;
      return {
        id: i,
        routeIndex: routeIndex,
        segmentIndex: 0,
        // Start them at random spots along their route
        progress: Math.random(),
        // Adding some speed variety
        speed: 0.002 + Math.random() * 0.003,
        direction: Math.random() > 0.5 ? 1 : -1,
      };
    });
  });

  const truckIcon = useMemo(() => createTruckIcon(), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrucks(prev => prev.map(truck => {
        let { segmentIndex, progress, direction } = truck;
        const route = ROUTES[truck.routeIndex];
        
        progress += truck.speed * direction;
        
        if (progress >= 1) {
          progress = 0;
          segmentIndex++;
          if (segmentIndex >= route.length - 1) {
            // Reached the end of the line, reverse
            segmentIndex = route.length - 2;
            progress = 1;
            direction = -1;
          }
        } else if (progress <= 0) {
          progress = 1;
          segmentIndex--;
          if (segmentIndex < 0) {
            // Reached the beginning of the line, reverse
            segmentIndex = 0;
            progress = 0;
            direction = 1;
          }
        }

        return { ...truck, segmentIndex, progress, direction };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Helper to calculate exact lat/lng given the truck's segment and progress
  const getInterpolatedPosition = (truck: TruckData): [number, number] => {
    const route = ROUTES[truck.routeIndex];
    // Safety check in case route gets modified or shrinks
    const segIdx = Math.max(0, Math.min(truck.segmentIndex, route.length - 2));
    const start = route[segIdx];
    const end = route[segIdx + 1];
    
    const lat = start[0] + (end[0] - start[0]) * truck.progress;
    const lng = start[1] + (end[1] - start[1]) * truck.progress;
    
    return [lat, lng];
  };

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <MapContainer 
        center={[-34.6037, -58.3816]} 
        zoom={14} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png"
        />
        {trucks.map(truck => (
          <Marker 
            key={truck.id} 
            position={getInterpolatedPosition(truck)} 
            icon={truckIcon} 
          />
        ))}
      </MapContainer>
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5F7]/80 via-[#F5F5F7]/30 to-[#F5F5F7] pointer-events-none z-10" />
    </div>
  );
}
