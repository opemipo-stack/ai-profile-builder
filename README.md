# Submission Overview
-  Live Demo: https://ai-profile-builder.vercel.app/
-  Summary Doc: [Google Doc/PDF Link Here]
-  Built with: Next.js, Node.js, OpenAI, GitHub API, PDL


# Profile Enrichment Platform

A full-stack application that enriches user profiles by combining data from GitHub, People Data Labs, and OpenAI APIs.

# AI Agent Profile Builder

An AI-powered onboarding agent that automatically creates user profiles using publicly available data.  
Instead of forcing users to manually fill out long forms, the system pulls information from sources like GitHub, Clearbit, and AI enrichment, then builds a structured, editable profile.

---

##  Case Study Summary

### Why
Traditional onboarding requires users to fill long forms, leading to high drop-off rates and incomplete data.  
We want to **reduce friction**, **increase sign-up completion**, and **deliver richer user profiles from day one**.

### What
An **AI Agent Profile Builder** that:
- Pulls real data from public sources (GitHub, Clearbit, etc.).
- Auto-generates 70–90% of a new user’s profile.
- Prompts only for missing info (minimal questions).
- Provides an editable profile page for final touches.

### Who
- **Startups & platforms** looking to improve onboarding.  
- **Developers, creators, professionals** who benefit from fast, accurate profiles.  
- **Users** who want seamless, delightful onboarding with less effort.

### How
- **Frontend**: Next.js + TailwindCSS (deployed on Vercel).  
- **Backend**: Node.js/Next.js API routes.  
- **Data Sources**:  
  - GitHub API (public repos, bio, languages).  
  - Clearbit API (enrichment from name/email).  
  - OpenAI (fallback profile synthesis if no public data). 

##  Features

- **Frontend**: Next.js with App Router, TypeScript, and TailwindCSS
- **Backend**: Node.js + Express API server
- **Profile Enrichment**: Combines data from multiple sources:
  - GitHub API (repositories, bio, stats)
  - People Data Labs (professional data, work history)
  - OpenAI (AI-powered summaries and insights)
- **Responsive Design**: Beautiful profile cards with edit functionality
- **Error Handling**: Graceful fallbacks when APIs are unavailable

## 📁 Project Structure

```
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/       # App Router pages and layouts
│   │   └── components/ # Reusable React components
│   ├── package.json
│   └── tailwind.config.js
├── backend/           # Express.js backend API
│   ├── src/
│   │   ├── routes/    # API route handlers
│   │   ├── services/  # External API integrations
│   │   └── utils/     # Utility functions
│   ├── package.json
│   └── server.js
├── .env.example       # Environment variables template
└── README.md
```

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` in the root directory and fill in your API keys:

```bash
cp .env.example .env
```

Required API keys:
- **GITHUB_API_KEY**: Get from [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
- **PDL_API_KEY**: Get from [People Data Labs](https://www.peopledatalabs.com/)
- **OPENAI_API_KEY**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)

### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
## locally
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
## production
- Frontend: vercel
- Backend API: render

## 🔧 API Endpoints

### POST /api/enrich
Enriches a user profile with data from multiple sources.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

**Response:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "headline": "Senior Software Engineer",
  "company": "Tech Corp",
  "location": "San Francisco, CA",
  "bio": "Passionate developer with 5+ years experience...",
  "profileImage": "https://avatars.githubusercontent.com/u/123456",
  "socials": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "twitter": "https://twitter.com/johndoe"
  },
  "skills": ["JavaScript", "React", "Node.js"],
  "workHistory": [
    {
      "company": "Tech Corp",
      "title": "Senior Software Engineer",
      "duration": "2020-Present"
    }
  ],
  "githubStats": {
    "repos": 25,
    "stars": 150,
    "followers": 45
  },
  "summary": "AI-generated professional summary..."
}
```

## 🎨 Features

- **Smart Profile Enrichment**: Combines multiple data sources for comprehensive profiles
- **Responsive Design**: Works perfectly on desktop and mobile
- **Edit Mode**: Users can modify enriched data before saving
- **Loading States**: Beautiful loading animations during data fetching
- **Error Handling**: Graceful fallbacks when APIs are unavailable
- **Mock Data**: Demo works even without API keys

## 🚀 Deployment

The project is ready and has been deployed on platforms like Vercel (frontend) and Render (backend).
