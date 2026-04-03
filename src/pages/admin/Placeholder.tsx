import { Wrench } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function AdminPlaceholder() {
  const location = useLocation();
  
  // Format the path into a readable title
  const title = location.pathname
    .split('/')
    .pop()
    ?.replace(/-/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase()) || 'Resumen General';
    
  const displayTitle = location.pathname === '/dashboard/admin' ? 'Resumen General' : title;

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto p-12 bg-white rounded-3xl border border-black/5 shadow-sm mt-10">
      <div className="w-16 h-16 bg-[#0066CC]/10 rounded-2xl flex items-center justify-center mb-6 text-[#0066CC]">
        <Wrench className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-semibold mb-3 tracking-tight">Módulo: {displayTitle}</h3>
      <p className="text-black/60 leading-relaxed text-sm">
        Esta sección exclusiva para el <span className="font-semibold text-black">Administrador del Sistema</span> está actualmente en desarrollo.
      </p>
    </div>
  );
}
