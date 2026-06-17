export type Service = {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  visitFee: number;
};

export type BookingStatus = "pending" | "confirmed" | "completed" | "failed";

export type PaymentStatus = "pending" | "paid" | "failed";

export type TherapistGenderPreference = "male" | "female" | "no-preference";

export type ServiceDistrict = "muzaffarnagar" | "saharanpur" | "meerut" | "shamli";

export type BookingPayload = {
  name: string;
  phone: string;
  address: string;
  serviceDistrict: ServiceDistrict;
  serviceId: string;
  therapistGenderPreference: TherapistGenderPreference;
  dateTime: string;
};

export type Booking = BookingPayload & {
  id: string;
  userId: string;
  userEmail: string | null;
  serviceName: string;
  servicePrice: number;
  visitFee: number;
  payableAmount?: number;
  freeSessionNumber: number | null;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UserOfferState = {
  uid: string;
  email: string | null;
  usedFreeSessions: number;
  completedFreeSessions?: number;
};

export type AuthUser = {
  uid: string;
  email: string | null;
  name?: string;
  isAdmin: boolean;
};
