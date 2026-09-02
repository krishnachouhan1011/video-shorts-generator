import { Router, type IRouter } from "express";
import {
  AnalyzeShortsBody,
  AnalyzeShortsResponse,
  CreateProjectBody,
  CreateProjectResponse,
  ExportShortBody,
  ExportShortResponse,
  GetDashboardResponse,
  GetProjectResponse,
  GetTranscriptResponse,
  GenerateTranscriptBody,
  GenerateTranscriptResponse,
  ListProjectsResponse,
  ListShortsResponse,
  SaveShortResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

type Project = {
  id: string;
  name: string;
  fileName: string;
  fileSize: number;
  durationSeconds: number;
  status: "uploaded" | "transcribing" | "ready" | "analyzing" | "complete";
  createdAt: string;
  updatedAt: string;
  thumbnail: string | null;
};

type Segment = {
  id: string;
  startSeconds: number;
  endSeconds: number;
  text: string;
};

type Short = {
  id: string;
  projectId: string;
  rank: number;
  title: string;
  startSeconds: number;
  endSeconds: number;
  durationSeconds: number;
  score: number;
  hook: string;
  summary: string;
  whyItWorks: string[];
  suggestedTitle: string;
  hashtags: string[];
  saved: boolean;
  status: "suggested" | "exporting" | "ready";
};

const now = new Date().toISOString();
const projects: Project[] = [
  {
    id: "proj-founders",
    name: "The Founder’s Playbook",
    fileName: "founders-playbook-ep-12.mp4",
    fileSize: 187_400_000,
    durationSeconds: 2_862,
    status: "complete",
    createdAt: now,
    updatedAt: now,
    thumbnail: null,
  },
  {
    id: "proj-creative",
    name: "Creative Systems Workshop",
    fileName: "creative-systems-workshop.mov",
    fileSize: 243_900_000,
    durationSeconds: 3_540,
    status: "ready",
    createdAt: now,
    updatedAt: now,
    thumbnail: null,
  },
];

const segments: Record<string, Segment[]> = {
  "proj-founders": [
    { id: "seg-1", startSeconds: 0, endSeconds: 12, text: "Welcome back to the show. Today we’re talking about the moments that change how a company grows." },
    { id: "seg-2", startSeconds: 12, endSeconds: 28, text: "Most founders try to add more before they understand what is already working." },
    { id: "seg-3", startSeconds: 28, endSeconds: 49, text: "The best growth lever is usually not another channel. It is making one promise so clear that customers repeat it for you." },
    { id: "seg-4", startSeconds: 49, endSeconds: 67, text: "That clarity creates momentum because every decision starts pointing in the same direction." },
    { id: "seg-5", startSeconds: 67, endSeconds: 88, text: "When you feel stuck, do not ask what should we add. Ask what can we remove until the answer is obvious." },
    { id: "seg-6", startSeconds: 88, endSeconds: 108, text: "That question has helped more teams find their next chapter than any complicated framework." },
    { id: "seg-7", startSeconds: 108, endSeconds: 130, text: "The companies that last are not always the loudest. They are the ones people know how to explain." },
  ],
  "proj-creative": [
    { id: "seg-c1", startSeconds: 0, endSeconds: 18, text: "A creative system should make good work easier to repeat, not make every idea look the same." },
    { id: "seg-c2", startSeconds: 18, endSeconds: 41, text: "The goal is to protect the messy part of making while giving the team a reliable way to ship." },
  ],
};

const shortsByProject: Record<string, Short[]> = {
  "proj-founders": [
    {
      id: "short-1",
      projectId: "proj-founders",
      rank: 1,
      title: "The growth lever founders overlook",
      startSeconds: 28,
      endSeconds: 67,
      durationSeconds: 39,
      score: 96,
      hook: "Your next growth channel might be hiding in a single sentence.",
      summary: "The speaker explains why a clear, repeatable promise is often more powerful than adding another marketing channel.",
      whyItWorks: ["Instantly useful insight", "Strong contrast", "Clean beginning and ending"],
      suggestedTitle: "The Growth Lever Most Founders Miss",
      hashtags: ["#shorts", "#startups", "#growth", "#founders"],
      saved: true,
      status: "suggested",
    },
    {
      id: "short-2",
      projectId: "proj-founders",
      rank: 2,
      title: "What to do when you feel stuck",
      startSeconds: 67,
      endSeconds: 108,
      durationSeconds: 41,
      score: 91,
      hook: "Feeling stuck? Stop adding. Start removing.",
      summary: "A practical reframing for founders: remove complexity until the next step becomes obvious.",
      whyItWorks: ["Relatable pain point", "Memorable line", "Actionable takeaway"],
      suggestedTitle: "The Simplest Way Out of a Founder’s Rut",
      hashtags: ["#shorts", "#mindset", "#business", "#motivation"],
      saved: false,
      status: "suggested",
    },
    {
      id: "short-3",
      projectId: "proj-founders",
      rank: 3,
      title: "Why clarity beats volume",
      startSeconds: 108,
      endSeconds: 130,
      durationSeconds: 22,
      score: 87,
      hook: "The loudest company rarely wins the explanation.",
      summary: "The episode closes with a sharp principle about being easy to explain rather than simply being loud.",
      whyItWorks: ["Strong closing thought", "Short and punchy", "High replay potential"],
      suggestedTitle: "Be the Company People Can Explain",
      hashtags: ["#shorts", "#branding", "#business", "#strategy"],
      saved: false,
      status: "suggested",
    },
  ],
  "proj-creative": [],
};

function findProject(projectId: string) {
  return projects.find((project) => project.id === projectId);
}

function getTranscript(projectId: string) {
  const project = findProject(projectId);
  const projectSegments = segments[projectId] ?? [];
  return {
    id: `transcript-${projectId}`,
    projectId,
    status: project ? "complete" as const : "failed" as const,
    language: "English",
    confidence: 0.97,
    durationSeconds: project?.durationSeconds ?? 0,
    segments: projectSegments,
  };
}

router.get("/dashboard", (_req, res) => {
  const data = GetDashboardResponse.parse({
    totalProjects: projects.length,
    totalTranscribed: projects.filter((project) => project.status === "complete").length,
    totalShorts: Object.values(shortsByProject).flat().length,
    minutesProcessed: Math.round(projects.reduce((sum, project) => sum + project.durationSeconds, 0) / 60),
    recentProjects: projects,
    activity: [
      { id: "activity-1", type: "shorts", label: "Shorts analysis complete", detail: "3 moments found in The Founder’s Playbook", createdAt: now },
      { id: "activity-2", type: "transcript", label: "Transcript ready", detail: "The Founder’s Playbook is ready to review", createdAt: now },
      { id: "activity-3", type: "upload", label: "Video uploaded", detail: "Creative Systems Workshop", createdAt: now },
    ],
  });
  res.json(data);
});

router.get("/projects", (_req, res) => {
  res.json(ListProjectsResponse.parse(projects));
});

router.post("/projects", (req, res) => {
  const input = CreateProjectBody.parse(req.body);
  const project: Project = {
    id: `proj-${Date.now()}`,
    name: input.name,
    fileName: input.fileName,
    fileSize: input.fileSize,
    durationSeconds: input.durationSeconds,
    status: "uploaded",
    createdAt: now,
    updatedAt: now,
    thumbnail: null,
  };
  projects.unshift(project);
  segments[project.id] = [];
  shortsByProject[project.id] = [];
  res.status(201).json(CreateProjectResponse.parse(project));
});

router.get("/projects/:projectId", (req, res) => {
  const project = findProject(req.params.projectId);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(GetProjectResponse.parse(project));
});

router.get("/projects/:projectId/transcript", (req, res) => {
  res.json(GetTranscriptResponse.parse(getTranscript(req.params.projectId)));
});

router.post("/projects/:projectId/transcript", (req, res) => {
  GenerateTranscriptBody.parse(req.body ?? {});
  const project = findProject(req.params.projectId);
  if (project) project.status = "complete";
  res.status(202).json(GenerateTranscriptResponse.parse(getTranscript(req.params.projectId)));
});

router.get("/projects/:projectId/shorts", (req, res) => {
  res.json(ListShortsResponse.parse(shortsByProject[req.params.projectId] ?? []));
});

router.post("/projects/:projectId/shorts", (req, res) => {
  const input = AnalyzeShortsBody.parse(req.body);
  const existing = shortsByProject[req.params.projectId] ?? [];
  const selected = existing.slice(0, input.numberOfShorts);
  res.status(202).json(AnalyzeShortsResponse.parse(selected));
});

router.post("/projects/:projectId/shorts/:shortId/save", (req, res) => {
  const short = (shortsByProject[req.params.projectId] ?? []).find((item) => item.id === req.params.shortId);
  if (!short) {
    res.status(404).json({ error: "Short not found" });
    return;
  }
  short.saved = !short.saved;
  res.json(SaveShortResponse.parse(short));
});

router.post("/projects/:projectId/shorts/:shortId/export", (req, res) => {
  const input = ExportShortBody.parse(req.body);
  const data = {
    id: `export-${Date.now()}`,
    shortId: req.params.shortId,
    status: "processing" as const,
    resolution: input.resolution,
    downloadUrl: null,
  };
  res.status(202).json(ExportShortResponse.parse(data));
});

export default router;