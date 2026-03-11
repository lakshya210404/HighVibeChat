import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Duration in minutes for each tier
const TIER_DURATIONS: Record<string, number> = {
  light_up: 30,
  blaze_mode: 60,
  elevated: 1440, // 24 hours
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("Not authenticated");

    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Session ID is required");

    // Check if already activated
    const { data: existing } = await supabaseClient
      .from("premium_access")
      .select("id")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ success: true, already_activated: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify payment with Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2025-08-27.basil" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    const tier = session.metadata?.tier;
    if (!tier || !TIER_DURATIONS[tier]) {
      throw new Error("Invalid tier in session metadata");
    }

    const durationMinutes = TIER_DURATIONS[tier];
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

    // Get product ID from line items
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 1 });
    const productId = lineItems.data[0]?.price?.product || "";

    const { error: insertError } = await supabaseClient.from("premium_access").insert({
      user_id: user.id,
      tier,
      product_id: typeof productId === "string" ? productId : "",
      started_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      stripe_session_id: sessionId,
    });

    if (insertError) throw new Error(`DB error: ${insertError.message}`);

    return new Response(JSON.stringify({ success: true, tier, expires_at: expiresAt.toISOString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
