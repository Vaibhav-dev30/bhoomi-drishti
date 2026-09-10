import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold shadow hover:from-amber-400 hover:to-amber-500",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-500",
        outline:
          "border border-slate-700 bg-slate-900/50 text-slate-200 hover:bg-slate-800 hover:text-white",
        secondary:
          "bg-slate-800 text-slate-100 shadow-sm hover:bg-slate-700 border border-slate-700/60",
        ghost: "hover:bg-slate-800/60 text-slate-300 hover:text-white",
        link: "text-amber-400 underline-offset-4 hover:underline",
        primaryGov: "bg-blue-600 hover:bg-blue-500 text-white shadow font-semibold",
        emerald: "bg-emerald-600 hover:bg-emerald-500 text-white shadow font-semibold",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
