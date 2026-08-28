export function StatCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string;
  icon: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-on-surface-variant">{label}</span>
        <span className="material-symbols-outlined text-primary">{icon}</span>
      </div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-xs text-on-surface-variant">{hint}</div>}
    </div>
  );
}
