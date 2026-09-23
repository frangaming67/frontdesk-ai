import { practice } from "@/lib/knowledge-base";

export function Footer() {
  return (
    <footer className="border-t border-line-soft py-8">
      <div className="mx-auto max-w-6xl px-5 text-sm text-ink-soft/70 sm:px-8">
        <p>
          FrontDesk AI is a product demo. {practice.name} is a fictional practice created to show how the AI
          receptionist works — no real patient or medical data is used.
        </p>
      </div>
    </footer>
  );
}
