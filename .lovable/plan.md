

## Plan: Staff Portal Messages System

### Overview
Build a full messaging hub with four sub-features: Contact Form Inbox, Internal Staff Chat, Patient Notifications, and Announcements Board.

### Database Changes (new tables)

1. **`contact_messages`** — Stores messages from the public Contact page
   - `id`, `name`, `email`, `phone`, `subject`, `message`, `status` (new/read/replied), `reply_text`, `replied_at`, `created_at`
   - RLS: Public can INSERT, staff/admin can SELECT and UPDATE

2. **`internal_messages`** — Staff-to-staff chat messages
   - `id`, `sender_id` (references auth.users), `sender_name`, `message`, `created_at`
   - RLS: Authenticated staff/doctors/admins can SELECT and INSERT
   - Enable realtime for live chat

3. **`announcements`** — Admin-posted notices visible to all staff
   - `id`, `title`, `content`, `priority` (normal/urgent), `author_id`, `author_name`, `created_at`, `expires_at`
   - RLS: Anyone authenticated can SELECT; only admin can INSERT/UPDATE/DELETE

4. **`patient_notifications`** — Log of notifications sent to patients
   - `id`, `appointment_id`, `patient_name`, `mobile`, `email`, `notification_type` (reminder/report_ready/custom), `message`, `sent_via` (sms/email/whatsapp), `sent_at`, `sent_by`
   - RLS: Admin/staff can SELECT and INSERT

### Frontend Changes

**`src/components/admin/MessagesHub.tsx`** (new component)
- Replaces the placeholder "coming soon" in the Messages tab
- Sub-tabs: **Inbox** | **Staff Chat** | **Notifications** | **Announcements**

**Inbox Tab:**
- List of contact form submissions with status badges (New/Read/Replied)
- Click to expand and view full message
- Reply button that saves reply text and marks as replied
- Wire the public Contact page form to save to `contact_messages` table

**Staff Chat Tab:**
- Simple real-time chat feed using Supabase Realtime
- Shows sender name, message, and timestamp
- Text input at bottom to post messages
- All staff/doctors/admins can participate

**Patient Notifications Tab:**
- Form to send a notification: select patient (from appointments), choose type (reminder/custom), write message
- Log table showing all sent notifications with timestamps
- For now, notifications are logged (actual SMS/email sending can be wired later)

**Announcements Tab:**
- Admin can create announcements with title, content, and priority
- All staff see announcements sorted by date
- Urgent announcements highlighted with a red/orange accent
- Admin can delete expired announcements

**`src/pages/AdminDashboard.tsx`**
- Replace the Messages placeholder with `<MessagesHub />`
- Add unread count badge on the Messages quick nav button

**`src/pages/Contact.tsx`**
- Wire the contact form to also save submissions to `contact_messages` table (in addition to existing EmailJS)

### Files to create/edit
- Create: `src/components/admin/MessagesHub.tsx`
- Create: `src/components/admin/ContactInbox.tsx`
- Create: `src/components/admin/StaffChat.tsx`
- Create: `src/components/admin/PatientNotifications.tsx`
- Create: `src/components/admin/AnnouncementsBoard.tsx`
- Edit: `src/pages/AdminDashboard.tsx`
- Edit: `src/pages/Contact.tsx`
- Database: 4 new tables with RLS policies + realtime on `internal_messages`

