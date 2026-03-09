
-- Drop the restrictive ALL policy that blocks anonymous inserts
DROP POLICY IF EXISTS "Admins can manage appointments" ON public.appointments;

-- Recreate admin policy for SELECT, UPDATE, DELETE only (not INSERT)
CREATE POLICY "Admins can read appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete appointments"
ON public.appointments
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
