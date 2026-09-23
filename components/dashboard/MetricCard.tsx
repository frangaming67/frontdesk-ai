export function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-line-soft bg-white p-5">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="mt-2 font-display text-3xl text-ink">{value}</p>
    </div>
  );
}
