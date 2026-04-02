import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login, just redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6">
      <Link to="/" className="mb-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-[#0066CC] rounded-xl flex items-center justify-center shadow-sm">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-2xl tracking-tight text-[#1D1D1F]">LogiTrack</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <Card className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight mb-2">Iniciar Sesión</h1>
            <p className="text-black/60 text-sm">Ingresa a tu panel de vendedor</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-black/80 ml-1">Correo electrónico</label>
              <Input type="email" placeholder="ejemplo@empresa.com" required defaultValue="vendedor@mercadolibre.com" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-black/80">Contraseña</label>
                <a href="#" className="text-xs text-[#0066CC] hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <Input type="password" placeholder="••••••••" required defaultValue="password123" />
            </div>

            <Button type="submit" className="w-full mt-2">
              Ingresar al Dashboard
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-black/60">
            ¿No tienes cuenta? <a href="#" className="text-[#0066CC] hover:underline font-medium">Regístrate aquí</a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
