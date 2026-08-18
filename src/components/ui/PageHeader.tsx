import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export function PageHeader({ eyebrow, title, subtitle, className }: Props) {
  return (
    <header className={cn("mb-6 space-y-3 md:mb-8", className)}>
      {eyebrow && (
        <p className="font-hud text-[10px] text-cyan tracking-[0.28em] rtl:tracking-normal">{eyebrow}</p>
      )}
      <h1 className="font-pixel text-[16px] leading-relaxed text-cream glitch sm:text-[22px] md:text-[28px]">
        {title}
      </h1>
      {subtitle && <p className="max-w-xl text-sm text-muted md:text-base">{subtitle}</p>}
    </header>
  );
}
