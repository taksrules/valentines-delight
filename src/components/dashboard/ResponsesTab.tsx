'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shimmer } from '@/components/ui/Loader';

interface Answer {
  id: string;
  answerText: string;
  answeredAt: string;
  question: {
    questionText: string;
    questionOrder: number;
  };
}

interface ResponsesTabProps {
  journeyId: string;
  recipientName: string;
}

export default function ResponsesTab({ journeyId, recipientName }: ResponsesTabProps) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await fetch(`/api/v1/journeys/${journeyId}/responses`);
        if (response.ok) {
          const data = await response.json();
          setAnswers(data);
        } else {
          setError('Failed to load responses');
        }
      } catch (err) {
        console.error('Error fetching responses:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResponses();
  }, [journeyId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <Shimmer className="h-4 w-3/4 mb-4 rounded" />
            <Shimmer className="h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          {error}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Please try refreshing the page.
        </p>
      </div>
    );
  }

  if (answers.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
        <div className="text-5xl mb-6">⏳</div>
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
          {recipientName} hasn't responded yet
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto">
          You'll be notified via email as soon as they complete their journey and share their thoughts with you.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          Partner Responses
        </h2>
        <span className="text-sm text-neutral-500 font-medium">
          {answers.length} total responses
        </span>
      </div>

      <div className="grid gap-6">
        {answers.map((answer, index) => (
          <motion.div
            key={answer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 font-bold text-sm shrink-0">
                {answer.question.questionOrder}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-neutral-900 dark:text-white mb-3">
                  {answer.question.questionText}
                </h4>
                <div className="p-4 bg-rose-50/50 dark:bg-neutral-950 rounded-xl border border-rose-100/50 dark:border-neutral-800">
                  <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    "{answer.answerText}"
                  </p>
                </div>
                <div className="mt-3 text-xs text-neutral-500">
                  Responded on {new Date(answer.answeredAt).toLocaleString()}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-6 bg-rose-50/30 dark:bg-rose-500/5 rounded-2xl border border-rose-100 dark:border-rose-500/10 mt-8">
        <p className="text-sm text-rose-700 dark:text-rose-300 text-center italic">
          "These responses are private and only visible to you. Thank you for creating this meaningful moment. ❤️"
        </p>
      </div>
    </div>
  );
}
