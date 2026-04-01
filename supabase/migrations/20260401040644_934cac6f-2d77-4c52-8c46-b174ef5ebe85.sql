CREATE POLICY "Anyone can check slot availability"
ON public.appointments
FOR SELECT
TO anon
USING (true);