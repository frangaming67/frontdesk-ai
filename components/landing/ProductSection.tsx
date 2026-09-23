const STEPS = [
  {
    title: "Respond",
    copy: "Every message gets an instant, on-brand reply, drawn only from your practice's own information.",
  },
  {
    title: "Qualify",
    copy: "The conversation reads intent — someone comparing treatments looks different from someone ready to book.",
  },
  {
    title: "Capture",
    copy: "Name, contact, and preferred time are collected naturally, without a form to abandon.",
  },
  {
    title: "Follow up",
    copy: "A ready lead lands on your dashboard with the full conversation, so your team can pick it up fast.",
  },
];

export function ProductSection() {
  return (
    <section id="product" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 className="max-w-lg font-display text-3xl text-ink sm:text-4xl">One conversation, handled start to finish.</h2>

        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.title} className="bg-white p-6">
              <p className="font-display text-xl text-teal-deep">{step.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
