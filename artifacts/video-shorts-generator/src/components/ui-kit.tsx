import { type ReactNode } from 'react';
import { ArrowRight, Check, CircleAlert, LoaderCircle, Play, RefreshCw } from 'lucide-react';

export function Button({
  children,
  variant = 'dark',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  testId,
}: {
  children: ReactNode;
  variant?: 'dark' | 'lime' | 'outline' | 'soft' | 'coral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  testId?: string;
}) {
  const variants = {
    dark: 'bg-primary text-primary-foreground border-primary hover:opacity-90',
    lime: 'bg-accent text-accent-foreground border-accent hover:brightness-95',
    outline: 'bg-transparent text-foreground border-border hover:bg-muted',
    soft: 'bg-secondary text-secondary-foreground border-secondary hover:bg-muted',
    coral: 'bg-destructive text-destructive-foreground border-destructive hover:brightness-95',
  };
  const sizes = { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 text-sm', lg: 'h-12 px-5 text-sm' };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      data-testid={testId}
      className={`inline-flex items-center justify-center gap-2 rounded-[4px] border font-semibold tracking-[-0.01em] disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = 'neutral', testId }: { children: ReactNode; tone?: 'neutral' | 'lime' | 'coral' | 'blue' | 'dark'; testId?: string }) {
  const tones = {
    neutral: 'bg-muted text-muted-foreground',
    lime: 'bg-accent/35 text-foreground',
    coral: 'bg-destructive/12 text-destructive',
    blue: 'bg-chart-3/12 text-chart-3',
    dark: 'bg-primary text-primary-foreground',
  };
  return <span data-testid={testId} className={`inline-flex items-center rounded-full px-2 py-1 font-label text-[10px] uppercase tracking-[.08em] ${tones[tone]}`}>{children}</span>;
}

export function Panel({ children, className = '', accent = false, testId }: { children: ReactNode; className?: string; accent?: boolean; testId?: string }) {
  return <section data-testid={testId} className={`rounded-[6px] border border-card-border bg-card shadow-sm ${accent ? 'border-l-[3px] border-l-destructive' : ''} ${className}`}>{children}</section>;
}

export function SectionHeader({ eyebrow, title, detail, action }: { eyebrow?: string; title: string; detail?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="mb-1 font-label text-[10px] uppercase tracking-[.18em] text-destructive">{eyebrow}</div>}
        <h2 className="font-display text-[28px] leading-none tracking-[-.03em] text-foreground">{title}</h2>
        {detail && <p className="mt-2 text-sm text-muted-foreground">{detail}</p>}
      </div>
      {action}
    </div>
  );
}

export function LoadingBlock({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-3" aria-label="Loading">
      {Array.from({ length: lines }).map((_, index) => <div key={index} className={`skeleton-shine h-4 rounded ${index === lines - 1 ? 'w-2/3' : 'w-full'}`} />)}
    </div>
  );
}

export function ErrorBlock({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-[6px] border border-destructive/25 bg-destructive/8 p-4 text-sm text-destructive" data-testid="status-error">
      <CircleAlert className="size-4 shrink-0" />
      <span className="flex-1">Something missed the cut. Try loading this view again.</span>
      {onRetry && <button className="inline-flex items-center gap-1 font-semibold underline" onClick={onRetry} data-testid="button-retry"><RefreshCw className="size-3" /> Retry</button>}
    </div>
  );
}

export function EmptyState({ icon: Icon = Play, title, detail, action }: { icon?: typeof Play; title: string; detail: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[6px] border border-dashed border-border bg-card/55 px-6 py-16 text-center" data-testid="state-empty">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground"><Icon className="size-5" /></div>
      <h3 className="font-display text-2xl tracking-[-.02em]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{detail}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Stat({ label, value, detail, tone = 'plain' }: { label: string; value: string | number; detail: string; tone?: 'plain' | 'lime' | 'coral' }) {
  return (
    <div className={`relative overflow-hidden rounded-[5px] border border-border p-4 ${tone === 'lime' ? 'bg-accent/55' : tone === 'coral' ? 'bg-destructive/8' : 'bg-card'}`} data-testid={`stat-${label.toLowerCase().replace(/\s/g, '-')}`}>
      <div className="font-label text-[10px] uppercase tracking-[.12em] text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl tracking-[-.04em]">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
    </div>
  );
}

export function formatTime(seconds = 0) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

export function formatDate(value?: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export function StatusDot({ status }: { status: string }) {
  const active = ['processing', 'transcribing', 'analyzing'].includes(status);
  return <span className={`inline-flex size-2 rounded-full ${active ? 'animate-pulse bg-chart-4' : status === 'complete' || status === 'ready' ? 'bg-chart-2' : status === 'failed' ? 'bg-destructive' : 'bg-muted-foreground/40'}`} />;
}

export function ProgressBar({ value, color = 'bg-accent' }: { value: number; color?: string }) {
  return <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>;
}

export function SuccessNote({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-2 rounded-[4px] bg-accent/40 px-3 py-2 text-xs font-medium" data-testid="status-success"><Check className="size-3.5" /> {children}</div>;
}

export function PendingLabel({ children = 'Working' }: { children?: ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><LoaderCircle className="size-3 animate-spin" />{children}</span>;
}

export function ArrowCta({ children, onClick, testId }: { children: ReactNode; onClick?: () => void; testId?: string }) {
  return <button onClick={onClick} className="group inline-flex items-center gap-2 text-sm font-semibold" data-testid={testId}>{children}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></button>;
}