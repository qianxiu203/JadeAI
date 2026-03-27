'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useInterviewStore } from '@/stores/interview-store';
import type { InterviewerConfig } from '@/types/interview';

export function ProgressBar() {
  const { rounds, currentRoundIndex } = useInterviewStore();

  return (
    <div className="flex items-center justify-center gap-0 py-2">
      {rounds.map((round, i) => {
        const config = round.interviewerConfig as InterviewerConfig;
        const isCurrent = i === currentRoundIndex;
        const isDone = round.status === 'completed' || round.status === 'skipped';

        return (
          <div key={round.id} className="flex items-center">
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-medium transition-all',
                isCurrent && 'border-pink-500 bg-gradient-to-r from-pink-50 to-white dark:from-pink-950 dark:to-zinc-900',
                isDone && 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950',
                !isCurrent && !isDone && 'border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800'
              )}
            >
              <div
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                  isCurrent && 'bg-pink-500 text-white',
                  isDone && 'bg-green-500 text-white',
                  !isCurrent && !isDone && 'bg-zinc-300 text-white dark:bg-zinc-600'
                )}
              >
                {isDone ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <span
                className={cn(
                  isCurrent && 'text-pink-700 dark:text-pink-300',
                  isDone && 'text-green-700 dark:text-green-300',
                  !isCurrent && !isDone && 'text-zinc-400'
                )}
              >
                {config.name}
              </span>
            </div>
            {i < rounds.length - 1 && (
              <div className={cn('h-0.5 w-6', isDone ? 'bg-green-300 dark:bg-green-700' : 'bg-zinc-200 dark:bg-zinc-700')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
