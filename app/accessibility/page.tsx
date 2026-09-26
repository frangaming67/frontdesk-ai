import { LegalPage } from "@/components/legal/LegalPage";
import { branding } from "@/lib/branding";
import { legalIdentity } from "@/lib/legal/config";
import { verificationAvailability } from "@/lib/verification/config";
export const metadata = { title: `Accesibilidad | ${branding.name}` };
export default function AccessibilityPage() { return <LegalPage kind="accessibility" identity={legalIdentity()} availability={verificationAvailability()} />; }
