
-- Drop the restrictive insert policy
DROP POLICY IF EXISTS "Anyone can book appointments" ON public.appointments;

-- Recreate as permissive so anonymous users can book
CREATE POLICY "Anyone can book appointments"
ON public.appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
