# 🧠 SecondMind - AI Memory & Cognitive Digital Twin Platform

SecondMind is an enterprise-grade personal memory and cognitive digital twin system that continuously ingests, parses, summarizes, and indexes your professional documentation, learning roadmaps, skills, and notes. Using a coordinated multi-agent orchestration engine powered by **Google Gemini**, SecondMind builds a dynamic representation of your professional identity. 

The platform features a custom-built, modern glassmorphic web dashboard, an interactive real-time concentric Orbit Canvas, predictive career projection models, and publishes a native **Model Context Protocol (MCP)** server, enabling local LLM clients (like Claude Desktop or Cursor) to query your personal knowledge base directly.

---

## 📖 Table of Contents
1. [Platform Capabilities & Mechanics](#-platform-capabilities--mechanics)
2. [Multi-Agent Orchestration Engine](#-multi-agent-orchestration-engine)
3. [Technical Architecture](#-technical-architecture)
4. [Technology Stack](#-technology-stack)
5. [Detailed Third-Party Setup Guides](#-detailed-third-party-setup-guides)
    - [Google Cloud Console (OAuth 2.0)](#1-google-cloud-console-oauth-20)
    - [Firebase Console (Auth & Admin SDK)](#2-firebase-console-auth--admin-sdk)
    - [MongoDB Atlas (Cloud Database)](#3-mongodb-atlas-cloud-database)
    - [Google AI Studio (Gemini API Key)](#4-google-ai-studio-gemini-api-key)
6. [Environment Variable Reference](#-environment-variable-reference)
    - [Backend Env Parameters](#backend-env-parameters)
    - [Frontend Env Parameters](#frontend-env-parameters)
7. [Local Installation & Sizing Guide](#-local-installation--run-guide)
8. [Model Context Protocol (MCP) Integration](#-model-context-protocol-mcp-integration)
9. [Production Deployment (Google Cloud Run)](#-production-deployment-google-cloud-run)
10. [FAQ & Troubleshooting](#-faq--troubleshooting)

---

## 🌌 Platform Capabilities & Mechanics

### 1. Advanced Knowledge Ingestion
- **Document Parsing**: When a user drops a resume or project document (PDF, DOCX, TXT) into the ingestion portal, the backend handles the stream, using custom text parsers (such as `mammoth` for DOCX and text line readers) to strip formatting, resolve character encodings, and compile clean raw text.
- **AI-Powered Summarization**: The raw content is passed to the Google Gemini model to produce a structured summary focusing on professional capabilities, experience levels, and primary domains.
- **Dynamic Identity Updating**: Upon saving the memory log, the backend triggers an asynchronous task to rebuild the user's digital twin schema, scanning the entire memory history database to capture newly acquired skills or changing goals.

### 2. Concentric Orbit Cognitive Twin Canvas
- **Live Physics-based Canvas**: The digital twin page maps the user's profile to a responsive 2D HTML5 canvas. 
- **Concentric Orbits**: Mapped nodes orbit the identity center at defined radii:
  - **Inner Orbit (Radius: 90px)**: Mapped Skills (represented by glowing violet nodes).
  - **Middle Orbit (Radius: 145px)**: Mapped Interests and research domains (represented by blue nodes).
  - **Outer Orbit (Radius: 200px)**: Mapped Target Goals (represented by emerald nodes).
- **Concentric Particle flow**: Connecting threads draw particle flows pulsing outward from the core identity circle to active satellite nodes.
- **Interactive Tooltips**: Collision-detection logic checks the user's mouse coordinates against satellite node radii, highlighting active lines and rendering responsive blur tooltips containing node titles.

### 3. Memory Explorer
- **Query Grounding**: Users can ask natural language questions (e.g., "What did I study in my Kubernetes notes?").
- **Agentic Filtering**: The Memory Agent scores database records, fetches the most relevant logs, and answers the query using Gemini.
- **Safe HTML Highlighting**: Multi-term search highlighting scans the user's query, sanitizes input terms, filters out standard stop words, and highlights matches in the content and summary using glowing CSS mark classes.
- **Monospace Console Previewer**: Expands records into a monospace black code-editor console view complete with file sizes, line-height margins, word counters, and a copy-to-clipboard utility.

### 4. Predictive Future Simulator
- **Career Path Modelling**: Users can model career transitions (e.g., "Transition to AI Engineer").
- **Timeline Progression**: The simulator compiles chronological projected phases, rating risk levels (Low, Medium, High) with visual badge highlights.
- **Competency Roadmaps**: Compiles curricula detailing study timescales and recommended reference resources.
- **Visual Success Meters**: Displays career suitability indices using an enlarged circular SVG gauge gradient.

---

## 🤖 Multi-Agent Orchestration Engine

SecondMind organizes its reasoning processes using a coordinated network of specialized agents. Each agent utilizes targeted prompt boundaries and outputs clean structured models:

### 1. Memory Agent
- **Purpose**: Locates, ranks, and interprets stored database logs to ground user questions in factual history.
- **Mechanics**: Extracts search keywords from the query. Performs a keyword frequency and weight match across the user's memory database records. The highest-scoring documents are assembled into a contextual prompt block and passed to Gemini to generate the final answer.

### 2. Learning Agent
- **Purpose**: Synthesizes a structured study curriculum and identifies skill gap roadmaps.
- **Mechanics**: Compares the user's current skills against the simulated target goal, outputting study schedules, resources, and expected outcomes formatted as a JSON model:
  ```json
  {
    "milestones": [{ "title": "Syllabus Milestone", "timeframe": "Week 1", "resources": "Books/Docs", "details": "Steps" }],
    "skillRoadmap": ["Skill 1", "Skill 2"],
    "estimatedOutcomes": "Outcome description"
  }
  ```

### 3. Career Agent
- **Purpose**: Simulates the trajectory of career path adjustments, warning levels, and success probability.
- **Mechanics**: Performs diagnostic validation against current skills, goals, and interests to determine phase timelines and risk matrices, returning details as a JSON model:
  ```json
  {
    "timeline": [{ "phase": "Month 1-3", "role": "Associate", "milestones": ["Tasks"], "riskLevel": "Low" }],
    "gapAnalysis": ["Missing toolsets"],
    "progressionProbability": "Probability value (e.g. 75%)"
  }
  ```

### 4. Planning Agent
- **Purpose**: Generates dynamic weekly task lists and actionable agendas.
- **Mechanics**: Reviews the user's digital twin schema alongside the last 10 memory logs to create weekly focus objectives, day-by-day task lists, and high-impact action items.

---

## 📐 Technical Architecture

```text
                  ┌───────────────────────────────┐
                  │        Claude Desktop         │
                  │       (or Cursor IDE)         │
                  └───────────────┬───────────────┘
                                  │ (MCP Connection / Stdio JSON-RPC)
                                  ▼
┌──────────────┐   HTTP / REST    ┌──────────────┐   Mongoose   ┌──────────────┐
│  React App   ├───────────────►  │  Express API ├─────────────►│   MongoDB    │
│  (Frontend)  │◄───────────────  │   (Backend)  │◄─────────────┤ (Atlas/Local)│
└──────┬───────┘   JSON Webs      └──────┬───────┘              └──────────────┘
       │                              │
       │ (Google Auth Token)          │ (System Prompt / Grounding Context)
       ▼                              ▼
┌──────────────┐               ┌──────────────┐
│   Firebase   │               │  Google AI   │
│     Auth     │               │  Gemini SDK  │
└──────────────┘               └──────────────┘
```

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 & Vite | Fast client environment, page routing, context providers |
| **Styling** | Custom HSL CSS | Dark glassmorphism, responsive visual cards, transition glows |
| **Icons** | Lucide React | High-resolution scalable vector icons |
| **Backend** | Node.js & Express | REST API server, document parsers, token check middleware |
| **Database** | MongoDB & Mongoose | Schemas for Users, Memories, and DigitalTwins |
| **Auth** | Firebase Auth / Admin | Multi-client Google authentication and token verification |
| **AI Layer** | Gemini SDK | Model execution (`gemini-1.5-flash` or `gemini-1.5-pro`) |
| **MCP** | Model Context Protocol | Exposes MongoDB resources as tools over stdio channels |

---

## ⚙️ Detailed Third-Party Setup Guides

### 1. Google Cloud Console (OAuth 2.0)
The Google Cloud console manages OAuth credentials and controls the authorization scopes needed for Google Sign-In.
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named `SecondMind` (or select an existing one).
3. From the left menu, select **APIs & Services** > **OAuth consent screen**:
   - Choose **External** and click **Create**.
   - Input your App name (`SecondMind`), User support email, and Developer contact information. Click **Save and Continue**.
   - Under **Scopes**, add `openid`, `.../auth/userinfo.email`, and `.../auth/userinfo.profile`.
4. Navigate to the **Credentials** tab:
   - Click **+ Create Credentials** > **OAuth client ID**.
   - Select **Web application** as the application type.
   - Name it `SecondMind Local Dev Client`.
   - Under **Authorized JavaScript origins**, add:
     - `http://localhost:5173`
   - Under **Authorized redirect URIs**, add:
     - `https://your-firebase-project-id.firebaseapp.com/__/auth/handler` (Copy this from your Firebase Auth Provider Settings).
   - Click **Create** and copy the **Client ID** and **Client Secret**.

### 2. Firebase Console (Auth & Admin SDK)
Firebase handles identity management and verifies OAuth tokens on the server.
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and link it to your existing Google Cloud project.
3. In the left panel, navigate to **Build** > **Authentication** and click **Get Started**.
4. Select the **Sign-in method** tab > **Add new provider** > Select **Google**:
   - Enable the provider.
   - Provide a project support email.
   - Under **Web SDK configuration**, paste your Google Cloud Web Client ID and Client Secret. Click **Save**.
5. Click the **Project Settings** gear icon (top left):
   - Under the **General** tab, scroll down to **Your apps**, click the web icon (`</>`), name your app `SecondMind Client`, and click **Register app**.
   - Copy the `firebaseConfig` keys (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).
6. Generate the **Firebase Admin SDK** credentials (Required by the backend to verify client tokens):
   - Go to **Project Settings** > **Service accounts**.
   - Click **Generate new private key** (JSON file). Download this file safely. You will extract parameters from it for your backend configuration.

### 3. MongoDB Atlas (Cloud Database)
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster (M0 tier) and name it `SecondMindCluster`.
3. Under **Database Access**, create a user (e.g. `secondmind-admin`) with **Read and write to any database** permissions.
4. Under **Network Access**, click **Add IP Address** and add `0.0.0.0/0` (allows connections from any deployment location; recommended for Google Cloud Run compatibility).
5. Go to **Database** > **Connect** > Choose **Drivers**:
   - Copy the connection string. Replace `<password>` with your database user's password.

### 4. Google AI Studio (Gemini API Key)
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Click **Create API Key**.
3. Choose your Google Cloud project and click **Create API Key in existing project**.
4. Copy the generated key.

---

## 📝 Environment Variable Reference

### Backend Env Parameters
Create `backend/.env` in the backend directory. It must contain the following variables:

```env
# The network port the Express server will listen on
PORT=5000

# The MongoDB Atlas connection string (use the drivers connection link)
MONGO_URI=mongodb+srv://secondmind-admin:<PASSWORD>@cluster.xxxx.mongodb.net/secondmind?retryWrites=true&w=majority

# Your Google AI Studio Gemini API Key
GEMINI_API_KEY=AIzaSy...

# The Gemini model to target (gemini-1.5-flash is optimized for speed)
GEMINI_MODEL=gemini-1.5-flash

# Firebase Admin SDK Project ID (extracted from service account JSON)
FIREBASE_PROJECT_ID=secondmind-xxxx

# Firebase Admin SDK Client Email (extracted from service account JSON)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@secondmind-xxxx.iam.gserviceaccount.com

# Firebase Admin SDK Private Key (extracted from service account JSON)
# Ensure the key is surrounded by double quotes and contains literal \n character string escapes.
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQ...\n-----END PRIVATE KEY-----\n"
```

### Frontend Env Parameters
Create `frontend/.env` in the frontend directory. It must contain the following variables:

```env
# The root endpoint of the local backend server API
VITE_API_URL=http://localhost:5000/api

# Firebase client initialization parameters (extracted from Web App registration Config)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=secondmind-xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=secondmind-xxxx
VITE_FIREBASE_STORAGE_BUCKET=secondmind-xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

---

## 🚀 Local Installation & Run Guide

### Step 1: Install & Launch Backend
1. Open a terminal in the `/backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the backend development server:
   ```bash
   npm run dev
   ```
   The backend will connect to MongoDB Atlas and start listening on `http://localhost:5000`.

### Step 2: Install & Launch Frontend
1. Open a new terminal in the `/frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Click the link in the terminal or open `http://localhost:5173/` in your browser.

---

## 🔌 Model Context Protocol (MCP) Integration

SecondMind exports a Model Context Protocol (MCP) server over standard input/output (stdio). This allows external LLMs running inside IDEs (like Cursor or Claude Desktop) to access your database memory logs and interact with your digital twin directly.

### Exposed Tools:
1. `list_memories`: Scans database collections and lists user document details, summaries, and source tags.
2. `get_digital_twin`: Returns the user's digital twin schema (skills, interests, strengths, weaknesses, and goals).
3. `add_memory_note`: Saves a reflection note or task entry directly to the database.

### 1. Claude Desktop Setup
Open your Claude Desktop config file (located at `%APPDATA%/Claude/claude_desktop_config.json` on Windows or `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS) and add the server config block:

```json
{
  "mcpServers": {
    "secondmind-mcp": {
      "command": "node",
      "args": [
        "C:/Users/Love/Desktop/Projects/secondmind/backend/scripts/mcp-server.js"
      ],
      "env": {
        "MONGO_URI": "mongodb+srv://secondmind-admin:<PASSWORD>@cluster.xxxx.mongodb.net/secondmind?retryWrites=true&w=majority"
      }
    }
  }
}
```
*Note: Ensure you write absolute paths with forward slashes `/` to prevent escape sequence issues on Windows.*

### 2. Cursor IDE Setup
1. Go to **Cursor Settings** > **Features** > **MCP**.
2. Click **+ Add New MCP Server**.
3. Configure the fields:
   - **Name**: `secondmind-mcp`
   - **Type**: `stdio`
   - **Command**: `node C:/Users/Love/Desktop/Projects/secondmind/backend/scripts/mcp-server.js`
4. Click **+ Add Env Variable** and add:
   - **Key**: `MONGO_URI`
   - **Value**: `mongodb+srv://secondmind-admin:<PASSWORD>@cluster.xxxx.mongodb.net/secondmind?retryWrites=true&w=majority`
5. Click **Save**.

---

## 📦 Production Deployment (Google Cloud Run)

To package and deploy the backend API to **Google Cloud Run** using containerization:

1. **Verify your local container configurations**:
   Review [Dockerfile](file:///c:/Users/Love/Desktop/Projects/secondmind/backend/Dockerfile) in the backend directory.
2. **Build and push the container** to Google Container Registry:
   ```bash
   cd backend
   gcloud builds submit --tag gcr.io/your-firebase-project-id/secondmind-backend
   ```
3. **Deploy the container** to Google Cloud Run:
   ```bash
   gcloud run deploy secondmind-backend \
     --image gcr.io/your-firebase-project-id/secondmind-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars MONGO_URI="mongodb+srv://secondmind-admin:<PASSWORD>@cluster.xxxx.mongodb.net/secondmind?retryWrites=true&w=majority" \
     --set-env-vars GEMINI_API_KEY="AIzaSyYourKeyHere" \
     --set-env-vars GEMINI_MODEL="gemini-1.5-flash" \
     --set-env-vars FIREBASE_PROJECT_ID="your-firebase-project-id" \
     --set-env-vars FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com" \
     --set-env-vars FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQ...\n-----END PRIVATE KEY-----\n"
   ```
4. Cloud Run will return a service URL (e.g. `https://secondmind-backend-706942069996.us-central1.run.app`).
5. Update your frontend `.env` config:
   ```env
   VITE_API_URL=https://secondmind-backend-706942069996.us-central1.run.app/api
   ```
6. Build your production frontend bundle and deploy to a hosting service (e.g., Firebase Hosting, Vercel, Netlify):
   ```bash
   cd frontend
   npm run build
   ```

---

## ❓ FAQ & Troubleshooting

### Q: The Google sign-in popup opens but immediately closes or remains blank
- **Reason**: This is often caused by Chrome's third-party cookie restrictions or browser security mechanisms blocking window communication across origins.
- **Fix**: The frontend configuration includes custom headers in `vite.config.js` to enable:
  - `Cross-Origin-Opener-Policy: same-origin-allow-popups`
  Verify that your popup blocker is disabled for `localhost`. If the issue persists, clear your browser cache or run the client in Incognito Mode.

### Q: MongoDB database connection error on Cloud Run deployment
- **Reason**: The backend server container was deployed, but Atlas blocked access from the dynamically changing Google Cloud IP range.
- **Fix**: Navigate to MongoDB Atlas > Network Access, edit your current rules, and configure the target IP whitelist to `0.0.0.0/0` (allow connections from anywhere). Cloud Run uses dynamic outbound IPs that cannot be predefined.

### Q: The console shows: "Firebase Admin SDK initialization failed"
- **Reason**: The private key payload `FIREBASE_PRIVATE_KEY` has incorrect formatting (e.g. quotes or escaped line breaks `\n` parsed as literal backslashes).
- **Fix**: In your backend configuration, the private key is parsed by replacing double backslashes:
  `process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')`.
  Make sure your local `.env` wraps the key in double quotes and keeps the `\n` sequence exactly as downloaded from the Firebase account credentials.

### Q: Gemini API Key returns 403 Forbidden or Quota exceeded errors
- **Reason**: Your Google AI Studio API key has expired, has incorrect permissions, or has run out of tokens.
- **Fix**: Create a new key in Google AI Studio and verify your billing limits or tier constraints.
