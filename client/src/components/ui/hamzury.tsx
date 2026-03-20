/**
 * HAMZURY Brand Component Library
 * ════════════════════════════════
 * All components follow the HAMZURY brand system:
 *   Primary:  Luxury Dark Green #0A1F1C
 *   Accent:   Gold #C9A97E
 *   Surface:  Milk #F8F5F0
 *   Text:     Charcoal #2C2C2C
 *   Radius:   4px buttons / 8px cards
 *   Touch:    44px minimum height
 *   Voice:    Calm · Confident · Minimal · Professional
 *
 * Usage:
 *   import { HButton, HCard, HInput, HBadge, HModal, HLabel } from "@/components/ui/hamzury";
 */

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Design Tokens (mirrors index.css) ───────────────────────────────────────

export const BRAND = "#0A1F1C";
export const BRAND_LIGHT = "#1B4D3E";
export const BRAND_MUTED = "#F0F5F4";
export const GOLD = "#C9A97E";
export const GOLD_MUTED = "#FBF7F2";
export const MILK = "#F8F5F0";
export const CHARCOAL = "#2C2C2C";
export const HAIRLINE = "#EBEBEB";
export const MUTED_TEXT = "#888888";

// ─── HButton ─────────────────────────────────────────────────────────────────

type HButtonVariant = "primary" | "gold" | "ghost" | "danger" | "link";
type HButtonSize = "default" | "sm" | "lg" | "icon";

interface HButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: HButtonVariant;
  size?: HButtonSize;
  loading?: boolean;
  asChild?: boolean;
}

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap select-none transition-all duration-150 focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]";

const BUTTON_VARIANTS: Record<HButtonVariant, string> = {
  primary: "bg-brand text-white hover:opacity-90 rounded-[4px]",
  gold:    "bg-gold text-[#0A1F1C] hover:opacity-90 rounded-[4px]",
  ghost:   "bg-transparent text-charcoal border border-hairline hover:bg-[#F8F8F8] rounded-[4px]",
  danger:  "bg-red-600 text-white hover:bg-red-700 rounded-[4px]",
  link:    "bg-transparent text-brand underline-offset-4 hover:underline p-0 h-auto min-w-0",
};

const BUTTON_SIZES: Record<HButtonSize, string> = {
  default: "h-11 px-7 text-[13px]",
  sm:      "h-9 px-5 text-[12px]",
  lg:      "h-12 px-8 text-[14px]",
  icon:    "h-11 w-11 p-0 text-[13px]",
};

export function HButton({
  variant = "primary",
  size = "default",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: HButtonProps) {
  return (
    <button
      className={cn(
        BUTTON_BASE,
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          <span>Loading…</span>
        </>
      ) : children}
    </button>
  );
}

// ─── HCard ────────────────────────────────────────────────────────────────────

interface HCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "milk" | "brand" | "gold";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const CARD_VARIANTS: Record<string, string> = {
  default: "bg-white border border-[#EBEBEB]",
  milk:    "bg-[#F8F5F0] border border-[#EBEBEB]",
  brand:   "bg-[#0A1F1C] text-white border-transparent",
  gold:    "bg-[#C9A97E] text-[#0A1F1C] border-transparent",
};

const CARD_PADDING: Record<string, string> = {
  none: "",
  sm:   "p-4",
  md:   "p-6",
  lg:   "p-8",
};

export function HCard({
  variant = "default",
  padding = "md",
  hover = false,
  className,
  children,
  ...props
}: HCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.025)]",
        hover && "transition-shadow duration-200 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)]",
        CARD_VARIANTS[variant],
        CARD_PADDING[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function HCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props} />;
}

export function HCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-[15px] font-semibold text-[#2C2C2C] leading-snug", className)} {...props} />;
}

export function HCardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-[13px] text-[#888888] leading-relaxed mt-1", className)} {...props} />;
}

export function HCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}

export function HCardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-5 pt-4 border-t border-[#EBEBEB] flex items-center gap-3", className)} {...props} />;
}

// ─── HInput ───────────────────────────────────────────────────────────────────

