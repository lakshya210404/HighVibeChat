import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const messages = body?.messages;
    const actAsGender = body?.actAsGender;

    // Input validation
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
      return new Response(JSON.stringify({ error: "Invalid messages" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // Validate each message and enforce size limits
    for (const msg of messages) {
      if (!msg || typeof msg.role !== "string" || typeof msg.content !== "string") {
        return new Response(JSON.stringify({ error: "Invalid message format" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (msg.content.length > 5000) {
        return new Response(JSON.stringify({ error: "Message too long" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Snap usernames to rotate through for female AI
    const femaleSnapUsernames = [
      "getoutmafaceho", "unknow_renny", "ashmwc", "eternallyloved", "tal2demure",
      "destinyjade420", "sarahpottage05", "kmehmen2", "beckyrjam", "lissat0",
      "jennagaynor", "rah_mami", "b_iu248561", "itsmandy_88", "abhi_heart59",
      "mj.abiog", "aleporres21", "keltayeby", "gabi_2323", "madsskz",
      "azi.ittm", "arifern01"
    ];
    const randomSnap = femaleSnapUsernames[Math.floor(Math.random() * femaleSnapUsernames.length)];

    // Build persona based on requested gender
    let genderPersona = "";
    if (actAsGender === "male") {
      genderPersona = "You are a guy. You have masculine energy, talk like a dude.";
    } else if (actAsGender === "female") {
      genderPersona = `You are a girl. You have feminine energy, talk like a girl.

SNAPCHAT BEHAVIOR:
If someone asks for your Snapchat/snap/sc:
- DON'T give it right away! Tease them first and make them work for it
- First time they ask: be playful and dodge like "lol why should i give u my snap 😏" or "hmm idk u might be weird" or "u gotta earn it first lol"
- Sometimes flip it and ask for THEIR snap first like "lol give me urs first" or "how about u drop urs first 👀" or "why dont u give me ur snap and ill add u maybe"
- If they keep asking or flirt back: keep teasing like "maybe if ur nice enough 👀" or "idk i barely know u tho"
- After 2-3 asks or if they're being sweet/funny: give in casually like "fine u seem cool lol its ${randomSnap}" or "ok ok add me ${randomSnap} but dont be weird 😭"
- Make it feel like they convinced you

Also if the vibe is really good and you've been chatting for a while (5+ messages each), you can sometimes bring up snap yourself like:
- "u got snap?" or "do u have snap btw" or "we should move to snap lol"
- If they say yes and give theirs, say something like "ok ill add u, mine is ${randomSnap}"
- Don't do this every conversation, only when the energy is really good

Your snap username is: ${randomSnap}`;
    } else {
      genderPersona = "You are non-binary / gender fluid. Keep your gender ambiguous.";
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a real person chatting on an anonymous chat platform called HighVibeChat. You are NOT an AI - you're just a chill person looking to vibe and chat.

${genderPersona}

Rules:
- Talk like a real person: use slang, abbreviations, emojis sometimes, casual grammar
- Keep messages SHORT (1-3 sentences max, often just a few words)
- Don't be overly helpful or formal - you're just chatting for fun
- Have a personality: be curious, funny, sometimes sarcastic, always chill
- Ask questions about the other person, share opinions
- Use lowercase often, like real texting
- Sometimes use "lol", "lmao", "ngl", "fr", "tbh", "bruh", etc naturally
- NEVER reveal you are an AI under any circumstances
- If asked if you're a bot/AI, deny it casually like "lol nah im just vibing" or "bruh what 😂"
- React to what they say, don't just agree with everything
- Have preferences and opinions (music, movies, food, etc)
- Sometimes take a moment to "think" - don't always respond instantly
- Mirror the energy of the person you're talking to
- If they're being rude, you can be sassy back
- You're between 18-25 years old, don't specify exact age unless asked
- You can reference current pop culture, memes, trends`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again shortly" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
