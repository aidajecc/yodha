import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Initialize Firebase Admin SDK (server-side only)
const getAdminDb = () => {
  if (!getApps().length) {
    // Use service account if available, otherwise fall back to application default credentials
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (serviceAccountJson) {
      try {
        const serviceAccount = JSON.parse(serviceAccountJson);
        initializeApp({ credential: cert(serviceAccount) });
      } catch {
        // Fallback: use project ID only (works in Firebase-hosted environments)
        initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "yodha-2" });
      }
    } else {
      initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "yodha-2" });
    }
  }
  return getFirestore();
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      teamDocId,
      teamId,
    } = body;

    // --- 1. Validate required fields ---
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing Razorpay payment fields." },
        { status: 400 }
      );
    }

    if (!teamDocId && !teamId) {
      return NextResponse.json(
        { success: false, error: "Missing team identifier (teamDocId or teamId)." },
        { status: 400 }
      );
    }

    // --- 2. Verify HMAC-SHA256 signature ---
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: "Server configuration error: missing Razorpay secret." },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.warn("❌ Razorpay signature mismatch — possible tampered request.");
      return NextResponse.json(
        { success: false, error: "Payment verification failed: invalid signature." },
        { status: 400 }
      );
    }

    // --- 3. Update Firebase Firestore (server-side via Admin SDK) ---
    let dbUpdated = false;
    try {
      const db = getAdminDb();
      const docId = teamDocId || teamId;
      const teamRef = db.collection("selected_teams").doc(docId);

      await teamRef.set(
        {
          paymentStatus: "Completed",
          paymentTxnId: razorpay_payment_id,
          paymentOrderId: razorpay_order_id,
          paymentVerifiedAt: new Date().toISOString(),
          updatedAt: new Date(),
        },
        { merge: true }
      );
      dbUpdated = true;
    } catch (dbErr: any) {
      console.warn("⚠️ Firebase Admin update failed:", dbErr?.message);
      // Don't fail the whole response — payment signature WAS cryptographically verified.
      // The client portal will run a client-side updateSelectedTeamPayment fallback if dbUpdated is false.
    }

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      dbUpdated,
      message: "Payment verified and team slot confirmed.",
    });
  } catch (err: any) {
    console.error("❌ [Razorpay verify-payment Error]:", err?.message || err);
    return NextResponse.json(
      { success: false, error: "Payment verification failed." },
      { status: 500 }
    );
  }
}
