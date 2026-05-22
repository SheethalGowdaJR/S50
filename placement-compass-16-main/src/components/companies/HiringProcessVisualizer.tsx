import React, { useMemo } from 'react';
import type { Company } from '@/types/company';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function HiringProcessVisualizer({ company }: { company: Company }) {
  const stages = useMemo(() => {
    const rounds: { name: string; color: string }[] = [];
    
    const nature = (company.nature_of_company || '').toLowerCase();
    const tech = company.tech_stack;
    const aiLevel = (company.ai_ml_adoption_level || '').toLowerCase();
    const autoLevel = (company.automation_level || '').toLowerCase();
    const hiringVel = (company.hiring_velocity || '').toLowerCase();

    if (nature.includes('product')) {
      rounds.push({ name: 'DSA/Coding Round', color: 'bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-400 dark:border-blue-800' });
    }
    if (nature.includes('service')) {
      rounds.push({ name: 'Aptitude Test', color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400 dark:border-yellow-800' });
    }
    if (tech && (typeof tech === 'string' ? tech.length > 0 : tech.length > 0)) {
      rounds.push({ name: 'Technical Interview', color: 'bg-purple-500/10 text-purple-700 border-purple-200 dark:text-purple-400 dark:border-purple-800' });
    }
    if (aiLevel === 'high') {
      rounds.push({ name: 'ML/Data Round', color: 'bg-teal-500/10 text-teal-700 border-teal-200 dark:text-teal-400 dark:border-teal-800' });
    }
    if (autoLevel === 'high') {
      rounds.push({ name: 'Logical Reasoning Test', color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400 dark:border-yellow-800' });
    }
    if (hiringVel === 'slow') {
      rounds.push({ name: 'Management Round', color: 'bg-orange-500/10 text-orange-700 border-orange-200 dark:text-orange-400 dark:border-orange-800' });
    }
    
    rounds.push({ name: 'HR Round', color: 'bg-green-500/10 text-green-700 border-green-200 dark:text-green-400 dark:border-green-800' });
    
    return rounds;
  }, [company]);

  return (
    <Card className="mt-6 mb-6 overflow-hidden">
      <CardHeader className="bg-surface pb-4 border-b border-border flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          Estimated Interview Process
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Generated from available company data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 overflow-x-auto scrollbar-thin">
        {stages.length === 1 && stages[0].name === 'HR Round' ? (
          <div className="text-center text-sm text-muted-foreground py-4">
            Round details not available for this company
          </div>
        ) : (
          <div className="flex items-center min-w-max py-2">
            {stages.map((stage, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center group min-w-[120px]">
                  <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center font-bold text-sm shadow-sm transition-transform group-hover:scale-110 ${stage.color}`}>
                    {idx + 1}
                  </div>
                  <div className="mt-3 text-xs font-medium text-foreground text-center">
                    {stage.name}
                  </div>
                </div>
                {idx < stages.length - 1 && (
                  <div className="w-8 sm:w-16 h-px bg-border -mt-6 mx-1 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
