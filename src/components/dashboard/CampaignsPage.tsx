import { useDashboard } from '@/store/DashboardContext';
import { campaigns } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

const platformColors: Record<string, string> = {
  Google: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Meta: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  YouTube: 'bg-red-500/10 text-red-600 dark:text-red-400',
  'Apple Search': 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
  'Google UAC': 'bg-green-500/10 text-green-600 dark:text-green-400',
};

function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      {[1,2,3,4,5,6].map(i => (
        <td key={i} className="py-3 px-4">
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export default function CampaignsPage() {
  const { isLoading, selectedClient } = useDashboard();
  const clientCampaigns = campaigns.filter(c => c.clientId === selectedClient.id);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Campañas</h1>
        <p className="text-muted-foreground text-sm mt-1">{clientCampaigns.length} campañas · {selectedClient.name}</p>
      </div>

      <div className="dashboard-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {['Campaña', 'Plataforma', 'Estado', 'Presupuesto', 'Conversiones', 'ROAS'].map(h => (
                  <th key={h} className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [1,2,3].map(i => <SkeletonRow key={i} />)
                : clientCampaigns.map(c => {
                    const roas = c.spent > 0 ? (c.revenue / c.spent).toFixed(2) : '—';
                    const budgetPct = Math.round((c.spent / c.budget) * 100);
                    return (
                      <tr key={c.id} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">{c.name}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${platformColors[c.platform] || 'bg-muted text-muted-foreground'}`}>
                            {c.platform}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            c.status === 'active' ? 'bg-success/10 text-success' :
                            c.status === 'paused' ? 'bg-warning/10 text-warning' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {c.status === 'active' ? '● Activa' : c.status === 'paused' ? '⏸ Pausada' : 'Terminada'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">€{c.spent.toLocaleString()}</span>
                              <span className="text-muted-foreground">{budgetPct}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${Math.min(budgetPct, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-foreground">{c.conversions.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 font-bold text-success">
                            <TrendingUp className="h-3.5 w-3.5" />
                            {roas}x
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
    </div>
  );
}
