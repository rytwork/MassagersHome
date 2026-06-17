import type { Service } from "./types";

export const visitFeeOptions = [99, 149, 199] as const;

export const services: Service[] = [
  {
    id: "swedish-massage",
    name: "Swedish Massage",
    description:
      "Gentle full-body relaxation for stress relief, better sleep, and everyday balance.",
    duration: "60 min",
    price: 799,
    visitFee: 149,
  },
  {
    id: "deep-tissue",
    name: "Deep Tissue Massage",
    description:
      "Focused pressure therapy for tight muscles, active lifestyles, and persistent knots.",
    duration: "75 min",
    price: 999,
    visitFee: 199,
  },
  {
    id: "aromatherapy",
    name: "Aromatherapy",
    description:
      "Essential oil therapy designed for calm, balance, and a deeper mood reset.",
    duration: "60 min",
    price: 899,
    visitFee: 149,
  },
  {
    id: "thai-massage",
    name: "Thai Massage",
    description:
      "Assisted stretching and pressure work for mobility, flexibility, and energy.",
    duration: "75 min",
    price: 1099,
    visitFee: 199,
  },
  {
    id: "prenatal-massage",
    name: "Prenatal Massage",
    description:
      "Comfort-focused care for expecting mothers by trained home wellness therapists.",
    duration: "60 min",
    price: 1199,
    visitFee: 199,
  },
  {
    id: "foot-reflexology",
    name: "Foot Reflexology",
    description:
      "Pressure-point foot therapy for circulation, fatigue relief, and calm recovery.",
    duration: "45 min",
    price: 699,
    visitFee: 99,
  },
];

export function getService(serviceId: string) {
  return services.find((service) => service.id === serviceId);
}
