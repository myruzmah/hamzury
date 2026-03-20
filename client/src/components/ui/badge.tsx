import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * HAMZURY-branded shadcn Badge
 * Radius: 4px
 * Variants aligned with HAMZURY brand palette
 */
const badgeVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5",
    "px-2.5 py-1",
    "text-[11px] font-semibold",
    "rounded-[4px]",
    "whitespace-nowrap shrink-0 w-fit",
    "border border-transparent",
    "[&>svg]:size-3 [&>svg]:pointer-events-none",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
    "transition-colors overflow-hidden",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary — Luxury Dark Green
        default:
          "bg-[#0A1F1C] text-white",
        // Soft green — success / active
        success:
          "bg-emerald-50 text-emerald-700",
        // Gold — premium / founder
        gold:
          "bg-amber-50 text-amber-700",
        // Red — error / cancelled
        destructive:
          "bg-red-50 text-red-600",
        // Amber — warning / on-hold
        warning:
          "bg-orange-50 text-orange-700",
        // Blue — info / in-progress
        info:
          "bg-blue-50 text-blue-700",
        // Neutral — default / not-started
        secondary:
          "bg-gray-100 text-gray-600",
        // Outline — ghost badge
        outline:
          "border-[#EBEBEB] text-[#2C2C2C] bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
