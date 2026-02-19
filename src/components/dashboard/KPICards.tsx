import { useMemo } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';

interface SparklineProps {
  data: number[];
  color?: string;
  positive?: boolean;
}

export function Sparkline({ data, color, positive = true }: SparklineProps) {
  const chartData = data.map((v, i) => ({ i, v }));
  const lineColor = color || (positive ? 'hsl(var(--success))' : 'hsl(var(--destructive))');

  return (
    <ResponsiveContainer width="100%" height={36}>
      <LineChart data={chartData}>
        <Line type="monotone" dataKey="v" stroke={lineColor} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function TrendArrow({ value }: { value: number }) {
  if (value > 0.5) return (
    <span className="metric-badge-up">
      <TrendingUp className="h-3 w-3" />
      +{value.toFixed(1)}%
    </span>
  );
  if (value < -0.5) return (
    <span className="metric-badge-down">
      <TrendingDown className="h-3 w-3" />
      {value.toFixed(1)}%
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
      <Minus className="h-3 w-3" />
      0%
    </span>
  );
}

function SkeletonKPI() {
  return (
    <div className="kpi-card animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-5 w-12 rounded bg-muted" />
      </div>
      <div className="h-7 w-24 rounded bg-muted mb-1" />
      <div className="h-3 w-16 rounded bg-muted mb-2" />
      <div className="h-9 w-full rounded bg-muted" />
    </div>
  );
}

export default function KPICards() {
  const { kpis, isLoading, metrics } = useDashboard();

  // Build sparkline data from last 7 days
  const sparkData = useMemo(() => {
    const last7 = metrics.slice(-7);
    return {
      roi: last7.map(m => m.cost > 0 ? ((m.revenue - m.cost) / m.cost) * 100 : 0),
      cpc: last7.map(m => m.clicks > 0 ? m.cost / m.clicks : 0),
      ctr: last7.map(m => m.impressions > 0 ? (m.clicks / m.impressions) * 100 : 0),
      roas: last7.map(m => m.cost > 0 ? m.revenue / m.cost : 0),
    };
  }, [metrics]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1,2,3,4].map(i => <SkeletonKPI key={i} />)}
      </div>
    );
  }

  if (!kpis) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* ROI Card */}
      <div className="kpi-card">
        <div className="flex items-start justify-between mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">ROI</span>
          <TrendArrow value={kpis.roiProjected > kpis.roi ? kpis.roiProjected - kpis.roi : 0} />
        </div>
        <div className="text-2xl font-bold text-foreground animate-count-up">{kpis.roi.toFixed(1)}%</div>
        <div className="flex items-center gap-2 my-1">
          <span className="text-xs text-muted-foreground">Proyectado IA:</span>
          <span className="text-xs font-bold text-primary">{kpis.roiProjected.toFixed(1)}%</span>
        </div>
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground">Confianza IA</span>
            <span className="text-[10px] font-bold text-primary">{kpis.aiConfidence}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-primary transition-all duration-700"
              style={{ width: `${kpis.aiConfidence}%` }}
            />
          </div>
        </div>
        <Sparkline data={sparkData.roi} positive={kpis.roi > 100} />
      </div>

      {/* CPC Card */}
      <div className="kpi-card">
        <div className="flex items-start justify-between mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CPC</span>
          <TrendArrow value={-kpis.cpcChange} /> {/* negative CPC change is good */}
        </div>
        <div className="text-2xl font-bold text-foreground animate-count-up">€{kpis.cpc.toFixed(2)}</div>
        <div className="mb-2 text-xs text-muted-foreground">Variación semanal</div>
        <Sparkline data={sparkData.cpc} positive={kpis.cpcChange <= 0} />
      </div>

      {/* CTR Card */}
      <div className="kpi-card">
        <div className="flex items-start justify-between mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CTR</span>
          <TrendArrow value={kpis.ctrChange} />
        </div>
        <div className="text-2xl font-bold text-foreground animate-count-up">{kpis.ctr.toFixed(2)}%</div>
        <div className="mb-2 text-xs text-muted-foreground">Variación semanal</div>
        <Sparkline data={sparkData.ctr} positive={kpis.ctrChange >= 0} />
      </div>

      {/* ROAS Card */}
      <div className="kpi-card">
        <div className="flex items-start justify-between mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">ROAS</span>
          <TrendArrow value={kpis.roasChange} />
        </div>
        <div className="text-2xl font-bold text-foreground animate-count-up">{kpis.roas.toFixed(2)}x</div>
        <div className="mb-2 text-xs text-muted-foreground">Tendencia global</div>
        <Sparkline data={sparkData.roas} positive={kpis.roasChange >= 0} />
      </div>
    </div>
  );
}
