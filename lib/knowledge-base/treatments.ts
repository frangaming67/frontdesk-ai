// Treatments offered by the demo practice.
// NOTE: no real prices are stored here on purpose — the AI must never invent
// pricing. If pricing is added later it should be added explicitly here,
// and only then may the AI reference it.

import { matchesKeyword } from "./matchKeywords";
import type { Locale } from "@/lib/i18n/types";

export interface Treatment {
  id: string;
  name: string;
  nameEs: string;
  keywords: string[];
  shortDescription: string;
  shortDescriptionEs: string;
  priceKnown: false;
}

export const treatments: Treatment[] = [
  {
    id: "invisalign",
    name: "Invisalign",
    nameEs: "Invisalign",
    keywords: ["invisalign", "clear aligner", "clear aligners", "aligner", "aligners", "straighten", "straightening", "crooked teeth", "invisible braces", "alineadores", "alineador", "ortodoncia invisible", "dientes torcidos", "enderezar los dientes"],
    shortDescription:
      "Clear aligner treatment to straighten teeth without traditional braces.",
    shortDescriptionEs: "Tratamiento con alineadores transparentes para enderezar los dientes sin brackets tradicionales.",
    priceKnown: false,
  },
  {
    id: "implants",
    name: "Dental Implants",
    nameEs: "Implantes dentales",
    keywords: ["implant", "implants", "missing tooth", "missing teeth", "tooth replacement", "replace a tooth", "replace missing teeth", "implante", "implantes", "me falta un diente", "reemplazar un diente", "reemplazo dental"],
    shortDescription:
      "Permanent tooth replacement that looks and functions like a natural tooth.",
    shortDescriptionEs: "Reemplazo permanente de un diente, diseñado para verse y funcionar como un diente natural.",
    priceKnown: false,
  },
  {
    id: "veneers",
    name: "Veneers",
    nameEs: "Carillas dentales",
    keywords: ["veneer", "veneers", "porcelain veneers", "smile makeover", "carilla", "carillas", "carillas de porcelana", "diseño de sonrisa"],
    shortDescription:
      "Thin custom shells that improve the shape, color, and appearance of teeth.",
    shortDescriptionEs: "Láminas finas hechas a medida que mejoran la forma, el color y la apariencia de los dientes.",
    priceKnown: false,
  },
  {
    id: "whitening",
    name: "Teeth Whitening",
    nameEs: "Blanqueamiento dental",
    keywords: ["whitening", "whiten", "bleaching", "whiter teeth", "brighter teeth", "brighten my smile", "teeth bleaching", "blanqueamiento", "blanquear", "dientes más blancos", "aclarar mis dientes"],
    shortDescription: "Professional treatment to brighten and whiten teeth.",
    shortDescriptionEs: "Tratamiento profesional para aclarar y blanquear los dientes.",
    priceKnown: false,
  },
  {
    id: "general",
    name: "General Dentistry",
    nameEs: "Odontología general",
    keywords: ["cleaning", "cleanings", "checkup", "checkups", "check-up", "check-ups", "cavity", "cavities", "filling", "fillings", "general dentistry", "dental exam", "routine exam", "limpieza", "limpiezas", "chequeo", "revisión dental", "caries", "empaste", "odontología general", "control dental"],
    shortDescription: "Routine checkups, cleanings, and general oral health care.",
    shortDescriptionEs: "Controles de rutina, limpiezas y cuidado general de la salud bucal.",
    priceKnown: false,
  },
];

export function findTreatmentByKeyword(text: string): Treatment | undefined {
  return treatments.find((t) => t.keywords.some((k) => matchesKeyword(text, k)));
}

export function treatmentName(name: string, locale: Locale = "en"): string {
  if (locale === "en") return name;
  if (name === "General Consultation") return "Consulta general";
  return treatments.find((t) => t.name === name)?.nameEs ?? name;
}

export function treatmentDescription(treatment: Treatment, locale: Locale = "en"): string {
  return locale === "es" ? treatment.shortDescriptionEs : treatment.shortDescription;
}
