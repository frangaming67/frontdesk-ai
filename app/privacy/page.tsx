import { LegalPage } from "@/components/legal/LegalPage";
import { branding } from "@/lib/branding";
import { legalIdentity } from "@/lib/legal/config";
import { verificationAvailability } from "@/lib/verification/config";
export const metadata = { title: `Privacidad y datos | ${branding.name}` };
export default function PrivacyPage() { return <LegalPage kind="privacy" identity={legalIdentity()} availability={verificationAvailability()} />; }
