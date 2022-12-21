const { event } = require("./data.json");

export default function handler(req, res) {
  const evt = event.filter((ev) => ev.slug === req.query.slug);

  if (req.method === "GET") {
    res.status(200).json(evt);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ massage: `Method ${res.method} is not allowed` });
  }
}
