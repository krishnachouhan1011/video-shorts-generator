import { useState, type ReactNode } from 'react';
import { BarChart3, Clapperboard, FolderOpen, LayoutDashboard, Menu, Settings, Subtitles, Upload, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/upload', label: 'Upload video', icon: Upload },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/transcripts', label: 'Transcripts', icon: Subtitles },
  { href: '/shorts', label: 'Shorts library', icon: Clapperboard },
];

const pageMeta: Record<string, { eyebrow: string; title: string }> = {
  '/': { eyebrow: 'Workspace / overview', title: 'Command center' },
  '/upload': { eyebrow: 'Workspace / new source', title: 'Upload a recording' },
  '/projects': { eyebrow: 'Workspace / library', title: 'Video projects' },
  '/transcripts': { eyebrow: 'Workspace / language layer', title: 'Transcript desk' },
  '/shorts': { eyebrow: 'Workspace / moments', title: 'Shorts library' },
  '/settings': { eyebrow: 'Workspace / preferences', title: 'Workspace settings' },
};

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const meta = pageMeta[location.split('?')[0]] ?? pageMeta['/'];
  return (
    <div className="app-noise min-h-[100dvh] bg-background text-foreground">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[246px] flex-col bg-sidebar px-4 py-5 text-sidebar-foreground transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-3">
          <Link href="/" className="flex items-center gap-3" data-testid="link-brand">
            <span className="relative flex size-8 items-center justify-center overflow-hidden rounded-[4px] bg-sidebar-primary text-sidebar-primary-foreground"><span className="absolute -right-1 -top-2 size-5 rotate-45 bg-sidebar-primary-foreground/15" /><BarChart3 className="relative size-4" /></span>
            <span className="font-display text-[22px] tracking-[-.04em]">cutline</span>
          </Link>
          <button className="rounded p-1 text-sidebar-foreground/60 hover:bg-sidebar-accent lg:hidden" onClick={() => setOpen(false)} data-testid="button-close-menu"><X className="size-4" /></button>
        </div>
        <div className="mt-12 px-3 font-label text-[9px] uppercase tracking-[.2em] text-sidebar-foreground/45">Workspace</div>
        <nav className="mt-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = location === href;
            return <Link key={href} href={href} onClick={() => setOpen(false)} className={`group flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-sm ${active ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`} data-testid={`link-nav-${label.toLowerCase().replace(/\s/g, '-')}`}><Icon className="size-4" /><span>{label}</span>{href === '/shorts' && <span className={`ml-auto rounded-full px-1.5 py-0.5 font-label text-[9px] ${active ? 'bg-sidebar-primary-foreground/15' : 'bg-sidebar-accent'}`}>12</span>}</Link>;
          })}
        </nav>
        <div className="mt-auto">
          <div className="mb-5 rounded-[5px] border border-sidebar-border bg-sidebar-accent/60 p-3">
            <div className="flex items-center justify-between"><span className="font-label text-[9px] uppercase tracking-[.12em] text-sidebar-foreground/45">Monthly minutes</span><span className="font-label text-[10px] text-sidebar-primary">68%</span></div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-sidebar-foreground/10"><div className="h-full w-[68%] rounded-full bg-sidebar-primary" /></div>
            <p className="mt-2 text-[11px] leading-4 text-sidebar-foreground/55">68 of 100 minutes processed</p>
          </div>
          <Link href="/settings" className={`flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-sm ${location === '/settings' ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`} data-testid="link-nav-settings"><Settings className="size-4" /> Settings</Link>
          <div className="mt-4 flex items-center gap-3 border-t border-sidebar-border px-3 pt-4"><div className="flex size-8 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">MC</div><div className="min-w-0"><div className="truncate text-xs font-semibold">Mara Chen</div><div className="truncate text-[10px] text-sidebar-foreground/45">Solo creator</div></div><span className="ml-auto size-1.5 rounded-full bg-sidebar-primary" /></div>
        </div>
      </aside>
      {open && <button className="fixed inset-0 z-30 bg-primary/30 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation" data-testid="button-overlay-menu" />}
      <main className="min-h-[100dvh] lg:pl-[246px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-border/75 bg-background/90 px-5 backdrop-blur-md sm:px-8 lg:px-10">
          <div className="flex items-center gap-3"><button className="rounded border border-border p-2 lg:hidden" onClick={() => setOpen(true)} data-testid="button-open-menu"><Menu className="size-4" /></button><div><div className="font-label text-[9px] uppercase tracking-[.18em] text-muted-foreground">{meta.eyebrow}</div><h1 className="mt-1 font-display text-[22px] leading-none tracking-[-.03em]">{meta.title}</h1></div></div>
          <div className="flex items-center gap-2"><span className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 font-label text-[10px] uppercase tracking-[.1em] text-muted-foreground sm:flex"><span className="size-1.5 rounded-full bg-chart-2" /> API connected</span><Link href="/upload" className="inline-flex h-9 items-center gap-2 rounded-[4px] bg-primary px-3 text-xs font-semibold text-primary-foreground hover:opacity-90" data-testid="link-header-upload"><Upload className="size-3.5" /> <span className="hidden sm:inline">New upload</span><span className="sm:hidden">Upload</span></Link></div>
        </header>
        <div className="page-enter px-5 py-7 sm:px-8 lg:px-10 lg:py-9">{children}</div>
      </main>
    </div>
  );
}