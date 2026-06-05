type Props = {
  title: string;
  value: string;
  subtitle?: string;
};

export function KpiCard({ title, value, subtitle }: Props) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
      {subtitle ? (
        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      ) : null}
    </div>
  );
}
