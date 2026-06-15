# Import Report (Sample)

When the app ingests the messy CSV, it doesn't just jam it into the database. It generates a report that the user has to review. Here is what that output looks like:

```json
{
  "status": "pending_review",
  "totalRowsParsed": 45,
  "cleanRowsReady": 38,
  "anomaliesDetected": [
    {
      "row": 12,
      "description": "Parasailing refund",
      "issue": "Negative Amount Detected (-30 USD).",
      "actionPolicy": "REQUIRE_APPROVAL",
      "message": "Is this a refund? Please verify before importing."
    },
    {
      "row": 18,
      "description": "Rohan paid Aisha back",
      "issue": "Settlement masquerading as expense.",
      "actionPolicy": "REQUIRE_APPROVAL",
      "message": "This looks like a settlement. Import as a settlement instead?"
    },
    {
      "row": 24,
      "description": "April Rent",
      "issue": "Member Timeline Violation.",
      "actionPolicy": "REQUIRE_APPROVAL",
      "message": "Meera's move-out date is in March. Remove Meera from this split?"
    },
    {
      "row": 30,
      "description": "NYC Trip Dinner",
      "issue": "Currency Mismatch (USD).",
      "actionPolicy": "IMPORT_WITH_CORRECTION",
      "message": "Converted 50 USD to 4150 INR for balance calculations."
    }
  ]
}
```
