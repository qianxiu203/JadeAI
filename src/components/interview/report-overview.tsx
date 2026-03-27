'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { InterviewReport, InterviewSession } from '@/types/interview';

function getGrade(score: number): { key: string; color: string } {
  if (score >= 90) return { key: 'excellent', color: 'text-green-600' };
  if (score >= 75) return { key: 'good', color: 'text-blue-600' };
  if (score >= 60) return { key: 'pass', color: 'text-yellow-600' };
  return { key: 'needsImprovement', color: 'text-red-600' };
}

interface ReportOverviewProps {
  report: InterviewReport;
  session: InterviewSession;
}

export function ReportOverview({ report, session }: ReportOverviewProps) {
  const t = useTranslations('interview.report');
  const grade = getGrade(report.overallScore);

  return (
    <div className="rounded-lg border bg-white p-6 dark:bg-zinc-900">
      <div className="mb-4 flex items-center gap-6">
        <div className="text-center">
          <div className="text-5xl font-bold">{report.overallScore}</div>
          <div className={cn('text-sm font-medium', grade.color)}>
            {t(`grade.${grade.key}`)}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="mb-1 text-lg font-semibold">{session.jobTitle}</h2>
          <p className="text-sm text-zinc-500">
            {new Date(session.createdAt).toLocaleDateString()}
            {' · '}
            {(session.selectedInterviewers as any[]).length} {t('overview')}
          </p>
        </div>
      </div>
      <p className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
        {report.overallFeedback}
      </p>
    </div>
  );
}
