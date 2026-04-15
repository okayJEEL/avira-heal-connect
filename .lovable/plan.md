

## Plan: In-App Notification Bell + Browser Push Notifications

### What You'll Get
- A **bell icon with unread count** in the dashboard header that persists across page refreshes
- A **dropdown panel** showing recent unread bookings with patient name, department, and time
- **Browser push notifications** (with sound) that alert doctors even when the tab is in the background
- Doctors only see notifications for their own department; admins see all

### How It Works

1. **New database table: `staff_notifications`**
   - Stores each notification with fields: `id`, `user_id` (doctor/admin), `appointment_id`, `title`, `message`, `read` (boolean), `created_at`
   - RLS: users can only read/update their own notifications
   - A database function + trigger on the `appointments` table will auto-create notification rows for relevant staff when a new appointment is inserted

2. **Database trigger logic**
   - On INSERT to `appointments`: look up which doctors/admins should be notified (based on department mapping or admin role) and insert rows into `staff_notifications`

3. **NotificationBell component** (new file)
   - Bell icon with a red badge showing unread count
   - Click opens a dropdown with recent notifications (patient name, department, time, "Mark as read")
   - "Mark all as read" button
   - Uses Supabase real-time subscription on `staff_notifications` for instant updates

4. **Browser push notification**
   - On first load, request `Notification.permission` from the browser
   - When real-time subscription fires a new notification, play a short notification sound and trigger `new Notification(...)` if the tab is not focused

5. **Integration into AdminDashboard.tsx**
   - Add the `NotificationBell` component to the header bar (next to the logout button)
   - Pass `userRole` and `userEmail` so it can filter appropriately

### Files Changed
- **Create**: Database migration for `staff_notifications` table + trigger function
- **Create**: `src/components/admin/NotificationBell.tsx`
- **Edit**: `src/pages/AdminDashboard.tsx` — add bell to header

### Technical Details

**Database migration:**
```sql
CREATE TABLE public.staff_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications"
  ON public.staff_notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can mark their own as read
CREATE POLICY "Users can update own notifications"
  ON public.staff_notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- System (trigger) can insert
CREATE POLICY "System can insert notifications"
  ON public.staff_notifications FOR INSERT TO authenticated
  WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.staff_notifications;
```

**Trigger function** — on new appointment, insert notification rows for all admins + doctors matching the department.

**NotificationBell component** — fetches unread count, subscribes to real-time, shows dropdown, requests browser notification permission, plays sound on new notifications.

