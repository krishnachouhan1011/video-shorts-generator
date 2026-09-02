import { Activity, ArrowUpRight, Clock3, FileAudio, Film, MoreHorizontal, Play, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';
import { getGetProjectQueryKey, useGetDashboard, useGetProject } from '@workspace/api-client-react';
import { Badge, ErrorBlock, formatDate, formatTime, LoadingBlock, Panel, ProgressBar, SectionHeader, Stat, StatusDot } from '@/components/ui-kit';

function ProjectArtwork({ thumbnail, className = '' }: { thumbnail?: string | null; className?: string }) {
  return <div className={`relative overflow-hidden bg-[#22333c] ${className}`} style={thumbnail ? { backgroundImage: `url(${thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}><div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(232,237,81,.22),transparent_45%,rgba(201,77,56,.35))]" /><div className="absolute bottom-3 left-3 font-label text-[9px] uppercase tracking-[.14em] text-white/75">CUTLINE / SOURCE</div></div>;
}

export default function Dashboard() {
  const dashboardQuery = useGetDashboard();
  const dashboard = dashboardQuery.data;
  const activeProjectId = dashboard?.recentProjects?.[0]?.id ?? '';
  const activeProjectQuery = useGetProject(activeProjectId, { query: { enabled: Boolean(activeProjectId), queryKey: getGetProjectQueryKey(activeProjectId) } });
  const activeProject = activeProjectQuery.data ?? dashboard?.recentProjects?.[0];

  if (dashboardQuery.isLoading) return <div className="mx-auto max-w-[1400px]"><LoadingBlock lines={7} /></div>;
  if (dashboardQuery.isError || !dashboard) return <div className="mx-auto max-w-[1400px]"><ErrorBlock onRetry={() => dashboardQuery.refetch()} /></div>;

  const transcriptProgress = activeProject?.status === 'complete' || activeProject?.status === 'ready' ? 100 : activeProject?.status === 'transcribing' ? 64 : 20;
  return (
    <div className="mx-auto max-w-[1400px] space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.4fr_.8fr]">
        <div className="relative overflow-hidden rounded-[6px] bg-primary p-6 text-primary-foreground sm:p-8">
          <div className="absolute -right-16 -top-24 size-72 rounded-full border border-accent/20" /><div className="absolute -right-4 -top-12 size-48 rounded-full border border-accent/20" />
          <div className="relative">
            <div className="flex items-center justify-between gap-3"><Badge tone="lime">Active project</Badge><span className="font-label text-[10px] uppercase tracking-[.1em] text-primary-foreground/55">{formatDate(activeProject?.updatedAt)}</span></div>
            <div className="mt-8 max-w-xl"><h2 className="font-display text-4xl leading-[.96] tracking-[-.05em] sm:text-6xl">Find the moment<br /><em className="text-accent">worth replaying.</em></h2><p className="mt-5 max-w-md text-sm leading-6 text-primary-foreground/65">Your long-form recording is already becoming a library of publishable moments.</p></div>
            <div className="mt-9 flex flex-wrap items-center gap-3"><Link href={activeProjectId ? `/transcripts?project=${activeProjectId}` : '/upload'} className="inline-flex h-10 items-center gap-2 rounded-[4px] bg-accent px-4 text-sm font-semibold text-accent-foreground hover:brightness-95" data-testid="link-open-active-project"><Play className="size-3.5 fill-current" /> Open active project</Link><Link href="/upload" className="inline-flex h-10 items-center gap-2 rounded-[4px] border border-primary-foreground/20 px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10" data-testid="link-start-another">Start another <ArrowUpRight className="size-3.5" /></Link></div>
          </div>
        </div>
        <Panel className="flex flex-col justify-between p-5 sm:p-6" accent>
          <div className="flex items-center justify-between"><div className="flex items-center gap-2 font-label text-[10px] uppercase tracking-[.15em] text-muted-foreground"><span className="size-2 rounded-full bg-chart-4" /> Processing now</div><MoreHorizontal className="size-4 text-muted-foreground" /></div>
          <div className="mt-8"><div className="flex items-end justify-between gap-3"><div><div className="font-display text-2xl tracking-[-.03em]">{activeProject?.name ?? 'No active recording'}</div><p className="mt-1 truncate text-xs text-muted-foreground">{activeProject?.fileName ?? 'Upload a recording to get started'}</p></div><span className="font-label text-xs text-destructive">{transcriptProgress}%</span></div><div className="mt-4"><ProgressBar value={transcriptProgress} color="bg-destructive" /></div><div className="mt-3 flex items-center justify-between text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><StatusDot status={activeProject?.status ?? 'queued'} /> {activeProject?.status === 'complete' ? 'Analysis ready' : 'Preparing transcript'}</span><span>{formatTime(activeProject?.durationSeconds)} total</span></div></div>
          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-border pt-4"><div><div className="font-label text-[9px] uppercase tracking-[.12em] text-muted-foreground">Transcript</div><div className="mt-1 text-sm font-semibold">{transcriptProgress}% indexed</div></div><div><div className="font-label text-[9px] uppercase tracking-[.12em] text-muted-foreground">Shorts queue</div><div className="mt-1 text-sm font-semibold">{dashboard.totalShorts} moments</div></div></div>
        </Panel>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Projects" value={dashboard.totalProjects} detail="recordings in workspace" tone="plain" />
        <Stat label="Transcribed" value={dashboard.totalTranscribed} detail="ready to mine" tone="lime" />
        <Stat label="Shorts ranked" value={dashboard.totalShorts} detail="high-signal moments" tone="coral" />
        <Stat label="Minutes processed" value={dashboard.minutesProcessed} detail="this workspace" tone="plain" />
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.2fr_.8fr]">
        <div>
          <SectionHeader eyebrow="Signal report" title="The latest cut" detail="A quick read on what the engine found in your active recording." action={<Link href="/shorts" className="text-xs font-semibold text-destructive hover:underline" data-testid="link-view-all-shorts">View all shorts →</Link>} />
          <Panel className="overflow-hidden">
            <div className="grid sm:grid-cols-[180px_1fr]">
              <ProjectArtwork thumbnail={activeProject?.thumbnail} className="min-h-[150px] sm:min-h-full" />
              <div className="p-5 sm:p-6"><div className="flex flex-wrap items-center gap-2"><Badge tone="coral">Top signal</Badge><span className="font-label text-[10px] text-muted-foreground">RANK #01 / 12</span></div><h3 className="mt-3 font-display text-3xl leading-none tracking-[-.04em]">The uncomfortable truth about “overnight” success</h3><p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">A clean hook, a turn at 00:42, and a payoff that lands before the scroll. This one has the shape of a keeper.</p><div className="mt-5 flex flex-wrap items-center gap-3"><span className="font-label text-xs text-destructive">SCORE 94 / 100</span><span className="text-xs text-muted-foreground">01:12 — 01:57 · 45 sec</span><Link href="/shorts" className="ml-auto text-xs font-semibold underline underline-offset-4" data-testid="link-review-short">Review moment</Link></div></div>
            </div>
          </Panel>
          <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-[4px] border border-border bg-card px-4 py-3"><div className="flex items-center gap-2 text-xs text-muted-foreground"><TrendingUp className="size-3.5 text-destructive" /> Hook strength</div><div className="mt-2 font-label text-sm">94 <span className="text-muted-foreground">/ 100</span></div></div><div className="rounded-[4px] border border-border bg-card px-4 py-3"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock3 className="size-3.5 text-chart-3" /> Best duration</div><div className="mt-2 font-label text-sm">30–45 sec</div></div><div className="rounded-[4px] border border-border bg-card px-4 py-3"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Sparkles className="size-3.5 text-chart-4" /> Avg. confidence</div><div className="mt-2 font-label text-sm">89.6%</div></div></div>
        </div>
        <div>
          <SectionHeader eyebrow="Studio log" title="Recent activity" />
          <Panel className="divide-y divide-border">
            {dashboard.activity?.slice(0, 5).map((item) => <div key={item.id} className="flex gap-3 p-4" data-testid={`activity-${item.id}`}><div className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${item.type === 'shorts' ? 'bg-accent/55' : item.type === 'export' ? 'bg-destructive/12' : 'bg-secondary'}`}>{item.type === 'shorts' ? <Sparkles className="size-3.5" /> : item.type === 'export' ? <Film className="size-3.5" /> : item.type === 'transcript' ? <FileAudio className="size-3.5" /> : <Activity className="size-3.5" />}</div><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item.label}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{item.detail}</p></div><span className="font-label text-[9px] text-muted-foreground">{new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(item.createdAt))}</span></div>)}
            {!dashboard.activity?.length && <div className="p-6 text-sm text-muted-foreground">Your studio log will appear here as you work.</div>}
          </Panel>
        </div>
      </section>

      <section>
        <SectionHeader eyebrow="Source library" title="Recent projects" detail="Everything you have sent through the cutline engine." action={<Link href="/projects" className="text-xs font-semibold text-destructive hover:underline" data-testid="link-view-all-projects">Browse projects →</Link>} />
        <div className="grid gap-3 md:grid-cols-3">
          {dashboard.recentProjects?.slice(0, 3).map((project) => <Link href={`/transcripts?project=${project.id}`} key={project.id} className="group rounded-[5px] border border-border bg-card p-3 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md" data-testid={`card-project-${project.id}`}><div className="flex gap-3"><ProjectArtwork thumbnail={project.thumbnail} className="size-[72px] shrink-0 rounded-[3px]" /><div className="min-w-0 py-1"><div className="truncate text-sm font-semibold">{project.name}</div><div className="mt-1 truncate text-xs text-muted-foreground">{project.fileName}</div><div className="mt-3 flex items-center gap-2"><StatusDot status={project.status} /><span className="font-label text-[9px] uppercase tracking-[.08em] text-muted-foreground">{project.status}</span></div></div></div></Link>)}
        </div>
      </section>
    </div>
  );
}