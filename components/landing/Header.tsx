import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-line-soft">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="font-display text-lg text-ink">
          FrontDesk <span className="text-teal">AI</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-ink-soft sm:flex">
          <a href="#problem" className="transition-colors hover:text-ink">
            Why it matters
          </a>
          <a href="#product" className="transition-colors hover:text-ink">
            How it works
          </a>
        </nav>
        <Link
          href="/chat"
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-deep"
        >
          See it in action
        </Link>
      </div>
    </header>
  );
}
