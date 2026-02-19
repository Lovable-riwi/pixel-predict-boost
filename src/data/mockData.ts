// Mock data for the Marketing Dashboard

export interface Client {
  id: string;
  name: string;
  avatar: string;
  industry: string;
  budget: number;
}

export interface Campaign {
  id: string;
  clientId: string;
  name: string;
  platform: string;
  status: 'active' | 'paused' | 'ended';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

export interface DailyMetric {
  date: string;
  conversions: number;
  revenue: number;
  cost: number;
  clicks: number;
  impressions: number;
}

export interface AIAlert {
  id: string;
  type: 'bajo_rendimiento' | 'alto_costo' | 'caida_ctr' | 'oportunidad';
  priority: 'Alta' | 'Media' | 'Baja';
  probabilidadImpacto: number;
  mensaje: string;
  recomendacion: string;
  campaignId: string;
  campaignName: string;
}

export interface KPIData {
  roi: number;
  roiProjected: number;
  aiConfidence: number;
  cpc: number;
  cpcChange: number;
  ctr: number;
  ctrChange: number;
  roas: number;
  roasChange: number;
}

// --- Clients ---
export const clients: Client[] = [
  { id: 'c1', name: 'TechNova Corp', avatar: 'TN', industry: 'SaaS', budget: 85000 },
  { id: 'c2', name: 'Bloom Retail', avatar: 'BR', industry: 'E-commerce', budget: 42000 },
  { id: 'c3', name: 'UrbanMove', avatar: 'UM', industry: 'Mobility', budget: 67000 },
];

// --- Campaigns ---
export const campaigns: Campaign[] = [
  { id: 'camp1', clientId: 'c1', name: 'Google Ads – Brand', platform: 'Google', status: 'active', budget: 15000, spent: 11240, impressions: 842000, clicks: 18400, conversions: 920, revenue: 82800 },
  { id: 'camp2', clientId: 'c1', name: 'Meta Prospecting Q1', platform: 'Meta', status: 'active', budget: 12000, spent: 9800, impressions: 1240000, clicks: 22100, conversions: 742, revenue: 62280 },
  { id: 'camp3', clientId: 'c1', name: 'YouTube Awareness', platform: 'YouTube', status: 'active', budget: 8000, spent: 6200, impressions: 3100000, clicks: 8900, conversions: 310, revenue: 24800 },
  { id: 'camp4', clientId: 'c2', name: 'Shopping – Temporada', platform: 'Google', status: 'active', budget: 18000, spent: 14200, impressions: 560000, clicks: 14800, conversions: 1180, revenue: 94400 },
  { id: 'camp5', clientId: 'c2', name: 'Meta Retargeting', platform: 'Meta', status: 'active', budget: 9000, spent: 7100, impressions: 320000, clicks: 9600, conversions: 580, revenue: 43500 },
  { id: 'camp6', clientId: 'c3', name: 'App Install – iOS', platform: 'Apple Search', status: 'active', budget: 22000, spent: 17800, impressions: 980000, clicks: 31200, conversions: 2480, revenue: 148800 },
  { id: 'camp7', clientId: 'c3', name: 'App Install – Android', platform: 'Google UAC', status: 'active', budget: 20000, spent: 15600, impressions: 2200000, clicks: 44000, conversions: 3100, revenue: 186000 },
  { id: 'camp8', clientId: 'c1', name: 'Display Remarketing', platform: 'Google', status: 'paused', budget: 5000, spent: 2100, impressions: 1800000, clicks: 3200, conversions: 88, revenue: 7040 },
];

// --- Generate 30 days of metrics ---
function generateDailyMetrics(): DailyMetric[] {
  const metrics: DailyMetric[] = [];
  const now = new Date();
  let baseConversions = 420;
  let baseRevenue = 36000;
  let baseCost = 18000;

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayStr = date.toISOString().split('T')[0];
    
    // Weekend dip
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const weekendFactor = isWeekend ? 0.72 : 1;
    
    // Trend: slight growth over time
    const trendFactor = 1 + (29 - i) * 0.004;
    
    // Random noise
    const noise = () => 0.88 + Math.random() * 0.24;

    const conversions = Math.round(baseConversions * weekendFactor * trendFactor * noise());
    const revenue = Math.round(baseRevenue * weekendFactor * trendFactor * noise());
    const cost = Math.round(baseCost * weekendFactor * noise());
    const clicks = Math.round((conversions / 0.048) * noise());
    const impressions = Math.round(clicks * 52 * noise());

    metrics.push({ date: dayStr, conversions, revenue, cost, clicks, impressions });
  }
  return metrics;
}

