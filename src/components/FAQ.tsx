import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface FAQItem {
  question: { en: string; zh: string };
  answer: { en: string; zh: string };
}

export const FAQ: React.FC<{ faqs: FAQItem[] }> = ({ faqs }) => {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className="space-y-3 mt-8">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">
        {isZh ? '常见问题' : 'FAQ'}
      </h3>
      {faqs.map(({ question, answer }, i) => (
        <div key={i} className="border border-border-site rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-sm font-medium text-left hover:bg-bg2 transition-colors"
          >
            {isZh ? question.zh : question.en}
            {openIndex === i ? <ChevronUp className="w-4 h-4 flex-shrink-0 text-text-muted" /> : <ChevronDown className="w-4 h-4 flex-shrink-0 text-text-muted" />}
          </button>
          {openIndex === i && (
            <div className="px-4 pb-4 text-sm text-text2 leading-relaxed">{isZh ? answer.zh : answer.en}</div>
          )}
        </div>
      ))}
    </div>
  );
};
