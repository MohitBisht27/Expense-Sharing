# Scope & Data Anomaly Log

## Database Schema

The application uses a relational database (PostgreSQL) managed via Sequelize ORM.

1. **Users Table**
   - `id` (UUID, Primary Key)
   - `name` (String)
   - `email` (String, Unique)
   - `passwordHash` (String)
   - `createdAt`, `updatedAt`

2. **Groups Table**
   - `id` (UUID, Primary Key)
   - `name` (String)
   - `description` (String)
   - `createdBy` (UUID, Foreign Key -> Users)
   - `createdAt`, `updatedAt`

3. **GroupMembers Table**
   - `id` (UUID, Primary Key)
   - `groupId` (UUID, Foreign Key -> Groups)
   - `userId` (UUID, Foreign Key -> Users)
   - `joinedAt` (Date) - *Crucial for validating if a user was in the group during an expense.*
   - `leftAt` (Date, Nullable)
   - `isActive` (Boolean)

4. **Expenses Table**
   - `id` (UUID, Primary Key)
   - `groupId` (UUID, Foreign Key -> Groups)
   - `description` (String)
   - `amount` (Decimal)
   - `currency` (String)
   - `amountInINR` (Decimal) - *Normalized base currency for calculations.*
   - `paidBy` (UUID, Foreign Key -> Users)
   - `expenseDate` (Date)
   - `splitType` (Enum: EQUAL, EXACT, PERCENTAGE, SHARES)
   - `category` (String), `notes` (Text)

5. **ExpenseSplits Table**
   - `id` (UUID, Primary Key)
   - `expenseId` (UUID, Foreign Key -> Expenses)
   - `userId` (UUID, Foreign Key -> Users)
   - `amountOwed` (Decimal)
   - `percentage` (Decimal, Nullable)
   - `shares` (Integer, Nullable)

6. **Settlements Table**
   - `id` (UUID, Primary Key)
   - `groupId` (UUID, Foreign Key -> Groups)
   - `paidBy` (UUID, Foreign Key -> Users)
   - `paidTo` (UUID, Foreign Key -> Users)
   - `amount` (Decimal)
   - `status` (Enum: PENDING, COMPLETED)
   - `notes` (String)

---

## CSV Anomaly Log

The `expenses_export.csv` file contained deliberate messy data. Below is the log of anomalies detected and how the system handles them.

| Anomaly Found in Data | Detection Logic | Action Policy |
| :--- | :--- | :--- |
| **Missing Fields** (e.g., missing Amount or PaidBy) | Checks for null/empty values in required core fields (`Description`, `Amount`, `PaidBy`, `Date`). | `SKIP` - The row is flagged and skipped as it cannot be processed without core data. |
| **Invalid Date** | Fails JS `Date` parsing validation. | `SKIP` - Skipped because balances depend on timelines. |
| **Negative Amount** (e.g., Parasailing refund: -30 USD) | `amount < 0` | `REQUIRE_APPROVAL` - Flagged as a potential refund rather than a standard expense. Requires user manual verification. |
| **Settlement disguised as Expense** (e.g., "Rohan paid Aisha back") | RegEx/keyword search in Description (e.g., "settlement", "paid back"). | `REQUIRE_APPROVAL` - Flagged. Settlements should be recorded via the Settlement feature to adjust balances, not added as new group shared expenses. |
| **Payer not in Group** | `PaidBy` user is not found in the `GroupMembers` table. | `SKIP` - Cannot attribute payment to an unknown entity. |
| **Currency Mismatch** (e.g., USD expenses from the trip) | `Currency === 'USD'` | `IMPORT_WITH_CORRECTION` - Automatically converted to the base currency (INR) using a configured exchange rate (`amountInINR`). The original USD value is preserved in the database. |
| **Duplicates** (e.g., Swiggy dinner entered twice) | Generates a hash `Description_Amount_PaidBy_Date` and tracks occurrences. | `REQUIRE_APPROVAL` - The first instance is processed normally, but subsequent identical rows are flagged for manual review to prevent double charging. |
| **Member Timeline Violation** (e.g., Meera charged for April rent after moving out) | Checks if `ExpenseDate` > member's `leftAt` or < member's `joinedAt`. | `REQUIRE_APPROVAL` - Automatically flags if an expense assigns debt to someone who wasn't living there at the time. |
| **Percentage Split Mismatch** | Parses `SplitWith` details and sums percentages. Fails if sum ≠ 100%. | `IMPORT_WITH_CORRECTION` - Flagged to the user that percentages are mathematically impossible. |
| **Exact Amount Mismatch** | Sum of exact participant amounts ≠ total `Amount`. | `IMPORT_WITH_CORRECTION` - Flagged. Total expense value and individual owed amounts do not align. |
| **Unknown Split Types** | Split type string does not match ENUMs (`EQUAL`, `EXACT`, `PERCENTAGE`, `SHARES`). | `IMPORT_WITH_CORRECTION` - Defaults to EQUAL or flags for manual fixing. |
| **Participant not in Group** | Parsed participant name in `split_details` is not in `GroupMembers`. | `SKIP` - Cannot assign debt to a non-member. |
