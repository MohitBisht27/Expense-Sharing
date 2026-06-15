# Scope & Data Anomaly Log

## Database Schema

When designing the database schema, I had to think carefully about real-world edge cases. 
*   **Users & Groups:** The standard stuff—who you are and what house/trip you belong to.
*   **GroupMembers (The Secret Sauce):** I added `joinedAt` and `leftAt` timestamps here. This is crucial! If Meera moves out in March, the database needs to know she shouldn't be charged for April's rent.
*   **Expenses & ExpenseSplits:** I track the original currency but also save an `amountInINR` (a normalized base currency) so we can do all the math in one standard format. The splits table handles exactly how much of that expense each person owes (whether by equal share, percentage, or exact amounts).
*   **Settlements:** For tracking when someone actually pays someone else back.

## The Anomaly Log (How we handle the messy CSV)

When staring at that messy spreadsheet, I found several types of bad data. Here's how my app handles them:

*   **Missing Core Data (No Amount/Payer):** *Action: SKIP.* If we don't know how much it is or who paid, we just can't process it.
*   **Invalid Dates:** *Action: SKIP.* Since balances depend on *when* people lived in the house, a bad date ruins the math.
*   **Negative Amounts:** *Action: REQUIRE_APPROVAL.* Is a -30 USD charge a refund? We flag it and ask the user to confirm.
*   **Settlements disguised as Expenses (e.g., "Rohan paid Aisha"):** *Action: REQUIRE_APPROVAL.* If you log a payback as a shared expense, it doubles the debt! We flag these based on keywords so the user can log it properly as a settlement instead.
*   **Currency Mismatches (e.g., USD):** *Action: IMPORT_WITH_CORRECTION.* We don't crash. We automatically convert it to INR using an exchange rate so it fits our base math, but we keep the USD note.
*   **Timeline Violations (Charging a moved-out roommate):** *Action: REQUIRE_APPROVAL.* If an expense date happens *after* a roommate's `leftAt` date, the app flags it immediately.
*   **Math that doesn't math:** If percentages don't equal 100%, or exact amounts don't add up to the total, the app flags it as `IMPORT_WITH_CORRECTION` and asks the user to fix the numbers.
