import Link from "next/link";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { practice } from "@/lib/knowledge-base";

export const metadata = {
  title: "AI Receptionist — Miami Smile Dental Demo",
};

export default function ChatPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-line-soft bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="text-sm text-ink-soft transition-colors hover:text-ink">
            ← Back
          </Link>
          <span className="rounded-full bg-gold-tint px-2.5 py-1 text-xs font-medium text-gold">Live demo</span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6 sm:px-6">
        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-line-soft bg-white shadow-[0_1px_2px_rgba(13,43,41,0.04),0_12px_32px_-16px_rgba(13,43,41,0.18)]">
          <div className="flex items-center gap-3 border-b border-line-soft bg-teal-deep px-5 py-4 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
              MS
            </div>
            <div>
              <p className="text-sm font-medium">{practice.name}</p>
              <p className="text-xs text-white/70">AI Receptionist, usually replies in seconds</p>
            </div>
          </div>
          <ChatWindow />
        </div>
        <p className="mx-auto mt-4 max-w-md text-center text-xs text-ink-soft/70">
          This is a demo conversation for a fictional practice. It does not provide medical advice or confirm
          appointments — it captures consultation requests for a human team to follow up on.
        </p>
      </main>
    </div>
  );
}
