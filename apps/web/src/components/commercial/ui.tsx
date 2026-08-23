import Link from "next/link";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div>
        {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
        <h1 className="font-display text-3xl font-semibold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  title,
  headerExtra,
  children,
  padding = true,
}: {
  title?: string;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  padding?: boolean;
}) {
  return (
    <div className="rounded-[10px] border border-line bg-paper shadow-sm">
      {title && (
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
          {headerExtra}
        </div>
      )}
      <div className={padding ? "p-5" : ""}>{children}</div>
    </div>
  );
}

export function Btn({
  variant = "primary",
  size = "md",
  className = "",
  href,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "gold" | "ghost";
  size?: "sm" | "md";
  href?: string;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-md font-medium transition-colors cursor-pointer border";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" };
  const variants = {
    primary: "border-ink bg-ink text-paper hover:bg-ink-soft",
    secondary: "border-line bg-paper text-ink hover:bg-sand",
    gold: "border-gold bg-gold text-ink hover:bg-gold-deep hover:text-paper",
    ghost: "border-transparent bg-transparent text-ink-soft hover:bg-sand",
  };
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export function AiPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-[10px] bg-gradient-to-br from-[#2a2520] to-ink p-4 text-sand">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
        ✦ AI Assistant · Draft until accept · I20.10
      </div>
      {children}
      <p className="mt-2 text-[0.65rem] text-muted">
        AI suggestions require human review before client-facing use.
      </p>
    </div>
  );
}
