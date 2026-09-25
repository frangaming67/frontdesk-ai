import { Icon } from "@/components/ui/Icon";

export function ProblemSection() {
  return (
    <section id="problem" className="border-y border-line-soft bg-white py-16 sm:py-20">
      <div className="page-shell grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <p className="eyebrow">The moments in between</p>
          <h2 className="mt-4 text-3xl leading-[1.15] sm:text-[40px]">Your front desk is busy.<br />Your next patient is waiting.</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-ink-soft">After closing. During lunch. Between patients. A simple question can become a missed opportunity when nobody is there to answer.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-line-soft bg-paper p-6">
            <span className="mb-5 inline-flex size-10 items-center justify-center rounded-xl border border-line bg-white text-ink-soft"><Icon name="clock" /></span>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">A familiar story</p>
            <p className="mt-3 font-display text-2xl leading-tight">&ldquo;Anyone there?&rdquo;</p>
            <p className="mt-3 text-sm leading-6 text-ink-soft">The message waits. The patient keeps looking. Your team starts tomorrow already catching up.</p>
            <div className="mt-6 flex items-center gap-2 text-xs text-ink-soft"><span className="size-1.5 rounded-full bg-coral/60" /> One more unanswered inquiry</div>
          </div>
          <div className="rounded-3xl border border-teal/15 bg-teal-tint p-6">
            <span className="mb-5 inline-flex size-10 items-center justify-center rounded-xl bg-teal text-white"><Icon name="message" /></span>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-teal">With FrontDesk AI</p>
            <p className="mt-3 font-display text-2xl leading-tight">&ldquo;Happy to help.&rdquo;</p>
            <p className="mt-3 text-sm leading-6 text-ink-soft">Their question gets a response. Their interest is captured. Your team knows exactly where to pick up.</p>
            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-teal"><Icon name="check" size={15} /> A conversation worth continuing</div>
          </div>
        </div>
      </div>
    </section>
  );
}
