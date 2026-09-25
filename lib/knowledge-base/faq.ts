// Frequently asked questions the AI receptionist is authorized to answer.

import { practice } from "./practice";
import { matchesKeyword } from "./matchKeywords";

export interface FaqEntry {
  id: string;
  keywords: string[];
  answer: string;
  answerEs: string;
}

export const faq: FaqEntry[] = [
  {
    id: "new-patients",
    keywords: ["new patient", "new patients", "accept new", "accepting patients", "taking patients", "first visit", "first time", "never been", "nuevo paciente", "nuevos pacientes", "primera visita", "primera vez"],
    answer:
      "Yes, Miami Smile Dental is currently accepting new patients. I can help you request a consultation whenever you're ready.",
    answerEs: "Sí, Miami Smile Dental acepta nuevos pacientes. Puedo ayudarte a solicitar una consulta cuando quieras.",
  },
  {
    id: "insurance",
    keywords: ["insurance", "coverage", "in-network", "out of network", "dental plan", "ppo", "hmo", "medicaid", "medicare", "seguro", "seguros", "cobertura", "plan dental", "obra social"],
    answer:
      "Insurance details vary by plan, so our front desk team can confirm your specific coverage. I can pass your question along when I set up your consultation request.",
    answerEs: "La cobertura del seguro varía según el plan. Nuestro equipo de recepción debe confirmar tu cobertura específica. Puedo incluir tu pregunta en la solicitud de consulta.",
  },
  {
    id: "saturday",
    keywords: ["saturday", "weekend", "sábado", "sábados", "fin de semana"],
    answer: "We're open Saturdays from 9:00 AM to 1:00 PM. We're closed on Sundays.",
    answerEs: "Abrimos los sábados de 9:00 a. m. a 1:00 p. m. Los domingos estamos cerrados.",
  },
  {
    id: "location",
    keywords: ["where are you", "where is the office", "where is your office", "where's your office", "where are you based", "location", "located", "address", "directions", "dónde están", "dónde queda", "dónde se encuentran", "ubicación", "dirección", "cómo llegar"],
    answer: `Our demo practice is in ${practice.city}, ${practice.state}. The fictional address is ${practice.addressLine}.`,
    answerEs: `La clínica de demostración está en ${practice.city}, ${practice.state}. Su dirección ficticia es ${practice.addressStreet} (dirección de ejemplo; no es una ubicación real).`,
  },
  {
    id: "phone",
    keywords: ["your phone", "your number", "office number", "call you", "call the office", "telephone", "contact the office", "su teléfono", "su número", "teléfono de la clínica", "llamarlos", "contactar con la clínica"],
    answer: `The fictional demo phone number for ${practice.name} is ${practice.phoneDisplay}. You can also request a consultation here.`,
    answerEs: `El teléfono ficticio de ${practice.name} para esta demostración es ${practice.phoneDisplay}. También puedes solicitar una consulta aquí.`,
  },
  {
    id: "payment-options",
    keywords: ["financing", "finance", "payment plan", "payment plans", "monthly payments", "installments", "financiación", "financiamiento", "financian", "plan de pago", "planes de pago", "cuotas", "pagos mensuales"],
    answer: "Our front desk team would need to confirm which payment options are available and any terms. I can help you request a consultation to discuss your options.",
    answerEs: "Nuestro equipo de recepción debe confirmar las opciones de pago disponibles y sus condiciones. Puedo ayudarte a solicitar una consulta para conocer tus opciones.",
  },
];

export function findFaqAnswer(text: string): FaqEntry | undefined {
  return faq.find((f) => f.keywords.some((k) => matchesKeyword(text, k)));
}
