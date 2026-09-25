import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";

const STEPS: { title: string; copy: string; icon: IconName }[] = [
  { title: "A question comes in", copy: "A patient asks about treatments, office hours, or their first visit.", icon: "message" },
  { title: "A helpful reply", copy: "Answers come from your practice information. Medical questions stay with your team.", icon: "sparkles" },
  { title: "Interest becomes a lead", copy: "The receptionist collects a name, contact details, and a preferred time.", icon: "users" },
  { title: "Your team takes it from here", copy: "Review the conversation, reach out, and confirm the next steps.", icon: "check-circle" },
];

export function ProductSection() {
  return (
    <section id="product" className="page-shell py-16 sm:py-24">
      <div className="max-w-xl"><p className="eyebrow">Simple by design</p><h2 className="mt-4 text-3xl leading-tight sm:text-[42px]">From first question<br />to a personal follow-up.</h2></div>
      <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {STEPS.map((step, index) => (
          <li key={step.title}>
            <div className={"relative mb-5 flex items-center " + (index < 3 ? "step-connector" : "")}><span className="relative z-10 flex size-11 items-center justify-center rounded-2xl border border-line bg-white text-teal"><Icon name={step.icon} /></span></div>
            <p className="mb-2 text-[10px] font-semibold tracking-wider text-teal">0{index + 1}</p>
            <h3 className="font-body! text-[15px] font-semibold! tracking-normal!">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{step.copy}</p>
          </li>
        ))}
      </ol>
      <div className="mt-16 rounded-[28px] border border-line bg-white p-6 sm:mt-20 sm:p-9">
        <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Take a look around</p><h3 className="mt-2 text-2xl sm:text-3xl">Two sides. One connected experience.</h3></div><span className="text-xs text-ink-soft">No account. No setup. Just explore.</span></div>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/chat" className="group flex items-center gap-4 rounded-2xl bg-teal-tint p-5 transition-colors hover:bg-[#DFEBDD] sm:p-6">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-teal"><Icon name="message" size={23} /></span>
            <div className="flex-1"><p className="text-[10px] font-semibold uppercase tracking-widest text-teal">01 · For the patient</p><p className="mt-1 text-[15px] font-semibold">Try the receptionist</p><p className="mt-1 text-xs leading-5 text-ink-soft">Ask a question. Request a consultation.</p></div>
            <Icon name="arrow-up-right" className="shrink-0 text-teal transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <Link href="/dashboard" className="group flex items-center gap-4 rounded-2xl border border-line bg-paper p-5 transition-colors hover:bg-teal-tint sm:p-6">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-teal"><Icon name="grid" size={22} /></span>
            <div className="flex-1"><p className="text-[10px] font-semibold uppercase tracking-widest text-ink-soft">02 · For your team</p><p className="mt-1 text-[15px] font-semibold">Explore the dashboard</p><p className="mt-1 text-xs leading-5 text-ink-soft">Meet your leads. Find your next follow-up.</p></div>
            <Icon name="arrow-up-right" className="shrink-0 text-teal transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
