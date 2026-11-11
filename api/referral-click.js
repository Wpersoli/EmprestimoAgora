const ALLOWED = new Set(["facio", "jeitto", "recargapay", "velotax", "supersim"]);
const cleanPath = (value) => typeof value === "string" && value.startsWith("/") && value.length <= 120 ? value.split("?")[0].split("#")[0] : "/";
module.exports = (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin || !host) return res.status(403).json({ error: "Forbidden" });
  let originHost;
  try { originHost = new URL(origin).host; } catch { return res.status(403).json({ error: "Forbidden" }); }
  if (originHost !== host) return res.status(403).json({ error: "Forbidden" });
  let body = req.body;
  if (typeof body === "string") {
    if (body.length > 2048) return res.status(413).json({ error: "Payload too large" });
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "Invalid JSON" }); }
  }
  if (!body || !ALLOWED.has(body.partner)) return res.status(400).json({ error: "Invalid partner" });
  const event = {
    event: "partner_referral_click",
    partner: body.partner,
    page: cleanPath(body.page),
    placement: body.placement === "article-content" ? "article-content" : body.placement === "partner-card" ? "partner-card" : body.placement === "chat-assistant" ? "chat-assistant" : "other",
    timestamp: new Date().toISOString()
  };
  // Event is emitted to Vercel Function logs; no IP, email, CPF, or query string is collected.
  console.log(JSON.stringify(event));
  return res.status(204).end();
};