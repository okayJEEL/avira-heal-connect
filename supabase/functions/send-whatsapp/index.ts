import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";
const SANDBOX_FROM = "whatsapp:+14155238886";

function buildMessage(event: string, data: Record<string, string>): string {
  const { patient_name, doctor_name, department, date, time, fee } = data;

  switch (event) {
    case "booking":
      return `Dear ${patient_name}, your appointment has been booked with ${doctor_name} (${department}) on ${date} at ${time}. Fee: ₹${fee}. Status: Pending confirmation. — Avira Hospital`;
    case "confirmed":
      return `Dear ${patient_name}, your appointment with ${doctor_name} on ${date} at ${time} is confirmed. Please arrive 15 mins early. — Avira Hospital`;
    case "cancelled":
      return `Dear ${patient_name}, your appointment with ${doctor_name} on ${date} at ${time} has been cancelled. Please rebook if needed. — Avira Hospital`;
    default:
      throw new Error(`Unknown event type: ${event}`);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
    if (!TWILIO_API_KEY) throw new Error("TWILIO_API_KEY is not configured");

    // Use secret if available, otherwise sandbox
    const fromNumber =
      Deno.env.get("TWILIO_WHATSAPP_FROM") || SANDBOX_FROM;

    const body = await req.json();
    const { mobile, patient_name, doctor_name, department, date, time, fee, event } = body;

    if (!mobile || !patient_name || !event) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: mobile, patient_name, event" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const message = buildMessage(event, { patient_name, doctor_name, department, date, time, fee });

    // Format mobile: ensure it has country code
    const toNumber = mobile.startsWith("+") ? mobile : `+91${mobile.replace(/^0+/, "")}`;

    const response = await fetch(`${GATEWAY_URL}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TWILIO_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: `whatsapp:${toNumber}`,
        From: fromNumber.startsWith("whatsapp:") ? fromNumber : `whatsapp:${fromNumber}`,
        Body: message,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Twilio error:", JSON.stringify(data));
      throw new Error(`Twilio API error [${response.status}]: ${JSON.stringify(data)}`);
    }

    console.log("WhatsApp sent successfully, SID:", data.sid);

    return new Response(
      JSON.stringify({ success: true, sid: data.sid }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("send-whatsapp error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
