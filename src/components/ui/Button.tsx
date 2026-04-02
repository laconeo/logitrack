import * as React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }>(({ className, variant = 'primary', ...props }, ref) => {
  const variants = {
    primary: "bg-[#0066CC] text-white hover:bg-[#0055AA] shadow-sm",
    secondary: "bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E5E5EA]",
    outline: "border border-black/10 bg-transparent hover:bg-black/5 text-[#1D1D1F]",
    ghost: "bg-transparent hover:bg-black/5 text-[#1D1D1F]"
  };
  return (
    <button
      ref={ref}
      className={cn("inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none", variants[variant], className)}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
