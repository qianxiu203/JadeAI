'use client';

import { Bookmark, Lightbulb, SkipForward } from 'lucide-react';
import { useInterviewStore } from '@/stores/interview-store';

interface CandidateMessageProps {
  content: string;
  messageId: string;
}

export function CandidateMessage({ content, messageId }: CandidateMessageProps) {
  const { markedMessages, hintedQuestions, skippedQuestions } = useInterviewStore();
  const isMarked = markedMessages.has(messageId);
  const isHinted = hintedQuestions.has(messageId);
  const isSkipped = skippedQuestions.has(messageId);

  return (
    <div className="flex justify-end">
      <div className="max-w-[75%] rounded-2xl rounded-tr-none bg-gradient-to-br from-zinc-900 to-zinc-800 px-4 py-3 text-sm text-white dark:from-zinc-700 dark:to-zinc-800">
        <div className="whitespace-pre-wrap">{content}</div>
        {(isMarked || isHinted || isSkipped) && (
          <div className="mt-2 flex gap-2">
            {isMarked && <Bookmark className="h-3 w-3 text-yellow-300" />}
            {isHinted && <Lightbulb className="h-3 w-3 text-amber-300" />}
            {isSkipped && <SkipForward className="h-3 w-3 text-zinc-400" />}
          </div>
        )}
      </div>
    </div>
  );
}
