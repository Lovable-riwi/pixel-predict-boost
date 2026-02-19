import { useDashboard } from '@/store/DashboardContext';
import { AlertTriangle, TrendingDown, DollarSign, Zap, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { AIAlert } from '@/data/mockData';

const typeConfig = {
  bajo_rendimiento: {
    icon: TrendingDown,
    label: 'Bajo Rendimiento',
    colorClass: 'border-l-destructive',
    iconBg: 'bg-destructive/10',
    iconColor: 'text-destructive',
  },
  alto_costo: {
    icon: DollarSign,
    label: 'Alto Costo',
    colorClass: 'border-l-warning',
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
  },
  caida_ctr: {
    icon: AlertTriangle,
    label: 'Caída CTR',
    colorClass: 'border-l-destructive',
    iconBg: 'bg-destructive/10',
    iconColor: 'text-destructive',
  },
  oportunidad: {
    icon: Zap,
    label: 'Oportunidad',
    colorClass: 'border-l-success',
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
  },
};

const priorityBadge = {
  Alta: 'bg-destructive/10 text-destructive border border-destructive/20',
  Media: 'bg-warning/10 text-warning border border-warning/20',
  Baja: 'bg-success/10 text-success border border-success/20',
};

function AlertCard({ alert, index }: { alert: AIAlert; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const config = typeConfig[alert.type];
  const Icon = config.icon;

  return (
    <div
      className="alert-item border-l-2 cursor-pointer"
      style={{
        borderLeftColor: alert.type === 'oportunidad'
          ? 'hsl(var(--success))'
          : alert.priority === 'Alta'
          ? 'hsl(var(--destructive))'
          : 'hsl(var(--warning))',
        animationDelay: `${index * 80}ms`,
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${config.iconBg}`}>
          <Icon className={`h-4 w-4 ${config.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${priorityBadge[alert.priority]}`}>
                {alert.priority}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">{config.label}</span>
            </div>
            {expanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />}
          </div>

          <p className="text-xs text-foreground font-medium leading-snug mb-2">{alert.mensaje}</p>

          {/* Impact bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground">Probabilidad de impacto</span>
              <span className="text-[10px] font-bold text-foreground">{alert.probabilidadImpacto}%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${alert.probabilidadImpacto}%`,
                  background: alert.type === 'oportunidad'
                    ? 'hsl(var(--success))'
                    : alert.priority === 'Alta'
                    ? 'hsl(var(--destructive))'
                    : 'hsl(var(--warning))',
                }}
              />
            </div>
          </div>

          {/* Campaign name */}
          <span className="text-[10px] text-muted-foreground">📍 {alert.campaignName}</span>
        </div>
      </div>

      {/* Expanded recommendation */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border animate-fade-in">
          <div className="rounded-lg bg-accent/50 p-2.5 mb-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-accent-foreground mb-1">Recomendación IA</div>
            <p className="text-xs text-foreground leading-relaxed">{alert.recomendacion}</p>
          </div>
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            Ver campaña
          </button>
        </div>
      )}
    </div>
  );
}

function SkeletonAlert() {
  return (
    <div className="rounded-lg border border-border p-3 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-muted flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-3/4 rounded bg-muted" />
          <div className="h-1 w-full rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export default function AIAlerts() {
  const { alerts, isLoading } = useDashboard();

  return (
    <div className="dashboard-card flex flex-col h-full">
      <div className="flex items-center justify-between p-5 pb-3">
        <div>
          <h2 className="text-base font-bold text-foreground">Alertas IA</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{alerts.length} detecciones activas</p>
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary">
          <Zap className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-5 pb-5 space-y-2">
        {isLoading
          ? [1, 2, 3].map(i => <SkeletonAlert key={i} />)
          : alerts
              .sort((a, b) => {
                const order = { Alta: 0, Media: 1, Baja: 2 };
                return order[a.priority] - order[b.priority];
              })
              .map((alert, i) => <AlertCard key={alert.id} alert={alert} index={i} />)
        }
      </div>
    </div>
  );
}