interface HInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function HInput({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}: HInputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-[13px] font-medium text-[#2C2C2C] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] flex items-center">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            "w-full h-11 px-3.5 text-[14px] font-normal text-[#2C2C2C]",
            "bg-white border rounded-[4px] outline-none",
            "placeholder:text-[#AAAAAA]",
            "transition-all duration-150",
            error
              ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
              : "border-[#EBEBEB] focus:border-[#0A1F1C] focus:shadow-[0_0_0_3px_rgba(10,31,28,0.08)]",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#F8F8F8]",
            leftIcon  && "pl-9",
            rightIcon && "pr-9",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] flex items-center">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="mt-1.5 text-[12px] text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-[12px] text-[#888888]">{hint}</p>}
    </div>
  );
}

// ─── HTextarea ────────────────────────────────────────────────────────────────

interface HTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function HTextarea({ label, error, hint, className, id, ...props }: HTextareaProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-[13px] font-medium text-[#2C2C2C] mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          "w-full px-3.5 py-3 text-[14px] font-normal text-[#2C2C2C]",
          "bg-white border rounded-[4px] outline-none resize-vertical min-h-[100px]",
          "placeholder:text-[#AAAAAA]",
          "transition-all duration-150",
          error
            ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
            : "border-[#EBEBEB] focus:border-[#0A1F1C] focus:shadow-[0_0_0_3px_rgba(10,31,28,0.08)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-[12px] text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-[12px] text-[#888888]">{hint}</p>}
    </div>
  );
}

// ─── HBadge ───────────────────────────────────────────────────────────────────

type HBadgeVariant =
  | "green" | "gold" | "red" | "amber" | "blue" | "neutral"
  | "active" | "paused" | "error" | "new" | "pending" | "completed";

const BADGE_STYLES: Record<HBadgeVariant, string> = {
  green:     "bg-emerald-50 text-emerald-700",
  gold:      "bg-amber-50 text-amber-700",
  red:       "bg-red-50 text-red-600",
  amber:     "bg-orange-50 text-orange-700",
  blue:      "bg-blue-50 text-blue-700",
  neutral:   "bg-gray-100 text-gray-600",
  active:    "bg-emerald-50 text-emerald-700",
  paused:    "bg-amber-50 text-amber-700",
  error:     "bg-red-50 text-red-600",
  new:       "bg-[#FBF7F2] text-[#C9A97E]",
  pending:   "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
};

interface HBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: HBadgeVariant;
  dot?: boolean;
}

export function HBadge({ variant = "neutral", dot = false, className, children, ...props }: HBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-[4px] whitespace-nowrap",
        BADGE_STYLES[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 shrink-0" />
      )}
      {children}
    </span>
  );
}

// ─── HModal ───────────────────────────────────────────────────────────────────

