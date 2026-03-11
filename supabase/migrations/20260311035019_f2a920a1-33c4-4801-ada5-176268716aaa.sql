CREATE POLICY "Doctors can update appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'doctor'::app_role))
WITH CHECK (has_role(auth.uid(), 'doctor'::app_role));