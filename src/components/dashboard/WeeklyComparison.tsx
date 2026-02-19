import { useDashboard } from '@/store/DashboardContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function formatVal(value: number, format: string): string {
  switch (format) {
    case 'currency': return `€${value.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`;
    case 'percent': return `${value.toFixed(2)}%`;
    case 'decimal': return value.toFixed(2);
    default: return value.toLocaleString('es-ES');
  }
}

function ChangeIndicator({ pct }: { pct: number }) {
  const abs = Math.abs(pct);
  if (pct > 0.5) return (
    <div className="flex items-center gap-1 metric-badge-up">
      <TrendingUp className="h-3 w-3" />
      +{abs.toFixed(1)}%
    </div>
  );
  if (pct < -0.5) return (
    <div className="flex items-center gap-1 metric-badge-down">
      <TrendingDown className="h-3 w-3" />
      -{abs.toFixed(1)}%
    </div>
  );
  return (
    <div className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
      <Minus className="h-3 w-3" />
      0%
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      {[1,2,3,4].map(i => (
        <td key={i} className="py-2.5 px-3">
          <div className="h-3.5 w-full rounded bg-muted animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export default function WeeklyComparison() {
  const { weeklyComparison, isLoading } = useDashboard();

  return (
    <div className="dashboard-card overflow-hidden">
      <div className="flex items-center justify-between p-5 pb-3 border-b border-border">
        <div>
          <h2 className="text-base font-bold text-foreground">Comparativa Semanal</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Esta semana vs semana anterior</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Métrica</th>
              <th className="py-2.5 px-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actual</th>
              <th className="py-2.5 px-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Anterior</th>
              <th className="py-2.5 px-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cambio</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? [1,2,3,4,5].map(i => <SkeletonRow key={i} />)
              : weeklyComparison.map((row) => {
                  const pct = row.previous > 0 ? ((row.current - row.previous) / row.previous) * 100 : 0;
                  return (
                    <tr key={row.metric} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-foreground">{row.metric}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-foreground">
                        {formatVal(row.current, row.format)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-muted-foreground hidden sm:table-cell">
                        {formatVal(row.previous, row.format)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex justify-end">
                          <ChangeIndicator pct={pct} />
                        </div>
                      </td>
                    </tr>
                  );
                })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
