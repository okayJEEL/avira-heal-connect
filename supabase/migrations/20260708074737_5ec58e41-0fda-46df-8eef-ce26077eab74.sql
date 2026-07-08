
-- 1) Remove anonymous SELECT policy on appointments
DROP POLICY IF EXISTS "Anyone can check slot availability" ON public.appointments;

-- 2) Remove appointments from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.appointments;

-- 3) Safe function for public availability checks - returns only time_slot
CREATE OR REPLACE FUNCTION public.get_booked_slots(_department text, _day date)
RETURNS TABLE(time_slot timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.time_slot
  FROM public.appointments a
  WHERE a.department = _department
    AND a.time_slot >= (_day::timestamp AT TIME ZONE 'UTC')
    AND a.time_slot < ((_day + 1)::timestamp AT TIME ZONE 'UTC')
    AND a.status IN ('pending','confirmed','completed');
$$;

REVOKE ALL ON FUNCTION public.get_booked_slots(text, date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_booked_slots(text, date) TO anon, authenticated;

-- 4) Lock down internal SECURITY DEFINER functions from direct execution
REVOKE ALL ON FUNCTION public.handle_first_admin() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notify_staff_on_new_appointment() FROM PUBLIC, anon, authenticated;

-- has_role and current_doctor_slug are used inside RLS policies (executed as definer),
-- so revoke direct anon execution but keep authenticated for policy evaluation contexts.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.current_doctor_slug() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_doctor_slug() TO authenticated, service_role;
