# Security Specification - CekAjaDulu Reborn

## Data Invariants
- A user can only read and write their own profile (`/users/{uid}`).
- Predictions and Messages must belong to the logged-in user.
- Users cannot modify the `uid` or `email` fields once set.
- Predictions and Messages are immutable after creation (except maybe deletion).

## The Dirty Dozen Payloads (Rejection Targets)
1. Writing to `/users/other-uid` as a different user.
2. Injecting `isAdmin: true` into a user profile.
3. Setting `chance: 100` in a prediction without actual AI logic (client write).
4. Modification of `createdAt` by client.
5. Large string injection (>1MB) in insights.
6. Messages with `role: 'model'` sent by the client.
7. Accessing other users' predictions via list queries.
8. Deleting other users' profile.
9. Creating a user profile with an unverified email (if enforced).
10. Rapid-fire writes (rate limiting - though rules can't do this perfectly).
11. Orphaned prediction (no parent user).
12. Shadow fields in user profile.

## Security Rules Plan
- `isValidUser`: Checks keys and auth match.
- `isValidPrediction`: Checks relational parent and schema.
- `isValidMessage`: Checks role restriction and schema.
