import Link from "next/link";
import { practice } from "@/lib/knowledge-base";

export function DashboardHeader({ backHref, backLabel }: { backHref?: string; backLabel?: string }) {
  return (
    <header className="border-b border-line-soft bg-white px-4 py-4 sm:px-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div>
          {backHref && (
            <Link href={backHref} className="mb-1 block text-xs text-ink-soft transition-colors hover:text-ink">
              ← {backLabel ?? "Back"}
            </Link>
          )}
          <p className="font-display text-lg text-ink">{practice.name}</p>
          <p className="text-xs text-ink-soft">AI Receptionist Dashboard</p>
        </div>
        <Link
          href="/chat"
          className="rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-teal hover:text-teal"
        >
          Open chat demo
        </Link>
      </div>
    </header>
  );
}
