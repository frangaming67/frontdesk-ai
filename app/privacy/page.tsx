import { LegalPage } from "@/components/legal/LegalPage";
import { legalIdentity } from "@/lib/legal/config";
import { verificationAvailability } from "@/lib/verification/config";
export const metadata = { title: "Privacy & data | FrontDesk AI" };
export default function PrivacyPage() { return <LegalPage kind="privacy" identity={legalIdentity()} availability={verificationAvailability()} />; }
