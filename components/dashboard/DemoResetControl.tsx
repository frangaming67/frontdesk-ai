"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { leadRepository } from "@/lib/leads/LocalLeadRepository";
import type { Lead } from "@/lib/leads/types";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function DemoResetControl({ onReset }: { onReset: (leads: Lead[]) => void }) {
  const { t } = useLanguage();
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
    <section aria-label={t("Demo controls", "Controles de la demo")} className="rounded-2xl border border-dashed border-line px-5 py-5 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink">{t("A workspace for your walkthrough", "Un espacio para tu demostración")}</p>
          <p className="mt-1 max-w-lg text-xs leading-relaxed text-ink-soft">{t("Fictional examples and test leads, saved only in this browser. Reset anytime to start a fresh demo.", "Ejemplos ficticios y contactos de prueba guardados solo en este navegador. Restablece los datos para comenzar una nueva demo.")}</p>
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
          className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-ink-soft transition-colors hover:bg-white hover:text-teal disabled:cursor-wait disabled:opacity-50"
        >
          <Icon name="refresh" size={15} />
          {t("Reset demo leads", "Restablecer demo")}
        </button>
      </div>

      {isConfirming && (
        <div id="demo-reset-confirmation" role="group" aria-labelledby="demo-reset-title" className="mt-4 rounded-xl border border-line-soft bg-white p-4 sm:p-5">
          <p id="demo-reset-title" className="text-sm font-medium text-ink">{t("Reset this demo?", "¿Restablecer esta demo?")}</p>
          <p className="mt-1 text-sm text-ink-soft">
            {t("This removes leads you created in this browser and restores the original fictional examples, including their statuses. This cannot be undone.", "Se eliminarán los contactos que creaste en este navegador y se restaurarán los ejemplos ficticios y sus estados originales. Esta acción no se puede deshacer.")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              autoFocus
              type="button"
              onClick={closeConfirmation}
              disabled={isResetting}
              className="button-secondary disabled:cursor-wait disabled:opacity-50"
            >
              {t("Cancel", "Cancelar")}
            </button>
            <button
              type="button"
              onClick={resetDemo}
              disabled={isResetting}
              className="button-primary disabled:cursor-wait disabled:opacity-50"
            >
              {isResetting ? t("Resetting…", "Restableciendo…") : t("Reset and restore examples", "Restablecer y restaurar ejemplos")}
            </button>
          </div>
        </div>
      )}
      {message && <p role="status" className="mt-3 text-sm text-teal-deep">{t(message, "Demo restablecida. Los ejemplos ficticios originales están listos para tu próxima presentación.")}</p>}
      {error && <p role="alert" className="mt-3 text-sm text-coral">{t(error, "No se pudieron restablecer los datos. Comprueba que el almacenamiento del navegador esté disponible e inténtalo de nuevo.")}</p>}
    </section>
  );
}
