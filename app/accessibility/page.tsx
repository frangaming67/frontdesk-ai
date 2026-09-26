import { LegalPage } from "@/components/legal/LegalPage";
import { legalIdentity } from "@/lib/legal/config";
import { verificationAvailability } from "@/lib/verification/config";
export const metadata = { title: "Accessibility | FrontDesk AI" };
export default function AccessibilityPage() { return <LegalPage kind="accessibility" identity={legalIdentity()} availability={verificationAvailability()} />; }
