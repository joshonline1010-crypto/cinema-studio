# Video Studio

Multi-user AI video generation system with Astro frontend and n8n backend.

**Status:** OPERATIONAL
**Last Updated:** 2026-01-02

---

## Quick Start

### 1. Start n8n (separate terminal)

```bash
C:\Users\yodes\Documents\n8n\start-n8n.bat
```

### 2. Start Video Studio

```bash
cd C:\Users\yodes\Documents\n8n\video-studio
npm run dev
```

Open http://localhost:3000

### Default Login

- **Username:** admin
- **Password:** admin123

---

## Features

| Feature | Status | Description |
|---------|--------|-------------|
| User Authentication | Working | Login/register/logout with sessions |
| Projects | Working | Create, list, switch between projects |
| Chat Interface | Working | Send messages to n8n agents |
| Agent Selection | Working | Switch between multiple agents |
| Project Files | Working | Browse project folder structure |
| Workflow Tracking | Working | See which n8n workflows were used |
| Executions Panel | Working | View recent n8n executions |
| Media Display | Working | Show images/videos in chat responses |
| Markdown Formatting | Working | Bold, lists, paragraphs in agent responses |
| Storyboard Progress | Working | Visual checkpoint tracker for story intake |

---

## Architecture

```
video-studio/                    # Astro 5 SSR frontend (port 3000)
├── src/
│   ├── pages/
│   │   ├── index.astro          # Landing/login page
│   │   ├── dashboard.astro      # Main dashboard
│   │   └── api/                 # API routes
│   │       ├── auth/            # Login, register, logout
│   │       ├── chat/send.ts     # Chat proxy to n8n
│   │       ├── projects/        # Project CRUD
│   │       │   ├── index.ts     # List/create projects
│   │       │   └── [projectId]/ # Project operations
│   │       │       ├── index.ts       # Get project details
│   │       │       ├── files.ts       # Project file tree
│   │       │       ├── workflows.ts   # Workflow/execution history
│   │       │       └── state.ts       # Intake state for storyboard
│   │       ├── files/           # Serve media files
│   │       └── executions/      # n8n execution proxy
│   ├── components/react/        # React components
│   │   ├── ChatPanel.tsx        # Chat interface + markdown
│   │   ├── Sidebar.tsx          # Projects + agent selection
│   │   ├── ProjectDetails.tsx   # Files/Workflows tabs
│   │   ├── ExecutionsPanel.tsx  # Execution history
│   │   └── StoryboardProgress.tsx # Visual checkpoint tracker
│   ├── stores/
│   │   └── chatStore.ts         # Zustand state management
│   └── lib/
│       ├── db.ts                # JSON file database
│       ├── cookies.ts           # Session cookies
│       └── projects.ts          # Project file operations
│
└── db/                          # Local JSON database
    └── users.json               # User credentials

n8n/db/users/                    # User project data
└── {userId}/projects/{projectId}/
    ├── manifest.json            # Project metadata
    ├── chats/conversation.txt   # Chat history
    ├── outputs/                 # Generated media
    │   ├── images/
    │   └── videos/
    └── savepoints/              # Workflow savepoints
```

---

## Dashboard Layout

```
+------------------+-------------------------+------------------+
|                  |                         |                  |
|     Sidebar      |       Chat Panel        | Project Details  |
|   (280px)        |       (flex-1)          |    (320px)       |
|                  |                         |                  |
| +-------------+  | +-------------------+   | +-------------+  |
| | Agents      |  | | Storyboard       |   | | Project     |  |
| | - Intake    |  | | Progress (7 cards)|  | | Header      |  |
| | - CHIP v2   |  | +-------------------+   | +-------------+  |
| | - Universal |  | | Messages         |   | | [Files]     |  |
| +-------------+  | | - User message   |   | | [Workflows] |  |
|                  | | - Bot (markdown) |   | +-------------+  |
| +-------------+  | | - Media display  |   | | File tree   |  |
| | Projects    |  | +-------------------+   | | or          |  |
| | - Project 1 |  | +-------------------+   | | Workflow    |  |
| | - Project 2 |  | | Input box        |   | | history     |  |
| | + New       |  | +-------------------+   | +-------------+  |
| +-------------+  |                         |                  |
|                  |                         | +-------------+  |
|                  |                         | | Executions  |  |
|                  |                         | | Panel       |  |
|                  |                         | +-------------+  |
+------------------+-------------------------+------------------+
```

---

## API Endpoints

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | `{ username, password }` |
| `/api/auth/register` | POST | `{ username, email, password }` |
| `/api/auth/logout` | GET/POST | Clear session |

