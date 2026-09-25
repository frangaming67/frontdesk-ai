import Link from "next/link";
import { Brand } from "@/components/ui/Brand";
import { practice } from "@/lib/knowledge-base";

export function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="page-shell">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <Brand />
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-6 text-xs text-ink-soft">
            <Link href="/chat" className="hover:text-teal">Try the receptionist</Link>
            <Link href="/dashboard" className="hover:text-teal">Practice dashboard</Link>
            <a href="#questions" className="hover:text-teal">About the demo</a>
          </nav>
        </div>
        <div className="mt-7 flex flex-col justify-between gap-3 border-t border-line-soft pt-5 text-[11px] leading-5 text-ink-soft">
          <p>Built for a better first impression.</p>
          <p>{practice.name} is a fictional practice. This product demo captures consultation requests; it does not provide medical advice or confirm appointments.</p>
        </div>
      </div>
    </footer>
  );
}
