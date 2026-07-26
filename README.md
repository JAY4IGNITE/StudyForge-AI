# StudyForge AI

> **Adaptive Learning & AI-Powered Video Interview Intelligence Platform**

StudyForge AI is an enterprise-grade technical preparation and learning platform. Utilizing Generative AI, Retrieval-Augmented Generation (RAG), and computer vision telemetry, StudyForge AI delivers adaptive study sessions, live video interview simulations, code execution evaluation, and posture and speech coaching.

Whether preparing for software engineering roles, system architecture design, or executive technical evaluations, StudyForge AI functions as an intelligent mentor by identifying technical knowledge gaps, analyzing communication delivery, and generating adaptive improvement roadmaps.

---

## Key Features

### 1. AI Video Interview & Telemetry System
* **Real-Time Video Interviews**: Live interview simulations featuring conversational AI powered by NVIDIA NIM (Llama 3.1 70B).
* **Posture & Body Language Analysis**: Non-invasive posture scoring, shoulder alignment metrics, and slouching detection using MediaPipe.
* **Eye Contact & Attention Tracking**: Gaze direction monitoring, camera attention percentages, and looking-away telemetry.
* **Voice Delivery & Pacing Analytics**: Real-time evaluation of speaking speed (WPM), filler word breakdown (`um`, `uh`, `like`), silence/pause estimation, and speech clarity scoring.

### 2. Live Coding Interview Environment
* **Monaco Editor Integration**: Multi-language code editor supporting Python, TypeScript, JavaScript, Java, C++, Go, and Rust.
* **Automated Code Execution & Review**: Test case validation, execution metrics, and automated AI code reviews analyzing time and space complexity ($O(N)$).

### 3. Resume & Job Description Parser
* **Resume Extraction**: Automated extraction of technical skills, projects, and work experience from resumes with tailored question generation.
* **Job Description Alignment**: Custom interview question generation aligned to target role requirements and company cultures.

### 4. Socratic AI Mentor & Chatbot
* **Interactive Floating Assistant**: Context-aware AI mentor accessible across all application views for concept clarification, progressive hints, and study guidance.

### 5. Comprehensive Evaluation & Analytics
* **6-Axis Radar Reports**: Multi-dimensional evaluation covering Communication, Technical Accuracy, Confidence, Problem Solving, Coding, and STAR Behavioral structure.
* **ATS Keyword Recommendations**: Missing resume keyword recommendations and bullet point optimization.
* **Adaptive Learning Plans**: Personalized 7-day, 14-day, and 30-day preparation roadmaps based on historical performance metrics.

---

## Architecture & Technology Stack

### Frontend
* **Core**: React 18, TypeScript, Vite
* **Styling**: Tailwind CSS, Framer Motion
* **State & Data Fetching**: TanStack Query, Axios
* **UI Components**: Monaco Editor, Recharts, Lucide React
* **Computer Vision**: MediaPipe Tasks Vision

### Backend
* **Framework**: FastAPI (Python 3.11+)
* **Database & ODM**: MongoDB Atlas, Beanie ODM, Motor (AsyncIOMotorClient)
* **Authentication**: JWT (JSON Web Tokens), bcrypt hashing
* **Communication**: WebSockets, RESTful API APIs
* **Transactional Email**: Brevo API

### AI & Intelligence Engine
* **Inference Engine**: NVIDIA NIM (`meta/llama-3.1-70b-instruct`)
* **Vector Engine & RAG**: ChromaDB / Retrieval-Augmented Generation
* **Third-Party Agent Integration**: Lyzr AI Studio

---

## Project Structure

```text
StudyForge-AI/
├── backend/
│   ├── app/
│   │   ├── api/          # REST & WebSocket route handlers
│   │   ├── core/         # Security, configuration, and logging
│   │   ├── db/           # MongoDB initialization and seeding
│   │   ├── models/       # Beanie document models
│   │   └── services/     # AI Engine, Resume Parser, and Voice/Vision analyzers
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

## Core Operational Workflow

```text
               +----------------------------------+
               |  Candidate Selects Interview Mode |
               | (Technical, Coding, Resume, JD)  |
               +----------------------------------+
                                │
                                ▼
               +----------------------------------+
               |  AI Interviewer Asks Question    |
               |   (NVIDIA NIM Llama 3.1 70B)    |
               +----------------------------------+
                                │
                                ▼
               +----------------------------------+
               | Candidate Responds via Video/Mic |
               |  or Monaco Code Editor           |
               +----------------------------------+
                                │
                                ▼
               +----------------------------------+
               | Real-Time Speech & Vision Engine |
               | (WPM, Fillers, MediaPipe Posture)|
               +----------------------------------+
                                │
                                ▼
               +----------------------------------+
               | Executive Evaluation & Report    |
               | (Radar Chart, ATS, 7-Day Plan)   |
               +----------------------------------+
```

---

## Environment Setup & Installation

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **Python**: v3.11.0 or higher
* **MongoDB**: MongoDB Atlas Cluster connection URI

### 1. Clone the Repository
```bash
git clone https://github.com/JAY4IGNITE/StudyForge-AI.git
cd StudyForge-AI
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
APP_NAME="StudyForge AI"
API_VERSION="v1"
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/?appName=Cluster0"
MONGODB_DATABASE="studyforge"
JWT_ACCESS_SECRET="your-access-secret-key"
NVIDIA_NIM_API_KEY="nvapi-your-nvidia-nim-key"
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

## Deployment

The repository includes a standardized `render.yaml` configuration for automated deployment on Render as a single unified service:

* **Build Command**: `npm install --prefix frontend && npm run build --prefix frontend && pip install -r backend/requirements.txt`
* **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

---

## License

This project is distributed under the [MIT License](LICENSE).

---

## Author & Contact

**Jaya Sai Krishna Vasamsetti**  
* GitHub: [@JAY4IGNITE](https://github.com/JAY4IGNITE)  
* Email: [aistudyforge@gmail.com](mailto:aistudyforge@gmail.com)
