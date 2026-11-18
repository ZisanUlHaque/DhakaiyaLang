'use client';

import React, { useRef, useState } from 'react';
import { Copy, Check, Terminal, Code, Sparkles, FileCode } from 'lucide-react';

interface EditorPaneProps {
  code: string;
  onChange: (newCode: string) => void;
  onRun: () => void;
}

export const EditorPane: React.FC<EditorPaneProps> = ({ code, onChange, onRun }) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = code.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Run on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }

    // Tab key support
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newCode);

      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const insertSnippet = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newCode = code.substring(0, start) + snippet + code.substring(end);
    onChange(newCode);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
    }, 0);
  };

  return (
    <div className="flex flex-col h-full bg-dhaka-card rounded-2xl border border-dhaka-border overflow-hidden shadow-xl">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-dhaka-elevated/70 border-b border-dhaka-border text-xs">
        <div className="flex items-center gap-2 text-dhaka-textLight font-mono">
          <FileCode className="w-4 h-4 text-dhaka-gold" />
          <span className="font-semibold text-dhaka-gold">khela.dhaka</span>
          <span className="text-dhaka-textMuted">• {lines.length} lines</span>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => insertSnippet('rakh item = 10;\n')}
            className="hidden sm:inline-flex px-2 py-0.5 rounded text-[11px] font-mono bg-dhaka-bg text-dhaka-gold hover:bg-dhaka-border transition-colors border border-dhaka-border/60"
            title="ইনসার্ট: rakh (ভ্যারিয়েবল)"
          >
            + rakh
          </button>
          <button
            onClick={() => insertSnippet('chilla "আরে মামা!";\n')}
            className="hidden sm:inline-flex px-2 py-0.5 rounded text-[11px] font-mono bg-dhaka-bg text-dhaka-terracottaLight hover:bg-dhaka-border transition-colors border border-dhaka-border/60"
            title="ইনসার্ট: chilla (প্রিন্ট)"
          >
            + chilla
          </button>
          <button
            onClick={() => insertSnippet('jodi (x > 0) {\n    \n  }\n')}
            className="hidden md:inline-flex px-2 py-0.5 rounded text-[11px] font-mono bg-dhaka-bg text-dhaka-amber hover:bg-dhaka-border transition-colors border border-dhaka-border/60"
            title="ইনসার্ট: jodi (শর্ত)"
          >
            + jodi
          </button>
          <button
            onClick={() => insertSnippet('chakkor (i > 0) {\n    \n  }\n')}
            className="hidden md:inline-flex px-2 py-0.5 rounded text-[11px] font-mono bg-dhaka-bg text-dhaka-teal hover:bg-dhaka-border transition-colors border border-dhaka-border/60"
            title="ইনসার্ট: chakkor (লুপ)"
          >
            + chakkor
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-dhaka-bg text-dhaka-textMuted hover:text-white border border-dhaka-border hover:border-dhaka-gold/40 transition-all ml-1"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-dhaka-teal" />
                <span className="text-[11px] text-dhaka-teal">কপি হইছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">কপি</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative font-mono text-sm">
        {/* Line Numbers Column */}
        <div className="select-none py-4 px-3 bg-dhaka-bg/70 text-dhaka-textMuted/40 text-right font-mono text-xs border-r border-dhaka-border/50 min-w-[3rem]">
          {lines.map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 bg-transparent text-dhaka-textLight p-4 resize-none focus:outline-none font-mono text-xs md:text-sm leading-6 selection:bg-dhaka-terracotta/30 selection:text-white border-none h-full overflow-y-auto"
          placeholder="এখানে ঢাকাইয়া কোড লেখেন মামা..."
        />
      </div>

      {/* Editor Footer Status */}
      <div className="px-4 py-1.5 bg-dhaka-bg/90 border-t border-dhaka-border/60 flex items-center justify-between text-[11px] text-dhaka-textMuted font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-dhaka-teal animate-pulse" />
          <span>DhakaiyaLang Engine • Ready</span>
        </span>
        <span className="hidden sm:inline">UTF-8 • Tab: 2 Spaces</span>
      </div>
    </div>
  );
};
