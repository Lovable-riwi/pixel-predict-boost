import { useDashboard } from '@/store/DashboardContext';
import ConversionsChart from './ConversionsChart';
import KPICards from './KPICards';
import AIAlerts from './AIAlerts';
import WeeklyComparison from './WeeklyComparison';

export default function MainDashboard() {
  const { activePage } = useDashboard();

  if (activePage !== 'dashboard') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-8">
        <div className="text-5xl mb-4">🚀</div>
        <h2 className="text-xl font-bold text-foreground mb-2">Sección en construcción</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          Esta sección estará disponible próximamente. Navega al Dashboard para explorar las métricas.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Dashboard Principal</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Vista general de todas las campañas activas</p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] xl:grid-cols-[2fr_1fr_1fr] gap-5">
        {/* Conversions chart — takes 2 cols on xl */}
        <div className="md:col-span-1 xl:col-span-2">
          <ConversionsChart />
        </div>

        {/* KPI stack */}
        <div className="xl:col-span-1">
          <KPICards />
        </div>

        {/* Weekly comparison — below chart on xl */}
        <div className="md:col-span-1 xl:col-span-2">
          <WeeklyComparison />
        </div>

        {/* AI Alerts */}
        <div className="xl:col-span-1">
          <AIAlerts />
        </div>
      </div>
    </div>
  );
}
