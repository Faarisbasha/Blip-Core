type MetricCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
};

export function MetricCard({ title, value, subtitle, icon }: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="text-emerald-300">{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
    </div>
  );
}
