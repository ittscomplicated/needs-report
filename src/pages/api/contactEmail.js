import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const isEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, subject, message } = req.body || {};

    // Basic validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: subject?.trim()
        ? `[Needs Report] ${subject.trim()}`
        : "[Needs Report] New Contact Request",
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        subject?.trim() ? `Subject: ${subject.trim()}` : null,
        "",
        "Message:",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
}
