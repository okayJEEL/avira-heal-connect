
-- Mapping table: doctor staff user -> doctor slug shown on the website
CREATE TABLE IF NOT EXISTS public.doctor_profiles (
  user_id uuid PRIMARY KEY,
  doctor_slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.doctor_profiles TO authenticated;
GRANT ALL ON public.doctor_profiles TO service_role;

ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage doctor_profiles"
  ON public.doctor_profiles FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "User can read own doctor_profile"
  ON public.doctor_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Helper: doctor slug for the currently signed-in user (security definer to bypass RLS)
CREATE OR REPLACE FUNCTION public.current_doctor_slug()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT doctor_slug FROM public.doctor_profiles WHERE user_id = auth.uid()
$$;

-- Replace admin-only edit policies with admin-or-mapped-doctor
DROP POLICY IF EXISTS "Admins manage weekly availability" ON public.doctor_weekly_availability;
DROP POLICY IF EXISTS "Admins manage date overrides" ON public.doctor_date_overrides;

CREATE POLICY "Admin or mapped doctor manage weekly"
  ON public.doctor_weekly_availability FOR ALL
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR doctor_id = public.current_doctor_slug()
  )
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role)
    OR doctor_id = public.current_doctor_slug()
  );

CREATE POLICY "Admin or mapped doctor manage overrides"
  ON public.doctor_date_overrides FOR ALL
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR doctor_id = public.current_doctor_slug()
  )
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role)
    OR doctor_id = public.current_doctor_slug()
  );
