
-- Create staff_notifications table
CREATE TABLE public.staff_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.staff_notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications"
  ON public.staff_notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can mark their own as read
CREATE POLICY "Users can update own notifications"
  ON public.staff_notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Trigger function can insert (SECURITY DEFINER so it bypasses RLS)
CREATE POLICY "System can insert notifications"
  ON public.staff_notifications FOR INSERT TO authenticated
  WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.staff_notifications;

-- Trigger function: on new appointment, notify all admins + doctors with matching doctor_id
CREATE OR REPLACE FUNCTION public.notify_staff_on_new_appointment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  staff_record RECORD;
  notif_title TEXT;
  notif_message TEXT;
BEGIN
  notif_title := 'New Appointment Booked';
  notif_message := NEW.patient_name || ' booked an appointment' ||
    CASE WHEN NEW.department IS NOT NULL THEN ' in ' || NEW.department ELSE '' END ||
    ' for ' || to_char(NEW.time_slot AT TIME ZONE 'Asia/Kolkata', 'DD Mon YYYY, HH12:MI AM');

  -- Notify all admins
  FOR staff_record IN
    SELECT ur.user_id FROM public.user_roles ur WHERE ur.role = 'admin'
  LOOP
    INSERT INTO public.staff_notifications (user_id, appointment_id, title, message)
    VALUES (staff_record.user_id, NEW.id, notif_title, notif_message);
  END LOOP;

  -- Notify the assigned doctor if doctor_id is set
  IF NEW.doctor_id IS NOT NULL THEN
    -- Check the doctor exists in user_roles and isn't already notified as admin
    IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.doctor_id AND role = 'doctor') THEN
      IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.doctor_id AND role = 'admin') THEN
        INSERT INTO public.staff_notifications (user_id, appointment_id, title, message)
        VALUES (NEW.doctor_id, NEW.id, notif_title, notif_message);
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger on appointments table
CREATE TRIGGER on_new_appointment_notify_staff
AFTER INSERT ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.notify_staff_on_new_appointment();
