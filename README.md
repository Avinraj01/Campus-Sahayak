<div align="center">

# 🎓 Campus Sahayak

### AI-Powered Multilingual Campus Assistant

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=24&duration=2800&pause=900&color=6C63FF&center=true&vCenter=true&width=850&lines=24%2F7+Campus+Support;Multilingual+Conversational+AI;Student+Services+%2B+AI;Smart+Campus+Automation" alt="Campus Sahayak animation" />

<br />

<a href="https://campus-management-system-frontend.vercel.app"><img src="https://img.shields.io/badge/🚀_Live_Prototype-Campus_Sahayak-6C63FF?style=for-the-badge" /></a>
<a href="https://github.com/Avinraj01/Campus-Sahayak"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" /></a>

<br /><br />

<img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/FastAPI-Python-009688?style=flat-square&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/OpenRouter-AI-6C63FF?style=flat-square" />
<img src="https://img.shields.io/badge/Vercel-Frontend-black?style=flat-square&logo=vercel" />
<img src="https://img.shields.io/badge/Render-Backend-46E3B7?style=flat-square&logo=render&logoColor=black" />

<br /><br />

**Campus Sahayak** is a multilingual, AI-powered campus assistance platform that brings conversational AI, authentication, student services, notices, forms and complaints into one digital experience.

</div>

---

## 🌐 What Problem Does It Solve?

Students repeatedly need answers about fees, scholarships, timetables, notices, forms, complaints and administrative procedures. Traditional support depends heavily on office hours and repetitive staff responses.

**Campus Sahayak turns these repetitive interactions into a 24/7 conversational self-service experience.**

| Challenge | Solution |
|---|---|
| 🔁 Repetitive questions | 🤖 AI-powered assistance |
| 🌐 Language barriers | 🗣️ Multilingual interaction |
| 📄 Scattered services | 🏫 Unified campus portal |
| ⏳ Office-hour dependency | ⚡ 24/7 digital access |
| 🧭 Difficult navigation | 💬 Conversational guidance |

---

# ✨ Core Features

- 🤖 **AI Campus Assistant** for campus-related questions
- 🌐 **Multilingual support**: English, Hindi, Gujarati, Telugu, Rajasthani and Urdu
- 🔐 **JWT authentication** with password hashing
- 👨‍🎓 **Student portal** and authenticated services
- 📝 **Complaint management**
- 📄 **Form submission**
- 📢 **Campus notices**
- 💬 **Chat history / sessions**
- ☁️ **Vercel + Render deployment**
- 🍃 **MongoDB Atlas persistence**

---

# 🧭 High-Level Mind Map

```mermaid
mindmap
  root((🎓 Campus Sahayak))
    Users
      Students
      Faculty
      Administrators
    AI Assistant
      Multilingual Chat
      Context
      Intent Handling
      AI Responses
    Campus Services
      Notices
      Forms
      Complaints
      Academic Information
      Fees
      Scholarships
    Security
      JWT
      Password Hashing
      CORS
      Environment Secrets
    Data
      Users
      Conversations
      Complaints
      Forms
      Notices
    Deployment
      Vercel
      Render
      MongoDB Atlas
```

---

# 🏗️ System Architecture

### Production architecture

```mermaid
flowchart LR
    USER[👤 Student / Faculty] --> FE[⚛️ React Frontend]
    FE --> V[▲ Vercel]
    V --> API[🚀 FastAPI Backend]
    API --> AUTH[🔐 JWT Auth]
    API --> DB[(🍃 MongoDB Atlas)]
    API --> CHAT[🤖 AI Chat Service]
    CHAT --> OR[OpenRouter / LLM]
    API --> SERVICES[🏫 Campus Services]
    SERVICES --> DB
```

### Request flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as React/Vercel
    participant B as FastAPI/Render
    participant D as MongoDB
    participant AI as OpenRouter

    U->>F: Ask / Login / Submit Service
    F->>B: HTTPS API Request
    B->>B: Validate JWT / Request
    B->>D: Read or Write Data
    B->>AI: AI Query (when required)
    AI-->>B: Generated Response
    B-->>F: JSON Response
    F-->>U: UI Update
