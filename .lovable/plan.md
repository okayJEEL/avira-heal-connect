

# Video Calling Integration with Jitsi Meet

## Overview
Add a consultation type toggle (OPD / Video Call) to the existing booking form. When "Video Call" is selected, a unique Jitsi Meet room link is generated and included in the appointment slip. Patients join via the link at their scheduled time.

## How It Works
- Jitsi Meet is completely free, requires no API keys, and works via embedded iframe or direct URL
- Each appointment gets a unique room name derived from the appointment ID (e.g., `avira-hospital-AH-2026-582931`)
- The doctor and patient both receive the same link and join at the scheduled time

## Changes

### 1. BookAppointment.tsx — Add consultation type toggle
- Add `consultationType: "opd"` to form state
- Add a radio group toggle between "In-Person (OPD)" and "Video Consultation" after the doctor selection
- When Video Call is selected, show an info box explaining the patient will receive a video link
- Pass `consultationType` to the appointment slip
- Generate Jitsi room URL: `https://meet.jit.si/avira-hospital-{appointmentId}`

### 2. AppointmentSlip.tsx — Show video call link
- Add `consultationType` and `videoCallLink` props
- Update "Consultation Type" field to show "Video Call" or "OPD"
- When video call: display the Jitsi room link with a styled clickable button/link and instructions ("Join at your scheduled time")
- Include the link in the printable/downloadable version

### 3. New Component: VideoCallRoom.tsx
- A new page at `/video-call/:roomId` that embeds Jitsi Meet via iframe using the JaaS (Jitsi as a Service) free tier
- Shows appointment details, waiting room message, and the embedded video call
- Mobile responsive with full-screen option

### 4. App.tsx — Add video call route
- Add route: `/video-call/:roomId` → `VideoCallRoom`

## Technical Details
- Jitsi room URL format: `https://meet.jit.si/avira-hospital-{sanitized-appointment-id}`
- The iframe embed uses Jitsi's IFrame API for controls (mute, camera, leave)
- No backend changes needed — Jitsi is fully client-side
- Fee structure remains the same (can be adjusted later if video consultations have different pricing)

