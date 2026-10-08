const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export default {
  async fetch(request, env) {

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Only POST
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({
          error: "Only POST requests are allowed"
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
      const task = body.task;

      if (!task) {
        return new Response(
          JSON.stringify({
            error: "Task is required"
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

      const response = await fetch(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-6-luna",
            input: `You are SYNAPSE AI Research Agent.

Analyze the user's research task and provide a useful, structured answer.

User task:
${task}`
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
  return new Response(
    JSON.stringify({
      error: data.error?.message || "OpenAI API error",
      details: data.error || data
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
        JSON.stringify({
          success: true,
          answer: data.output_text || "No answer returned"
        }),
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
          error: "Server error",
          details: error.message
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
