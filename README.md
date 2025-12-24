# 💰 Budget Tracker – Frontend

This is the **frontend** of the Budget Tracker application built using **React (Vite)**.  
It provides user authentication, expense management UI, and dashboard views.

The frontend communicates with a **FastAPI backend** via REST APIs.

---

## 🚀 Live Demo

👉 https://jolly-brigadeiros-470b0e.netlify.app

---

## 🛠️ Tech Stack

- React (Vite)
- React Router DOM
- Tailwind CSS
- Fetch API
- Netlify (Deployment)

---

## ✨ Features

- User Login & Registration
- Protected Dashboard
- Add / Edit / Delete Expenses
- Category & Summary views
- JWT-based authentication
- SPA routing with React Router

---

## 📁 Project Structure
budget_tracker_frontend/
├── public/
│ └── _redirects
├── src/
│ ├── pages/
│ │ ├── Login.jsx
│ │ ├── Register.jsx
│ │ └── Dashboard.jsx
│ ├── services/
│ │ ├── api.js
│ │ └── auth.js
│ ├── App.jsx
│ └── main.jsx
├── index.html
├── vite.config.js
└── package.json

---

## 🔐 Environment Variables

Create a `.env` file (not committed to GitHub):

```env
VITE_API_BASE_URL=https://budget-tracker-backend-production-5826.up.railway.app
```

---

## 🧑‍💻 Run Frontend Locally

### Prerequisites
- Node.js (v18 or later recommended)
- Backend server running (see backend README)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/<frontend-repo>.git

# 2. Go to project directory
cd budget_tracker_frontend

# 3. Install dependencies
npm install

# 4. Create environment file
cp .env.example .env
Update .env with your backend URL:
VITE_API_BASE_URL=http://localhost:8000

# 5. Start development server
npm run dev
Frontend will be available at:
http://localhost:5173

```

---

## 🔀 SPA Routing (Netlify)

This application uses client-side routing with **React Router**.

To ensure routes like `/login` and `/dashboard` work correctly on page refresh
in Netlify production, a redirect rule is configured:

**File:** `public/_redirects`
/* /index.html 200

This ensures all routes are handled by `index.html`, allowing React Router
to manage navigation.


