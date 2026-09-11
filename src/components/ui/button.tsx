import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer shadow-xs",
  {
    variants: {
      variant: {
        default:
          "bg-[#15803D] text-white hover:bg-[#16A34A] shadow-sm active:scale-[0.98]",
        destructive:
          "bg-red-600 text-white hover:bg-red-500 shadow-sm active:scale-[0.98]",
        outline:
          "border border-[#BAE6FD] bg-[#F0F9FF] text-[#0284C7] hover:bg-[#E0F2FE] hover:text-[#0369A1] shadow-xs active:scale-[0.98]",
        secondary:
          "bg-[#FAF8F5] text-slate-800 hover:bg-[#F2EFE8] border border-[#E5E0D6] shadow-xs active:scale-[0.98]",
        ghost:
          "text-slate-700 hover:bg-[#F4EFE6] hover:text-slate-900 shadow-none active:scale-[0.98]",
        link: "text-[#0284C7] underline-offset-4 hover:underline shadow-none",
        primaryGov:
          "bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sm font-bold active:scale-[0.98]",
        emerald:
          "bg-[#15803D] hover:bg-[#16A34A] text-white shadow-sm font-bold active:scale-[0.98]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-7 text-sm font-bold",
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
