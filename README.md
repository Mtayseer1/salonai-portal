# SalonAI Portal

AI-powered hairstyle and makeup preview for salons. Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Supabase.

---

## Autonomous Agent Workflow

This repository is set up for autonomous multi-agent development. Claude acts as the orchestrator/architect. Codex acts as the implementation worker. Git is the shared state.

### How it works

```
Claude writes task → /tasks/task.md
Codex worker picks it up → runs Codex CLI
Codex implements the change → commits it
Task moves to /completed_tasks/
Claude reviews the diff
```

### Start the system

**Windows (PowerShell):**
```powershell
.\start_agents.ps1
```

**WSL / macOS (Bash):**
```bash
./start_agents.sh
```

Flags:
- `--once` / `-Once` — process the current queue and exit (no daemon)
- `--no-worker` / `-NoWorker` — validate environment without starting the worker
- `--poll=N` / `-PollInterval N` — seconds between queue checks (default 10)

### Create a task for Codex

1. Copy a template from `tasks/_template_*.md`
2. Fill it out — be explicit about files, steps, and constraints
3. Save it to `tasks/your-task-name.md`
4. The worker picks it up within `PollInterval` seconds

Task file naming: prefix with a number to control order (`01_types.md`, `02_api.md`, `03_ui.md`).

### Directory structure

```
tasks/              Active task queue (Codex reads from here)
tasks/_template_*   Task templates — do not process these
tasks/failed/       Tasks that Codex failed to complete
completed_tasks/    Tasks that were successfully committed
logs/               Execution logs (one file per task + worker.log)
reviews/            Manual review notes written by Claude
scripts/            Worker scripts (codex_worker.ps1, codex_worker.sh)
.agents/            Claude orchestrator instructions
```

### Rollback a Codex commit

```powershell
# See recent agent commits
.\scripts\rollback.ps1

# Inspect the last agent commit
.\scripts\rollback.ps1 -Inspect

# Undo last agent commit (keeps files as uncommitted changes)
.\scripts\rollback.ps1 -Undo

# Discard last agent commit entirely
.\scripts\rollback.ps1 -UndoHard
```

### Claude vs Codex — what each handles

| Codex handles | Claude handles |
|---------------|---------------|
| New pages and UI components | Credit system changes |
| API route additions | Auth flow modifications |
| Performance refactors | Edge function payload changes |
| Copy and label updates | Database schema decisions |
| New catalog options | Any task that requires judgment |

See `.agents/claude_orchestrator.md` for the full delegation ruleset.

### Coding rules for agents

All agents must follow `AGENTS.md`. It covers: architecture, TypeScript conventions, UI design system, Supabase safety rules, credit system constraints, and the generation flow.

---

## Local Development

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
