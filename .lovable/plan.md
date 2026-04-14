

## Plan: WhatsApp Notifications via Twilio (Sandbox First)

### Approach
Start with the Twilio WhatsApp Sandbox number (`+14155238886`) hardcoded in the edge function. When you're ready to go live, you just update one secret value — no code changes needed.

### Important: Sandbox Limitation
Recipients must first send a "join" message (e.g. "join <two-words>") to **+1 415 523 8886** on WhatsApp before they can receive messages. You'll find your specific join phrase in Twilio Console → Messaging → Try it out → Send a WhatsApp message.

### Implementation

**1. Create `supabase/functions/send-whatsapp/index.ts`**
- Edge function accepting POST with: `mobile`, `patient_name`, `doctor_name`, `department`, `date`, `time`, `fee`, `event`
- Uses Twilio connector gateway (`https://connector-gateway.lovable.dev/twilio/Messages.json`)
- Sends with `From: whatsapp:+14155238886` (sandbox) and `To: whatsapp:+91{mobile}`
- Three message templates for booking, confirmed, cancelled events
- CORS headers, input validation

**2. Edit `src/pages/BookAppointment.tsx`**
- After successful DB insert, fire-and-forget call to `send-whatsapp` with `event: "booking"`

**3. Edit `src/pages/AdminDashboard.tsx`**
- After status change to "confirmed" or "cancelled", call `send-whatsapp` with the corresponding event type

### Switching to Production Later
When ready, we'll:
1. Store your own WhatsApp Business number as a secret (`TWILIO_WHATSAPP_FROM`)
2. Update the edge function to read from the secret instead of the hardcoded sandbox number

### Files
- Create: `supabase/functions/send-whatsapp/index.ts`
- Edit: `src/pages/BookAppointment.tsx`
- Edit: `src/pages/AdminDashboard.tsx`

