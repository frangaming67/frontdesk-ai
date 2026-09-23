"use client";

import { useEffect, useRef, useState } from "react";
import { leadRepository } from "@/lib/leads/LocalLeadRepository";
import type { Lead } from "@/lib/leads/types";

export function DemoResetControl({ onReset }: { onReset: (leads: Lead[]) => void }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const resetButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (message) resetButton.current?.focus();
  }, [message]);

  function closeConfirmation() {
    setIsConfirming(false);
    setError("");
    resetButton.current?.focus();
  }

  async function resetDemo() {
    setIsResetting(true);
    setError("");
    try {
      const restored = await leadRepository.resetDemo();
      onReset(restored);
      setIsConfirming(false);
      setMessage("Demo reset. The original fictional leads are ready for your next walkthrough.");
    } catch {
      setError("Could not reset demo data. Check that browser storage is available, then try again.");
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <section aria-label="Demo controls" className="rounded-2xl border border-line-soft bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink">Demo workspace</p>
          <p className="mt-0.5 text-xs text-ink-soft">Fictional examples and test leads, saved only in this browser.</p>
        </div>
        <button
          ref={resetButton}
          type="button"
          aria-expanded={isConfirming}
          aria-controls="demo-reset-confirmation"
          onClick={() => {
            setMessage("");
            setError("");
            setIsConfirming(true);
          }}
          disabled={isResetting}
          className="rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-teal hover:text-teal disabled:cursor-wait disabled:opacity-50"
        >
          Reset demo leads
        </button>
      </div>

      {isConfirming && (
        <div id="demo-reset-confirmation" role="group" aria-labelledby="demo-reset-title" className="mt-4 rounded-xl bg-paper p-4">
          <p id="demo-reset-title" className="text-sm font-medium text-ink">Reset this demo?</p>
          <p className="mt-1 text-sm text-ink-soft">
            This removes leads you created in this browser and restores the original fictional examples,
            including their statuses. This cannot be undone.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              autoFocus
              type="button"
              onClick={closeConfirmation}
              disabled={isResetting}
              className="rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-soft transition-colors hover:border-teal disabled:cursor-wait disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={resetDemo}
              disabled={isResetting}
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-deep disabled:cursor-wait disabled:opacity-50"
            >
              {isResetting ? "Resetting…" : "Reset and restore examples"}
            </button>
          </div>
        </div>
      )}
      {message && <p role="status" className="mt-3 text-sm text-teal-deep">{message}</p>}
      {error && <p role="alert" className="mt-3 text-sm text-coral">{error}</p>}
    </section>
  );
}
