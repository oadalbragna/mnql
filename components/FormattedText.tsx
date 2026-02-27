
import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

const FormattedText: React.FC<FormattedTextProps> = ({ text, className = "" }) => {
  if (!text) return null;

  // تقسيم النص إلى فقرات بناءً على الأسطر الجديدة لضمان تباعد مريح
  const paragraphs = text.split('\n');

  return (
    <div className={`space-y-3 ${className}`}>
      {paragraphs.map((paragraph, pIdx) => {
        if (!paragraph.trim()) return <div key={pIdx} className="h-2"></div>;

        // معالجة الخط العريض **نص**، التظليل "نص"، والمنشن @نص
        const parts = paragraph.split(/(\*\*.*?\*\*|".*?"|@\S+)/g);

        return (
          <p key={pIdx} className="leading-relaxed text-right">
            {parts.map((part, i) => {
              // 1. الخط العريض للوضوح العالي
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={i} className="font-black text-slate-900 mx-0.5 border-b-2 border-primary/10">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              // 2. التظليل للمعلومات الهامة (ظل)
              if (part.startsWith('"') && part.endsWith('"')) {
                return (
                  <span key={i} className="bg-yellow-100 text-amber-900 px-2 py-0.5 rounded-lg font-black mx-1 shadow-sm border border-amber-200/50">
                    {part.slice(1, -1)}
                  </span>
                );
              }
              // 3. المنشن (أهل المناقل)
              if (part.startsWith('@')) {
                return (
                  <span key={i} className="text-primary font-black bg-primary/5 px-2 py-0.5 rounded-md mx-0.5 border border-primary/10">
                    {part}
                  </span>
                );
              }
              // 4. النص العادي
              return <span key={i} className="text-slate-600 font-bold">{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
};

export default FormattedText;
