

## Plan: WhatsApp Notifications via Twilio

### What This Does
Automatically sends WhatsApp messages to patients at three key moments:
1. **Booking** — When a patient books an appointment (from the public booking page)
2. **Confirmed** — When staff confirms the appointment (from admin dashboard)
3. **Cancelled** — When staff cancels the appointment (from admin dashboard)

### Message Templates

| Event | Message |
|-------|---------|
| Booking | "Dear {name}, your appointment with {doctor} ({dept}) on {date} at {time} has been received. Fee: Rs.{fee}. We will confirm shortly. — Avira Hospital" |
| Confirmed | "Dear {name}, your appointment with {doctor} on {date} at {time} is confirmed. Please arrive 15 mins early. — Avira Hospital" |
| Cancelled | "Dear {name}, your appointment with {doctor} on {date} at {time} has been cancelled. Please rebook if needed. — Avira Hospital" |

### Setup Required
- Connect Twilio via the Lovable connector (you will be prompted)
- You need a Twilio account with a WhatsApp-enabled number (or Twilio WhatsApp Sandbox for testing)

### Implementation

**1. Create Edge Function: `supabase/functions/send-whatsapp/index.ts`**
- Accepts POST with: `mobile`, `patient_name`, `doctor_name`, `department`, `date`, `time`, `fee`, `event` (booking/confirmed/cancelled)
- Builds the correct message template based on event type
- Sends via Twilio gateway with `whatsapp:` prefix on phone numbers
- Returns success/failure status
- Validates JWT for staff-triggered events; allows anonymous for booking event

**2. Edit: `src/pages/BookAppointment.tsx`**
- After successful appointment insert, call the edge function with `event: "booking"` and all appointment details
- Fire-and-forget (don't block booking on WhatsApp delivery)

**3. Edit: `src/pages/AdminDashboard.tsx`**
- In `updateAppointmentStatus`, after successful status update to "confirmed" or "cancelled", call the edge function with the appointment details and corresponding event type

**4. Connect Twilio connector** to make `TWILIO_API_KEY` and `LOVABLE_API_KEY` available

### Files
- Connect: Twilio connector
- Create: `supabase/functions/send-whatsapp/index.ts`
- Edit: `src/pages/BookAppointment.tsx` (add WhatsApp call after booking)
- Edit: `src/pages/AdminDashboard.tsx` (add WhatsApp call on confirm/cancel)

