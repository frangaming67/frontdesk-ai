// Server-only values: expose these public identity fields deliberately, never credentials.
export function legalIdentity() {
  return {
    name: process.env.LEGAL_OPERATOR_NAME?.trim() || "",
    country: process.env.LEGAL_OPERATOR_COUNTRY?.trim() || "",
    email: process.env.LEGAL_CONTACT_EMAIL?.trim() || "",
  };
}

export function legalIdentityReady() {
  const identity = legalIdentity();
  return !!(identity.name && identity.country && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.email));
}
