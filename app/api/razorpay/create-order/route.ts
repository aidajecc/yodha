import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured.");
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, teamId, teamName, currency = "INR" } = body;

    if (!amount || !teamId || !teamName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: amount, teamId, teamName" },
        { status: 400 }
      );
    }

    // Sanitize amount (handle numbers or strings like "700", "₹700", etc.)
    const cleanAmount = typeof amount === "number" ? amount : Number(String(amount).replace(/[^0-9.]/g, ""));
    // Razorpay amount is in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(cleanAmount * 100);
    if (isNaN(amountInPaise) || amountInPaise <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid amount value." },
        { status: 400 }
      );
    }

    const razorpay = getRazorpayInstance();

    // Receipt max length in Razorpay is 40 characters
    const cleanTeamId = String(teamId).replace(/[^a-zA-Z0-9]/g, "").slice(-16);
    const safeReceipt = `rcpt_${cleanTeamId}_${Date.now().toString().slice(-10)}`.slice(0, 40);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: safeReceipt,
      notes: {
        teamId: String(teamId).slice(0, 40),
        teamName: String(teamName).slice(0, 100),
        source: "YODHA 2.0 Payment Portal",
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    console.error("❌ [Razorpay create-order Error]:", err?.message || err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to create Razorpay order." },
      { status: 500 }
    );
  }
}
