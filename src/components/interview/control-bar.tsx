'use client';

import { useTranslations, useLocale } from 'next-intl';
import { SkipForward, Lightbulb, Bookmark, StopCircle, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInterviewStore } from '@/stores/interview-store';
import { getAIHeaders } from '@/stores/settings-store';

interface ControlBarProps {
  sessionId: string;
  roundId: string;
  lastAssistantMessageId?: string;
  isLoading: boolean;
}

export function ControlBar({ sessionId, roundId, lastAssistantMessageId, isLoading }: ControlBarProps) {
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

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={handleSkip} disabled={isLoading}>
        <SkipForward className="mr-1 h-3 w-3" />
        {t('skip')}
      </Button>
      <Button variant="outline" size="sm" onClick={handleHint} disabled={isLoading}>
        <Lightbulb className="mr-1 h-3 w-3" />
        {t('hint')}
      </Button>
      <Button variant="outline" size="sm" onClick={handleMark} disabled={!lastAssistantMessageId}>
        <Bookmark className="mr-1 h-3 w-3" />
        {isMarked ? t('unmark') : t('mark')}
      </Button>
      <Button variant="outline" size="sm" onClick={handleEndRound} disabled={isLoading}>
        <StopCircle className="mr-1 h-3 w-3" />
        {t('endRound')}
      </Button>
      <Button variant="ghost" size="sm" onClick={handlePause}>
        <Pause className="mr-1 h-3 w-3" />
        {t('pause')}
      </Button>
    </div>
  );
}
