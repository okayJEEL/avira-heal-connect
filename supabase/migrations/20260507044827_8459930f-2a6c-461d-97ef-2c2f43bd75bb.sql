
-- Weekly recurring availability per doctor per weekday
CREATE TABLE public.doctor_weekly_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL,
  weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  is_available BOOLEAN NOT NULL DEFAULT true,
  start_time TIME NOT NULL DEFAULT '10:00',
  end_time TIME NOT NULL DEFAULT '13:00',
  slot_minutes INTEGER NOT NULL DEFAULT 15,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (doctor_id, weekday)
);

-- Date-specific overrides (leave or custom hours)
CREATE TABLE public.doctor_date_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('leave','custom')),
  start_time TIME,
  end_time TIME,
  slot_minutes INTEGER DEFAULT 15,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (doctor_id, date)
);

ALTER TABLE public.doctor_weekly_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_date_overrides ENABLE ROW LEVEL SECURITY;

-- SELECT: any authenticated staff
CREATE POLICY "Staff can view weekly availability"
ON public.doctor_weekly_availability FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'doctor') OR public.has_role(auth.uid(),'staff'));

CREATE POLICY "Staff can view date overrides"
ON public.doctor_date_overrides FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'doctor') OR public.has_role(auth.uid(),'staff'));

-- INSERT/UPDATE/DELETE: admin or the doctor themselves
CREATE POLICY "Admin or self can insert weekly"
ON public.doctor_weekly_availability FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(),'admin') OR auth.uid() = doctor_id);

CREATE POLICY "Admin or self can update weekly"
ON public.doctor_weekly_availability FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(),'admin') OR auth.uid() = doctor_id)
WITH CHECK (public.has_role(auth.uid(),'admin') OR auth.uid() = doctor_id);

CREATE POLICY "Admin or self can delete weekly"
ON public.doctor_weekly_availability FOR DELETE TO authenticated
USING (public.has_role(auth.uid(),'admin') OR auth.uid() = doctor_id);

CREATE POLICY "Admin or self can insert overrides"
ON public.doctor_date_overrides FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(),'admin') OR auth.uid() = doctor_id);

CREATE POLICY "Admin or self can update overrides"
ON public.doctor_date_overrides FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(),'admin') OR auth.uid() = doctor_id)
WITH CHECK (public.has_role(auth.uid(),'admin') OR auth.uid() = doctor_id);

CREATE POLICY "Admin or self can delete overrides"
ON public.doctor_date_overrides FOR DELETE TO authenticated
USING (public.has_role(auth.uid(),'admin') OR auth.uid() = doctor_id);

-- updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_weekly_avail_updated BEFORE UPDATE ON public.doctor_weekly_availability
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_date_overrides_updated BEFORE UPDATE ON public.doctor_date_overrides
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_weekly_doctor ON public.doctor_weekly_availability(doctor_id);
CREATE INDEX idx_overrides_doctor_date ON public.doctor_date_overrides(doctor_id, date);
