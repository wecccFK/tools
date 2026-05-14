import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface FAQItem {
  question: { en: string; zh: string };
  answer: { en: string; zh: string };
}

interface FAQProps {
  faqs: FAQItem[];
}

export const FAQ: React.FC<FAQProps> = ({ faqs }) => {
  const { lang } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-12 pt-8 border-t border-border-site">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold text-text-site">
          {lang === 'zh' ? '常见问题' : 'Frequently Asked Questions'}
        </h3>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-secondary-site/30 border border-border-site rounded-2xl overflow-hidden transition-all hover:border-primary/30"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-secondary-site/50 transition-colors"
            >
              <span className="font-medium text-text-site pr-4">
                {lang === 'zh' ? faq.question.zh : faq.question.en}
              </span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-primary shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-text-site/50 shrink-0" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 pt-0 text-sm text-text-site/70 leading-relaxed border-t border-border-site/50 mt-2">
                {lang === 'zh' ? faq.answer.zh : faq.answer.en}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
