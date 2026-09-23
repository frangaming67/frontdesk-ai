export function ProblemSection() {
  return (
    <section id="problem" className="border-y border-line-soft bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">
            Most inquiries arrive when no one is at the front desk.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            A late-night message, a lunch-hour form, a Saturday afternoon question — if it waits too long, the
            patient calls the next practice on their list instead.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-line-soft bg-paper p-6">
            <p className="text-sm font-medium text-ink-soft">Without FrontDesk AI</p>
            <div className="mt-4 space-y-3">
              <p className="text-xs text-ink-soft/70">10:47 PM</p>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-line bg-white px-3.5 py-2 text-sm text-ink">
                Hi, I&apos;m interested in Invisalign.
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-line bg-white px-3.5 py-2 text-sm text-ink">
                Anyone there?
              </div>
              <p className="pt-2 text-sm text-coral">No response. The patient books elsewhere.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-teal/25 bg-teal-tint/50 p-6">
            <p className="text-sm font-medium text-teal-deep">With FrontDesk AI</p>
            <div className="mt-4 space-y-3">
              <p className="text-xs text-ink-soft/70">10:47 PM</p>
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-ink px-3.5 py-2 text-sm text-white">
                  Hi, I&apos;m interested in Invisalign.
                </div>
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-line-soft bg-white px-3.5 py-2 text-sm text-ink">
                Absolutely, I&apos;d be happy to help. Would you like to request a consultation?
              </div>
              <p className="pt-2 text-sm text-teal-deep">Answered in seconds. Lead captured for the morning team.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
