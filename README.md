# SplitWise - Shared Expenses App

**Welcome to SplitWise!** 👋
SplitWise is an app I built to solve that classic flatmate nightmare: the messy, chaotic shared expense spreadsheet. Whether people are moving in and out, paying in different currencies, or just uploading completely broken CSV files, this app is designed to catch the errors and keep everyone’s balances fair.

## Setup Instructions

**How to get it running locally:**
You'll need Node.js and PostgreSQL installed.

1. **Database:** Create a local Postgres database (e.g., `expensesharing_db`).
2. **Backend:** 
   - Open a terminal and `cd backend`.
   - Run `npm install`.
   - Create a `.env` file and add your database URL, a port (like `5000`), and a JWT secret.
   - Run `npm run dev`. The server will fire up and automatically build your database tables!
3. **Frontend:**
   - Open a new terminal and `cd frontend`.
   - Run `npm install`, then `npm run dev`.
   - Pop open your browser to `http://localhost:5173` and you're good to go!

## AI Collaboration

I built this project with an AI pair programmer (Gemini). It was super helpful for scaffolding out the React architecture, writing the initial database models, and setting up the modern CSS design. We definitely had to wrestle a bit to get the complex logic right, but it was a great collaborative experience.

Please refer to `AI_USAGE.md` for a detailed breakdown of the AI collaboration process.
