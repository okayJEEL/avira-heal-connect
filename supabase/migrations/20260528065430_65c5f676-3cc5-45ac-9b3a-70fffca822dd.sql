
-- Drop old policies first (they reference doctor_id)
DROP POLICY IF EXISTS "Admin or self can delete weekly" ON public.doctor_weekly_availability;
DROP POLICY IF EXISTS "Admin or self can insert weekly" ON public.doctor_weekly_availability;
DROP POLICY IF EXISTS "Admin or self can update weekly" ON public.doctor_weekly_availability;
DROP POLICY IF EXISTS "Staff can view weekly availability" ON public.doctor_weekly_availability;

DROP POLICY IF EXISTS "Admin or self can delete overrides" ON public.doctor_date_overrides;
DROP POLICY IF EXISTS "Admin or self can insert overrides" ON public.doctor_date_overrides;
DROP POLICY IF EXISTS "Admin or self can update overrides" ON public.doctor_date_overrides;
DROP POLICY IF EXISTS "Staff can view date overrides" ON public.doctor_date_overrides;

-- Clear old rows that were keyed by auth user id
TRUNCATE TABLE public.doctor_date_overrides;
TRUNCATE TABLE public.doctor_weekly_availability;

-- Switch doctor_id from uuid to text (doctor slug)
ALTER TABLE public.doctor_weekly_availability
  ALTER COLUMN doctor_id TYPE text USING doctor_id::text;
ALTER TABLE public.doctor_date_overrides
  ALTER COLUMN doctor_id TYPE text USING doctor_id::text;

-- Public read so the booking page (anon) can filter slots
GRANT SELECT ON public.doctor_weekly_availability TO anon;
GRANT SELECT ON public.doctor_date_overrides TO anon;

CREATE POLICY "Anyone can view weekly availability"
  ON public.doctor_weekly_availability FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view date overrides"
  ON public.doctor_date_overrides FOR SELECT
  USING (true);

CREATE POLICY "Admins manage weekly availability"
  ON public.doctor_weekly_availability FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage date overrides"
  ON public.doctor_date_overrides FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
