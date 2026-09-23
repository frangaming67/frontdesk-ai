import Link from "next/link";

export function DemoCTA() {
  return (
    <section className="bg-teal-deep py-16 sm:py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <h2 className="font-display text-3xl text-white sm:text-4xl">Try the AI receptionist yourself.</h2>
          <p className="mt-3 max-w-md text-white/75">
            Ask about Invisalign, request a consultation, then watch the lead land on the dashboard in real time.
          </p>
        </div>
        <Link
          href="/chat"
          className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-medium text-teal-deep transition-colors hover:bg-gold-tint"
        >
          Try the AI receptionist
        </Link>
      </div>
    </section>
  );
}
