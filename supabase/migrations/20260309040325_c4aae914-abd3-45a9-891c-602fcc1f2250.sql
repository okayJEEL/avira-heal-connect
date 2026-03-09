-- Add consultation type and video call link columns to appointments
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS consultation_type text DEFAULT 'opd',
ADD COLUMN IF NOT EXISTS video_call_link text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS patient_type text DEFAULT 'new';