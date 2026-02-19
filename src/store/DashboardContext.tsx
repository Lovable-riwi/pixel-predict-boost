import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  clients, campaigns, historicalMetrics, aiAlerts,
  computeKPIs, generatePrediction, getWeeklyComparison, simulateFetch,
  type Client, type Campaign, type DailyMetric, type AIAlert, type KPIData, type WeeklyRow,
} from '@/data/mockData';

type DateRange = '7d' | '30d' | 'custom';
type ActivePage = 'dashboard' | 'campaigns' | 'ads' | 'audiences' | 'reports' | 'settings';

interface DashboardState {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Navigation
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  activePage: ActivePage;
  setActivePage: (p: ActivePage) => void;

  // Client / Date
  selectedClient: Client;
  setSelectedClient: (c: Client) => void;
  dateRange: DateRange;
  setDateRange: (r: DateRange) => void;

  // Data
  isLoading: boolean;
  metrics: DailyMetric[];
  prediction: DailyMetric[];
  kpis: KPIData | null;
  alerts: AIAlert[];
  weeklyComparison: WeeklyRow[];
  allCampaigns: Campaign[];
  allClients: Client[];

  // UI
  showPrediction: boolean;
  setShowPrediction: (v: boolean) => void;
  selectedMetric: 'conversions' | 'revenue' | 'cost';
  setSelectedMetric: (m: 'conversions' | 'revenue' | 'cost') => void;
}

const DashboardContext = createContext<DashboardState | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('dashboard-theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [selectedClient, setSelectedClient] = useState<Client>(clients[0]);
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DailyMetric[]>([]);
  const [prediction, setPrediction] = useState<DailyMetric[]>([]);
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [alerts, setAlerts] = useState<AIAlert[]>([]);
  const [weeklyComparison, setWeeklyComparison] = useState<WeeklyRow[]>([]);
  const [showPrediction, setShowPrediction] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'conversions' | 'revenue' | 'cost'>('conversions');

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('dashboard-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // Load data
  useEffect(() => {
    setIsLoading(true);
    const filtered = dateRange === '7d' ? historicalMetrics.slice(-7) : historicalMetrics;
    
    simulateFetch({
      metrics: filtered,
      prediction: generatePrediction(historicalMetrics),
      kpis: computeKPIs(historicalMetrics),
      alerts: aiAlerts,
      weekly: getWeeklyComparison(historicalMetrics),
    }, 900).then((data) => {
      setMetrics(data.metrics);
      setPrediction(data.prediction);
      setKpis(data.kpis);
      setAlerts(data.alerts);
      setWeeklyComparison(data.weekly);
      setIsLoading(false);
    });
  }, [selectedClient, dateRange]);

  return (
    <DashboardContext.Provider value={{
      theme, toggleTheme,
      sidebarCollapsed, setSidebarCollapsed,
      activePage, setActivePage,
      selectedClient, setSelectedClient,
      dateRange, setDateRange,
      isLoading,
      metrics, prediction, kpis, alerts, weeklyComparison,
      allCampaigns: campaigns,
      allClients: clients,
      showPrediction, setShowPrediction,
      selectedMetric, setSelectedMetric,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
