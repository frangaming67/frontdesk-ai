import Link from "next/link";
import { Brand } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line-soft bg-paper/95 backdrop-blur-md">
      <div className="page-shell flex min-h-20 items-center justify-between gap-4">
        <Brand />
        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-[13px] font-medium text-ink-soft md:flex">
          <a href="#product" className="transition-colors hover:text-teal">How it works</a>
          <Link href="/dashboard" className="transition-colors hover:text-teal">Explore the dashboard</Link>
          <a href="#questions" className="transition-colors hover:text-teal">FAQs</a>
        </nav>
        <Link href="/chat" className="button-primary px-4 sm:px-5">Try the demo <Icon name="arrow-up-right" size={16} /></Link>
      </div>
    </header>
  );
}
