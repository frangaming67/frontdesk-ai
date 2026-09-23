// Treatments offered by the demo practice.
// NOTE: no real prices are stored here on purpose — the AI must never invent
// pricing. If pricing is added later it should be added explicitly here,
// and only then may the AI reference it.

import { matchesKeyword } from "./matchKeywords";

export interface Treatment {
  id: string;
  name: string;
  keywords: string[];
  shortDescription: string;
  priceKnown: false;
}

export const treatments: Treatment[] = [
  {
    id: "invisalign",
    name: "Invisalign",
    keywords: ["invisalign", "clear aligner", "clear aligners", "aligner", "aligners", "straighten", "straightening", "crooked teeth", "invisible braces"],
    shortDescription:
      "Clear aligner treatment to straighten teeth without traditional braces.",
    priceKnown: false,
  },
  {
    id: "implants",
    name: "Dental Implants",
    keywords: ["implant", "implants", "missing tooth", "missing teeth", "tooth replacement", "replace a tooth", "replace missing teeth"],
    shortDescription:
      "Permanent tooth replacement that looks and functions like a natural tooth.",
    priceKnown: false,
  },
  {
    id: "veneers",
    name: "Veneers",
    keywords: ["veneer", "veneers", "porcelain veneers", "smile makeover"],
    shortDescription:
      "Thin custom shells that improve the shape, color, and appearance of teeth.",
    priceKnown: false,
  },
  {
    id: "whitening",
    name: "Teeth Whitening",
    keywords: ["whitening", "whiten", "bleaching", "whiter teeth", "brighter teeth", "brighten my smile", "teeth bleaching"],
    shortDescription: "Professional treatment to brighten and whiten teeth.",
    priceKnown: false,
  },
  {
    id: "general",
    name: "General Dentistry",
    keywords: ["cleaning", "cleanings", "checkup", "checkups", "check-up", "check-ups", "cavity", "cavities", "filling", "fillings", "general dentistry", "dental exam", "routine exam"],
    shortDescription: "Routine checkups, cleanings, and general oral health care.",
    priceKnown: false,
  },
];

export function findTreatmentByKeyword(text: string): Treatment | undefined {
  return treatments.find((t) => t.keywords.some((k) => matchesKeyword(text, k)));
}