### Chat

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat/send` | POST | `{ chatInput, chatSessionId, projectId, agentEndpoint }` |

### Projects

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/projects` | GET | List all projects for user |
| `/api/projects` | POST | `{ name }` Create new project |
| `/api/projects/[id]` | GET | Get project details + chat history |
| `/api/projects/[id]` | PUT | `{ name }` Rename project |
| `/api/projects/[id]/files` | GET | Get project file tree |
| `/api/projects/[id]/workflows` | GET | Get workflows + executions for project |
| `/api/projects/[id]/state` | GET | Get intake_state.json for storyboard progress |

### Files

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/files/[...path]` | GET | Serve media files from user folders |

### Executions

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/executions` | GET | Proxy to n8n executions API |

---

## Agents

Configured in `src/stores/chatStore.ts`:

```typescript
export const AVAILABLE_AGENTS: Agent[] = [
  {
    id: 'story-intake',
    name: 'Story Intake (New!)',
    endpoint: '/webhook/visual-story-intake/chat'
  },
  {
    id: 'chip-agent-v2',
    name: 'CHIP Agent v2',
    endpoint: '/webhook/chip-agent-v2/chat'
  },
  {
    id: 'universal-agent',
    name: 'Universal Agent',
    endpoint: '/webhook/test-universal/chat'
  },
];
```

### Story Intake Agent (NEW)

The Story Intake agent helps build stories through visual checkpoints:
- Shows 3x3 grids for each story decision (endings, openings, locations, etc.)
- Locks user choices and tracks progress
- Outputs handoff JSON for Storyboard Agent
- Uses StoryboardProgress component to show visual progress

Both agents use the same request format:
```json
{
  "chatInput": "your message",
  "sessionId": "project-id-or-session-id",
  "projectId": "project-id",
  "userId": "user_001",
  "username": "admin"
}
```

---

## State Management (Zustand)

```typescript
// src/stores/chatStore.ts
interface ChatState {
  // Chat
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  chatSessionId: string | null;
  currentAgent: Agent;

  // Projects
  activeProject: Project | null;
  projects: Project[];
  projectsLoading: boolean;

  // Actions
  sendMessage: (content: string, userId: string) => Promise<void>;
  clearMessages: () => void;
  setAgent: (agent: Agent) => void;
  fetchProjects: () => Promise<void>;
  createProject: (name: string) => Promise<string | null>;
  selectProject: (projectId: string) => Promise<void>;
  clearProject: () => void;
}
```

---

## User Folder Structure

Each user's project data is stored in:

```
db/users/{userId}/projects/{projectId}/
├── manifest.json                # Project metadata
├── chats/
│   └── conversation.txt         # Chat history log
├── outputs/
│   ├── images/                  # Generated images
│   ├── videos/                  # Generated videos
│   └── audio/                   # Generated audio
├── savepoints/                  # Workflow savepoints
│   └── {timestamp}_savepoint.json
└── notes/                       # Project notes
```

### manifest.json

```json
{
  "id": "mcp-session-1766824235215",
  "name": "CHIP Haunted House",
  "created": "2025-12-28T20:00:00Z",
  "modified": "2025-12-28T23:28:45Z",
  "agent": "chip-agent-v2",
  "thumbnail": "outputs/chip_haunted_4k.png",
  "messageCount": 12,
  "outputCount": 5
}
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/pages/dashboard.astro` | Main dashboard page layout |
| `src/components/react/ChatPanel.tsx` | Chat interface with media display + markdown |
| `src/components/react/Sidebar.tsx` | Agent selector + project list |
| `src/components/react/ProjectDetails.tsx` | Files/Workflows tabs |
| `src/components/react/ExecutionsPanel.tsx` | Execution history |
| `src/components/react/StoryboardProgress.tsx` | Visual checkpoint tracker (NEW) |
| `src/stores/chatStore.ts` | Zustand state management |
| `src/pages/api/chat/send.ts` | Chat proxy to n8n |
| `src/pages/api/projects/index.ts` | Project list/create API |
| `src/pages/api/projects/[projectId]/files.ts` | File tree API |
| `src/pages/api/projects/[projectId]/workflows.ts` | Workflow tracking API |
| `src/pages/api/projects/[projectId]/state.ts` | Intake state API (NEW) |
| `src/lib/projects.ts` | Project file operations |
| `src/lib/db.ts` | User database operations |

---

## Development

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Requirements

- Node.js 18+
- n8n running on port 5678
- CHIP Agent v2 or Universal Agent workflow active

---

## Troubleshooting

### "Unauthorized" on chat
- Check if logged in (session cookie)
- Try logging out and back in

### Agent not responding
- Check n8n is running: http://localhost:5678
- Check workflow is active (green toggle)
- Check webhook path matches agent endpoint

### Files not showing in ProjectDetails
- Verify project folder exists in `db/users/{userId}/projects/{projectId}/`
- Check file permissions

### Executions empty
- n8n executions API may be rate limited
- Check n8n logs for errors
