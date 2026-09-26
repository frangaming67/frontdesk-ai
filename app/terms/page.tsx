import { LegalPage } from "@/components/legal/LegalPage";
import { branding } from "@/lib/branding";
import { legalIdentity } from "@/lib/legal/config";
import { verificationAvailability } from "@/lib/verification/config";
export const metadata = { title: `Términos de la demo | ${branding.name}` };
export default function TermsPage() { return <LegalPage kind="terms" identity={legalIdentity()} availability={verificationAvailability()} />; }
