"use client";

import { useMemo, useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import { createClient } from "@/utils/supabase/client";
const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
type DashboardTab =
  | "dashboard"
  | "intake"
  | "drafting"
  | "prosecution"
  | "documents"
  | "partners"
  | "settings";

type WorkflowType = "draft" | "validate" | "prosecute" | null;
type ViewMode = "workflow-home" | "project-choice" | "workspace";

type DashboardShellProps = {
  userEmail: string;
  userId: string;
};

export default function DashboardShell({ userEmail, userId }: DashboardShellProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowType>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("workflow-home");
  const [hoveredTab, setHoveredTab] = useState<DashboardTab | null>(null);

  const tabs: {
    key: DashboardTab;
    label: string;
    short: string;
    description: string;
  }[] = [
    {
      key: "dashboard",
      label: "Dashboard Home",
      short: "DB",
      description:
        "See your overall PatentOS workspace, recent matters, stats, and quick actions.",
    },
    {
      key: "intake",
      label: "Invention Intake",
      short: "IN",
      description:
        "Capture invention disclosures, inventor context, novelty inputs, and early technical notes.",
    },
    {
      key: "drafting",
      label: "Drafting Workspace",
      short: "DR",
      description:
        "Generate and refine specifications, claims, embodiments, and drafting structure.",
    },
    {
      key: "prosecution",
      label: "Prosecution Tracker",
      short: "PR",
      description:
        "Track applications, office actions, deadlines, counsel coordination, and filing readiness.",
    },
    {
      key: "documents",
      label: "Documents",
      short: "DC",
      description:
        "Manage invention disclosures, drafts, filings, checklists, and related working papers.",
    },
    {
      key: "partners",
      label: "Partner Counsel",
      short: "PC",
      description:
        "Coordinate with integrated IP law firms and external support teams across matters.",
    },
    {
      key: "settings",
      label: "Settings",
      short: "ST",
      description:
        "Manage workspace preferences, notifications, account information, and product defaults.",
    },
  ];

  const workflowCards = [
    {
      key: "draft" as const,
      title: "Draft",
      subtitle:
        "Turn invention inputs into structured patent drafting workflows.",
      detail:
        "Use PatentOS to capture invention context, build specifications, and generate claims in a guided drafting environment.",
    },
    {
      key: "validate" as const,
      title: "Validate",
      subtitle:
        "Review and strengthen existing patent draft material and filing inputs.",
      detail:
        "Validate invention support, drafting structure, claim logic, and completeness before moving toward filing or counsel review.",
    },
    {
      key: "prosecute" as const,
      title: "Prosecute",
      subtitle:
        "Manage prosecution workflow, deadlines, office actions, and counsel coordination.",
      detail:
        "Track examination progress, upcoming actions, and the operational path from application to grant-readiness.",
    },
  ];

  const stats = useMemo(
    () => [
      { label: "Active invention matters", value: "12" },
      { label: "Drafts in progress", value: "8" },
      { label: "Filings under prosecution", value: "21" },
      { label: "Integrated law firm partners", value: "3" },
    ],
    []
  );

  const pipeline = [
    {
      title: "AI-assisted thermal control system",
      stage: "Invention intake",
      owner: "Bert Labs",
      updated: "Today",
      status: "Needs review",
    },
    {
      title: "Industrial emissions edge gateway",
      stage: "Drafting workspace",
      owner: "Internal team",
      updated: "Yesterday",
      status: "Drafting in progress",
    },
    {
      title: "Predictive kiln state inference engine",
      stage: "Counsel review",
      owner: "External counsel",
      updated: "2 days ago",
      status: "Awaiting comments",
    },
    {
      title: "Building energy optimization workflow",
      stage: "Prosecution readiness",
      owner: "Patent team",
      updated: "3 days ago",
      status: "Ready to file",
    },
  ];

  const draftMatters = [
    {
      title: "Digital twin control architecture",
      type: "Specification + claims",
      progress: "72%",
      assignee: "Drafting team",
    },
    {
      title: "AI emissions anomaly prediction",
      type: "Claims refinement",
      progress: "48%",
      assignee: "Patent counsel",
    },
    {
      title: "Energy load balancing orchestration",
      type: "Figure mapping",
      progress: "85%",
      assignee: "In-house IP",
    },
  ];

  const prosecutionItems = [
    {
      application: "IN-2026-000145",
      title: "Emissions network synchronization",
      jurisdiction: "India",
      nextAction: "FER response due",
      dueDate: "24 Mar 2026",
      counsel: "K Law",
    },
    {
      application: "PCT/IN2026/000021",
      title: "Thermal optimization engine",
      jurisdiction: "PCT",
      nextAction: "Formalities review",
      dueDate: "30 Mar 2026",
      counsel: "External filing counsel",
    },
    {
      application: "US-18/445,192",
      title: "Industrial process inference platform",
      jurisdiction: "United States",
      nextAction: "Office action analysis",
      dueDate: "08 Apr 2026",
      counsel: "US associate",
    },
  ];

  const documents = [
    {
      name: "Thermal control invention disclosure.pdf",
      category: "IDF",
      updated: "Today",
      owner: "Inventor team",
    },
    {
      name: "Emissions gateway claim set v3.docx",
      category: "Draft",
      updated: "Yesterday",
      owner: "Patent drafting",
    },
    {
      name: "PCT filing package checklist.xlsx",
      category: "Checklist",
      updated: "2 days ago",
      owner: "Paralegal",
    },
    {
      name: "Partner counsel comments memo.docx",
      category: "Counsel review",
      updated: "3 days ago",
      owner: "K Law",
    },
  ];

  const partnerCounsel = [
    {
      name: "K Law",
      specialization: "Patent prosecution and filings",
      matters: "9 active matters",
      contact: "Lead partner assigned",
    },
    {
      name: "Boutique IP Associates",
      specialization: "Drafting support and analytics",
      matters: "4 active matters",
      contact: "Shared working group",
    },
    {
      name: "US Associate Counsel",
      specialization: "US prosecution and foreign filings",
      matters: "3 active matters",
      contact: "Primary jurisdiction lead",
    },
  ];

  function startWorkflow(workflow: WorkflowType) {
    setActiveWorkflow(workflow);
    setViewMode("project-choice");
  }

  function continueLastProject() {
    if (activeWorkflow === "draft") setActiveTab("drafting");
    if (activeWorkflow === "validate") setActiveTab("documents");
    if (activeWorkflow === "prosecute") setActiveTab("prosecution");
    setViewMode("workspace");
  }

  async function startNewProject() {
  const supabase = createClient();

  const title =
    activeWorkflow === "draft"
      ? "New Draft Project"
      : activeWorkflow === "validate"
      ? "New Validation Project"
      : "New Prosecution Project";

  const { data, error } = await supabase
  .from("projects")
  .insert({
    user_id: userId,
    title,
    workflow_type: activeWorkflow,
    status: "new",
    input_text: null,
  })
  .select()
  .single();

if (error) {
  alert(error.message);
  return;
}

setCurrentProjectId(data.id);

  if (activeWorkflow === "draft") setActiveTab("intake");
  if (activeWorkflow === "validate") setActiveTab("documents");
  if (activeWorkflow === "prosecute") setActiveTab("prosecution");

  setViewMode("workspace");
}

  function getWorkflowLabel() {
    if (activeWorkflow === "draft") return "Draft";
    if (activeWorkflow === "validate") return "Validate";
    if (activeWorkflow === "prosecute") return "Prosecute";
    return "";
  }

  function renderWorkflowHome() {
    return (
      <div className="space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.12em] text-[#ff8a00]">
              PatentOS Dashboard
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[#122033]">
              What would you like to do?
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
              Choose a PatentOS workflow to begin. Start a new drafting, validation, or prosecution workflow from one coordinated workspace.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LogoutButton />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {workflowCards.map((card) => (
            <button
              key={card.key}
              onClick={() => startWorkflow(card.key)}
              className="group rounded-[2rem] border border-[rgba(20,87,184,0.10)] bg-white p-8 text-left shadow-[0_10px_40px_rgba(20,87,184,0.05)] transition hover:-translate-y-1 hover:border-[rgba(255,138,0,0.20)] hover:shadow-[0_18px_60px_rgba(20,87,184,0.08)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[linear-gradient(135deg,#0b2f6b_0%,#1457b8_65%,#ff8a00_140%)] text-lg font-semibold text-white">
                {card.title.charAt(0)}
              </div>
              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-[#122033]">
                {card.title}
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                {card.subtitle}
              </p>
              <p className="mt-5 text-sm leading-7 text-slate-500">
                {card.detail}
              </p>
              <div className="mt-8 inline-flex items-center rounded-full bg-[rgba(20,87,184,0.08)] px-4 py-2 text-sm font-semibold text-[#1457b8] transition group-hover:bg-[rgba(255,138,0,0.12)] group-hover:text-[#ff8a00]">
                Open workflow
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-[2rem] border border-[rgba(255,138,0,0.16)] bg-[linear-gradient(135deg,#fff6ec_0%,#ffffff_100%)] p-8 shadow-[0_10px_40px_rgba(255,138,0,0.08)]">
          <p className="text-xl font-semibold text-[#122033]">Signed in as</p>
          <p className="mt-3 text-base text-slate-600">{userEmail}</p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            PatentOS is designed to help India close its patent gap by leveraging AI across drafting, validation, and prosecution workflows.
          </p>
        </div>
      </div>
    );
  }

  function renderProjectChoice() {
    return (
      <div className="space-y-10">
        <div>
          <p className="text-sm font-semibold tracking-[0.12em] text-[#ff8a00]">
            {getWorkflowLabel()} Workflow
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[#122033]">
            Continue or start a new project
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
            Choose whether you want to continue your latest {getWorkflowLabel().toLowerCase()} workflow or begin a fresh project inside PatentOS.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <button
            onClick={continueLastProject}
            className="rounded-[2rem] border border-[rgba(20,87,184,0.10)] bg-white p-8 text-left shadow-[0_10px_40px_rgba(20,87,184,0.05)] transition hover:-translate-y-1"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[rgba(20,87,184,0.08)] text-lg font-semibold text-[#1457b8]">
              C
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-[#122033]">
              Continue last project
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Resume the most recent {getWorkflowLabel().toLowerCase()} workflow and continue from where you left off.
            </p>
          </button>

          <button
            onClick={startNewProject}
            className="rounded-[2rem] border border-[rgba(255,138,0,0.16)] bg-[linear-gradient(135deg,#fff6ec_0%,#ffffff_100%)] p-8 text-left shadow-[0_10px_40px_rgba(255,138,0,0.08)] transition hover:-translate-y-1"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[rgba(255,138,0,0.12)] text-lg font-semibold text-[#ff8a00]">
              N
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-[#122033]">
              Start new project
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Open a fresh {getWorkflowLabel().toLowerCase()} workspace and begin a new PatentOS project.
            </p>
          </button>
        </div>

        <div>
          <button
            onClick={() => {
              setActiveWorkflow(null);
              setViewMode("workflow-home");
            }}
            className="rounded-full border border-[rgba(20,87,184,0.12)] bg-white px-5 py-2.5 text-sm font-semibold text-[#1457b8] transition hover:bg-[rgba(20,87,184,0.05)]"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  function renderTabContent() {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.12em] text-[#ff8a00]">
                  PatentOS Dashboard
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[#122033]">
                  Welcome back
                </h1>
                <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
                  Manage invention flow, drafting momentum, and prosecution readiness from one coordinated workspace.
                </p>
                {currentProjectId && (
  <p className="text-sm text-slate-500">Current project ID: {currentProjectId}</p>
)}
              </div>

              <div className="flex items-center gap-3">
                <button className="rounded-full bg-[#1457b8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b2f6b]">
                  New Invention Matter
                </button>
                <LogoutButton />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.75rem] border border-[rgba(20,87,184,0.10)] bg-white p-6 shadow-[0_10px_40px_rgba(20,87,184,0.05)]"
                >
                  <p className="text-sm leading-7 text-slate-500">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-[#122033]">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="rounded-[2rem] border border-[rgba(20,87,184,0.10)] bg-white p-8 shadow-[0_10px_40px_rgba(20,87,184,0.05)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xl font-semibold text-[#122033]">Recent invention pipeline</p>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                      Snapshot of matters currently moving through the PatentOS workflow.
                    </p>
                  </div>
                  <button className="rounded-full border border-[rgba(20,87,184,0.12)] px-4 py-2 text-sm font-medium text-[#1457b8] transition hover:bg-[rgba(20,87,184,0.05)]">
                    View all
                  </button>
                </div>

                <div className="mt-8 space-y-4">
                  {pipeline.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[1.5rem] border border-[rgba(20,87,184,0.08)] bg-[#f9fbff] p-5"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-[#122033]">{item.title}</p>
                          <p className="mt-2 text-sm text-slate-500">
                            Owner: {item.owner}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full bg-[rgba(255,138,0,0.12)] px-3 py-1 text-xs font-semibold text-[#ff8a00]">
                            {item.stage}
                          </span>
                          <span className="rounded-full bg-[rgba(20,87,184,0.08)] px-3 py-1 text-xs font-semibold text-[#1457b8]">
                            {item.status}
                          </span>
                          <span className="text-sm text-slate-500">{item.updated}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="rounded-[2rem] border border-[rgba(20,87,184,0.10)] bg-white p-8 shadow-[0_10px_40px_rgba(20,87,184,0.05)]">
                  <p className="text-xl font-semibold text-[#122033]">Quick actions</p>
                  <div className="mt-6 grid gap-3">
                    <button className="rounded-2xl bg-[#1457b8] px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-[#0b2f6b]">
                      Start new invention intake
                    </button>
                    <button className="rounded-2xl border border-[rgba(20,87,184,0.12)] bg-white px-4 py-3 text-left text-sm font-semibold text-[#1457b8] transition hover:bg-[rgba(20,87,184,0.05)]">
                      Create drafting workspace
                    </button>
                    <button className="rounded-2xl border border-[rgba(20,87,184,0.12)] bg-white px-4 py-3 text-left text-sm font-semibold text-[#1457b8] transition hover:bg-[rgba(20,87,184,0.05)]">
                      Invite partner counsel
                    </button>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[rgba(20,87,184,0.10)] bg-white p-8 shadow-[0_10px_40px_rgba(20,87,184,0.05)]">
                  <p className="text-xl font-semibold text-[#122033]">Priority tasks</p>
                  <div className="mt-6 space-y-3">
                    {[
                      "Review claim structure for emissions monitoring matter",
                      "Upload inventor notes for new university-originated disclosure",
                      "Coordinate partner counsel handoff for prosecution package",
                      "Finalize filing readiness checklist for enterprise pipeline",
                    ].map((task) => (
                      <div
                        key={task}
                        className="rounded-2xl border border-[rgba(20,87,184,0.08)] bg-[#f9fbff] px-4 py-3 text-sm leading-7 text-slate-600"
                      >
                        {task}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[rgba(255,138,0,0.16)] bg-[linear-gradient(135deg,#fff6ec_0%,#ffffff_100%)] p-8 shadow-[0_10px_40px_rgba(255,138,0,0.08)]">
                  <p className="text-sm font-semibold tracking-[0.12em] text-[#ff8a00]">
                    Signed in as
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[#122033]">{userEmail}</p>
                  
                </div>
              </div>
            </div>
          </div>
        );

      case "intake":
        return (
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold tracking-[0.12em] text-[#ff8a00]">Invention Intake</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[#122033]">
                Capture new invention matters
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
                Intake structured invention data from inventors, R&D teams, universities, startups, and enterprise stakeholders.
              </p>
            </div>

            <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[2rem] border border-[rgba(20,87,184,0.10)] bg-white p-8 shadow-[0_10px_40px_rgba(20,87,184,0.05)]">
                <p className="text-xl font-semibold text-[#122033]">New invention form</p>
                <div className="mt-6 grid gap-4">
                  <input
                    placeholder="Invention title"
                    className="rounded-2xl border border-[rgba(20,87,184,0.12)] px-4 py-3 outline-none"
                  />
                  <input
                    placeholder="Inventor / team name"
                    className="rounded-2xl border border-[rgba(20,87,184,0.12)] px-4 py-3 outline-none"
                  />
                  <select className="rounded-2xl border border-[rgba(20,87,184,0.12)] px-4 py-3 outline-none">
                    <option>Technology domain</option>
                    <option>AI / Software</option>
                    <option>Industrial systems</option>
                    <option>Climate / Energy</option>
                    <option>Electronics / Embedded</option>
                  </select>
                  <textarea
                    rows={5}
                    placeholder="Problem statement"
                    className="rounded-2xl border border-[rgba(20,87,184,0.12)] px-4 py-3 outline-none"
                  />
                  <textarea
                    rows={5}
                    placeholder="Proposed solution / novelty summary"
                    className="rounded-2xl border border-[rgba(20,87,184,0.12)] px-4 py-3 outline-none"
                  />
                  <div className="flex gap-3">
                    <button className="rounded-full bg-[#1457b8] px-5 py-2.5 text-sm font-semibold text-white">
                      Save intake
                    </button>
                    <button className="rounded-full border border-[rgba(20,87,184,0.12)] px-5 py-2.5 text-sm font-semibold text-[#1457b8]">
                      Upload notes
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[rgba(20,87,184,0.10)] bg-white p-8 shadow-[0_10px_40px_rgba(20,87,184,0.05)]">
                <p className="text-xl font-semibold text-[#122033]">Recent intake queue</p>
                <div className="mt-6 space-y-4">
                  {[
                    "University-originated sensor fusion disclosure",
                    "MSME industrial safety controller concept",
                    "Enterprise energy optimization workflow intake",
                    "Individual inventor mechanical linkage submission",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[rgba(20,87,184,0.08)] bg-[#f9fbff] p-4 text-sm text-slate-600"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "drafting":
        return (
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold tracking-[0.12em] text-[#ff8a00]">Drafting Workspace</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[#122033]">
                Draft specifications, claims, and figure logic
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
                Build structured patent documentation from invention inputs, technical notes, and counsel comments.
              </p>
            </div>

            <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[2rem] border border-[rgba(20,87,184,0.10)] bg-white p-8 shadow-[0_10px_40px_rgba(20,87,184,0.05)]">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-semibold text-[#122033]">Draft matters</p>
                  <button className="rounded-full border border-[rgba(20,87,184,0.12)] px-4 py-2 text-sm font-medium text-[#1457b8]">
                    New draft
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {draftMatters.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[1.5rem] border border-[rgba(20,87,184,0.08)] bg-[#f9fbff] p-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold text-[#122033]">{item.title}</p>
                          <p className="mt-2 text-sm text-slate-500">{item.type}</p>
                        </div>
                        <span className="rounded-full bg-[rgba(255,138,0,0.12)] px-3 py-1 text-xs font-semibold text-[#ff8a00]">
                          {item.progress}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-500">Assigned to: {item.assignee}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="rounded-[2rem] border border-[rgba(20,87,184,0.10)] bg-white p-8 shadow-[0_10px_40px_rgba(20,87,184,0.05)]">
                  <p className="text-xl font-semibold text-[#122033]">Draft editor preview</p>
                  <div className="mt-6 rounded-[1.5rem] border border-[rgba(20,87,184,0.08)] bg-[#f9fbff] p-5">
                    <p className="text-sm font-semibold text-[#1457b8]">Independent Claim 1</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      A system for synchronized emissions data validation in a distributed industrial sensor network, comprising...
                    </p>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[rgba(20,87,184,0.10)] bg-white p-8 shadow-[0_10px_40px_rgba(20,87,184,0.05)]">
                  <p className="text-xl font-semibold text-[#122033]">Drafting actions</p>
                  <div className="mt-6 grid gap-3">
                    <button className="rounded-2xl bg-[#1457b8] px-4 py-3 text-left text-sm font-semibold text-white">
                      Generate claim set
                    </button>
                    <button className="rounded-2xl border border-[rgba(20,87,184,0.12)] px-4 py-3 text-left text-sm font-semibold text-[#1457b8]">
                      Build abstract
                    </button>
                    <button className="rounded-2xl border border-[rgba(20,87,184,0.12)] px-4 py-3 text-left text-sm font-semibold text-[#1457b8]">
                      Map figures
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "prosecution":
        return (
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold tracking-[0.12em] text-[#ff8a00]">Prosecution Tracker</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[#122033]">
                Track applications, deadlines, and next actions
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
                Monitor filing status, office actions, FER responses, partner counsel coordination, and key dates.
              </p>
            </div>

            <div className="rounded-[2rem] border border-[rgba(20,87,184,0.10)] bg-white p-8 shadow-[0_10px_40px_rgba(20,87,184,0.05)]">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-[rgba(20,87,184,0.08)] text-sm text-slate-500">
                      <th className="pb-4 pr-6">Application</th>
                      <th className="pb-4 pr-6">Title</th>
                      <th className="pb-4 pr-6">Jurisdiction</th>
                      <th className="pb-4 pr-6">Next action</th>
                      <th className="pb-4 pr-6">Due date</th>
                      <th className="pb-4">Counsel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prosecutionItems.map((item) => (
                      <tr
                        key={item.application}
                        className="border-b border-[rgba(20,87,184,0.06)] text-sm text-slate-600"
                      >
                        <td className="py-4 pr-6 font-semibold text-[#1457b8]">{item.application}</td>
                        <td className="py-4 pr-6">{item.title}</td>
                        <td className="py-4 pr-6">{item.jurisdiction}</td>
                        <td className="py-4 pr-6">{item.nextAction}</td>
                        <td className="py-4 pr-6">{item.dueDate}</td>
                        <td className="py-4">{item.counsel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "documents":
        return (
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold tracking-[0.12em] text-[#ff8a00]">Documents</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[#122033]">
                Central repository for invention and filing documents
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
                Organize invention disclosures, drafts, filings, checklists, and related working papers in one place.
              </p>
            </div>

            <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[2rem] border border-[rgba(20,87,184,0.10)] bg-white p-8 shadow-[0_10px_40px_rgba(20,87,184,0.05)]">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-semibold text-[#122033]">Document library</p>
                  <button className="rounded-full bg-[#1457b8] px-4 py-2 text-sm font-semibold text-white">
                    Upload document
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {documents.map((doc) => (
                    <div
                      key={doc.name}
                      className="rounded-[1.5rem] border border-[rgba(20,87,184,0.08)] bg-[#f9fbff] p-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold text-[#122033]">{doc.name}</p>
                          <p className="mt-2 text-sm text-slate-500">{doc.owner}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#1457b8]">{doc.category}</p>
                          <p className="mt-1 text-sm text-slate-500">{doc.updated}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-[rgba(20,87,184,0.10)] bg-white p-8 shadow-[0_10px_40px_rgba(20,87,184,0.05)]">
                <p className="text-xl font-semibold text-[#122033]">Folders</p>
                <div className="mt-6 grid gap-3">
                  {[
                    "Invention disclosures",
                    "Draft specifications",
                    "Claim sets",
                    "Filing packages",
                    "Counsel comments",
                    "Checklists and templates",
                  ].map((folder) => (
                    <div
                      key={folder}
                      className="rounded-2xl border border-[rgba(20,87,184,0.08)] bg-[#f9fbff] px-4 py-3 text-sm text-slate-600"
                    >
                      {folder}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "partners":
        return (
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold tracking-[0.12em] text-[#ff8a00]">Partner Counsel</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[#122033]">
                Coordinate with integrated law firm and IP support partners
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
                Manage partner assignments, review queues, prosecution collaboration, and external drafting support.
              </p>
            </div>

            <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[2rem] border border-[rgba(20,87,184,0.10)] bg-white p-8 shadow-[0_10px_40px_rgba(20,87,184,0.05)]">
                <p className="text-xl font-semibold text-[#122033]">Partner network</p>
                <div className="mt-6 space-y-4">
                  {partnerCounsel.map((partner) => (
                    <div
                      key={partner.name}
                      className="rounded-[1.5rem] border border-[rgba(20,87,184,0.08)] bg-[#f9fbff] p-5"
                    >
                      <p className="text-lg font-semibold text-[#122033]">{partner.name}</p>
                      <p className="mt-2 text-sm text-slate-500">{partner.specialization}</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <span className="rounded-full bg-[rgba(20,87,184,0.08)] px-3 py-1 text-xs font-semibold text-[#1457b8]">
                          {partner.matters}
                        </span>
                        <span className="rounded-full bg-[rgba(255,138,0,0.12)] px-3 py-1 text-xs font-semibold text-[#ff8a00]">
                          {partner.contact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-[rgba(20,87,184,0.10)] bg-white p-8 shadow-[0_10px_40px_rgba(20,87,184,0.05)]">
                <p className="text-xl font-semibold text-[#122033]">Assign external review</p>
                <div className="mt-6 grid gap-4">
                  <input
                    placeholder="Matter title"
                    className="rounded-2xl border border-[rgba(20,87,184,0.12)] px-4 py-3 outline-none"
                  />
                  <select className="rounded-2xl border border-[rgba(20,87,184,0.12)] px-4 py-3 outline-none">
                    <option>Select partner</option>
                    <option>K Law</option>
                    <option>Boutique IP Associates</option>
                    <option>US Associate Counsel</option>
                  </select>
                  <textarea
                    rows={5}
                    placeholder="Instructions / scope of external review"
                    className="rounded-2xl border border-[rgba(20,87,184,0.12)] px-4 py-3 outline-none"
                  />
                  <button className="rounded-full bg-[#1457b8] px-5 py-2.5 text-sm font-semibold text-white">
                    Assign matter
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold tracking-[0.12em] text-[#ff8a00]">Settings</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[#122033]">
                Workspace and account settings
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
                Configure account preferences, workspace defaults, collaboration settings, and notification controls.
              </p>
            </div>

            <div className="grid gap-8 xl:grid-cols-2">
              <div className="rounded-[2rem] border border-[rgba(20,87,184,0.10)] bg-white p-8 shadow-[0_10px_40px_rgba(20,87,184,0.05)]">
                <p className="text-xl font-semibold text-[#122033]">Account</p>
                <div className="mt-6 space-y-4">
                  <input
                    value={userEmail}
                    readOnly
                    className="w-full rounded-2xl border border-[rgba(20,87,184,0.12)] bg-[#f9fbff] px-4 py-3 outline-none"
                  />
                  <input
                    placeholder="Display name"
                    className="w-full rounded-2xl border border-[rgba(20,87,184,0.12)] px-4 py-3 outline-none"
                  />
                  <button className="rounded-full bg-[#1457b8] px-5 py-2.5 text-sm font-semibold text-white">
                    Save account settings
                  </button>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[rgba(20,87,184,0.10)] bg-white p-8 shadow-[0_10px_40px_rgba(20,87,184,0.05)]">
                <p className="text-xl font-semibold text-[#122033]">Notifications</p>
                <div className="mt-6 space-y-4 text-sm text-slate-600">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked />
                    Deadline reminders
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked />
                    Partner counsel updates
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked />
                    Draft review notifications
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" />
                    Weekly portfolio digest
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <main className="min-h-[calc(100vh-88px)] bg-[#f7f9fc] text-[#122033]">
      <div className="grid min-h-[calc(100vh-88px)] lg:grid-cols-[110px_1fr]">
        <aside className="relative border-r border-[rgba(20,87,184,0.08)] bg-white px-4 py-8">
          <div className="mt-2">
            <p className="text-center text-[11px] font-semibold tracking-[0.18em] text-[#ff8a00]">
              NAV
            </p>

            <nav className="mt-4 space-y-3">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                const isHovered = hoveredTab === tab.key;

                return (
                  <div
                    key={tab.key}
                    className="relative"
                    onMouseEnter={() => setHoveredTab(tab.key)}
                    onMouseLeave={() => setHoveredTab(null)}
                  >
                    <button
                      onClick={() => {
                        setActiveTab(tab.key);
                        setViewMode("workspace");
                      }}
                      className={`flex w-full flex-col items-center rounded-[1.5rem] px-3 py-4 text-center transition ${
                        isActive
                          ? "bg-[rgba(20,87,184,0.08)] text-[#1457b8]"
                          : "text-slate-600 hover:bg-[rgba(20,87,184,0.05)] hover:text-[#1457b8]"
                      }`}
                    >
                      <span className="text-xs font-semibold tracking-[0.08em]">
                        {tab.short}
                      </span>
                      <span className="mt-2 text-[11px] leading-4">
                        {tab.label.split(" ")[0]}
                      </span>
                    </button>

                    {isHovered && (
                      <div className="absolute left-[96px] top-1/2 z-30 w-72 -translate-y-1/2 rounded-[1.5rem] border border-[rgba(20,87,184,0.12)] bg-white p-5 shadow-[0_16px_50px_rgba(20,87,184,0.10)]">
                        <p className="text-sm font-semibold text-[#122033]">
                          {tab.label}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          {tab.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="mt-12 rounded-[1.5rem] border border-[rgba(255,138,0,0.18)] bg-[linear-gradient(135deg,#fff5ea_0%,#ffffff_100%)] p-4">
            <p className="text-sm font-semibold text-[#122033]">Vision</p>
            <p className="mt-3 text-xs leading-6 text-slate-600">
              Help India close its patent gap by leveraging AI for real innovation workflows.
            </p>
          </div>
        </aside>

        <section className="px-6 py-8 lg:px-10">
          {viewMode === "workflow-home" && renderWorkflowHome()}
          {viewMode === "project-choice" && renderProjectChoice()}
          {viewMode === "workspace" && renderTabContent()}
        </section>
      </div>
    </main>
  );
}