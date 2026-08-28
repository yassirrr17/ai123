export function BarRow({ label, value, max, suffix }: { label: string; value: number; max: number; suffix?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-sm font-medium">{label}</span>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-container">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 shrink-0 text-right text-sm text-on-surface-variant">
        {value}
        {suffix}
      </span>
    </div>
  );
}
