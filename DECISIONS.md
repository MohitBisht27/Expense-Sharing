# Decision Log

This document records the significant architectural and product decisions made during the development of SplitWise.

## 1. Handling the "Spreadsheet Mess" (Import Strategy)
**Options Considered:**
1. Clean the data on the client side before sending it to the backend.
2. Silently fix or guess anomalies on the backend (e.g., assume a negative number is a refund and subtract it).
3. **Parse on backend, generate a dry-run report, and enforce explicit policies.**

**Decision:** Option 3.
**Why:** A "silent guess" is dangerous when dealing with people's money. If Rohan paid Aisha back, logging it as a shared expense ruins the balances. The system was designed to parse the CSV, categorize every anomaly into `SKIP`, `IMPORT_WITH_CORRECTION`, or `REQUIRE_APPROVAL`, and surface this report to the user in a UI (`AnomalyReview.jsx`). This fulfills Meera's request to "approve anything the app changes."

## 2. Dealing with Move-ins and Move-outs (Timelines)
**Options Considered:**
1. Group members are static. If you are in the group, you split everything.
2. Keep a separate group for every combination of flatmates.
3. **Add `joinedAt` and `leftAt` timestamps to `GroupMembers`.**

**Decision:** Option 3.
**Why:** Sam moved in mid-April, and Meera moved out in March. A static group would force Sam to pay for March's electricity. By tracking membership timelines, the Import Service actively validates the `ExpenseDate` against the member's timeline. If Meera is included in an April rent split, the system flags a `MEMBER_LEFT_BEFORE_EXPENSE` anomaly.

## 3. Base Currency vs. Multi-currency
**Options Considered:**
1. Treat all numbers as raw values (spreadsheet approach).
2. Store expenses in their original currency and calculate separate balance sheets per currency (e.g., "You owe 50 USD and 2000 INR").
3. **Store original currency but normalize to a base currency (`amountInINR`).**

**Decision:** Option 3.
**Why:** Priya specifically called out that treating dollars as rupees is wrong. Aisha requested "just one number per person." By keeping a multi-currency balance sheet, we fail Aisha's requirement. By converting USD to INR at the time of ingestion/creation using a predefined exchange rate, we preserve the original USD metadata but unify the balance sheet into a single comprehensible number per person.

## 4. Resolving "Who owes whom?" (Balance Algorithm)
**Options Considered:**
1. Track individual pairwise debts (A owes B, B owes C).
2. **Calculate net balances and use a greedy algorithm to simplify debts.**

**Decision:** Option 2.
**Why:** If Aisha owes Rohan ₹100, and Rohan owes Priya ₹100, Aisha should just pay Priya. The backend calculates a `netBalance` for each user (Total Paid - Total Owed). We then separate members into "Debtors" (negative balance) and "Creditors" (positive balance) and pair them up to generate the minimum number of transactions needed to settle all debts. This directly satisfies Aisha's request for simplicity.

## 5. UI/UX Design System
**Options Considered:**
1. Use standard Tailwind CSS utilities exclusively in JSX.
2. Use a component library like Material-UI.
3. **Build a custom vanilla CSS design system mapping utility classes to a root theme.**

**Decision:** Option 3.
**Why:** We wanted the app to feel "smooth and like a modern website" (glassmorphism, vibrant gradients, micro-animations). Relying solely on raw Tailwind classes resulted in cluttered JSX and inconsistent states. Writing a unified `index.css` with semantic classes (`card-elevated`, `input-field`, `btn-primary`) provided a premium feel, exact control over SVG icon sizes, and highly reliable responsive behavior across varying screen sizes.
