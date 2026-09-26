import { LegalPage } from "@/components/legal/LegalPage";
import { legalIdentity } from "@/lib/legal/config";
import { verificationAvailability } from "@/lib/verification/config";
export const metadata = { title: "Demo terms | FrontDesk AI" };
export default function TermsPage() { return <LegalPage kind="terms" identity={legalIdentity()} availability={verificationAvailability()} />; }
