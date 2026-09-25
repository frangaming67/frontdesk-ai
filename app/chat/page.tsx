import Link from "next/link";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Brand } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";
import { practice } from "@/lib/knowledge-base";

export const metadata = {
  title: "Try the receptionist — Miami Smile Dental Demo",
};

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line-soft bg-paper/95">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Brand />
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-teal">
            <span className="hidden sm:inline">Explore the dashboard</span>
            <span className="sm:hidden">Dashboard</span>
            <Icon name="arrow-up-right" size={16} />
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-7 px-4 py-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-10 xl:gap-24">
        <aside className="flex flex-col justify-center lg:py-7">
          <div className="mb-4 hidden w-fit items-center gap-2 rounded-full border border-teal/15 bg-teal-tint px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-teal lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            Interactive demo
          </div>
          <h1 className="text-[28px] leading-[1.15] tracking-tight text-ink sm:text-3xl lg:text-[52px] xl:text-[58px]">
            A warm welcome.
            <span className="text-teal lg:block"> Every time.</span>
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft lg:mt-5 lg:text-base">
            Meet the receptionist for {practice.name}, our fictional demo practice.
          </p>

          <div className="mt-9 hidden rounded-2xl border border-line bg-white p-6 lg:block">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Icon name="message" size={18} className="text-teal" />
              Take the patient’s seat
            </div>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              Ask about a treatment or office hours. Then request a consultation to see how a conversation becomes a lead.
            </p>
            <div className="mt-5 border-t border-line-soft pt-4 text-xs leading-5 text-ink-soft">
              <span className="font-semibold text-teal">A quick tip:</span> use a made-up name and contact details. This is a demo, so nobody will contact you.
            </div>
          </div>

          <div className="mt-8 hidden items-start gap-3 lg:flex">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-tint text-teal">
              <Icon name="arrow-right" size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">See both sides of the conversation</p>
              <p className="mt-1 text-sm leading-6 text-ink-soft">Once you finish, open the captured lead to see what the front desk receives.</p>
            </div>
          </div>
          <p className="mt-8 hidden max-w-sm text-xs leading-5 text-ink-soft/80 lg:block">
            This demo answers general questions and collects consultation requests. Medical questions and appointment confirmations stay with the dental team.
          </p>
        </aside>

        <section aria-label="Interactive patient conversation" className="flex h-[calc(100svh-225px)] min-h-[460px] flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_20px_70px_-35px_rgba(20,46,41,0.28)] lg:h-[min(760px,calc(100svh-160px))] lg:min-h-[610px]">
          <ChatWindow />
        </section>
      </main>
    </div>
  );
}
