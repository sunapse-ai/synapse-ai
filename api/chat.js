export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const { task } = req.body;

  if (!task) {
    return res.status(400).json({
      error: "Task is required"
    });
  }

  return res.status(200).json({
    message: "SYNAPSE Research Agent received your task.",
    task: task
  });
}