```

---

# 🔄 End-to-End AI Workflow

```mermaid
flowchart TD
    A[💬 User Query] --> B[🌐 Detect / Select Language]
    B --> C[🧠 Process Query]
    C --> D{❓ Campus Information Available?}
    D -->|Yes| E[📚 Use Campus Context]
    D -->|AI Required| F[🤖 Send to LLM]
    E --> G[📝 Build Response]
    F --> G
    G --> H[🔐 Apply User / Session Context]
    H --> I[💬 Return Answer]
    I --> J[(🗄️ Store Conversation)]
```

---

# 🧠 AI Layer

```mermaid
flowchart LR
    Q[User Question] --> LANG[Language Handling]
    LANG --> CONTEXT[Conversation Context]
    CONTEXT --> ROUTER{Query Handling}
    ROUTER --> CAMPUS[Campus Information]
    ROUTER --> LLM[OpenRouter LLM]
    CAMPUS --> RESPONSE[Response]
    LLM --> RESPONSE
    RESPONSE --> USER[User]
```

> The current deployed chatbot uses the configured OpenRouter model. Any additional RAG, vector search, voice, WhatsApp or Telegram components should be treated as future extensions unless implemented in the repository.

---

# 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 | User interface |
| Styling | CSS / Tailwind where used | Responsive UI |
| HTTP | Axios | API communication |
| Backend | Python + FastAPI | REST API |
| Authentication | JWT + bcrypt/passlib | Secure sessions and passwords |
| Database | MongoDB Atlas | Persistent application data |
| AI | OpenRouter / configured LLM | Conversational responses |
| Deployment | Vercel | Frontend hosting |
| Deployment | Render | Backend hosting |
| Version Control | Git + GitHub | Source control |

---

# 🧩 API Surface

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Register user |
| `POST` | `/api/auth/login` | Authenticate user |
| `POST` | `/api/chat` | Send AI query |
| `GET` | `/api/chat/history/{session_id}` | Get chat history |
| `POST` | `/api/complaints` | Create complaint |
| `GET` | `/api/complaints` | Get user complaints |
| `POST` | `/api/forms` | Submit form |
| `GET` | `/api/forms` | Get submitted forms |
| `GET` | `/api/notices` | Get active notices |

API documentation is available through FastAPI's `/docs` endpoint on the deployed backend.

---

# 🗃️ Data Model

```mermaid
erDiagram
    USER ||--o{ COMPLAINT : submits
    USER ||--o{ FORM : submits
    USER ||--o{ CONVERSATION : creates

    USER {
        string id
        string email
        string full_name
        string user_type
    }

    COMPLAINT {
        string id
        string user_id
        string category
        string status
    }

    FORM {
        string id
        string user_id
        string form_type
        string status
    }

    CONVERSATION {
        string session_id
        string user_id
        string message
        string response
    }
```

> Conceptual model only. It does not claim to document every MongoDB field.

---

# 🧪 Test Cases

| ID | Test | Expected Result |
|---|---|---|
| TC-01 | Register with valid details | User is created |
| TC-02 | Register duplicate account | Registration is rejected |
| TC-03 | Login with valid credentials | JWT returned and portal opens |
| TC-04 | Login with wrong password | Authentication rejected |
| TC-05 | Protected API without token | Request rejected |
| TC-06 | Ask normal chatbot question | AI response returned |
| TC-07 | Ask in supported language | Response follows language context |
| TC-08 | Retrieve chat history | Session history returned |
| TC-09 | Submit complaint | Complaint stored |
| TC-10 | Retrieve complaints | User complaints returned |
| TC-11 | Submit form | Form stored successfully |
| TC-12 | Retrieve notices | Active notices returned |
| TC-13 | Allowed CORS origin | Browser request succeeds |
| TC-14 | Invalid CORS origin | Browser blocks request |
| TC-15 | AI provider failure | Controlled fallback/error returned |
| TC-16 | Production frontend | Application loads |
| TC-17 | Production API | Frontend reaches backend |
| TC-18 | Logout / token removal | Protected session becomes unavailable |

### Smoke Test

```mermaid
flowchart LR
    A[Open App] --> B[Sign Up]
    B --> C[Login]
    C --> D[Dashboard]
    D --> E[Ask AI]
    E --> F[Check Chat History]
    F --> G[Submit Complaint]
    G --> H[Check Forms / Notices]
```

> These are documented validation cases. They are not a claim that every case is automatically executed in CI.

---

# 🎥 User Experience

### 🌐 Live Prototype

**[Open Campus Sahayak](https://campus-management-system-frontend.vercel.app)**

### ▶️ User Experience Video

<div align="center">

<a href="https://www.youtube.com/shorts/yBuFif_eZp8">
  <img src="https://img.youtube.com/vi/yBuFif_eZp8/maxresdefault.jpg" alt="Campus Sahayak User Experience Demo" width="700" />
</a>

<br />

**▶️ Click the thumbnail to watch the User Experience demo on YouTube**

</div>

### 🧪 Prototype / Demo

**Prototype / demo:** `Add your final prototype URL here`

---

# 📂 Repository Structure

```text
Campus-Sahayak/
│
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   ├── render.yaml
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vercel.json
│   └── .env.example
│
├── docs/
├── .gitignore
└── README.md
```

---

# ⚙️ Local Development

## Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python server.py
```

Backend: `http://localhost:8000`

Docs: `http://localhost:8000/docs`

## Frontend

```bash
cd frontend
npm install --legacy-peer-deps
cp .env.example .env
npx craco start
```

Frontend: `http://localhost:3000`

---

# 🔑 Environment Variables

### Backend

```env
MONGO_URI=your-mongodb-uri
DB_NAME=campusDB
JWT_SECRET=your-jwt-secret
OPENROUTER_API_KEY=your-openrouter-api-key
CORS_ORIGINS=http://localhost:3000
```

### Frontend

```env
REACT_APP_BACKEND_URL=http://localhost:8000/api
PORT=3000
```

> **Never commit real API keys, MongoDB credentials or JWT secrets.** Store secrets in local `.env` files and deployment environment variables.

---

# ☁️ Deployment

```mermaid
flowchart LR
    GH[GitHub] --> V[▲ Vercel]
    GH --> R[🚀 Render]
    V --> FE[React Frontend]
    R --> API[FastAPI Backend]
    API --> DB[(MongoDB Atlas)]
    API --> AI[OpenRouter]
```

| Component | Production Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| AI Provider | OpenRouter |
| Source | GitHub |

---

# 🔐 Security

- 🔑 JWT authentication
- 🔒 Password hashing
- 🌐 CORS controls
- 🔐 Environment-based secrets
- 🚫 No production API keys in source code
- 🧱 Protected API endpoints

### Production hardening roadmap

```text
RBAC → Rate Limiting → Input Validation → Audit Logs → Monitoring → Secret Rotation
```

---

# 🚀 Roadmap

```text
AI
├── Better multilingual evaluation
├── Context / RAG improvements
└── AI response evaluation

Campus Services
├── Richer student portal
├── Admin content management
└── More service workflows

Platform
├── Automated tests
├── CI/CD
├── Analytics
└── Stronger RBAC

Channels
├── WhatsApp
├── Telegram
└── Voice interface
```

---

# 🏆 Smart India Hackathon Context

- **Problem Statement:** Language Agnostic Chatbot
- **PS ID:** 25104
- **Theme:** Smart Education
- **Category:** Software
- **Team:** SuperNovaZ
- **Project:** Campus Sahayak

---

# 👨‍💻 Author

<div align="center">

**Avin Raj**  
Computer Science & Engineering

Built as part of the **SuperNovaZ** Smart India Hackathon project.

<br />

⭐ If you find the project useful, consider starring the repository.

</div>

---

<div align="center">

### 🎓 Campus Sahayak

**Ask less. Find faster. Get things done.**

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=20&duration=3000&pause=1000&color=6C63FF&center=true&vCenter=true&width=700&lines=Multilingual+AI;Smart+Education;Campus+Automation;Student+First" alt="Campus Sahayak animation" />

</div>
