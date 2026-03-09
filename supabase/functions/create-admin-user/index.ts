import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  try {
    // Create admin user
    const { data: userRes, error: userError } = await supabase.auth.admin.createUser({
      email: "admin@avirahospital.com",
      password: "admin123",
      email_confirm: true,
    });

    if (userError && !userError.message.includes("already registered")) {
      throw userError;
    }

    const userId = userRes?.user?.id;
    if (!userId) {
      // User already exists, find them
      const { data: users } = await supabase.auth.admin.listUsers();
      const existingUser = users?.users?.find(u => u.email === "admin@avirahospital.com");
      if (existingUser) {
        // Ensure they have admin role
        const { error: roleError } = await supabase
          .from("user_roles")
          .upsert({ user_id: existingUser.id, role: "admin" }, { onConflict: "user_id,role" });
        
        return new Response(
          JSON.stringify({ success: true, message: "Admin user already exists, role confirmed." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("Could not create or find admin user");
    }

    // Assign admin role
    const { error: roleError } = await supabase
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

    if (roleError) throw roleError;

    return new Response(
      JSON.stringify({ success: true, message: "Admin user created successfully!" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
