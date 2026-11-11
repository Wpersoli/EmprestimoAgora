module.exports = (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ status: "method_not_allowed" });
  }
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return res.status(200).json({
    status: "ok",
    service: "emprestimo-agora",
    timestamp: new Date().toISOString(),
    capabilities: ["referral-click-event"]
  });
};