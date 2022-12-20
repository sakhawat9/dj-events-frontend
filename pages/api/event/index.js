const { event } = require("./data.json");

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(event);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ massage: `Method ${res.method} is not allowed` });
  }
}
