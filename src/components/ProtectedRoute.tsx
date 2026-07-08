import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [hasRole, setHasRole] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        checkRole(session.user.id);
      } else {
        setHasRole(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        checkRole(session.user.id);
      } else {
        setHasRole(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .limit(1);
    setHasRole(!!data && data.length > 0);
  };

  if (session === undefined || hasRole === undefined) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  if (!session || !hasRole) {
    return <Navigate to="/staff-portal" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
