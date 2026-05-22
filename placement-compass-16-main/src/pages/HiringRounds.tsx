import { useCompanies } from "@/hooks/useCompanies";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STANDARD_ROUNDS = [
  {
    name: "Online Assessment",
    topics: ["Aptitude", "Logical Reasoning", "Verbal Ability", "Coding Questions"]
  },
  {
    name: "Technical Screening",
    topics: ["DSA", "OOP", "DBMS", "Operating Systems", "Computer Networks"]
  },
  {
    name: "Coding Interview",
    topics: ["Problem Solving", "Algorithms", "Live Coding"]
  },
  {
    name: "Technical Interview",
    topics: ["Projects", "Core Subjects", "Development Skills"]
  },
  {
    name: "HR / Behavioral Round",
    topics: ["Communication", "Teamwork", "Leadership", "Career Goals"]
  },
  {
    name: "Offer Decision",
    topics: ["Compensation Discussion", "Role Allocation"]
  }
];

export default function HiringRounds() {
  const { data: companies = [] } = useCompanies();

  return (
    <div>
      <PageHeader
        eyebrow="Hiring Rounds"
        title="Recruitment Process Library"
        description="Understand each company's typical hiring process and how to prepare."
      />

      {companies.length === 0 ? (
        <EmptyState icon={<ListChecks className="h-5 w-5" />} />
      ) : (
        <div className="space-y-4">
          {companies.map(c => (
            <div key={String(c.company_id)} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-display text-lg font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.category} • Standard Software Engineering Pipeline</div>
                </div>
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">Standard Pattern</Badge>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                {STANDARD_ROUNDS.map((r, i) => (
                  <div key={r.name} className="rounded-lg border border-border p-3 bg-surface-muted flex flex-col h-full">
                    <div className="text-[10px] font-mono text-brand uppercase tracking-wider mb-1">Round {i + 1}</div>
                    <div className="text-sm font-semibold mb-2">{r.name}</div>
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {r.topics.map(t => (
                        <span key={t} className="text-[10px] bg-background border border-border px-1.5 py-0.5 rounded text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
