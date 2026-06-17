import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "./firebase-admin";
import { getService } from "./services";
import type { AuthUser, BookingPayload, BookingStatus } from "./types";

export async function createPendingBooking(
  payload: BookingPayload,
  razorpayOrderId: string,
  user: AuthUser,
  payableAmount: number,
) {
  const db = getAdminDb();
  const service = getService(payload.serviceId);

  if (!service) {
    throw new Error("Invalid service selected.");
  }

  const userRef = db.collection("users").doc(user.uid);
  const bookingRef = db.collection("bookings").doc();

  const booking = await db.runTransaction(async (transaction) => {
    const userSnap = await transaction.get(userRef);
    const completedFreeSessions = userSnap.exists
      ? Number(userSnap.data()?.completedFreeSessions ?? 0)
      : 0;
    const freeSessionNumber = completedFreeSessions < 2 ? completedFreeSessions + 1 : null;

    if (!userSnap.exists) {
      transaction.set(userRef, {
        uid: user.uid,
        email: user.email,
        name: payload.name,
        phone: payload.phone,
        usedFreeSessions: 0,
        completedFreeSessions: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    } else {
      transaction.update(userRef, {
        name: payload.name,
        phone: payload.phone,
        email: user.email,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    const data = {
      userId: user.uid,
      userEmail: user.email,
      name: payload.name,
      phone: payload.phone,
      address: payload.address,
      serviceDistrict: payload.serviceDistrict,
      serviceId: payload.serviceId,
      therapistGenderPreference: payload.therapistGenderPreference,
      dateTime: payload.dateTime,
      serviceName: service.name,
      servicePrice: service.price,
      visitFee: service.visitFee,
      payableAmount,
      freeSessionNumber,
      status: "pending",
      paymentStatus: "pending",
      razorpayOrderId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    transaction.set(bookingRef, data);
    return { id: bookingRef.id, ...data };
  });

  return booking;
}

export async function confirmPaidBooking({
  bookingId,
  orderId,
  paymentId,
}: {
  bookingId: string;
  orderId: string;
  paymentId: string;
}) {
  const db = getAdminDb();
  const bookingRef = db.collection("bookings").doc(bookingId);

  return db.runTransaction(async (transaction) => {
    const bookingSnap = await transaction.get(bookingRef);

    if (!bookingSnap.exists) {
      throw new Error("Booking not found.");
    }

    const booking = bookingSnap.data();

    if (booking?.razorpayOrderId !== orderId) {
      throw new Error("Payment order does not match booking.");
    }

    transaction.update(bookingRef, {
      status: "confirmed",
      paymentStatus: "paid",
      razorpayPaymentId: paymentId,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return { id: bookingId, ...booking, status: "confirmed", paymentStatus: "paid" };
  });
}

export async function markPaymentFailed(bookingId: string) {
  const db = getAdminDb();
  await db.collection("bookings").doc(bookingId).update({
    status: "failed",
    paymentStatus: "failed",
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function listBookings() {
  const db = getAdminDb();
  const snap = await db.collection("bookings").orderBy("createdAt", "desc").limit(100).get();

  return snap.docs.map((doc) => serializeDoc(doc.id, doc.data()));
}

export async function listUserBookings(userId: string) {
  const db = getAdminDb();
  const snap = await db
    .collection("bookings")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  return snap.docs.map((doc) => serializeDoc(doc.id, doc.data()));
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  const db = getAdminDb();
  const bookingRef = db.collection("bookings").doc(bookingId);

  await db.runTransaction(async (transaction) => {
    const bookingSnap = await transaction.get(bookingRef);

    if (!bookingSnap.exists) {
      throw new Error("Booking not found.");
    }

    const booking = bookingSnap.data();
    const wasCompleted = booking?.status === "completed";
    const isCompletingFreeSession =
      status === "completed" && !wasCompleted && booking?.freeSessionNumber && !booking?.freeSessionCompletedAt;

    transaction.update(bookingRef, {
      status,
      ...(status === "completed" ? { completedAt: FieldValue.serverTimestamp() } : {}),
      ...(isCompletingFreeSession ? { freeSessionCompletedAt: FieldValue.serverTimestamp() } : {}),
      updatedAt: FieldValue.serverTimestamp(),
    });

    if (isCompletingFreeSession) {
      transaction.set(
        db.collection("users").doc(String(booking.userId)),
        {
          uid: booking.userId,
          email: booking.userEmail ?? null,
          usedFreeSessions: FieldValue.increment(1),
          completedFreeSessions: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }
  });
}

export async function getCompletedFreeSessionCount(userId: string) {
  const userSnap = await getAdminDb().collection("users").doc(userId).get();
  return userSnap.exists ? Number(userSnap.data()?.completedFreeSessions ?? 0) : 0;
}

function serializeDoc(id: string, data: FirebaseFirestore.DocumentData) {
  return Object.fromEntries(
    Object.entries({ id, ...data }).map(([key, value]) => [
      key,
      isFirestoreTimestamp(value) ? value.toDate().toISOString() : value,
    ]),
  );
}

function isFirestoreTimestamp(value: unknown): value is { toDate: () => Date } {
  return Boolean(value && typeof value === "object" && "toDate" in value);
}
