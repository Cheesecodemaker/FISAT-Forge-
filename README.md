# FISAT Forge

FISAT Forge is a centralized networking platform designed to bridge the gap between students and alumni of the **Federal Institute of Science and Technology (FISAT)**. It provides mentorship, career opportunities, and continuous engagement by offering a structured alternative to scattered social media groups and alumni meetups.

---

## 🚀 Features

- Secure Authentication – Role-based login for Students, Alumni, and Admins  
- Profile Management – Showcase skills, achievements, and career interests  
- Networking Tools – Direct messaging, follow/unfollow system  
- Discussion Forums – Share blogs, guides, and knowledge resources  
- Opportunity Hub – Alumni post jobs/internships; students apply directly  
- Achievements Showcase – Highlight notable alumni achievements  
- Search & Filtering – Find people and opportunities by skills, industry, or location  
- Admin Dashboard – Manage users, content, and moderation  

---

## 🏗️ Tech Stack

- Frontend: React.js, React Router DOM, JavaScript, CSS  
- Backend: Node.js, Express.js, Socket.io  
- Database: MongoDB Atlas with Mongoose ODM  
- Deployment: Backend → AWS / Render, Frontend → Vercel  
- Other Tools: Multer (file uploads), Axios (HTTP client), Express-Session (sessions), Node-Cron (scheduling)  

---

## 📂 Project Structure

    fisat-forge/
    ├── backend/           # Node.js + Express server
    │   ├── controllers/   # Business logic
    │   ├── models/        # Mongoose schemas
    │   ├── routes/        # API endpoints
    │   ├── middlewares/   # Auth, validation, etc.
    │   └── utils/         # Helpers and utilities
    ├── frontend/          # React.js client
    │   ├── public/
    │   ├── src/
    │   │   ├── components/  # Reusable UI components
    │   │   ├── pages/       # Screens (Login, Dashboard, Forum, etc.)
    │   │   ├── services/    # API calls and auth helpers
    │   │   └── hooks/       # Custom hooks
    ├── docs/               # Screenshots, diagrams, report
    ├── .env.example
    ├── package.json
    └── README.md

---

## ⚙️ Installation & Setup

1. Clone  
    git clone https://gitlab.com/group-42592305/fisat-forge.git  
    cd fisat-forge  

2. Backend  
    cd backend  
    npm install  
    cp .env.example .env   # fill values (MONGO_URI, JWT_SECRET, etc.)  
    npm run dev            # or npm start  
    Runs on http://localhost:5000  

3. Frontend  
    cd ../frontend  
    npm install  
    cp .env.example .env   # set REACT_APP_API_BASE_URL  
    npm start  
    Runs on http://localhost:3000  

---

## 🔑 Environment Variables

Backend (`backend/.env`)  
    PORT=5000  
    MONGO_URI=your_mongodb_connection_string  
    JWT_SECRET=your_jwt_secret  
    SESSION_SECRET=your_session_secret  

Frontend (`frontend/.env`)  
    REACT_APP_API_BASE_URL=http://localhost:5000/api  

---

## 📡 API Summary

- POST /api/auth/register — register user  
- POST /api/auth/login — login, returns JWT / session  
- GET /api/profile/:id — fetch user profile  
- PUT /api/profile/:id — update user profile  
- POST /api/posts — create community post  
- GET /api/posts — get all posts  
- POST /api/jobs — post a job (alumni only)  
- GET /api/jobs — list jobs  
- POST /api/follow — follow a user  
- POST /api/unfollow — unfollow a user  
- POST /api/upload — upload images/resumes  

---

## 🧪 Testing

- Unit tests: Jest & React Testing Library (frontend), Mocha/Chai (backend)  
- Integration tests: Backend API + frontend flows  
- Security: Role-based access, XSS/CSRF prevention  
- Load testing: Simulated concurrent users  

---

## 🚀 Deployment Notes

- Use environment-specific `.env` values  
- MongoDB Atlas for production DB  
- Serve frontend on Vercel, backend on AWS/Render  
- Use HTTPS and secure credentials  
- Store large files in Cloudinary/S3, not DB  

---

## 📌 Future Scope

- Mobile App (React Native)  
- AI-powered job recommendations  
- LinkedIn OAuth verification  
- Event calendar with RSVP  

---
