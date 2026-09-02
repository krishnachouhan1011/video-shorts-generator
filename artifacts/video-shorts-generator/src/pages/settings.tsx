import { useEffect, useState } from 'react';
import { Bell, Check, Cloud, KeyRound, Monitor, Moon, Palette, ShieldCheck, Sun, Zap } from 'lucide-react';
import { useHealthCheck } from '@workspace/api-client-react';
import { Button, Panel, SectionHeader, StatusDot, SuccessNote } from '@/components/ui-kit';

export default function SettingsPage() {
  const health = useHealthCheck();
  const [saved, setSaved] = useState(false);
  const [dark, setDark] = useState(false);
  const [settings, setSettings] = useState({ autoTranscript: true, notifyReady: true, notifyExport: false, autoMusic: false, autoZoom: true });
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  const toggle = (key: keyof typeof settings) => setSettings((current) => ({ ...current, [key]: !current[key] }));
  const save = () => { setSaved(true); window.setTimeout(() => setSaved(false), 2200); };
  return (
    <div className="mx-auto max-w-[1040px]">
      <div className="mb-8"><p className="max-w-xl text-sm leading-6 text-muted-foreground">Tune how cutline reads your recordings, packages your moments, and keeps you in the loop.</p></div>
      <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
        <div className="space-y-8">
          <section><SectionHeader eyebrow="Workspace" title="Processing defaults" detail="These choices shape every new project." /><Panel className="divide-y divide-border">{[['autoTranscript', 'Start transcript pass automatically', 'Begin indexing as soon as a video is uploaded.', Zap], ['autoMusic', 'Suggest background music', 'Include a low-key music direction in export guidance.', Palette], ['autoZoom', 'Recommend punch-in moments', 'Flag emphasis beats where a subtle zoom could help.', Monitor]].map(([key, title, detail, Icon]) => <SettingRow key={key as string} title={title as string} detail={detail as string} icon={Icon as typeof Zap} value={settings[key as keyof typeof settings]} onToggle={() => toggle(key as keyof typeof settings)} testId={`toggle-${key}`} />)}</Panel></section>
          <section><SectionHeader eyebrow="Notifications" title="Keep the signal close" detail="A little information at the right moment goes a long way." /><Panel className="divide-y divide-border">{[['notifyReady', 'When a transcript or scan is ready', 'You’ll know when a project is ready for review.', Bell], ['notifyExport', 'When an export finishes', 'Get a nudge when a downloadable file is ready.', Cloud]].map(([key, title, detail, Icon]) => <SettingRow key={key as string} title={title as string} detail={detail as string} icon={Icon as typeof Bell} value={settings[key as keyof typeof settings]} onToggle={() => toggle(key as keyof typeof settings)} testId={`toggle-${key}`} />)}</Panel></section>
          <section><SectionHeader eyebrow="Appearance" title="Your studio, your light" /><Panel className="p-5"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded bg-secondary"><Sun className="size-4" /></div><div className="flex-1"><div className="text-sm font-semibold">Interface mode</div><div className="mt-1 text-xs text-muted-foreground">Light mode keeps the timeline and language layer easy to scan.</div></div><div className="flex rounded-[4px] border border-border bg-background p-1"><button onClick={() => setDark(false)} className={`rounded p-2 ${!dark ? 'bg-card shadow-sm' : 'text-muted-foreground'}`} data-testid="button-theme-light"><Sun className="size-3.5" /></button><button onClick={() => setDark(true)} className={`rounded p-2 ${dark ? 'bg-card shadow-sm' : 'text-muted-foreground'}`} data-testid="button-theme-dark"><Moon className="size-3.5" /></button></div></div></Panel></section>
          {saved && <SuccessNote>Preferences saved for this workspace.</SuccessNote>}<Button variant="coral" onClick={save} testId="button-save-settings"><Check className="size-3.5" /> Save preferences</Button>
        </div>
        <aside className="space-y-4"><Panel className="bg-primary p-5 text-primary-foreground"><div className="flex items-center gap-2 font-label text-[10px] uppercase tracking-[.15em] text-primary-foreground/55"><ShieldCheck className="size-3.5" /> Workspace health</div><div className="mt-6 flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground"><StatusDot status={health.data?.status === 'ok' ? 'complete' : 'processing'} /></span><div><div className="text-sm font-semibold">{health.isLoading ? 'Checking connection' : health.data?.status === 'ok' ? 'All systems ready' : 'Connection pending'}</div><div className="mt-1 text-xs text-primary-foreground/55">API service · {health.data?.status ?? 'syncing'}</div></div></div><div className="mt-6 border-t border-primary-foreground/15 pt-4 font-label text-[9px] uppercase tracking-[.1em] text-primary-foreground/45">Last checked just now</div></Panel><Panel className="p-5"><div className="flex items-center gap-2"><KeyRound className="size-4 text-destructive" /><span className="text-sm font-semibold">Private workspace</span></div><p className="mt-3 text-xs leading-5 text-muted-foreground">Your source videos and generated guidance are visible only to you. Shared links are not enabled.</p></Panel></aside>
      </div>
    </div>
  );
}

function SettingRow({ title, detail, icon: Icon, value, onToggle, testId }: { title: string; detail: string; icon: typeof Zap; value: boolean; onToggle: () => void; testId: string }) {
  return <div className="flex items-center gap-4 p-5"><div className="hidden size-9 shrink-0 items-center justify-center rounded bg-secondary sm:flex"><Icon className="size-4 text-muted-foreground" /></div><div className="min-w-0 flex-1"><div className="text-sm font-semibold">{title}</div><p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p></div><button role="switch" aria-checked={value} onClick={onToggle} className={`relative h-6 w-11 shrink-0 rounded-full ${value ? 'bg-primary' : 'bg-muted-foreground/25'}`} data-testid={testId}><span className={`absolute top-1 size-4 rounded-full bg-card shadow-sm ${value ? 'left-6' : 'left-1'}`} /></button></div>;
}