# Decision Log

Here are the major crossroads I hit during development and why I chose the path I did:

## 1. How to handle bad CSV data?
*   **The Decision:** Don't silently guess, and don't just crash. Parse it on the backend, generate a "dry-run" report, and force the user to approve any fixes. 
*   **Why?** When dealing with money, silent guesses are dangerous. If the app assumes a negative number is a refund and subtracts it, and it was actually just a typo, balances are ruined.

## 2. How to handle people moving in and out?
*   **The Decision:** Track membership timelines (`joinedAt` and `leftAt`).
*   **Why?** A static group means the new guy pays for last year's wifi. By validating expense dates against these timelines, the math is always fair.

## 3. Handling USD and INR in the same sheet?
*   **The Decision:** Store the original currency, but normalize everything into a base currency (`amountInINR`).
*   **Why?** The users asked for "just one number per person." If I kept a multi-currency balance sheet (e.g., "You owe $50 and ₹2000"), it gets confusing. Converting at ingestion keeps the final balance sheet clean and simple.

## 4. How to calculate who owes whom?
*   **The Decision:** Use a greedy debt-simplification algorithm.
*   **Why?** If A owes B ₹100, and B owes C ₹100, A should just give C ₹100. The app calculates everyone's net balance, separates people into "Debtors" and "Creditors," and pairs them up to minimize the total number of transactions.
