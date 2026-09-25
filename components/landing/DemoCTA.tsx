import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const QUESTIONS = [
  { question: "Does the receptionist confirm appointments?", answer: "It captures a consultation request and the patient's preferred day and time. Your team follows up to confirm availability. It never promises a confirmed appointment." },
  { question: "What can I try in this demo?", answer: "Ask about Invisalign, implants, veneers, whitening, office hours, or insurance. Then request a consultation using fictional contact details and see the new lead in the dashboard." },
  { question: "Where do the demo requests go?", answer: "Requests appear in the dashboard in the same browser you used for the chat. They are demo data, not messages sent to a real clinic. You can restore the original examples with Reset demo leads." },
];

export function DemoCTA() {
  return (
    <>
      <section id="questions" className="page-shell pb-16 sm:pb-24">
        <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div><p className="eyebrow">A few good questions</p><h2 className="mt-4 text-3xl sm:text-[38px]">Clear expectations.<br />A better experience.</h2><p className="mt-4 text-sm leading-6 text-ink-soft">A simple demo of a more responsive front desk.</p></div>
          <div className="divide-y divide-line border-y border-line">
            {QUESTIONS.map((item) => <details key={item.question} className="group"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-medium [&::-webkit-details-marker]:hidden">{item.question}<Icon name="plus" size={18} className="shrink-0 text-teal transition-transform group-open:rotate-45" /></summary><p className="pb-6 pr-7 text-sm leading-7 text-ink-soft">{item.answer}</p></details>)}
          </div>
        </div>
      </section>
      <section className="page-shell pb-14">
        <div className="relative overflow-hidden rounded-[28px] bg-teal-deep px-7 py-12 text-white sm:px-12 sm:py-14">
          <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-44 size-[520px] rounded-full border border-white/10" /><div aria-hidden="true" className="pointer-events-none absolute -right-14 -top-28 size-[410px] rounded-full border border-white/10" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"><div className="max-w-xl"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C2DBB2]">Your next patient is one conversation away</p><h2 className="mt-4 text-3xl leading-[1.15] sm:text-[43px]">Give every inquiry<br />a welcoming first reply.</h2><p className="mt-4 max-w-md text-sm leading-6 text-white/75">See what the first few minutes with FrontDesk AI could feel like for your patients and your team.</p></div><div className="shrink-0"><Link href="/chat" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#D3E6B5] px-6 py-3.5 text-sm font-semibold text-teal-deep transition-colors hover:bg-white">Try the live demo <Icon name="arrow-right" size={17} /></Link><p className="mt-3 text-xs text-white/65">Free to explore. No sign-up needed.</p></div></div>
        </div>
      </section>
    </>
  );
}
