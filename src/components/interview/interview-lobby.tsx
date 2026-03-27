'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { InterviewCard } from './interview-card';
import { Link } from '@/i18n/routing';
import type { InterviewSession } from '@/types/interview';

export function InterviewLobby() {
  const t = useTranslations('interview.lobby');
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fp = localStorage.getItem('jade_fingerprint');
    fetch('/api/interview', {
      headers: fp ? { 'x-fingerprint': fp } : {},
    })
      .then((r) => r.json())
      .then((data) => setSessions(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return;
    const fp = localStorage.getItem('jade_fingerprint');
    await fetch(`/api/interview/${id}`, {
      method: 'DELETE',
      headers: fp ? { 'x-fingerprint': fp } : {},
    });
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Link href="/interview/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('newInterview')}
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <p>{t('noInterviews')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <InterviewCard key={session.id} session={session} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
