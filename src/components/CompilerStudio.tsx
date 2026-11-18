'use client';

import React, { useState } from 'react';
import { Terminal, ListTree, Code2, Cpu, Copy, Check, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { RunResult } from '../engine';

interface CompilerStudioProps {
  result: RunResult | null;
  isRunning: boolean;
  onClearConsole: () => void;
}

type TabType = 'console' | 'tokens' | 'ast' | 'transpiler';

export const CompilerStudio: React.FC<CompilerStudioProps> = ({
  result,
  isRunning,
  onClearConsole
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('console');
  const [copiedJs, setCopiedJs] = useState(false);
  const [copiedAst, setCopiedAst] = useState(false);
  const [tokenSearch, setTokenSearch] = useState('');

  const handleCopyJs = () => {
    if (!result?.jsCode) return;
    navigator.clipboard.writeText(result.jsCode);
    setCopiedJs(true);
    setTimeout(() => setCopiedJs(false), 2000);
  };

  const handleCopyAst = () => {
    if (!result?.ast) return;
    navigator.clipboard.writeText(JSON.stringify(result.ast, null, 2));
    setCopiedAst(true);
    setTimeout(() => setCopiedAst(false), 2000);
  };

  const filteredTokens = result?.tokens.filter(tok => {
    if (!tokenSearch) return true;
    const q = tokenSearch.toLowerCase();
    return tok.type.toLowerCase().includes(q) || String(tok.value).toLowerCase().includes(q);
  }) || [];

  return (
    <div className="flex flex-col h-full bg-dhaka-card rounded-2xl border border-dhaka-border overflow-hidden shadow-xl">
      {/* Studio Header Tabs */}
      <div className="flex items-center justify-between px-3 py-2 bg-dhaka-elevated/80 border-b border-dhaka-border">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'console'
                ? 'bg-dhaka-terracotta text-white shadow-md shadow-dhaka-terracotta/30'
                : 'text-dhaka-textMuted hover:text-white hover:bg-dhaka-bg'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>কনসোল</span>
            {result?.error && (
              <span className="w-2 h-2 rounded-full bg-dhaka-crimson animate-ping ml-0.5" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('tokens')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'tokens'
                ? 'bg-dhaka-gold text-dhaka-bg font-bold shadow-md shadow-dhaka-gold/30'
                : 'text-dhaka-textMuted hover:text-white hover:bg-dhaka-bg'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>টোকেন স্ট্রিম ({result?.tokens.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('ast')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ast'
                ? 'bg-dhaka-teal text-dhaka-bg font-bold shadow-md shadow-dhaka-teal/30'
                : 'text-dhaka-textMuted hover:text-white hover:bg-dhaka-bg'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>AST পার্সার ট্রি</span>
          </button>

          <button
            onClick={() => setActiveTab('transpiler')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'transpiler'
                ? 'bg-dhaka-blue text-white shadow-md shadow-dhaka-blue/30'
                : 'text-dhaka-textMuted hover:text-white hover:bg-dhaka-bg'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>JS (V8 Engine)</span>
          </button>
        </div>

        {/* Tab specific top-right tools */}
        <div>
          {activeTab === 'console' && (
            <button
              onClick={onClearConsole}
              title="কনসোল পরিষ্কার করুন"
              className="p-1.5 text-dhaka-textMuted hover:text-white bg-dhaka-bg rounded-lg border border-dhaka-border hover:border-dhaka-border/80 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {activeTab === 'transpiler' && (
            <button
              onClick={handleCopyJs}
              className="flex items-center gap-1 px-2 py-1 rounded bg-dhaka-bg text-dhaka-textMuted hover:text-white border border-dhaka-border text-xs transition-colors"
            >
              {copiedJs ? <Check className="w-3 h-3 text-dhaka-teal" /> : <Copy className="w-3 h-3" />}
              <span>{copiedJs ? 'কপি হইছে!' : 'JS কোড কপি'}</span>
            </button>
          )}

          {activeTab === 'ast' && (
            <button
              onClick={handleCopyAst}
              className="flex items-center gap-1 px-2 py-1 rounded bg-dhaka-bg text-dhaka-textMuted hover:text-white border border-dhaka-border text-xs transition-colors"
            >
              {copiedAst ? <Check className="w-3 h-3 text-dhaka-teal" /> : <Copy className="w-3 h-3" />}
              <span>{copiedAst ? 'কপি হইছে!' : 'AST JSON কপি'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs md:text-sm">
        {/* TAB 1: CONSOLE */}
        {activeTab === 'console' && (
          <div className="space-y-3">
            <div className="text-dhaka-textMuted/60 text-xs pb-2 border-b border-dhaka-border/40 flex items-center justify-between">
              <span>পুরান ঢাকা টার্মিনাল v1.0 • রান করার জন্য [ চালাইও মামা! ] চাপুন</span>
              {result && !result.error && (
                <span className="text-dhaka-teal flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> সফলভাবে শেষ হইছে!
                </span>
              )}
            </div>

            {/* If no result yet */}
            {!result && (
              <div className="py-12 text-center text-dhaka-textMuted/50 font-sans">
                <Terminal className="w-10 h-10 mx-auto mb-2 text-dhaka-border" />
                <p>এখনো কোনো কোড রান করা হয় নাই মামা!</p>
                <p className="text-xs text-dhaka-textMuted/40 mt-1">
                  উপরে &quot;চালাও মামা!&quot; বাটনে চাপ দেন বা Ctrl+Enter চাপুন।
                </p>
              </div>
            )}

            {/* Error Message */}
            {result?.error && (
              <div className="p-4 rounded-xl bg-dhaka-crimson/10 border border-dhaka-crimson/40 text-dhaka-crimson space-y-1 animate-pulse">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-dhaka-crimson" />
                  <span>ধরা খাইসো মামা! [{result.error.phase} ফেজ]</span>
                </div>
                <p className="text-xs text-white/90 font-mono mt-1 whitespace-pre-wrap leading-relaxed">
                  {result.error.message}
                </p>
              </div>
            )}

            {/* Stdout Logs */}
            {result?.logs && result.logs.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {result.logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-dhaka-textLight">
                    <span className="text-dhaka-gold select-none font-bold">❯</span>
                    <span className="whitespace-pre-wrap break-words">{log}</span>
                  </div>
                ))}
              </div>
            )}

            {result && !result.error && result.logs.length === 0 && (
              <div className="text-dhaka-textMuted italic py-4">
                (প্রোগ্রাম সম্পন্ন হয়েছে, কিন্তু কোনো &apos;chilla&apos; স্টেটমেন্ট দেওয়া হয় নাই)
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TOKENS STREAM */}
        {activeTab === 'tokens' && (
          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs text-dhaka-textMuted">
                Compiler Phase 1: Lexical Analyzer দ্বারা শনাক্তকৃত টোকেন তালিকা
              </p>
              <input
                type="text"
                placeholder="টোকেন খুঁজুন..."
                value={tokenSearch}
                onChange={(e) => setTokenSearch(e.target.value)}
                className="bg-dhaka-bg text-dhaka-textLight text-xs px-2.5 py-1 rounded border border-dhaka-border focus:outline-none focus:border-dhaka-gold w-36"
              />
            </div>

            {!result?.tokens || result.tokens.length === 0 ? (
              <p className="text-dhaka-textMuted text-center py-8">
                টোকেন দেখতে আগে কোড রান করুন মামা!
              </p>
            ) : (
              <div className="border border-dhaka-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-dhaka-elevated text-dhaka-gold border-b border-dhaka-border">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">টোকেন টাইপ (Type)</th>
                      <th className="py-2 px-3">মান (Lexeme / Value)</th>
                      <th className="py-2 px-3">লাইন</th>
                      <th className="py-2 px-3">কলাম</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dhaka-border/40 font-mono">
                    {filteredTokens.map((tok, i) => (
                      <tr key={i} className="hover:bg-dhaka-elevated/40 transition-colors">
                        <td className="py-1.5 px-3 text-dhaka-textMuted">{i + 1}</td>
                        <td className="py-1.5 px-3">
                          <span className="px-1.5 py-0.5 rounded text-[11px] bg-dhaka-terracotta/20 text-dhaka-terracottaLight font-semibold">
                            {tok.type}
                          </span>
                        </td>
                        <td className="py-1.5 px-3 text-dhaka-textLight">
                          {typeof tok.value === 'string' ? `"${tok.value}"` : String(tok.value)}
                        </td>
                        <td className="py-1.5 px-3 text-dhaka-textMuted">{tok.line}</td>
                        <td className="py-1.5 px-3 text-dhaka-textMuted">{tok.column}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AST TREE */}
        {activeTab === 'ast' && (
          <div>
            <div className="mb-2 text-xs text-dhaka-textMuted">
              Compiler Phase 2: Recursive Descent Parser দ্বারা তৈরি Abstract Syntax Tree (AST)
            </div>
            {!result?.ast ? (
              <p className="text-dhaka-textMuted text-center py-8">
                AST দেখতে আগে কোড রান করুন মামা!
              </p>
            ) : (
              <pre className="bg-dhaka-bg p-4 rounded-xl border border-dhaka-border overflow-x-auto text-xs text-dhaka-teal leading-relaxed">
                {JSON.stringify(result.ast, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* TAB 4: TRANSPILER TO JAVASCRIPT */}
        {activeTab === 'transpiler' && (
          <div>
            <div className="mb-2 text-xs text-dhaka-textMuted flex items-center justify-between">
              <span>Compiler Phase 4: DhakaiyaLang AST থেকে সরাসরি জেনারেট হওয়া আধুনিক JavaScript (V8) কোড</span>
            </div>
            {!result?.jsCode ? (
              <p className="text-dhaka-textMuted text-center py-8">
                জাভাস্ক্রিপ্ট রূপান্তর দেখতে আগে কোড রান করুন মামা!
              </p>
            ) : (
              <pre className="bg-dhaka-bg p-4 rounded-xl border border-dhaka-border overflow-x-auto text-xs text-dhaka-gold leading-relaxed">
                {result.jsCode}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Studio Footer */}
      <div className="px-4 py-2 bg-dhaka-elevated/50 border-t border-dhaka-border/50 flex items-center justify-between text-[11px] text-dhaka-textMuted">
        <span>Compiler Lab Engine • 4-Phase Pipeline</span>
        <span>Made with 🍛 in Puran Dhaka</span>
      </div>
    </div>
  );
};
