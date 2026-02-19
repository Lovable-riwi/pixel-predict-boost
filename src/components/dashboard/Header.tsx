import { useState, useRef, useEffect } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { clients } from '@/data/mockData';
import {
  ChevronDown, Sun, Moon, Bell, Calendar,
  TrendingUp, User, Zap, ChevronRight,
} from 'lucide-react';

export default function Header() {
  const { theme, toggleTheme, selectedClient, setSelectedClient, dateRange, setDateRange, alerts } = useDashboard();
  const [clientOpen, setClientOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const clientRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (clientRef.current && !clientRef.current.contains(e.target as Node)) setClientOpen(false);
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setDateOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dateLabels: Record<string, string> = { '7d': 'Últimos 7 días', '30d': 'Últimos 30 días', 'custom': 'Personalizado' };
  const alertCount = alerts.filter(a => a.priority === 'Alta').length;

  return (
    <header
      className="sticky top-0 z-50 flex h-16 items-center justify-between px-4 md:px-6 border-b border-border"
      style={{
        background: scrolled ? 'hsl(var(--card))' : 'hsl(var(--background))',
        boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
        transition: 'background 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary flex-shrink-0">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="hidden sm:block">
          <span className="text-sm font-bold gradient-text">PulseMetrics</span>
          <span className="hidden md:block text-[10px] text-muted-foreground leading-none">Marketing Intelligence</span>
        </div>
      </div>

      {/* Center controls */}
      <div className="flex items-center gap-2">
        {/* Client selector */}
        <div className="relative" ref={clientRef}>
          <button
            onClick={() => { setClientOpen(!clientOpen); setDateOpen(false); }}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex-shrink-0">
              {selectedClient.avatar}
            </div>
            <span className="hidden sm:block max-w-[120px] truncate">{selectedClient.name}</span>
            <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${clientOpen ? 'rotate-180' : ''}`} />
          </button>

          {clientOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-56 rounded-xl border border-border bg-card shadow-card-lg z-50 animate-scale-in overflow-hidden">
              <div className="p-1">
                {clients.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedClient(c); setClientOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      c.id === selectedClient.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-foreground'
                    }`}
                  >
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${
                      c.id === selectedClient.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/10 text-primary'
                    }`}>
                      {c.avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{c.name}</div>
                      <div className={`text-xs ${c.id === selectedClient.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{c.industry}</div>
                    </div>
                    {c.id === selectedClient.id && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Date selector */}
        <div className="relative" ref={dateRef}>
          <button
            onClick={() => { setDateOpen(!dateOpen); setClientOpen(false); }}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="hidden md:block">{dateLabels[dateRange]}</span>
            <span className="md:hidden">{dateRange.toUpperCase()}</span>
            <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${dateOpen ? 'rotate-180' : ''}`} />
          </button>

          {dateOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-border bg-card shadow-card-lg z-50 animate-scale-in overflow-hidden">
              <div className="p-1">
                {(['7d', '30d'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => { setDateRange(range); setDateOpen(false); }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      range === dateRange ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-foreground'
                    }`}
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    {dateLabels[range]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="relative flex h-8 w-14 items-center rounded-full border border-border bg-muted p-1 transition-colors hover:bg-accent"
          aria-label="Toggle theme"
        >
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full bg-card shadow-sm transition-transform duration-200"
            style={{ transform: theme === 'dark' ? 'translateX(24px)' : 'translateX(0)' }}
          >
            {theme === 'dark'
              ? <Moon className="h-3.5 w-3.5 text-primary" />
              : <Sun className="h-3.5 w-3.5 text-warning" />
            }
          </div>
        </button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:bg-accent transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {alertCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {alertCount}
            </span>
          )}
        </button>

        {/* User avatar */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-gradient-primary hover:opacity-90 transition-opacity">
          <User className="h-4 w-4 text-primary-foreground" />
        </button>
      </div>
    </header>
  );
}
