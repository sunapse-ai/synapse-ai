export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Only POST requests are allowed" }),
        {
          status: 405,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    try {
      const body = await request.json();
      const task = body.task;

      if (!task) {
        return new Response(
          JSON.stringify({ error: "Task is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "SYNAPSE Research Agent received your task.",
          task: task
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }
};
