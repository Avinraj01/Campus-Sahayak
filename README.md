# 🎓 Campus Management System  

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) 
[![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python&logoColor=white)](https://www.python.org/) 
[![React](https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white)](https://reactjs.org/) 
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb&logoColor=white)](https://www.mongodb.com/) 
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100.0-lightblue?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/) 
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel&logoColor=white)](https://vercel.com/) 
[![Render](https://img.shields.io/badge/Render-Deploy-orange?logo=render&logoColor=white)](https://render.com/)  

A **comprehensive campus management platform** with AI-powered **multilingual chat assistance**, built for modern academic institutions.  

This system helps students, faculty, and administrators manage academics, communication, and campus services through a **secure and user-friendly platform**.  

---

## 🌐 High-Level Mindmap  

```mermaid
mindmap
  root((Campus Management System))
    Frontend
      React
      Tailwind CSS
      Axios
      Vercel Deployment
    Backend
      FastAPI
      JWT Authentication
      AI Chat (OpenRouter/DeepSeek)
      MongoDB Integration
      Render Deployment
    Database
      MongoDB Atlas
      Users
      Complaints
      Forms
      Notices
      Conversations
    Features
      Authentication
      AI-Powered Chat
      Student Portal
      Complaints & Forms
      Notice Board
      Academic Calendar
      Communication Tools
    Security
      JWT Tokens
      Password Hashing
      API Key Protection
      CORS Policy
````

---

## 🚀 Features

✅ **Authentication System** – Multi-user (student, faculty, general) with secure JWT tokens
✅ **AI-Powered Chat Assistant** – Multilingual support (English, Hindi, Gujarati, Telugu, Rajasthani, Urdu)
✅ **Student Portal** – Profiles, academic records, fee tracking, documents
✅ **Campus Services** – Complaints, forms, notices, academic calendar
✅ **Communication Tools** – Integrated contact info, WhatsApp & social media support
✅ **Security First** – Password hashing, API key protection, CORS, SSL/TLS

---

## 🏗️ Project Structure

```
Campus-Management-System/
├── backend/          # FastAPI backend
│   ├── server.py
│   ├── requirements.txt
│   ├── render.yaml
│   └── .env.example
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── utils/api.js
│   │   └── api/ (Vercel functions)
│   ├── vercel.json
│   ├── package.json
│   └── .env.example
├── documentation/    # Additional docs
└── README.md
```

---

## ⚙️ Tech Stack

| Frontend                                                                         | Backend                                                                                          | Database                                                                                   | Deployment                                                                                                                                                                              | AI                       |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| ![React](https://img.shields.io/badge/React-18-blue?logo=react\&logoColor=white) | ![FastAPI](https://img.shields.io/badge/FastAPI-0.100.0-lightblue?logo=fastapi\&logoColor=white) | ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb\&logoColor=white) | ![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel\&logoColor=white) <br> ![Render](https://img.shields.io/badge/Render-Deploy-orange?logo=render\&logoColor=white) | OpenRouter AI / DeepSeek |

---

## 🖥️ Local Development Setup

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python server.py
```

🔗 Backend will run on: [http://localhost:8000](http://localhost:8000)

### Frontend Setup

```bash
cd frontend
npm install --legacy-peer-deps
cp .env.example .env
npx craco start
```

🔗 Frontend will run on: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

### Backend (.env)

```env
MONGO_URI=your-mongodb-uri
DB_NAME=campusDB
JWT_SECRET=your-jwt-secret
OPENROUTER_API_KEY=your-openrouter-api-key
DEEPSEEK_API_KEY=your-deepseek-api-key
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env)

```env
REACT_APP_BACKEND_URL=http://localhost:8000/api
PORT=3000
```

---

## 📡 API Endpoints

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register new user   |
| POST   | `/api/auth/login`    | User login          |
| POST   | `/api/chat`          | AI chat assistant   |
| GET    | `/api/chat/history`  | Get chat history    |
| POST   | `/api/complaints`    | Submit complaint    |
| GET    | `/api/complaints`    | Get user complaints |
| POST   | `/api/forms`         | Submit form         |
| GET    | `/api/forms`         | Get submitted forms |
| GET    | `/api/notices`       | Get campus notices  |

---

## 🛠️ Troubleshooting

1. **CORS Errors** → Update `CORS_ORIGINS` in backend `.env`
2. **MongoDB Issues** → Ensure DB is running and URI is correct
3. **API Key Errors** → Verify OpenRouter/DeepSeek keys
4. **Frontend Not Connecting** → Check `REACT_APP_BACKEND_URL` in `.env`

---

## 🚀 Deployment

* **Frontend** → Vercel (`vercel.json` for rewrites & proxy)
* **Backend** → Render (`render.yaml` for config & environment)

🔗 API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 👨‍💻 Author

**Avin Raj** – Developer of Campus Management System
📌 Built with passion for students, faculty & institutions ✨

