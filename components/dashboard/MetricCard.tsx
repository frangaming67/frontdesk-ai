import { Icon } from "@/components/ui/Icon";

export function MetricCard({ label, value, description, icon, emphasized = false }: {
  label: string;
  value: number | string;
  description: string;
  icon: "users" | "sparkles" | "check-circle" | "calendar";
  emphasized?: boolean;
}) {
  return (
    <div className={`rounded-[22px] border p-5 sm:p-6 ${emphasized ? "border-teal bg-teal text-white" : "border-line-soft bg-white text-ink"}`}>
      <div className="flex items-center justify-between gap-2">
        <p className={`text-sm font-medium ${emphasized ? "text-white/85" : "text-ink-soft"}`}>{label}</p>
        <Icon name={icon} size={18} className={emphasized ? "text-white/70" : "text-teal"} />
      </div>
      <p className="mt-5 font-display text-4xl leading-none sm:text-5xl">{value}</p>
      <p className={`mt-3 text-xs leading-relaxed ${emphasized ? "text-white/80" : "text-ink-soft"}`}>{description}</p>
    </div>
  );
}
