## Doctor Availability Calendar — Plan

Add a scheduling tool inside the Staff Portal so admins (and each doctor for their own profile) can manage when each doctor is available. Patient booking flow stays untouched for now — this is admin-only visibility, ready to wire into bookings later.

### What you'll get

A new **"Availability"** tab in the Admin Dashboard with two parts per doctor:

1. **Weekly default schedule** — set working hours for each weekday (e.g. Mon–Sat 10:00 AM – 1:00 PM, 15-min slots). This applies automatically every week.
2. **Date overrides** — pick a specific date on a calendar to:
   - Mark the doctor as **on leave / unavailable** (block the whole day)
   - Set **custom hours** for that day (overrides weekly default)
   - **Add or remove individual slots**

A monthly calendar view shows green (available), red (leave), amber (custom hours) markers per day, so the schedule is readable at a glance.

### Permissions

- **Admin** — can edit availability for any doctor
- **Doctor** — sees only their own availability and can edit it
- **Staff** — read-only (can see when doctors are available)

### How you'll use it

1. Open Staff Portal → **Availability** tab
2. Pick a doctor (admins) or land on your own (doctors)
3. **Weekly tab**: toggle each weekday on/off, set start time, end time, slot duration → Save
4. **Calendar tab**: click any date → choose "Mark leave", "Custom hours", or "Reset to weekly default" → Save

### Booking impact

Per your choice, **no change to the public booking page yet**. We'll wire patient slot availability to this calendar in a follow-up once you've populated some schedules and confirmed the UX.

---

### Technical details

**New tables**

- `doctor_weekly_availability` — one row per doctor per weekday
  - doctor_id, weekday (0–6), is_available, start_time, end_time, slot_minutes
- `doctor_date_overrides` — one row per doctor per overridden date
  - doctor_id, date, type ('leave' | 'custom'), start_time, end_time, slot_minutes, note

`doctor_id` references `auth.users.id` of the staff account (matches existing `appointments.doctor_id` pattern).

**RLS policies**

- SELECT: any authenticated staff (admin/doctor/staff) can read
- INSERT/UPDATE/DELETE: admin OR `auth.uid() = doctor_id`

**Frontend**

- New tab in `src/pages/AdminDashboard.tsx`
- New component `src/components/admin/DoctorAvailability.tsx` containing:
  - Doctor selector (admin only; doctors auto-locked to themselves)
  - Weekly schedule editor (7 rows with switch + time inputs)
  - Monthly `Calendar` (shadcn) with day modifiers for leave / custom / default
  - Date override dialog
- Helper `src/utils/availability.ts` — given a doctor + date, compute the effective slot list (used now for the admin preview, reusable later for booking)

**No changes** to: BookAppointment page, EmailJS flows, existing tables, or any public route.
