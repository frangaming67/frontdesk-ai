import { ChatDemoPage } from "@/components/chat/ChatDemoPage";
import { practice } from "@/lib/knowledge-base/practice";
import { branding } from "@/lib/branding";

export const metadata = {
  title: `${practice.name} — Demo | ${branding.name}`,
};

export default function ChatPage() {
  return <ChatDemoPage />;
}
