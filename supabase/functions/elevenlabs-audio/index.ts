import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!KEY) throw new Error("ELEVENLABS_API_KEY missing");
    const body = await req.json();
    const { kind } = body;

    if (kind === "tts") {
      const { text, voiceId } = body;
      const r = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
        {
          method: "POST",
          headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.55,
              similarity_boost: 0.8,
              style: 0.35,
              use_speaker_boost: true,
              speed: 1.0,
            },
          }),
        }
      );
      if (!r.ok) {
        return new Response(JSON.stringify({ error: await r.text(), status: r.status }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const buf = await r.arrayBuffer();
      return new Response(buf, {
        headers: { ...corsHeaders, "Content-Type": "audio/mpeg" },
      });
    }

    if (kind === "music") {
      const { prompt, music_length_ms } = body;
      const r = await fetch("https://api.elevenlabs.io/v1/music", {
        method: "POST",
        headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, music_length_ms }),
      });
      if (!r.ok) {
        return new Response(JSON.stringify({ error: await r.text(), status: r.status }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const buf = await r.arrayBuffer();
      return new Response(buf, {
        headers: { ...corsHeaders, "Content-Type": "audio/mpeg" },
      });
    }

    return new Response(JSON.stringify({ error: "unknown kind" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
