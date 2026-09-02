import { useRef, useState } from 'react';
import { Check, FileVideo, LockKeyhole, UploadCloud, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { getGetDashboardQueryKey, getListProjectsQueryKey, useCreateProject } from '@workspace/api-client-react';
import { Button, Panel, ProgressBar, SuccessNote } from '@/components/ui-kit';

export default function UploadPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const createProject = useCreateProject();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [dragging, setDragging] = useState(false);
  const [created, setCreated] = useState(false);

  const selectFile = (nextFile?: File) => {
    if (!nextFile) return;
    setFile(nextFile);
    if (!name) setName(nextFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
  };
  const submit = () => {
    if (!file || !name.trim()) return;
    createProject.mutate({ data: { name: name.trim(), fileName: file.name, fileSize: file.size, durationSeconds: 184 } }, {
      onSuccess: (project) => {
        setCreated(true);
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
        window.setTimeout(() => setLocation(`/transcripts?project=${project.id}`), 700);
      },
    });
  };
  return (
    <div className="mx-auto max-w-[1080px]">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-7"><div className="font-label text-[10px] uppercase tracking-[.18em] text-destructive">Source material</div><h2 className="mt-2 font-display text-5xl leading-[.95] tracking-[-.05em]">One recording.<br /><em>Many cuts.</em></h2><p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">Drop in a long-form video and we’ll map every sentence, beat, and breakout moment worth shaping into a Short.</p></div>
          <button className={`group flex min-h-[310px] w-full flex-col items-center justify-center rounded-[6px] border-2 border-dashed p-8 text-center ${dragging ? 'border-destructive bg-destructive/8' : 'border-border bg-card hover:border-primary/40 hover:bg-card/70'}`} onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); selectFile(event.dataTransfer.files?.[0]); }} data-testid="dropzone-video">
            <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={(event) => selectFile(event.target.files?.[0])} data-testid="input-video-file" />
            <div className={`mb-5 flex size-16 items-center justify-center rounded-full ${file ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>{file ? <Check className="size-6" /> : <UploadCloud className="size-6" />}</div>
            {file ? <><div className="text-base font-semibold">{file.name}</div><div className="mt-2 font-label text-[10px] uppercase tracking-[.12em] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB · ready to process</div><span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-destructive underline underline-offset-4">Choose a different file</span></> : <><div className="text-base font-semibold">Drop your video here</div><div className="mt-2 text-sm text-muted-foreground">or click to browse from your computer</div><div className="mt-5 font-label text-[10px] uppercase tracking-[.12em] text-muted-foreground">MP4, MOV, WEBM · up to 2 GB</div></>}
          </button>
          {file && <div className="mt-5 rounded-[5px] border border-border bg-card p-4"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded bg-destructive/12 text-destructive"><FileVideo className="size-4" /></div><div className="min-w-0 flex-1"><input value={name} onChange={(event) => setName(event.target.value)} className="w-full border-0 bg-transparent p-0 text-sm font-semibold outline-none" placeholder="Name this project" data-testid="input-project-name" /><div className="mt-1 text-xs text-muted-foreground">{file.name}</div></div><button onClick={() => { setFile(null); setName(''); }} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" data-testid="button-remove-file"><X className="size-4" /></button></div></div>}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="size-3.5" /> Your source stays private to this workspace.</div><Button variant="coral" size="lg" disabled={!file || !name.trim() || createProject.isPending} onClick={submit} testId="button-create-project">{createProject.isPending ? 'Creating project…' : 'Create project'}</Button></div>
          {created && <div className="mt-4"><SuccessNote>Project created. Opening the transcript desk…</SuccessNote></div>}
        </div>
        <div className="space-y-4">
          <Panel className="p-5"><div className="font-label text-[10px] uppercase tracking-[.15em] text-muted-foreground">What happens next</div><div className="mt-5 space-y-5">{[['01', 'Transcript pass', 'Every word gets a timestamp and confidence score.'], ['02', 'Signal scan', 'The strongest hooks are ranked for retention potential.'], ['03', 'Shorts guidance', 'Get titles, captions, pacing, and edit notes for each cut.']].map(([number, title, detail]) => <div className="flex gap-3" key={number}><span className="font-label text-[10px] text-destructive">{number}</span><div><div className="text-sm font-semibold">{title}</div><p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p></div></div>)}</div></Panel>
          <Panel className="bg-primary p-5 text-primary-foreground"><div className="flex items-center justify-between"><span className="font-label text-[10px] uppercase tracking-[.15em] text-primary-foreground/55">Typical turnaround</span><span className="font-label text-xs text-accent">~ 90 sec</span></div><div className="mt-4 flex items-end gap-1"><span className="font-display text-4xl">3</span><span className="mb-1 text-sm text-primary-foreground/60">passes, then ready</span></div><div className="mt-4"><ProgressBar value={66} color="bg-accent" /></div></Panel>
        </div>
      </div>
    </div>
  );
}