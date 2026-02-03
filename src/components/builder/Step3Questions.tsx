'use client';

import { motion } from 'framer-motion';
import { useBuilderStore, type Question } from '@/stores/builderStore';
import { useState } from 'react';

const TEMPLATE_QUESTIONS: Question[] = [
  {
    questionText: 'What was the moment you knew we had something special?',
    option1: 'Our first date',
    option2: 'When we first talked',
    option3: 'A random Tuesday',
    option4: 'I always knew',
    acknowledgmentText: '✨ That moment changed everything for me too',
  },
  {
    questionText: "What's your favorite memory of us together?",
    option1: 'Our first trip',
    option2: 'A quiet night in',
    option3: 'That inside joke',
    option4: 'Every moment',
    acknowledgmentText: '💕 I treasure that memory so much',
  },
  {
    questionText: 'What do you love most about our relationship?',
    option1: 'How we laugh together',
    option2: 'Our deep conversations',
    option3: 'The little things',
    option4: 'Everything',
    acknowledgmentText: '🥰 You make every day better',
  },
  {
    questionText: 'Where do you see us in the future?',
    option1: 'Building a life together',
    option2: 'Traveling the world',
    option3: 'Growing old together',
    option4: "Wherever we're happy",
    acknowledgmentText: "🌟 I can't wait for our future together",
  },
];

export default function Step3Questions() {
  const { questions, questionSource, setQuestions, setQuestionSource, addQuestion, updateQuestion, removeQuestion } = useBuilderStore();
  const [activeTab, setActiveTab] = useState<'template' | 'bank' | 'custom'>(questionSource);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleUseTemplate = () => {
    setQuestions(TEMPLATE_QUESTIONS);
    setQuestionSource('template');
  };

  const handleAddCustomQuestion = () => {
    if (questions.length < 4) {
      const newQuestion: Question = {
        questionText: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        acknowledgmentText: '',
      };
      addQuestion(newQuestion);
      setEditingIndex(questions.length);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
          Add Your Questions
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-300">
          Choose 4 questions to guide your journey
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => {
            setActiveTab('template');
            setQuestionSource('template');
          }}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'template'
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Use Template
          {activeTab === 'template' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500"
            />
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab('bank');
            setQuestionSource('bank');
          }}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'bank'
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Question Bank
          {activeTab === 'bank' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500"
            />
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab('custom');
            setQuestionSource('custom');
          }}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'custom'
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Write Custom
          {activeTab === 'custom' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500"
            />
          )}
        </button>
      </div>

      {/* Template Tab */}
      {activeTab === 'template' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">💝</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                Classic Romantic
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                4 beautifully crafted questions perfect for Valentine's Day
              </p>
              <button
                onClick={handleUseTemplate}
                className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors"
              >
                {questions.length === 4 && questionSource === 'template'
                  ? '✓ Template Loaded'
                  : 'Use This Template'}
              </button>
            </div>
          </div>

          {questions.length === 4 && questionSource === 'template' && (
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div
                  key={i}
                  className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                >
                  <p className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    {i + 1}. {q.questionText}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <span>• {q.option1}</span>
                    <span>• {q.option2}</span>
                    <span>• {q.option3}</span>
                    {q.option4 && <span>• {q.option4}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Question Bank Tab */}
      {activeTab === 'bank' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
        >
          <p className="text-center text-neutral-600 dark:text-neutral-300 py-8">
            Question bank coming soon! For now, use the template or write custom questions.
          </p>
        </motion.div>
      )}

      {/* Custom Tab */}
      {activeTab === 'custom' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {questions.map((question, index) => (
            <QuestionEditor
              key={index}
              question={question}
              index={index}
              isEditing={editingIndex === index}
              onEdit={() => setEditingIndex(index)}
              onSave={(updated) => {
                updateQuestion(index, updated);
                setEditingIndex(null);
              }}
              onRemove={() => removeQuestion(index)}
            />
          ))}

          {questions.length < 4 && (
            <button
              onClick={handleAddCustomQuestion}
              className="w-full p-6 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl hover:border-rose-500 dark:hover:border-rose-500 transition-colors text-neutral-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium"
            >
              + Add Question ({questions.length}/4)
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}

// Question Editor Component
function QuestionEditor({
  question,
  index,
  isEditing,
  onEdit,
  onSave,
  onRemove,
}: {
  question: Question;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (question: Question) => void;
  onRemove: () => void;
}) {
  const [draft, setDraft] = useState(question);

  if (!isEditing) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-start justify-between mb-4">
          <h4 className="font-bold text-neutral-900 dark:text-neutral-100">
            Question {index + 1}
          </h4>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="text-sm text-rose-600 dark:text-rose-400 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={onRemove}
              className="text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
        <p className="text-neutral-700 dark:text-neutral-300 mb-3">{question.questionText}</p>
        <div className="grid grid-cols-2 gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <span>• {question.option1}</span>
          <span>• {question.option2}</span>
          <span>• {question.option3}</span>
          {question.option4 && <span>• {question.option4}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border-2 border-rose-500 p-6">
      <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-4">
        Question {index + 1}
      </h4>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Question Text
          </label>
          <input
            type="text"
            value={draft.questionText}
            onChange={(e) => setDraft({ ...draft, questionText: e.target.value })}
            placeholder="What's your question?"
            className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:border-rose-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(['option1', 'option2', 'option3', 'option4'] as const).map((key, i) => (
            <div key={key}>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Option {i + 1} {i === 3 && '(optional)'}
              </label>
              <input
                type="text"
                value={draft[key] || ''}
                onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                placeholder={`Option ${i + 1}`}
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:border-rose-500 focus:outline-none"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Acknowledgment Text
          </label>
          <input
            type="text"
            value={draft.acknowledgmentText}
            onChange={(e) => setDraft({ ...draft, acknowledgmentText: e.target.value })}
            placeholder="What to show after they answer"
            className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:border-rose-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onSave(draft)}
            className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors"
          >
            Save
          </button>
          <button
            onClick={onEdit}
            className="px-6 py-2 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
