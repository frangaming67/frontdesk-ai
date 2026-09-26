// Fictional practice used only to demonstrate the product in Argentina.
// No real location or contact channel is configured. A new name does not enable
// production use: storage, access control and integrations require setup first.
const name = process.env.NEXT_PUBLIC_PRACTICE_NAME?.trim() || "Consultorio Demo";

export const practice = {
  name,
  initials: name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase(),
  tagline: "Consultorio odontológico ficticio de demostración",
  country: "Argentina",
  city: null as string | null,
  addressLine: null as string | null,
  phoneDisplay: null as string | null,
  email: null as string | null,
  isFictional: true,
} as const;
