// Frequently asked questions the AI receptionist is authorized to answer.

import { practice } from "./practice";
import { matchesKeyword } from "./matchKeywords";

export interface FaqEntry {
  id: string;
  keywords: string[];
  answer: string;
}

export const faq: FaqEntry[] = [
  {
    id: "new-patients",
    keywords: ["new patient", "new patients", "accept new", "accepting patients", "taking patients", "first visit", "first time", "never been"],
    answer:
      "Yes, Miami Smile Dental is currently accepting new patients. I can help you request a consultation whenever you're ready.",
  },
  {
    id: "insurance",
    keywords: ["insurance", "coverage", "in-network", "out of network", "dental plan", "ppo", "hmo", "medicaid", "medicare"],
    answer:
      "Insurance details vary by plan, so our front desk team can confirm your specific coverage. I can pass your question along when I set up your consultation request.",
  },
  {
    id: "saturday",
    keywords: ["saturday", "weekend"],
    answer: "We're open Saturdays from 9:00 AM to 1:00 PM. We're closed on Sundays.",
  },
  {
    id: "location",
    keywords: ["where are you", "where is the office", "where is your office", "where's your office", "where are you based", "location", "located", "address", "directions"],
    answer: `Our demo practice is in ${practice.city}, ${practice.state}. The fictional address is ${practice.addressLine}.`,
  },
  {
    id: "phone",
    keywords: ["your phone", "your number", "office number", "call you", "call the office", "telephone", "contact the office"],
    answer: `The fictional demo phone number for ${practice.name} is ${practice.phoneDisplay}. You can also request a consultation here.`,
  },
  {
    id: "payment-options",
    keywords: ["financing", "finance", "payment plan", "payment plans", "monthly payments", "installments"],
    answer: "Our front desk team would need to confirm which payment options are available and any terms. I can help you request a consultation to discuss your options.",
  },
];

export function findFaqAnswer(text: string): FaqEntry | undefined {
  return faq.find((f) => f.keywords.some((k) => matchesKeyword(text, k)));
}
