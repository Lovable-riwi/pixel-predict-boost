import { useMemo, useState } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Cpu, ToggleLeft, ToggleRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type Metric = 'conversions' | 'revenue' | 'cost';

const metricLabels: Record<Metric, string> = {
  conversions: 'Conversiones',
  revenue: 'Ingresos (€)',
  cost: 'Coste (€)',
};

function formatValue(value: number, metric: Metric) {
  if (metric === 'revenue' || metric === 'cost') return `€${value.toLocaleString()}`;
  return value.toLocaleString();
}

function CustomTooltip({ active, payload, label, metric }: any) {
  if (!active || !payload?.length) return null;
  const actual = payload.find((p: any) => p.dataKey === 'actual');
  const predicted = payload.find((p: any) => p.dataKey === 'predicted');
  const prev = payload.find((p: any) => p.dataKey === 'prevActual');

  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-card-lg text-xs min-w-[160px]">
      <div className="font-semibold text-foreground mb-2">{label}</div>
      {actual && (
        <div className="flex items-center justify-between gap-4 mb-1">
          <span className="text-muted-foreground">Actual</span>
          <span className="font-bold text-foreground">{formatValue(actual.value, metric)}</span>
        </div>
      )}
      {predicted && (
        <div className="flex items-center justify-between gap-4 mb-1">
          <span className="text-muted-foreground">Predicción IA</span>
          <span className="font-bold text-primary">{formatValue(predicted.value, metric)}</span>
        </div>
      )}
      {actual?.value && prev?.value && (
        <div className="mt-2 pt-2 border-t border-border flex items-center gap-1.5">
          {actual.value >= prev.value
            ? <TrendingUp className="h-3 w-3 text-success" />
            : <TrendingDown className="h-3 w-3 text-destructive" />}
          <span className={actual.value >= prev.value ? 'text-success' : 'text-destructive'}>
            {((actual.value - prev.value) / prev.value * 100).toFixed(1)}% vs anterior
          </span>
        </div>
      )}
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="dashboard-card p-5 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 w-48 rounded bg-muted" />
        <div className="flex gap-2">
          <div className="h-8 w-24 rounded-lg bg-muted" />
          <div className="h-8 w-32 rounded-lg bg-muted" />
        </div>
      </div>
      <div className="h-64 w-full rounded-lg bg-muted" />
    </div>
  );
}

export default function ConversionsChart() {
  const { metrics, prediction, showPrediction, setShowPrediction, selectedMetric, setSelectedMetric, isLoading } = useDashboard();

  const chartData = useMemo(() => {
    const actualData = metrics.map((m, i) => ({
      date: format(new Date(m.date), 'd MMM', { locale: es }),
      actual: m[selectedMetric],
      prevActual: i > 0 ? metrics[i - 1][selectedMetric] : null,
      isPrediction: false,
    }));

    if (!showPrediction) return actualData;

    const predData = prediction.map(m => ({
      date: format(new Date(m.date), 'd MMM', { locale: es }),
      predicted: m[selectedMetric],
      actual: null,
      prevActual: null,
      isPrediction: true,
    }));

    return [...actualData, ...predData];
  }, [metrics, prediction, selectedMetric, showPrediction]);

  if (isLoading) return <SkeletonChart />;

  return (
    <div className="dashboard-card p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-bold text-foreground">Rendimiento de Campañas</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Histórico + proyección IA</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Metric selector */}
          <div className="flex rounded-lg border border-border bg-muted p-0.5 gap-0.5">
            {(Object.entries(metricLabels) as [Metric, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  selectedMetric === key
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Prediction toggle */}
          <button
            onClick={() => setShowPrediction(!showPrediction)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              showPrediction
                ? 'border-primary/40 bg-accent text-accent-foreground'
                : 'border-border bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            Predicción IA
            {showPrediction ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--chart-grid))"
            strokeOpacity={0.6}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => selectedMetric !== 'conversions' ? `€${(v/1000).toFixed(0)}k` : v}
          />
          <Tooltip content={<CustomTooltip metric={selectedMetric} />} />
          <Line
            type="monotone"
            dataKey="actual"
            name="Actual"
            stroke="hsl(var(--chart-primary))"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            connectNulls={false}
          />
          {showPrediction && (
            <Line
              type="monotone"
              dataKey="predicted"
              name="Predicción IA"
              stroke="hsl(var(--chart-prediction))"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              connectNulls={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      {showPrediction && (
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-6 rounded bg-chart-primary" />
            <span>Datos reales</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-6 rounded border-t-2 border-dashed" style={{ borderColor: 'hsl(var(--chart-prediction))' }} />
            <span>Predicción IA</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5 rounded-lg bg-accent px-2 py-1">
            <Cpu className="h-3 w-3 text-accent-foreground" />
            <span className="text-accent-foreground font-medium">Confianza del modelo: alta</span>
          </div>
        </div>
      )}
    </div>
  );
}
