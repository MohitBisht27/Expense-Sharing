# AI Usage Log

**AI Tool Used:** Gemini (Antigravity IDE)
**Role:** Primary Development Collaborator / Full-Stack Pair Programmer

## Workflow Overview
The AI was used extensively to transition from a conceptual understanding of the "flatmate spreadsheet" problem to a fully functional React/Node.js application. It assisted in schema design, backend logic generation, UI component creation, and debugging. 

**Key Prompts Used:**
- *"Analyze the requirements for the Shared Expenses App assignment. Design a PostgreSQL database schema that can handle varying group memberships (joinedAt/leftAt) and multi-currency expenses."*
- *"Implement the CSV import service in Node.js. It needs to read 'expenses_export.csv' and detect 12 specific anomalies such as Negative amounts, Currency mismatch (USD), Settlements masquerading as expenses, and Date validations against user group membership."*
- *"The UI looks basic and relies on raw Tailwind classes. You are a 10-year experienced developer. Rewrite the CSS to use a modern, premium design system (glassmorphism, vibrant gradients, micro-animations) and make all pages fully responsive."*

## AI Correction Cases (When the AI was wrong and how it was fixed)

### Case 1: Silent Failures in the Import Logic
**What the AI produced:** Initially, when asked to write the CSV import logic, the AI wrote a parser that encountered invalid data (like an unparseable split format) and either threw an error crashing the entire import, or wrapped it in a `try/catch` and silently dropped the row without informing the user.
**How it was caught:** The assignment explicitly stated: "A crashed import and a silent guess are both failing answers." I reviewed the import service code and noticed dropped rows had no UI representation.
**What was changed:** I directed the AI to completely rewrite `import.service.js` using an Anomaly Tracking array. Instead of dropping rows, the code was updated to push an anomaly object (with `type`, `message`, and an `ACTION` policy like `REQUIRE_APPROVAL` or `SKIP`) into an array. This array is then returned to the frontend and rendered in the `AnomalyReview.jsx` component.

### Case 2: Icon Sizing Issues in the UI
**What the AI produced:** During the UI overhaul, the AI updated the auth forms (Login/Register) to use Lucide React icons inside the input fields. It applied Tailwind sizing classes (e.g., `w-4 h-4`) directly to the `<Icon />` components. 
**How it was caught:** After deploying the CSS changes, I used the browser subagent to take a screenshot of the login page. The icons were completely broken—they rendered as tiny, unrecognizable glyphs that overlapped the placeholder text. The Tailwind classes were not correctly applying to the underlying SVG elements in the specific CSS environment.
**What was changed:** I instructed the AI to rewrite the `Input.jsx` wrapper component and the Login/Register pages. We removed the CSS utility classes for the icons and replaced them with bulletproof inline styles (`style={{ width: '1rem', height: '1rem' }}`) and explicit flexbox positioning to ensure perfect rendering regardless of stylesheet loading order.

### Case 3: Balance Calculation with Left Members
**What the AI produced:** The AI generated a greedy algorithm for debt simplification (calculating who owes whom). However, it initially pulled *all* group members into the calculation array regardless of their `isActive` or `leftAt` status.
**How it was caught:** While reviewing the logic against the requirement "Why would March electricity affect my balance?", I realized that the balance calculation would try to distribute a generic "EQUAL" split expense to a member who had already moved out if the UI didn't strictly filter the participants.
**What was changed:** The logic in `calculateSplits` inside the import service, as well as the backend balance controllers, was updated to strictly validate `expenseDate` against a member's `joinedAt` and `leftAt` timestamps. If a generic "EQUAL" split is logged in April, the AI was corrected to only divide the total among members whose `isActive` is true *and* whose timeline covers the April date.
