'use client';

import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { INTERVIEWER_COLORS, DEFAULT_INTERVIEWER_COLOR } from '@/lib/interview/interviewers';
import type { InterviewerConfig } from '@/types/interview';

interface InterviewerBannerProps {
  config: InterviewerConfig;
}

export function InterviewerBanner({ config }: InterviewerBannerProps) {
  const t = useTranslations('interview.interviewers');
  const colorClass = INTERVIEWER_COLORS[config.type] || DEFAULT_INTERVIEWER_COLOR;

  return (
    <div className={`rounded-lg border p-4 ${colorClass}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-bold dark:bg-zinc-800">
          {config.name[0]}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{config.name}</span>
            <Badge variant="secondary">{t(config.type.startsWith('custom_') ? 'custom' : config.type as any)}</Badge>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{config.title} · {config.style}</p>
        </div>
      </div>
    </div>
  );
}
