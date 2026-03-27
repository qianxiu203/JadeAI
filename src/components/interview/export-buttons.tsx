'use client';

import { useTranslations } from 'next-intl';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { InterviewReport, InterviewSession, RoundEvaluation } from '@/types/interview';

interface ExportButtonsProps {
  report: InterviewReport;
  session: InterviewSession;
}

export function ExportButtons({ report, session }: ExportButtonsProps) {
  const t = useTranslations('interview.report');

  const exportMarkdown = () => {
    const md = generateMarkdown(report, session);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-report-${session.jobTitle}-${new Date(session.createdAt).toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={exportMarkdown}>
        <FileText className="mr-1 h-4 w-4" />
        {t('exportMarkdown')}
      </Button>
    </div>
  );
}

function generateMarkdown(report: InterviewReport, session: InterviewSession): string {
  const lines: string[] = [];
  lines.push(`# Interview Report: ${session.jobTitle}`);
  lines.push(`Date: ${new Date(session.createdAt).toLocaleDateString()}`);
  lines.push(`Overall Score: ${report.overallScore}/100\n`);
  lines.push(`## Overall Feedback\n${report.overallFeedback}\n`);

  lines.push(`## Dimension Scores`);
  for (const d of report.dimensionScores) {
    lines.push(`- ${d.dimension}: ${d.score}/100`);
  }
  lines.push('');

  lines.push(`## Round Evaluations`);
  for (const r of report.roundEvaluations as RoundEvaluation[]) {
    lines.push(`### ${r.interviewerName} (${r.interviewerType}) — ${r.score}/100`);
    lines.push(r.feedback);
    for (const q of r.questions) {
      const tags = [q.marked && '[Review]', q.hinted && '[Hint]', q.skipped && '[Skipped]'].filter(Boolean).join(' ');
      lines.push(`\n**Q: ${q.question}** ${'⭐'.repeat(q.score)} ${tags}`);
      lines.push(`A: ${q.answerSummary}`);
      if (q.highlights.length) lines.push(`Highlights: ${q.highlights.join(', ')}`);
      if (q.weaknesses.length) lines.push(`Weaknesses: ${q.weaknesses.join(', ')}`);
      lines.push(`Reference: ${q.referenceTips}`);
    }
    lines.push('');
  }

  lines.push(`## Improvement Plan`);
  for (const item of report.improvementPlan) {
    lines.push(`### [${item.priority.toUpperCase()}] ${item.area}`);
    lines.push(item.description);
    if (item.resources.length) {
      lines.push(`Resources: ${item.resources.join(', ')}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
