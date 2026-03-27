'use client';

import { useTranslations, useLocale } from 'next-intl';
import { SkipForward, Lightbulb, Bookmark, BookmarkCheck, Square, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useInterviewStore } from '@/stores/interview-store';
import { getAIHeaders } from '@/stores/settings-store';

interface ControlBarProps {
  sessionId: string;
  roundId: string;
  lastAssistantMessageId?: string;
  isLoading: boolean;
}

interface IconBtnProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'destructive';
}

function IconBtn({ icon: Icon, label, onClick, disabled, variant }: IconBtnProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`h-8 w-8 ${variant === 'destructive' ? 'border-red-200 text-red-500 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950' : ''}`}
          onClick={onClick}
          disabled={disabled}
        >
          <Icon className="h-3.5 w-3.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function useInterviewControls({ sessionId, roundId, lastAssistantMessageId, isLoading }: ControlBarProps) {
  const t = useTranslations('interview.room');
  const locale = useLocale();
  const { markedMessages, toggleMark, addHinted, addSkipped } = useInterviewStore();
  const isMarked = lastAssistantMessageId ? markedMessages.has(lastAssistantMessageId) : false;

  const sendControl = async (action: string) => {
    const fp = localStorage.getItem('jade_fingerprint');
    await fetch(`/api/interview/${sessionId}/control`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(fp ? { 'x-fingerprint': fp } : {}),
        ...getAIHeaders(),
      },
      body: JSON.stringify({ action, roundId, locale }),
    });
  };

  const handleSkip = async () => {
    if (lastAssistantMessageId) addSkipped(lastAssistantMessageId);
    await sendControl('skip');
  };

  const handleHint = async () => {
    if (lastAssistantMessageId) addHinted(lastAssistantMessageId);
    await sendControl('hint');
  };

  const handleEndRound = async () => {
    await sendControl('end_round');
  };

  const handlePause = async () => {
    await sendControl('pause');
  };

  const handleMark = () => {
    if (!lastAssistantMessageId) return;
    toggleMark(lastAssistantMessageId);
    const fp = localStorage.getItem('jade_fingerprint');
    fetch(`/api/interview/${sessionId}/mark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(fp ? { 'x-fingerprint': fp } : {}),
      },
      body: JSON.stringify({ messageId: lastAssistantMessageId, marked: !isMarked }),
    });
  };

  const left = (
    <div className="flex gap-1">
      <IconBtn icon={SkipForward} label={t('skip')} onClick={handleSkip} disabled={isLoading} />
      <IconBtn icon={Lightbulb} label={t('hint')} onClick={handleHint} disabled={isLoading} />
      <IconBtn
        icon={isMarked ? BookmarkCheck : Bookmark}
        label={isMarked ? t('unmark') : t('mark')}
        onClick={handleMark}
        disabled={!lastAssistantMessageId}
      />
    </div>
  );

  const right = (
    <div className="flex gap-1">
      <IconBtn icon={Square} label={t('endRound')} onClick={handleEndRound} disabled={isLoading} variant="destructive" />
      <IconBtn icon={Pause} label={t('pause')} onClick={handlePause} />
    </div>
  );

  return { left, right };
}
