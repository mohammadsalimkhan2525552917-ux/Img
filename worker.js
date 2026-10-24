export default {
  async fetch(request, env) {

    // CORS — GitHub Pages se request allow karne ke liye
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // Browser ka CORS preflight request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    // Sirf POST requests allow
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({
          error: "Only POST requests are allowed."
        }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    try {

      const body = await request.json();

      const prompt = body.prompt;

      if (!prompt || typeof prompt !== "string") {
        return new Response(
          JSON.stringify({
            error: "Prompt is required."
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          }
        );
      }

      /*
       * API KEY ko GitHub code mein nahi rakhenge.
       * Baad mein Cloudflare Secret mein GEMINI_API_KEY
       * naam se add karenge.
       */

      if (!env.GEMINI_API_KEY) {
        return new Response(
          JSON.stringify({
            error: "GEMINI_API_KEY is not configured."
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          }
        );
      }

      // Gemini image generation request
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": env.GEMINI_API_KEY
          },

          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              responseModalities: ["TEXT", "IMAGE"]
            }
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return new Response(
          JSON.stringify({
            error: data.error?.message || "Image generation failed."
          }),
          {
            status: response.status,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          }
        );
      }

      return new Response(
        JSON.stringify(data),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );

    } catch (error) {

      return new Response(
        JSON.stringify({
          error: error.message || "Server error."
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
  }
};
