import { getRedFlagStatus } from "@/utils/redFlagUtils";
import type { Company } from "@/types/company";
import { AlertTriangle, Flag } from "lucide-react";

export function RedFlagBadge({ company }: { company: Company }) {
  const status = getRedFlagStatus(company);

  if (status.level === "none") return null;

  const isRed = status.level === "red";

  return (
    <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm ${
      isRed ? "bg-red-500/10 text-red-600 border border-red-200 dark:border-red-900/50" : "bg-amber-500/10 text-amber-600 border border-amber-200 dark:border-amber-900/50"
    }`}>
      {isRed ? <Flag className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
      {isRed ? "Risk Detected" : "Review Advised"}
    </div>
  );
}
