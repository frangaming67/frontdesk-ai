import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <h1 className="max-w-xl font-display text-[2.5rem] leading-[1.08] text-ink sm:text-[3.25rem]">
            Turn more dental inquiries into booked consultations, day or night.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            FrontDesk AI answers new-patient questions the moment they come in, qualifies real interest, and hands
            your team a ready-to-call lead instead of a missed message.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/chat"
              className="rounded-full bg-teal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-deep"
            >
              See it in action
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-teal hover:text-teal-deep"
            >
              View dashboard demo
            </Link>
          </div>
          <p className="mt-6 text-sm text-ink-soft/70">
            Shown here with Miami Smile Dental, a fictional practice built for this demo.
          </p>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-line-soft bg-white p-5 shadow-[0_1px_2px_rgba(13,43,41,0.04),0_24px_48px_-24px_rgba(13,43,41,0.22)] sm:p-6">
            <div className="flex items-center gap-2.5 border-b border-line-soft pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-deep text-xs font-semibold text-white">
                MS
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Miami Smile Dental</p>
                <p className="text-xs text-ink-soft">AI Receptionist</p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-ink px-3.5 py-2 text-sm text-white">
                  Hi, I&apos;m interested in Invisalign. How much does it cost?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-line-soft bg-paper px-3.5 py-2 text-sm text-ink">
                  Invisalign costs vary by treatment plan. Would you like me to help you request a consultation?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-ink px-3.5 py-2 text-sm text-white">
                  Yes, please.
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 text-sm font-medium text-teal-deep">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Consultation request captured
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
