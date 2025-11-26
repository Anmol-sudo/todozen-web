'use client';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type AIPrioritizerProps = {
  onPrioritize: () => void;
  isLoading: boolean;
  hasTasks: boolean;
};

export function AIPrioritizer({ onPrioritize, isLoading, hasTasks }: AIPrioritizerProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block"> {/* div wrapper for disabled button tooltip */}
            <Button onClick={onPrioritize} disabled={!hasTasks || isLoading} className="gap-2 transition-all duration-300">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Intelligent Prioritization
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{!hasTasks ? "Add some tasks first!" : "Let AI prioritize your tasks."}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
