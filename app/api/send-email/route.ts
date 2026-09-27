import { NextRequest, NextResponse } from "next/server";
import { sendGmailMessage } from "@/lib/gmailService";
import { generateEmailTemplate } from "@/lib/emailTemplate";
import type { RegistrationEmailPayload } from "@/lib/emailTemplate";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "Invalid Content-Type. Expected application/json." },
        { status: 400 }
      );
    }

    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    let to = "";
    let subject = "";
    let htmlContent = "";
    let textContent = "";

    // Support 1: Full Registration Email Payload (Blocked - Registrations Closed)
    if (body.leaderEmail && body.teamName) {
      return NextResponse.json(
        { success: false, error: "Team registrations for YODHA 2.0 are officially closed. No new submissions are accepted." },
        { status: 403 }
      );
    } 
    // Support 2: Standard Direct Send Payload { to, subject, text, html }
    else {
      to = (body.to || "").trim();
      subject = (body.subject || "").trim();
      textContent = (body.text || "").trim();
      htmlContent = (body.html || "").trim();
    }

    // Server-side Input Validation
    if (!to || !EMAIL_REGEX.test(to)) {
      return NextResponse.json(
        { success: false, error: "A valid recipient email address ('to') is required." },
        { status: 400 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        { success: false, error: "Email subject is required." },
        { status: 400 }
      );
    }

    if (!htmlContent && !textContent) {
      return NextResponse.json(
        { success: false, error: "Email content ('html' or 'text') is required." },
        { status: 400 }
      );
    }

    // Limit maximum payload size for security
    if ((htmlContent.length + textContent.length) > 500000) {
      return NextResponse.json(
        { success: false, error: "Email payload exceeds maximum allowed size." },
        { status: 400 }
      );
    }

    // Dispatch email via server-side Gmail API
    const result = await sendGmailMessage({
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || "Unable to send email" },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("❌ [API /api/send-email Error]:", err?.message || err);
    return NextResponse.json(
      { success: false, error: "Unable to send email" },
      { status: 500 }
    );
  }
}
