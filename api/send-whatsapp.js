// Serverless function (Vercel) — auto-sends enquiry/contact form messages to
// the business WhatsApp via the free CallMeBot API.
//
// Required environment variables (set in Vercel → Project → Settings → Environment Variables):
//   CALLMEBOT_PHONE   e.g. 919488075700   (the number that activated CallMeBot)
//   CALLMEBOT_APIKEY  the API key CallMeBot gave you after activation
//
// The static site posts JSON { message: "..." } to /api/send-whatsapp.

export default async function handler(req, res) {
  // CORS (harmless when same-origin on Vercel; allows other hosts too)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ ok: false, error: "Method not allowed" });

  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey)
    return res
      .status(500)
      .json({ ok: false, error: "Server not configured (missing CALLMEBOT_PHONE / CALLMEBOT_APIKEY)" });

  // Parse body (Vercel auto-parses JSON, but guard for string bodies too)
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const message = body && body.message ? String(body.message).slice(0, 2000) : "";
  if (!message)
    return res.status(400).json({ ok: false, error: "Empty message" });

  const url =
    "https://api.callmebot.com/whatsapp.php" +
    "?phone=" + encodeURIComponent(phone) +
    "&text=" + encodeURIComponent(message) +
    "&apikey=" + encodeURIComponent(apikey);

  try {
    const r = await fetch(url);
    const text = await r.text();
    if (!r.ok)
      return res.status(502).json({ ok: false, error: "CallMeBot error", detail: text.slice(0, 300) });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false, error: String(e) });
  }
}