export const historicalMetrics = generateDailyMetrics();

// Generate AI prediction (next 7 days)
export function generatePrediction(metrics: DailyMetric[]): DailyMetric[] {
  const last7 = metrics.slice(-7);
  const avgGrowth = 1.028;
  const prediction: DailyMetric[] = [];
  const lastDate = new Date(metrics[metrics.length - 1].date);
  const lastMetric = metrics[metrics.length - 1];

  for (let i = 1; i <= 7; i++) {
    const d = new Date(lastDate);
    d.setDate(d.getDate() + i);
    const factor = Math.pow(avgGrowth, i) * (0.95 + Math.random() * 0.1);
    prediction.push({
      date: d.toISOString().split('T')[0],
      conversions: Math.round(lastMetric.conversions * factor),
      revenue: Math.round(lastMetric.revenue * factor),
      cost: Math.round(lastMetric.cost * (factor * 0.92)),
      clicks: Math.round(lastMetric.clicks * factor),
      impressions: Math.round(lastMetric.impressions * factor),
    });
  }
  return prediction;
}

// --- KPIs ---
export function computeKPIs(metrics: DailyMetric[]): KPIData {
  const recent = metrics.slice(-7);
  const prev = metrics.slice(-14, -7);

  const totalRevenue = recent.reduce((s, m) => s + m.revenue, 0);
  const totalCost = recent.reduce((s, m) => s + m.cost, 0);
  const totalClicks = recent.reduce((s, m) => s + m.clicks, 0);
  const totalImpressions = recent.reduce((s, m) => s + m.impressions, 0);
  const totalConversions = recent.reduce((s, m) => s + m.conversions, 0);

  const prevRevenue = prev.reduce((s, m) => s + m.revenue, 0);
  const prevCost = prev.reduce((s, m) => s + m.cost, 0);
  const prevClicks = prev.reduce((s, m) => s + m.clicks, 0);
  const prevImpressions = prev.reduce((s, m) => s + m.impressions, 0);

  const roi = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0;
  const prevRoi = prevCost > 0 ? ((prevRevenue - prevCost) / prevCost) * 100 : 0;
  const aiConfidence = 78 + Math.floor(Math.random() * 14);
  const trendFactor = roi > prevRoi ? 1.032 : 0.975;
  const roiProjected = roi * trendFactor * (aiConfidence / 100 + 0.15);

  const cpc = totalClicks > 0 ? totalCost / totalClicks : 0;
  const prevCpc = prevClicks > 0 ? prevCost / prevClicks : 0;
  const cpcChange = prevCpc > 0 ? ((cpc - prevCpc) / prevCpc) * 100 : 0;

  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const prevCtr = prevImpressions > 0 ? (prevClicks / prevImpressions) * 100 : 0;
  const ctrChange = prevCtr > 0 ? ((ctr - prevCtr) / prevCtr) * 100 : 0;

  const roas = totalCost > 0 ? totalRevenue / totalCost : 0;
  const prevRoas = prevCost > 0 ? prevRevenue / prevCost : 0;
  const roasChange = prevRoas > 0 ? ((roas - prevRoas) / prevRoas) * 100 : 0;

  return {
    roi: Math.round(roi * 10) / 10,
    roiProjected: Math.round(roiProjected * 10) / 10,
    aiConfidence,
    cpc: Math.round(cpc * 100) / 100,
    cpcChange: Math.round(cpcChange * 10) / 10,
    ctr: Math.round(ctr * 100) / 100,
    ctrChange: Math.round(ctrChange * 10) / 10,
    roas: Math.round(roas * 100) / 100,
    roasChange: Math.round(roasChange * 10) / 10,
  };
}

