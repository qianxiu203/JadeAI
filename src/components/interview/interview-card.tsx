'use client';

import { useTranslations } from 'next-intl';
import { Trash2, Play, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/routing';
import type { InterviewSession } from '@/types/interview';

const STATUS_COLORS: Record<string, string> = {
  preparing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  paused: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

interface InterviewCardProps {
  session: InterviewSession;
  onDelete: (id: string) => void;
}

export function InterviewCard({ session, onDelete }: InterviewCardProps) {
  const t = useTranslations('interview');
  const interviewers = session.selectedInterviewers as any[];

  return (
    <Card className="group relative">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-1 text-base">{session.jobTitle || 'Untitled'}</CardTitle>
          <Badge variant="secondary" className={STATUS_COLORS[session.status] || ''}>
            {t(`lobby.status.${session.status}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 line-clamp-2 text-sm text-zinc-500">{session.jobDescription.slice(0, 100)}...</p>
        <p className="mb-4 text-xs text-zinc-400">
          {t('lobby.rounds', { count: interviewers.length })}
          {' · '}
          {new Date(session.createdAt).toLocaleDateString()}
        </p>
        <div className="flex items-center gap-2">
          {session.status === 'completed' ? (
            <Link href={`/interview/${session.id}/report`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <FileText className="mr-1 h-3 w-3" />
                {t('lobby.viewReport')}
              </Button>
            </Link>
          ) : session.status === 'in_progress' || session.status === 'paused' ? (
            <Link href={`/interview/${session.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Play className="mr-1 h-3 w-3" />
                {t('lobby.continue')}
              </Button>
            </Link>
          ) : null}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.preventDefault();
              onDelete(session.id);
            }}
            className="text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
