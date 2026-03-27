'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useInterviewStore } from '@/stores/interview-store';
import { INTERVIEWER_COLORS, DEFAULT_INTERVIEWER_COLOR } from '@/lib/interview/interviewers';
import type { InterviewerConfig } from '@/types/interview';

export function ProgressBar() {
  const t = useTranslations('interview.room');
  const { rounds, currentRoundIndex } = useInterviewStore();

  return (
    <div className="flex items-center gap-2 overflow-x-auto rounded-lg border bg-white p-3 dark:bg-zinc-900">
      {rounds.map((round, i) => {
        const config = round.interviewerConfig as InterviewerConfig;
        const isCurrent = i === currentRoundIndex;
        const isDone = round.status === 'completed' || round.status === 'skipped';
        const colorClass = INTERVIEWER_COLORS[round.interviewerType] || DEFAULT_INTERVIEWER_COLOR;

        return (
          <div
            key={round.id}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm transition-all',
              isCurrent && 'ring-2 ring-primary',
              isDone && 'opacity-60',
              colorClass
            )}
          >
            <span className="font-medium">{config.name}</span>
            {isDone && <span className="text-green-600">✓</span>}
            {isCurrent && (
              <Badge variant="secondary" className="text-xs">
                {t('questionProgress', { current: round.questionCount, max: round.maxQuestions })}
              </Badge>
            )}
          </div>
        );
      })}
      <div className="ml-auto shrink-0 text-sm text-zinc-500">
        {t('round', { current: currentRoundIndex + 1, total: rounds.length })}
      </div>
    </div>
  );
}
