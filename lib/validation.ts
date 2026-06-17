import { getService } from "./services";
import type { BookingPayload, ServiceDistrict, TherapistGenderPreference } from "./types";

const phonePattern = /^[6-9]\d{9}$/;
const therapistGenderPreferences: TherapistGenderPreference[] = [
  "male",
  "female",
  "no-preference",
];
const serviceDistricts: ServiceDistrict[] = ["muzaffarnagar", "saharanpur", "meerut", "shamli"];

export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "").slice(-10);
}

export function validateBookingPayload(payload: Partial<BookingPayload>) {
  const errors: Partial<Record<keyof BookingPayload, string>> = {};
  const name = payload.name?.trim() ?? "";
  const phone = normalizePhone(payload.phone ?? "");
  const address = payload.address?.trim() ?? "";
  const serviceDistrict = payload.serviceDistrict;
  const serviceId = payload.serviceId?.trim() ?? "";
  const therapistGenderPreference = payload.therapistGenderPreference;
  const dateTime = payload.dateTime?.trim() ?? "";

  if (name.length < 2) errors.name = "Enter your full name.";
  if (!phonePattern.test(phone)) errors.phone = "Enter a valid 10-digit Indian mobile number.";
  if (address.length < 12) errors.address = "Add a complete home address.";
  if (!serviceDistrict || !serviceDistricts.includes(serviceDistrict)) {
    errors.serviceDistrict = "Choose a supported service district.";
  }
  if (!getService(serviceId)) errors.serviceId = "Choose a massage service.";
  if (!therapistGenderPreference || !therapistGenderPreferences.includes(therapistGenderPreference)) {
    errors.therapistGenderPreference = "Choose a therapist gender preference.";
  }

  const selectedDate = dateTime ? new Date(dateTime) : null;
  if (!selectedDate || Number.isNaN(selectedDate.getTime())) {
    errors.dateTime = "Choose a date and time.";
  } else if (selectedDate.getTime() < Date.now() + 60 * 60 * 1000) {
    errors.dateTime = "Choose a slot at least 1 hour from now.";
  }

  return {
    data: {
      name,
      phone,
      address,
      serviceDistrict: serviceDistrict ?? "muzaffarnagar",
      serviceId,
      therapistGenderPreference: therapistGenderPreference ?? "no-preference",
      dateTime,
    },
    errors,
    valid: Object.keys(errors).length === 0,
  };
}
