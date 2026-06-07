# SecondMind - AI Memory & Digital Twin Platform

SecondMind is an AI-powered personal memory and digital twin system that continuously learns from a user's documents, projects, goals, conversations, and activities. It creates a structured representation of the user, acts as a long-term memory layer, and provides personalized reasoning, planning, and future simulations.

---

## Key Features

1. **Knowledge Ingestion**: Upload resumes, documents, and notes (PDF, DOCX, TXT) to automatically parse text, clean lines, and extract AI summaries.
2. **Cognitive Digital Twin**: Assembles a dynamic user profile containing skills, interests, strengths, weaknesses, and goals, which updates automatically upon new document uploads.
3. **Memory Explorer**: Search and filter your memories chronologically with timeline highlight tracking.
4. **Future Simulation Engine**: Ground hypothetical goals or career progressions in your Digital Twin data to generate study resources, gap analysis, and progression timelines.
5. **Agentic System**: Utilizes coordinated agents:
   - **Memory Agent**: Contextual grounding, ranking, and search answering.
   - **Learning Agent**: Custom syllabus planning and skill roadmap generator.
   - **Career Agent**: Transition projections, probabilities of success, and gap analysis.
   - **Planning Agent**: Formulates action-oriented weekly schedule agendas.
6. **MongoDB MCP Server**: Exposes collections (`memories`, `digitaltwins`, `users`) as MCP tools so external AI tools can query user data directly.

---

## Directory Structure

```text
secondmind/
├── backend/
│   ├── config/          # DB connection & Firebase Admin setup
│   ├── controllers/     # Route logic for auth, documents, memories, twin & agents
│   ├── middleware/      # Auth protection & sandbox token interceptors
│   ├── models/          # User, Memory, and DigitalTwin schemas
│   ├── routes/          # Express API route maps
│   ├── services/        # Mammoth text extraction & Gemini SDK client
│   │   └── agents/      # Cognitive agents (Memory, Learning, Career, Planning)
│   ├── scripts/         # Local checkups & MongoDB MCP stdio runner
│   ├── server.js        # Server launch file
│   └── Dockerfile       # Container setup for serverless cloud run
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbars & dropzone uploads
│   │   ├── context/     # Firebase Client Auth & Mock bypass
│   │   ├── pages/       # Dashboard, Twin canvas, timeline explorer, simulator
│   │   ├── services/    # Axios API connections
│   │   ├── App.jsx      # React router configuration
│   │   └── index.css    # Modern Dark glassmorphic design token styles
│   ├── index.html       # Vite app anchor & SEO metatags
│   └── .env             # UI environment configs
├── mcp-config.json      # Client configuration for Claude Desktop / Cursor
└── README.md
```

---

## Local Quickstart Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (A running local instance or MongoDB Atlas URI connection)
- **Google Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/))

### 2. Configure Backend Env
Create `backend/.env` (a template is provided in the project):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/secondmind
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Firebase credentials (Optional)
# Leave blank to automatically activate Mock Sandbox Authentication
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### 3. Run Backend Server
```bash
cd backend
npm install
npm run dev
```
The backend starts on `http://localhost:5000`.

### 4. Configure Frontend Env
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api

# Optional: Set client-side Firebase keys if not using Mock Bypass
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 5. Run React App
```bash
cd frontend
npm install
npm run dev
```
The React frontend starts on `http://localhost:5173`. Open it in your browser.

---

## Developer Sandbox & Mock Authentication

To make testing local workflows seamless, SecondMind includes a **Mock Auth Bypass Mode**:
- If Firebase parameters are not configured in `.env`, the client UI presents a **"Launch Sandbox Environment"** form.
- You can login using any email (e.g. `john@example.com`).
- The backend automatically syncs a mock database profile and authorizes requests using a sandbox Bearer token (`mock_token_for_<email>`).
- If a Gemini API Key is not set, the service falls back to generating structured mock responses representing realistic Career/Learning agent outputs, ensuring the app remains fully reviewable offline.

---

## Model Context Protocol (MCP) Integration

This project integrates a MongoDB Model Context Protocol (MCP) server that exposes your memory collections directly to AI agents.

### Exposed Tools:
- `list_memories(email, limit)`: Returns user summaries.
- `get_digital_twin(email)`: Returns the twin skillset schema.
- `add_memory_note(email, content)`: Creates a reflection entry in MongoDB.

### Wire up to Claude Desktop or Cursor:
Add the block inside `mcp-config.json` into your local IDE client config (e.g. `%APPDATA%/Claude/claude_desktop_config.json` or Cursor settings):
```json
{
  "mcpServers": {
    "secondmind-mcp": {
      "command": "node",
      "args": [
        "C:/Users/Love/Desktop/Projects/secondmind/backend/scripts/mcp-server.js"
      ],
      "env": {
        "MONGO_URI": "mongodb://localhost:27017/secondmind"
      }
    }
  }
}
```

---

## Deployment (Google Cloud Run)

To deploy the Express backend to Google Cloud Run:
```bash
cd backend

# Build the container via Google Artifact Registry
gcloud builds submit --tag gcr.io/your-project-id/secondmind-backend

# Deploy the container to Cloud Run
gcloud run deploy secondmind-backend \
  --image gcr.io/your-project-id/secondmind-backend \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars MONGO_URI="mongodb+srv://..." \
  --set-env-vars GEMINI_API_KEY="AIzaSy..."
```
