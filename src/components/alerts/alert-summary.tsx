type Props = {
  summary: string[];
};

export function AlertSummary({ summary }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-950">
        Alert Summary
      </h2>

      <ul className="space-y-3 text-sm text-slate-700">
        {summary.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-red-500">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}