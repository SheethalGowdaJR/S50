import { useState } from "react";
import { getRedFlagStatus } from "@/utils/redFlagUtils";
import type { Company } from "@/types/company";
import { AlertTriangle, Flag, X } from "lucide-react";

export function RedFlagPanel({ company }: { company: Company }) {
  const [dismissed, setDismissed] = useState(false);
  const status = getRedFlagStatus(company);

  if (status.level === "none" || dismissed) return null;

  const isRed = status.level === "red";

  return (
    <div className={`relative mb-6 rounded-lg border p-4 shadow-sm ${
      isRed ? "bg-red-500/5 border-red-200 dark:border-red-900/50" : "bg-amber-500/5 border-amber-200 dark:border-amber-900/50"
    }`}>
      <button 
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 p-1.5 rounded-md ${isRed ? "bg-red-100 text-red-600 dark:bg-red-900/30" : "bg-amber-100 text-amber-600 dark:bg-amber-900/30"}`}>
          {isRed ? <Flag className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${isRed ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400"}`}>
            {isRed ? "Risk Signals Detected" : "Review Advised"}
          </h3>
          
          <ul className="mt-2 space-y-1">
            {status.flags.map((flag, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                <span className={`w-1.5 h-1.5 rounded-full ${isRed ? "bg-red-400" : "bg-amber-400"}`} />
                {flag}
              </li>
            ))}
          </ul>
          
          <p className="mt-4 text-xs text-muted-foreground">
            Flags are generated from structured company data. Verify independently before making decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
