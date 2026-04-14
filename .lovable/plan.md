

## Plan: WhatsApp Notifications via Twilio

### What will be built
Automated WhatsApp messages sent to patients at three key moments: booking, confirmation, and cancellation.

### Files to create/edit

**1. Create `supabase/functions/send-whatsapp/index.ts`**
- Edge function that accepts POST with: `mobile`, `patient_name`, `doctor_name`, `department`, `date`, `time`, `fee`, `event`
- Builds message from template based on event type (booking/confirmed/cancelled)
- Sends via Twilio gateway with `whatsapp:` prefix on phone numbers
- CORS headers, input validation with checks
- No JWT required (booking is called by anonymous users)

**2. Edit `src/pages/BookAppointment.tsx`**
- After successful DB insert (line ~195), fire-and-forget call to the `send-whatsapp` edge function with `event: "booking"`
- Pass patient name, doctor name, department, date, time, fee

**3. Edit `src/pages/AdminDashboard.tsx`**
- In `updateAppointmentStatus` (line ~133), after successful status update to "confirmed" or "cancelled", call the edge function with appointment details
- Need to look up the appointment data from state to get patient mobile, doctor name, etc.

### Message Templates
- **Booking**: "Dear {name}, your appointment with {doctor} ({dept}) on {date} at {time} has been received. Fee: ₹{fee}. We will confirm shortly. — Avira Hospital"
- **Confirmed**: "Dear {name}, your appointment with {doctor} on {date} at {time} is confirmed. Please arrive 15 mins early. — Avira Hospital"
- **Cancelled**: "Dear {name}, your appointment with {doctor} on {date} at {time} has been cancelled. Please rebook if needed. — Avira Hospital"

### Important note
You'll need to provide your Twilio WhatsApp-enabled phone number (the "From" number). I'll add a prompt for that during implementation, or you can use Twilio's WhatsApp Sandbox number for testing.