// --- AI Alerts ---
export const aiAlerts: AIAlert[] = [
  {
    id: 'a1',
    type: 'caida_ctr',
    priority: 'Alta',
    probabilidadImpacto: 87,
    mensaje: 'CTR de "Google Ads – Brand" cayó 34% en los últimos 3 días',
    recomendacion: 'Actualizar creatividades y revisar concordancia de palabras clave. Considera añadir extensiones de anuncio.',
    campaignId: 'camp1',
    campaignName: 'Google Ads – Brand',
  },
  {
    id: 'a2',
    type: 'alto_costo',
    priority: 'Alta',
    probabilidadImpacto: 79,
    mensaje: 'CPC de "Meta Prospecting Q1" supera el benchmark en un 42%',
    recomendacion: 'Reducir el límite de puja manual a $2.80 y ampliar la segmentación de audiencia para reducir saturación.',
    campaignId: 'camp2',
    campaignName: 'Meta Prospecting Q1',
  },
  {
    id: 'a3',
    type: 'oportunidad',
    priority: 'Baja',
    probabilidadImpacto: 91,
    mensaje: 'App Install – Android muestra ROAS excepcional: 11.9x esta semana',
    recomendacion: 'Incrementar el presupuesto un 25% para aprovechar el momentum. La competencia es baja en este segmento.',
    campaignId: 'camp7',
    campaignName: 'App Install – Android',
  },
  {
    id: 'a4',
    type: 'bajo_rendimiento',
    priority: 'Media',
    probabilidadImpacto: 63,
    mensaje: 'Display Remarketing lleva 8 días sin conversiones registradas',
    recomendacion: 'Revisar frecuencia de los anuncios y segmento de remarketing. Considera reducir ventana de retargeting a 7 días.',
    campaignId: 'camp8',
    campaignName: 'Display Remarketing',
  },
  {
    id: 'a5',
    type: 'oportunidad',
    priority: 'Media',
    probabilidadImpacto: 74,
    mensaje: 'Shopping – Temporada tiene conversiones 22% sobre objetivo esta semana',
    recomendacion: 'Activar la estrategia tROAS y establecer objetivo en 6.5x para maximizar el margen en temporada alta.',
    campaignId: 'camp4',
    campaignName: 'Shopping – Temporada',
  },
];

// --- Weekly comparison ---
export interface WeeklyRow {
  metric: string;
  current: number;
  previous: number;
  format: 'number' | 'currency' | 'percent' | 'decimal';
}

export function getWeeklyComparison(metrics: DailyMetric[]): WeeklyRow[] {
  const current = metrics.slice(-7);
  const previous = metrics.slice(-14, -7);

  const sum = (arr: DailyMetric[], key: keyof DailyMetric) =>
    arr.reduce((s, m) => s + (m[key] as number), 0);

  return [
    { metric: 'Conversiones', current: sum(current, 'conversions'), previous: sum(previous, 'conversions'), format: 'number' },
    { metric: 'Ingresos', current: sum(current, 'revenue'), previous: sum(previous, 'revenue'), format: 'currency' },
    { metric: 'Coste', current: sum(current, 'cost'), previous: sum(previous, 'cost'), format: 'currency' },
    { metric: 'Clics', current: sum(current, 'clicks'), previous: sum(previous, 'clicks'), format: 'number' },
    { metric: 'Impresiones', current: sum(current, 'impressions'), previous: sum(previous, 'impressions'), format: 'number' },
  ];
}

// Simulate async loading
export function simulateFetch<T>(data: T, delay = 800): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}
