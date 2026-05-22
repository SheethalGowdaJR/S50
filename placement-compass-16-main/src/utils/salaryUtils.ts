import salaryData from '../data/salaryData.json';

export interface SalaryRecord {
  id: string;
  companyName: string;
  role: string;
  category: string;
  year: number;
  totalCTC: number;
  basePay: number;
  variableBonus: number;
  esopValue: number;
  stipend: number;
  offerType: string;
  verified: boolean;
}

const data = salaryData as SalaryRecord[];

export function getFilteredData(filters: any) {
  return data.filter(d => {
    if (filters.company && filters.company !== "all" && d.companyName !== filters.company) return false;
    if (filters.role && filters.role !== "all" && d.role !== filters.role) return false;
    if (filters.category && filters.category !== "all" && d.category !== filters.category) return false;
    if (filters.year && filters.year !== "all" && d.year !== Number(filters.year)) return false;
    return true;
  });
}

export function highestPackage(filtered = data) {
  if (!filtered.length) return 0;
  return Math.max(...filtered.map(d => d.totalCTC));
}

export function averagePackage(filtered = data) {
  if (!filtered.length) return 0;
  return Math.round(filtered.reduce((acc, d) => acc + d.totalCTC, 0) / filtered.length);
}

export function medianPackage(filtered = data) {
  if (!filtered.length) return 0;
  const sorted = [...filtered].map(d => d.totalCTC).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function highestBaseSalary(filtered = data) {
  if (!filtered.length) return 0;
  return Math.max(...filtered.map(d => d.basePay));
}

export function topPayingCompany(filtered = data) {
  if (!filtered.length) return 'N/A';
  const companyAvgs: Record<string, { total: number, count: number }> = {};
  filtered.forEach(d => {
    if (!companyAvgs[d.companyName]) companyAvgs[d.companyName] = { total: 0, count: 0 };
    companyAvgs[d.companyName].total += d.totalCTC;
    companyAvgs[d.companyName].count += 1;
  });
  let topC = '';
  let maxAvg = 0;
  for (const [c, stats] of Object.entries(companyAvgs)) {
    const avg = stats.total / stats.count;
    if (avg > maxAvg) {
      maxAvg = avg;
      topC = c;
    }
  }
  return topC;
}

export function averageBonus(filtered = data) {
  if (!filtered.length) return 0;
  return Math.round(filtered.reduce((acc, d) => acc + d.variableBonus, 0) / filtered.length);
}

export function salaryGrowthTrend(filtered = data) {
  const years: Record<number, { total: number, count: number }> = {};
  filtered.forEach(d => {
    if (!years[d.year]) years[d.year] = { total: 0, count: 0 };
    years[d.year].total += d.totalCTC;
    years[d.year].count += 1;
  });
  return Object.keys(years).sort().map(y => ({
    year: y,
    avgCTC: Math.round(years[Number(y)].total / years[Number(y)].count)
  }));
}

export function roleWiseCompensation(filtered = data) {
  const roles: Record<string, { total: number, count: number }> = {};
  filtered.forEach(d => {
    if (!roles[d.role]) roles[d.role] = { total: 0, count: 0 };
    roles[d.role].total += d.totalCTC;
    roles[d.role].count += 1;
  });
  return Object.keys(roles).map(r => ({
    role: r,
    avgCTC: Math.round(roles[r].total / roles[r].count)
  })).sort((a, b) => b.avgCTC - a.avgCTC);
}

export function companyComparison(filtered = data) {
  const companies: Record<string, { total: number, count: number }> = {};
  filtered.forEach(d => {
    if (!companies[d.companyName]) companies[d.companyName] = { total: 0, count: 0 };
    companies[d.companyName].total += d.totalCTC;
    companies[d.companyName].count += 1;
  });
  return Object.keys(companies).map(c => ({
    company: c,
    avgCTC: Math.round(companies[c].total / companies[c].count)
  })).sort((a, b) => b.avgCTC - a.avgCTC).slice(0, 10);
}

export const formatCurrency = (val: number) => {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val}`;
};

export const getAllData = () => data;
