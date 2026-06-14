# SplitWise - Shared Expenses App

SplitWise is a full-stack web application designed to help friends and flatmates track and split shared expenses effortlessly. Built to solve the messy spreadsheet problem, it handles complex scenarios like varying group memberships, multi-currency expenses, different split methods, and messy CSV imports.

## Features

- **Authentication System:** Secure user registration and login.
- **Group Management:** Create groups and manage members. Tracks when users join or leave to validate expenses.
- **Advanced Expense Splitting:**
  - **Equal:** Split evenly among selected members.
  - **Exact:** Specify exactly how much each person owes.
  - **Percentage:** Split by percentages (must sum to 100%).
  - **Shares:** Split by custom share ratios (e.g., Aisha 2, Rohan 1).
- **Smart CSV Import:** Ingests raw messy spreadsheets and automatically detects anomalies, validates dates against member timelines, detects duplicates, handles USD to INR conversions, and flags false expenses (like settlements).
- **Interactive Balances:** Clear individual and group-wise balance summaries.
- **Modern UI:** Built with React, featuring glassmorphism, responsive design, and smooth animations.

## Tech Stack

- **Frontend:** React, React Router, Vanilla CSS (Custom Design System), Lucide React (Icons), Vite.
- **Backend:** Node.js, Express.js.
- **Database:** PostgreSQL with Sequelize ORM.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)

### 1. Database Setup
1. Create a PostgreSQL database (e.g., `expensesharing_db`).
2. Ensure you have the database URL ready.

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   DATABASE_URL=postgres://username:password@localhost:5432/expensesharing_db
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000` and automatically sync the database schema.*

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

## AI Collaboration

This project was developed in collaboration with an AI coding assistant (Gemini/Antigravity). The AI was utilized as a pair programmer to scaffold the application architecture, design the database schema, implement the complex CSV import anomaly detection rules, and design the modern frontend CSS system. 

Please refer to `AI_USAGE.md` for a detailed breakdown of the AI collaboration process.
