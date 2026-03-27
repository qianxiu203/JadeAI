'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { JDInput } from './jd-input';
import { ResumeSelector } from './resume-selector';
import { InterviewerPicker } from './interviewer-picker';
import { useRouter } from '@/i18n/routing';
import { getAIHeaders } from '@/stores/settings-store';
import type { InterviewerConfig } from '@/types/interview';

export function InterviewSetup() {
  const t = useTranslations('interview.setup');
  const router = useRouter();
  const [jd, setJd] = useState('');
  const [resumeId, setResumeId] = useState<string | undefined>();
  const [selectedInterviewers, setSelectedInterviewers] = useState<InterviewerConfig[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const canStart = jd.trim().length > 0 && selectedInterviewers.length > 0;

  const handleStart = async () => {
    if (!canStart) return;
    setIsCreating(true);

    try {
      const fp = localStorage.getItem('jade_fingerprint');
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(fp ? { 'x-fingerprint': fp } : {}),
          ...getAIHeaders(),
        },
        body: JSON.stringify({
          jobDescription: jd,
          jobTitle: jd.split('\n')[0].slice(0, 100) || 'Interview',
          resumeId,
          interviewers: selectedInterviewers,
        }),
      });

      if (!res.ok) throw new Error('Failed to create interview');
      const { session } = await res.json();
      router.push(`/interview/${session.id}`);
    } catch (err) {
      console.error('Failed to create interview:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 bg-gradient-to-r from-pink-50 to-white rounded-xl px-6 py-5 dark:from-pink-950/30 dark:to-zinc-900">
        <h1 className="text-xl font-bold">🎙️ {t('title')}</h1>
      </div>
      <div className="space-y-6 px-1">
        <JDInput value={jd} onChange={setJd} />
        <ResumeSelector value={resumeId} onChange={setResumeId} />
        <InterviewerPicker selected={selectedInterviewers} onChange={setSelectedInterviewers} />
      </div>
      <div className="mt-8 px-1">
        <Button
          onClick={handleStart}
          disabled={!canStart || isCreating}
          className="w-full rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 py-6 text-base font-semibold hover:from-zinc-800 hover:to-zinc-700 dark:from-zinc-100 dark:to-zinc-200 dark:text-zinc-900"
          size="lg"
        >
          {isCreating ? '...' : t('startInterview')}
        </Button>
      </div>
    </div>
  );
}
