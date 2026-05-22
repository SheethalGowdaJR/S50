import type { Company } from '@/types/company';

export interface RedFlagStatus {
  level: "red" | "yellow" | "none";
  flags: string[];
  count: number;
}

export function getRedFlagStatus(company: Company): RedFlagStatus {
  const flags: string[] = [];

  const burnout = (company.burnout_risk || '').toLowerCase();
  if (burnout === 'high') {
    flags.push("High burnout risk");
  }

  const layoffs = (company.layoff_history || '').toLowerCase();
  if (layoffs && layoffs !== 'none') {
    flags.push("Recent layoff history");
  }

  const legal = (company.legal_issues || '').toLowerCase();
  if (legal && legal !== 'none') {
    flags.push("Legal issues detected");
  }

  const runwayStr = company.runway_months;
  if (runwayStr) {
    const months = parseInt(String(runwayStr), 10);
    if (!isNaN(months) && months < 12) {
      flags.push("Short financial runway (< 12 months)");
    }
  }

  const turnover = (company.employee_turnover || '').toLowerCase();
  if (turnover === 'high') {
    flags.push("High employee turnover");
  }

  const regulatory = (company.regulatory_status || '').toLowerCase();
  if (
    regulatory.includes('non-compliant') ||
    regulatory.includes('issue') ||
    regulatory.includes('violation')
  ) {
    flags.push("Regulatory compliance concern");
  }

  const count = flags.length;
  let level: "red" | "yellow" | "none" = "none";
  if (count >= 2) level = "red";
  else if (count === 1) level = "yellow";

  return { level, flags, count };
}
