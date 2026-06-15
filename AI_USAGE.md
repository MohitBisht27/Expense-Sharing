# AI Usage Log

**Tools Used:** Gemini (Antigravity IDE)  
**Role:** Full-Stack Pair Programmer

## Key Prompts I Used:
*   *"Analyze the requirements for the Shared Expenses App assignment. Design a PostgreSQL schema that handles varying group memberships (joinedAt/leftAt) and multi-currency expenses."*
*   *"Implement the CSV import service in Node.js. It needs to read 'expenses_export.csv' and detect 12 specific anomalies..."*
*   *"Rewrite the frontend CSS to use a modern, premium design system (glassmorphism, micro-animations) and ensure full responsiveness."*

## Where the AI Messed Up (and how I fixed it!):

### 1. The "Silent Failure" Import Bug
*   **What went wrong:** When writing the CSV parser, the AI wrapped invalid data errors in a `try/catch` block and just silently dropped the bad rows. 
*   **How I caught & fixed it:** The assignment specifically stated that silent guesses are failing answers. I made the AI completely rewrite the service to push an anomaly object (with policies like `REQUIRE_APPROVAL` or `SKIP`) into an array instead, which is then sent back to the user interface for review.

### 2. Breaking the UI Icons
*   **What went wrong:** While upgrading the UI, the AI tried applying Tailwind sizing classes (like `w-4 h-4`) directly to the Lucide React SVG components.
*   **How I caught & fixed it:** I checked the browser and the icons on the Login page were completely mangled and overlapping the text. I instructed the AI to strip out the utility classes and use explicit, bulletproof inline styles (`style={{ width: '1rem' }}`) and flexbox positioning to fix the rendering.

### 3. Charging Ghosts (The Balance Algorithm)
*   **What went wrong:** The AI wrote a great debt-simplification algorithm, but it greedily pulled *all* group members into the split array—even if they had already moved out!
*   **How I caught & fixed it:** I realized that if we logged a generic "EQUAL" split for April electricity, it would charge a roommate who left in March. I corrected the AI's logic to strictly validate the `expenseDate` against a member's `joinedAt` and `leftAt` timestamps before adding them to the math.
