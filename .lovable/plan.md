

## SMS Notification for Appointment Booking

### Recommended SMS Service: **Twilio**

Twilio is the industry standard for programmatic SMS. Here's why it's the best fit:
- Pay-per-message pricing (starts ~$0.0079/SMS for India)
- Reliable delivery with status tracking
- Simple REST API, works perfectly with backend functions
- Free trial with $15 credit to test

### How It Works

```text
Patient books appointment
        │
        ▼
  Backend function triggered
        │
        ▼
  SMS #1: "Booking Received"
  (sent immediately)
        │
        ▼
  Admin confirms from dashboard
        │
        ▼
  SMS #2: "Appointment Confirmed"
  (sent on status change)
```

### SMS Message Templates

**SMS 1 — Booking Received:**
> Dear {name}, your appointment request with {doctor} on {date} at {time} has been received. Consultation fee: ₹{fee}. We will confirm shortly. — Avira Hospital

**SMS 2 — Appointment Confirmed:**
> Dear {name}, your appointment with {doctor} on {date} at {time} is confirmed. Please arrive 15 mins early. For queries, call us. — Avira Hospital

### Implementation Plan

1. **Create a backend function** (`send-sms`) that accepts patient details and message type, then calls the Twilio API to send the SMS.

2. **Trigger SMS on booking** — After successfully inserting the appointment into the database in `BookAppointment.tsx`, call the `send-sms` function with type "booking".

3. **Trigger SMS on confirmation** — When an admin updates appointment status to "confirmed" (from the admin dashboard), call the `send-sms` function with type "confirmed".

4. **Store appointment in database** — Update `BookAppointment.tsx` to insert appointments into the database (currently it only sends an email via EmailJS).

### Setup Steps (What You Need To Do)

1. **Create a Twilio account** at [twilio.com](https://www.twilio.com)
2. Get your **Account SID**, **Auth Token**, and a **Twilio phone number** (or use Twilio's Messaging Service for India)
3. For India, you may need to register a sender ID and DLT template — Twilio guides you through this
4. Share the credentials with me and I'll securely store them and wire everything up

### Technical Details

- Backend function will be created as an edge function using Twilio's REST API
- Secrets needed: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- The booking flow will be updated to save appointments to the database before sending SMS
- RLS policies already allow anonymous inserts into the appointments table

