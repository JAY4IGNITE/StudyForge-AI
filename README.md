
<div align="center">
  <img src="https://img.icons8.com/color/96/000000/artificial-intelligence.png" alt="StudyForge AI Logo" />
  <h1>StudyForge AI</h1>
  <p><strong>Adaptive Learning & AI-Powered Video Interview Intelligence Platform</strong></p>

  <p>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18.0-blue.svg?logo=react&logoColor=white" alt="React" /></a>
    <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white" alt="FastAPI" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E.svg?logo=supabase&logoColor=white" alt="PostgreSQL" /></a>
    <a href="https://developer.nvidia.com/nim"><img src="https://img.shields.io/badge/NVIDIA_NIM-Llama_3.1-76B900.svg?logo=nvidia&logoColor=white" alt="NVIDIA" /></a>
  </p>
</div>

StudyForge AI is an enterprise-grade technical preparation and learning platform. Utilizing Generative AI, Retrieval-Augmented Generation (RAG), and computer vision telemetry, StudyForge AI delivers adaptive study sessions, live video interview simulations, code execution evaluation, and posture and speech coaching.

Whether preparing for software engineering roles, system architecture design, or executive technical evaluations, StudyForge AI functions as an intelligent mentor by identifying technical knowledge gaps, analyzing communication delivery, and generating adaptive improvement roadmaps.

---

## ✨ Key Features

### 1. AI Video Interview & Telemetry System
* **Real-Time Video Interviews**: Live interview simulations featuring conversational AI powered by NVIDIA NIM (Llama 3.1 70B) streamed directly to the frontend via WebSockets.
* **Posture & Body Language Analysis**: Non-invasive posture scoring, shoulder alignment metrics, and slouching detection using MediaPipe.
* **Eye Contact & Attention Tracking**: Gaze direction monitoring, camera attention percentages, and looking-away telemetry.
* **Voice Delivery & Pacing Analytics**: Real-time evaluation of speaking speed (WPM), filler word breakdown (`um`, `uh`, `like`), silence/pause estimation, and speech clarity scoring.

### 2. Resume Parsing & ATS Intelligence
* **Cloudflare R2 Integration**: Fast, secure, and highly scalable cloud storage for uploading resumes and cover letters.
* **Resume Extraction**: Automated extraction of technical skills, projects, and work experience from resumes using PyMuPDF and Llama 3.1.
* **ATS Keyword Recommendations**: Missing resume keyword recommendations and bullet point optimization compared against provided Job Descriptions.
* **Job Description Alignment**: Custom interview question generation aligned to target role requirements and company cultures.

### 3. Live Coding Interview Environment
* **Monaco Editor Integration**: Multi-language code editor supporting Python, TypeScript, JavaScript, Java, C++, Go, and Rust.
* **Automated Code Execution & Review**: Test case validation, execution metrics, and automated AI code reviews analyzing time and space complexity ($O(N)$).

### 4. Socratic AI Mentor & Chatbot
* **Interactive Floating Assistant**: Context-aware AI mentor accessible across all application views for concept clarification, progressive hints, and study guidance.

### 5. Comprehensive Evaluation & Analytics
* **6-Axis Radar Reports**: Multi-dimensional evaluation covering Communication, Technical Accuracy, Confidence, Problem Solving, Coding, and STAR Behavioral structure.
* **Adaptive Learning Plans**: Personalized 7-day, 14-day, and 30-day preparation roadmaps based on historical performance metrics.

---

## 🛠️ Architecture & Technology Stack

### Frontend
* **Core**: React 18, TypeScript, Vite
* **Styling**: Tailwind CSS, Framer Motion
* **State & Data Fetching**: TanStack Query, Axios
* **UI Components**: Monaco Editor, Recharts, Lucide React
* **Computer Vision**: MediaPipe Tasks Vision

### Backend
* **Framework**: FastAPI (Python 3.11+)
* **Database & ODM**: Supabase PostgreSQL, SQLAlchemy ORM, asyncpg
* **Authentication**: Local (JWT + bcrypt) & OAuth (Google/GitHub integration)
* **Communication**: WebSockets (Bidirectional AI Streaming), RESTful API
* **Cloud Storage**: Cloudflare R2 (S3-compatible)
* **Transactional Email**: Brevo API

### AI & Intelligence Engine
* **Inference Engine**: NVIDIA NIM (`meta/llama-3.1-70b-instruct`)
* **Vector Engine & RAG**: ChromaDB / Retrieval-Augmented Generation
* **Third-Party Agent Integration**: Lyzr AI Studio

---

## 📁 Project Structure

```text
StudyForge-AI/
├── backend/
│   ├── app/
│   │   ├── api/          # REST & WebSocket route handlers
│   │   ├── core/         # Security, OAuth, configuration, and logging
│   │   ├── db/           # PostgreSQL initialization and seeding
│   │   ├── models/       # Beanie document models
│   │   └── services/     # ATS Scanner, R2 Storage, AI Engine, Resume Parser
│   └── venv/
├── frontend/
│   ├── src/
│   │   ├── app/          # Router & Authentication context
│   │   ├── components/   # Shared UI & Chatbot layout components
│   │   ├── features/     # Dashboard, Interviews, Practice, and Reports
│   │   └── lib/          # Axios HTTP client configuration
│   ├── package.json
│   └── vite.config.ts
├── render.yaml           # Deployment configuration blueprint
└── README.md
```

---

## 🚀 Environment Setup & Installation

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **Python**: v3.11.0 or higher
* **PostgreSQL**: Supabase PostgreSQL Cluster connection URI

### 1. Clone the Repository
```bash
git clone https://github.com/JAY4IGNITE/StudyForge-AI.git
cd StudyForge-AI
```

### 2. Configure Environment Variables
Create a `.env` file in the project root containing the following configurations:

```env
# Core API & Database
APP_NAME="StudyForge AI"
API_VERSION="v1"
DATABASE_URL="postgresql+asyncpg://<username>:<password>@<host>:6543/postgres"

# Security (JWT & OAuth)
JWT_ACCESS_SECRET="your-access-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# AI & LLM Endpoints
NVIDIA_NIM_API_KEY="nvapi-your-nvidia-nim-key"

# Cloud Storage (Cloudflare R2 for Resumes)
R2_ACCOUNT_ID="your-cloudflare-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key"
R2_SECRET_ACCESS_KEY="your-r2-secret-key"
R2_BUCKET_NAME="studyforge-bucket"
R2_ENDPOINT="https://<account-id>.r2.cloudflarestorage.com"

# Mailing (Brevo)
BREVO_API_KEY="your-brevo-api-key"
BREVO_SENDER_EMAIL="your-verified-email@domain.com"
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## ☁️ Deployment

The repository includes a standardized `render.yaml` configuration for automated deployment on Render as a single unified service:

* **Build Command**: `npm install --prefix frontend && npm run build --prefix frontend && pip install -r backend/requirements.txt`
* **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

---

## 📬 Author & Contact

**Jaya Sai Krishna Vasamsetti**  
* GitHub: [@JAY4IGNITE](https://github.com/JAY4IGNITE)  
* Email: [aistudyforge@gmail.com](mailto:aistudyforge@gmail.com)
