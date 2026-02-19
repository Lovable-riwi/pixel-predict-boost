import { useDashboard } from '@/store/DashboardContext';
import { campaigns } from '@/data/mockData';
import {
  LayoutDashboard, Megaphone, Image, Users, FileBarChart2,
  Settings, ChevronLeft, ChevronRight, X,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'campaigns', label: 'Campañas', icon: Megaphone },
  { id: 'ads', label: 'Anuncios', icon: Image },
  { id: 'audiences', label: 'Audiencias', icon: Users },
  { id: 'reports', label: 'Reportes', icon: FileBarChart2 },
  { id: 'settings', label: 'Configuración', icon: Settings },
] as const;

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { sidebarCollapsed, setSidebarCollapsed, activePage, setActivePage } = useDashboard();
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

  const handleNav = (id: typeof navItems[number]['id']) => {
    setActivePage(id);
    onMobileClose?.();
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          flex flex-col border-r border-sidebar-border bg-sidebar z-50
          transition-all duration-300 ease-in-out
          fixed md:relative md:flex h-full
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${sidebarCollapsed ? 'md:w-[72px]' : 'w-[240px]'}
        `}
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        {/* Mobile close */}
        <button
          onClick={onMobileClose}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg hover:bg-sidebar-accent md:hidden"
        >
          <X className="h-4 w-4 text-sidebar-foreground" />
        </button>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin p-2 pt-3">
          <div className="space-y-0.5">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activePage === id;
              const showBadge = id === 'campaigns';

              return (
                <button
                  key={id}
                  onClick={() => handleNav(id)}
                  title={sidebarCollapsed ? label : undefined}
                  className={`
                    sidebar-link w-full
                    ${isActive ? 'active' : ''}
                    ${sidebarCollapsed ? 'justify-center px-0' : ''}
                  `}
                >
                  <Icon className={`h-4.5 w-4.5 flex-shrink-0 ${sidebarCollapsed ? 'h-5 w-5' : ''}`} />
                  {!sidebarCollapsed && (
                    <span className="flex-1 text-left">{label}</span>
                  )}
                  {!sidebarCollapsed && showBadge && (
                    <span className={`
                      ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold
                      ${isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/10 text-primary'}
                    `}>
                      {activeCampaigns}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Collapse toggle — desktop only */}
        <div className="hidden md:flex border-t border-sidebar-border p-2">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            {sidebarCollapsed
              ? <ChevronRight className="h-4 w-4" />
              : <><ChevronLeft className="h-4 w-4" /><span>Colapsar</span></>
            }
          </button>
        </div>
      </aside>
    </>
  );
}
