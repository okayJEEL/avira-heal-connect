
-- Tighten permissive INSERT policies flagged by scanner

-- appointments: public bookings must satisfy basic validity constraints
DROP POLICY IF EXISTS "Anyone can book appointments" ON public.appointments;
CREATE POLICY "Anyone can book appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (
    patient_name IS NOT NULL AND length(trim(patient_name)) BETWEEN 1 AND 120
    AND mobile IS NOT NULL AND length(trim(mobile)) BETWEEN 7 AND 20
    AND time_slot IS NOT NULL
    AND (status IS NULL OR status IN ('pending','confirmed'))
  );

-- contact_messages: public submissions must satisfy basic validity constraints
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (
    name IS NOT NULL AND length(trim(name)) BETWEEN 1 AND 120
    AND message IS NOT NULL AND length(trim(message)) BETWEEN 1 AND 5000
    AND (status IS NULL OR status = 'unread')
  );

-- staff_notifications: inserts go through SECURITY DEFINER trigger, so restrict RLS-based inserts
DROP POLICY IF EXISTS "System can insert notifications" ON public.staff_notifications;
CREATE POLICY "Admins can insert notifications"
  ON public.staff_notifications FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
