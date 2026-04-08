

## Plan: WhatsApp Notifications via MSG91

### What you'll get
Patients receive WhatsApp messages on three events:
1. **Booking received** — immediately after booking
2. **Appointment confirmed** — when doctor confirms
3. **Appointment cancelled** — when doctor cancels

### Steps

**1. Store MSG91 API credentials**
- Use the `add_secret` tool to request your **MSG91 Auth Key** and **Integrated Number** (WhatsApp sender number)
- Secrets: `MSG91_AUTH_KEY`, `MSG91_SENDER_NUMBER`

**2. Create edge function: `send-whatsapp`**
- Accepts: `to`, `patientName`, `doctorName`, `department`, `date`, `time`, `fee`, `messageType` (booking/confirmed/cancelled)
- Calls MSG91's WhatsApp API (`https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/`)
- Formats message based on `messageType`
- Input validation with Zod, CORS headers included

**3. Update `BookAppointment.tsx`**
- After successful DB insert, fire-and-forget call to `send-whatsapp` with type `booking`
- Won't block the booking flow if WhatsApp fails

**4. Update `AdminDashboard.tsx`**
- After `updateAppointmentStatus()` succeeds for "confirmed" or "cancelled", call `send-whatsapp` with the appropriate type
- Fetch appointment details (patient name, mobile, etc.) from the existing state

### Message Templates

| Event | WhatsApp Message |
|-------|-----------------|
| Booking | "Dear {name}, your appointment with {doctor} ({dept}) on {date} at {time} has been received. Fee: ₹{fee}. We will confirm shortly. — Avira Hospital" |
| Confirmed | "Dear {name}, your appointment with {doctor} on {date} at {time} is confirmed. Please arrive 15 mins early. — Avira Hospital" |
| Cancelled | "Dear {name}, your appointment with {doctor} on {date} at {time} has been cancelled. Please rebook if needed. — Avira Hospital" |

### What you need to do
1. Create an MSG91 account at [msg91.com](https://msg91.com)
2. Enable WhatsApp channel and get your **Auth Key** from Settings → Auth Key
3. Set up a WhatsApp sender number and register message templates (MSG91 guides you through DLT/WhatsApp Business approval)
4. Share credentials when prompted — I'll securely store them

### Technical details
- Edge function uses MSG91 WhatsApp API directly (no connector needed)
- Phone numbers auto-formatted to include `+91` country code
- Non-blocking: booking/confirmation succeeds even if WhatsApp fails
- Secrets stored securely as backend secrets, never exposed to frontend

