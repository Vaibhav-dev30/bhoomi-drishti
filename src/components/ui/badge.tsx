import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
        secondary:
          "bg-[#F2EFE8] text-slate-700 border-[#E5E0D6]",
        destructive:
          "bg-red-100 text-red-700 border-red-200",
        outline:
          "bg-white text-slate-700 border-[#E5E0D6]",
        success:
          "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]",
        info:
          "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]",
        purple:
          "bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
