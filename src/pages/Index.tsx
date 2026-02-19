import { useState } from 'react';
import { DashboardProvider } from '@/store/DashboardContext';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import MainDashboard from '@/components/dashboard/MainDashboard';
import CampaignsPage from '@/components/dashboard/CampaignsPage';
import { useDashboard } from '@/store/DashboardContext';
import { Menu } from 'lucide-react';

function DashboardContent() {
  const { activePage } = useDashboard();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Mobile sidebar toggle */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-2 md:hidden bg-card">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <Menu className="h-4 w-4 text-muted-foreground" />
          </button>
          <span className="text-sm font-medium text-muted-foreground">Menú</span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {activePage === 'campaigns' ? <CampaignsPage /> : <MainDashboard />}
        </main>
      </div>
    </div>
  );
}

const Index = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default Index;
