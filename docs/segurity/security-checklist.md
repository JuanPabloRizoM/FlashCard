# Security Checklist

## Input Validation

- All user inputs must be validated
- No direct insertion into queries
- Handle null/undefined safely

---

## Database Safety

- Use parameterized queries
- Avoid raw string concatenation
- Enforce foreign keys

---

## Data Integrity

- Prevent crashes on corrupt data
- Use safe defaults
- Validate before saving

---

## Logging

- No sensitive data in logs
- Avoid excessive logging

---

## Error Handling

- No raw errors exposed to UI
- Use safe fallback states

---

## Navigation Safety

- Prevent invalid navigation states
- Validate required params

---

## Storage

- Avoid storing sensitive info unnecessarily
- Validate JSON fields

---

## Future Considerations

- Encryption (if needed)
- Sync security
- Auth layer

---

## Mandatory Rule

Every feature must pass this checklist before being considered complete.