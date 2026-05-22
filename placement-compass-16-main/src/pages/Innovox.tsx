import { useMemo } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { useCompanies } from "@/hooks/useCompanies";
import { Sparkles, Cpu, TrendingUp, Lightbulb, ArrowUpRight } from "lucide-react";

export default function Innovox() {
  const { data: companies = [] } = useCompanies();

  const insights = useMemo(() => {
    // 1. Emerging Tech Trends
    const techCounts: Record<string, number> = {};
    companies.forEach(c => {
      if (!c.tech_stack) return;
      try {
        const stacks = Array.isArray(c.tech_stack) ? c.tech_stack : JSON.parse(c.tech_stack);
        if (Array.isArray(stacks)) {
          stacks.forEach(t => { techCounts[t] = (techCounts[t] || 0) + 1; });
        }
      } catch(e) {
        if (typeof c.tech_stack === 'string') {
          techCounts[c.tech_stack] = (techCounts[c.tech_stack] || 0) + 1;
        }
      }
    });
    const topTech = Object.entries(techCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);

    // 2. High-growth Companies
    const highGrowth = companies
      .filter(c => {
        const yoy = typeof c.yoy_growth_rate === 'string' ? parseFloat(c.yoy_growth_rate) : (c.yoy_growth_rate || 0);
        return yoy > 0 && c.hiring_velocity === "High";
      })
      .sort((a, b) => {
        const aYoy = typeof a.yoy_growth_rate === 'string' ? parseFloat(a.yoy_growth_rate) : (a.yoy_growth_rate || 0);
        const bYoy = typeof b.yoy_growth_rate === 'string' ? parseFloat(b.yoy_growth_rate) : (b.yoy_growth_rate || 0);
        return bYoy - aYoy;
      })
      .slice(0, 3);

    // 3. Skill Demand Insights
    const skillCounts: Record<string, number> = {};
    companies.forEach(c => {
      if (!c.skill_relevance) return;
      try {
        const skills = Array.isArray(c.skill_relevance) ? c.skill_relevance : JSON.parse(c.skill_relevance);
        if (Array.isArray(skills)) {
          skills.forEach(s => { skillCounts[s] = (skillCounts[s] || 0) + 1; });
        }
      } catch(e) {
        if (typeof c.skill_relevance === 'string') {
          const splits = c.skill_relevance.split(',').map(s => s.trim());
          splits.forEach(s => { skillCounts[s] = (skillCounts[s] || 0) + 1; });
        }
      }
    });
    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);

    return { topTech, highGrowth, topSkills };
  }, [companies]);

  const PANELS = [
    { 
      icon: Cpu, 
      title: "Emerging Tech Trends", 
      body: "Aggregated tech_stack signals across recruiting partners.",
      content: insights.topTech.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-4">
          {insights.topTech.map(t => (
            <span key={t} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md border border-border">
              {t}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-4 h-24 rounded-md border border-dashed border-border grid place-items-center text-xs text-muted-foreground">
          No tech data available
        </div>
      )
    },
    { 
      icon: TrendingUp, 
      title: "High-growth Companies", 
      body: "Companies ranked by positive growth and high hiring velocity.",
      content: insights.highGrowth.length > 0 ? (
        <div className="flex flex-col gap-2 mt-4">
          {insights.highGrowth.map(c => (
            <div key={c.company_id} className="flex justify-between items-center text-xs bg-muted/50 p-2 rounded-md border border-border">
              <span className="font-medium truncate mr-2">{c.name}</span>
              <span className="text-green-600 font-semibold">{c.yoy_growth_rate}% YoY</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 h-24 rounded-md border border-dashed border-border grid place-items-center text-xs text-muted-foreground">
          No growth data available
        </div>
      )
    },
    { 
      icon: Lightbulb, 
      title: "Skill Demand Insights", 
      body: "Most-requested skills derived from skill_relevance frequency.",
      content: insights.topSkills.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-4">
          {insights.topSkills.map(s => (
            <span key={s} className="text-xs bg-brand/10 text-brand px-2 py-1 rounded-md font-medium border border-brand/20">
              {s}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-4 h-24 rounded-md border border-dashed border-border grid place-items-center text-xs text-muted-foreground">
          No skills data available
        </div>
      )
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Innovox"
        title="Innovation & Insights Layer"
        description="An extensible analytics surface for forward-looking placement intelligence."
        actions={
          <div className="hidden sm:flex items-center gap-2 text-xs text-brand bg-brand-soft px-3 py-1.5 rounded-full">
            <Sparkles className="h-3.5 w-3.5" /> Beta module
          </div>
        }
      />

      <div className="rounded-2xl bg-gradient-mesh border border-border p-6 sm:p-10 mb-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-balance">
            Turn 163 columns of company data into <span className="text-brand">strategic foresight</span>.
          </h2>
          <p className="text-sm text-muted-foreground mt-3">
            Innovox surfaces patterns across hiring, tech adoption, and growth signals — designed to plug into the same Supabase schema.
          </p>
          <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
            <span><span className="font-display text-2xl font-bold text-foreground">{companies.length}</span> companies analyzed</span>
            <span className="h-4 w-px bg-border" />
            <span><span className="font-display text-2xl font-bold text-foreground">163</span> data points each</span>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PANELS.map(({ icon: Icon, title, body, content }) => (
          <div key={title} className="group rounded-xl border border-border bg-surface p-5 hover:shadow-elevated transition-all flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-brand-soft text-brand grid place-items-center group-hover:bg-gradient-brand group-hover:text-brand-foreground transition-all">
                <Icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-brand transition-colors" />
            </div>
            <div className="font-display font-semibold">{title}</div>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed flex-grow">{body}</p>
            {content}
          </div>
        ))}
      </div>
    </div>
  );
}