interface HModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const MODAL_SIZES: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function HModal({ open, onClose, title, description, size = "md", children, footer }: HModalProps) {
  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "h-modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "relative w-full bg-white rounded-t-2xl sm:rounded-xl shadow-2xl",
          "flex flex-col max-h-[90vh] sm:max-h-[85vh]",
          "animate-in fade-in slide-in-from-bottom-4 duration-200",
          MODAL_SIZES[size]
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#EBEBEB] shrink-0">
            <div>
              {title && (
                <h2 id="h-modal-title" className="text-[16px] font-semibold text-[#2C2C2C] leading-snug">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-[13px] text-[#888888] mt-1">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 rounded-lg hover:bg-[#F5F5F5] transition-colors shrink-0"
              aria-label="Close"
            >
              <X size={16} className="text-[#888888]" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[#EBEBEB] flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HLabel ───────────────────────────────────────────────────────────────────

interface HLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function HLabel({ required, className, children, ...props }: HLabelProps) {
  return (
    <label className={cn("block text-[13px] font-medium text-[#2C2C2C] mb-1.5", className)} {...props}>
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

// ─── HDivider ─────────────────────────────────────────────────────────────────

interface HDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function HDivider({ label, className, ...props }: HDividerProps) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-3 my-6", className)} {...props}>
        <div className="flex-1 h-px bg-[#EBEBEB]" />
        <span className="text-[11px] font-medium text-[#AAAAAA] uppercase tracking-widest">{label}</span>
        <div className="flex-1 h-px bg-[#EBEBEB]" />
      </div>
    );
  }
  return <div className={cn("h-px bg-[#EBEBEB] my-4", className)} {...props} />;
}

// ─── HSkeleton ────────────────────────────────────────────────────────────────

interface HSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export function HSkeleton({ width, height, rounded = false, className, style, ...props }: HSkeletonProps) {
  return (
    <div
      className={cn("skeleton", rounded && "!rounded-full", className)}
      style={{ width, height: height ?? "1rem", ...style }}
      {...props}
    />
  );
}

// ─── HKPICard ─────────────────────────────────────────────────────────────────
// Pre-built KPI card for dashboards

interface HKPICardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "brand" | "gold";
  className?: string;
}

export function HKPICard({
  label, value, sub, icon: Icon, trend, trendValue, variant = "default", className
}: HKPICardProps) {
  const trendColor = trend === "up" ? "#059669" : trend === "down" ? "#DC2626" : "#888888";
  const trendArrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";

  return (
    <HCard
      variant={variant === "brand" ? "brand" : variant === "gold" ? "gold" : "default"}
      padding="md"
      hover
      className={className}
    >
      <div className="flex items-start justify-between mb-3">
        <p className={cn(
          "text-[11px] font-semibold uppercase tracking-wider",
          variant === "default" ? "text-[#888888]" : "opacity-70"
        )}>
          {label}
        </p>
        {Icon && (
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            variant === "default" ? "bg-[#F0F5F4]" : "bg-white/15"
          )}>
            <Icon size={14} className={variant === "default" ? "text-[#0A1F1C]" : "opacity-90"} />
          </div>
        )}
      </div>
      <p className={cn(
        "text-3xl font-light mb-1",
        variant === "default" ? "text-[#0A1F1C]" : "text-current"
      )}>
        {value}
      </p>
      {(sub || trendValue) && (
        <div className="flex items-center gap-2">
          {trendValue && (
            <span className="text-[11px] font-semibold" style={{ color: variant === "default" ? trendColor : "currentColor" }}>
              {trendArrow} {trendValue}
            </span>
          )}
          {sub && <p className={cn("text-[12px]", variant === "default" ? "text-[#888888]" : "opacity-60")}>{sub}</p>}
        </div>
      )}
    </HCard>
  );
}

// ─── HEmptyState ──────────────────────────────────────────────────────────────

interface HEmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function HEmptyState({ icon: Icon, title, description, action, className }: HEmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center", className)}>
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-[#F0F5F4] flex items-center justify-center mb-4">
          <Icon size={20} className="text-[#0A1F1C]" />
        </div>
      )}
      <p className="text-[15px] font-medium text-[#2C2C2C] mb-1">{title}</p>
      {description && <p className="text-[13px] text-[#888888] max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ─── HPageHeader ──────────────────────────────────────────────────────────────

interface HPageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: string;
  actions?: React.ReactNode;
  backHref?: string;
  className?: string;
}

export function HPageHeader({ title, description, breadcrumb, actions, backHref, className }: HPageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      {(breadcrumb || backHref) && (
        <div className="flex items-center gap-2 mb-3">
          {backHref && (
            <a href={backHref} className="text-[12px] text-[#888888] hover:text-[#2C2C2C] transition-colors flex items-center gap-1">
              ← Back
            </a>
          )}
          {breadcrumb && <span className="text-[12px] text-[#AAAAAA]">{breadcrumb}</span>}
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-[#0A1F1C] leading-tight">{title}</h1>
          {description && <p className="text-[14px] text-[#888888] mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

// ─── HSelect ──────────────────────────────────────────────────────────────────

interface HSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function HSelect({ label, error, hint, options, placeholder, className, id, ...props }: HSelectProps) {
  const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-[13px] font-medium text-[#2C2C2C] mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          "w-full h-11 px-3.5 text-[14px] font-normal text-[#2C2C2C]",
          "bg-white border rounded-[4px] outline-none appearance-none",
          "transition-all duration-150",
          error
            ? "border-red-400 focus:border-red-500"
            : "border-[#EBEBEB] focus:border-[#0A1F1C] focus:shadow-[0_0_0_3px_rgba(10,31,28,0.08)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-[12px] text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-[12px] text-[#888888]">{hint}</p>}
    </div>
  );
}
