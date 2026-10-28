import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contact_schema } from "@/lib/contact-schema";

// export const runtime = "nodejs";
const TO_EMAIL = "skmdjeesan@gmail.com";

// visitor input goes into an HTML email, so escape it
const escape_html = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // honeypot: real users never fill this hidden field, bots do.
  // pretend it worked so bots don't retry
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contact_schema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { error: "Please fix the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }

  const { name, email, message } = parsed.data;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.error("Missing GMAIL_USER or GMAIL_APP_PASSWORD");
    return NextResponse.json(
      { error: "Mail service is not configured." },
      { status: 500 },
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const safe_name = name.replace(/[\r\n]+/g, " "); // keep newlines out of the subject line

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${user}>`,
      to: TO_EMAIL,
      replyTo: { name: safe_name, address: email }, // hitting Reply goes to the visitor
      subject: `New message from ${safe_name} via portfolio`,
      text: `Name: ${safe_name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family:sans-serif;line-height:1.6">
          <h2 style="margin:0 0 12px">New portfolio message</h2>
          <p><b>Name:</b> ${escape_html(safe_name)}</p>
          <p><b>Email:</b> ${escape_html(email)}</p>
          <p style="white-space:pre-wrap;border-left:3px solid #fbbf24;padding-left:12px">${escape_html(message)}</p>
        </div>`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("sendMail failed:", err);
    return NextResponse.json(
      { error: "Could not send your message. Please try again." },
      { status: 500 },
    );
  }
}
