import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * HAMZURY-branded shadcn Button
 * Primary: Luxury Dark Green #0A1F1C
 * Radius: 4px (rounded-[4px])
 * Touch target: 44px minimum height
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-semibold tracking-[0.01em]",
    "transition-all duration-150",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.98]",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    "outline-none",
    "focus-visible:ring-[3px] focus-visible:ring-[#0A1F1C]/15 focus-visible:border-[#0A1F1C]",
    "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary — Luxury Dark Green
        default:
          "bg-[#0A1F1C] text-white hover:opacity-90 rounded-[4px]",
        // Gold — Founder / premium actions
        gold:
          "bg-[#C9A97E] text-[#0A1F1C] hover:opacity-90 rounded-[4px]",
        // Destructive
        destructive:
          "bg-red-600 text-white hover:bg-red-700 rounded-[4px] focus-visible:ring-red-500/20",
        // Ghost — hairline border, no fill
        outline:
          "border border-[#EBEBEB] bg-transparent text-[#2C2C2C] hover:bg-[#F8F8F8] rounded-[4px]",
        // Subtle secondary
        secondary:
          "bg-[#F0F5F4] text-[#0A1F1C] hover:bg-[#E6EFED] rounded-[4px]",
        // Ghost — no border
        ghost:
          "bg-transparent text-[#2C2C2C] hover:bg-[#F5F5F5] rounded-[4px]",
        // Text link
        link:
          "bg-transparent text-[#0A1F1C] underline-offset-4 hover:underline p-0 h-auto min-w-0",
      },
      size: {
        default: "h-11 px-7",
        sm:      "h-9 px-5 text-[12px]",
        lg:      "h-12 px-8 text-[14px]",
        icon:    "size-11",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
