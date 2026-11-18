'use client';

import React, { useState } from 'react';
import { X, BookOpen, GraduationCap, Code, Sparkles, Check, HelpCircle } from 'lucide-react';
import { KEYWORDS } from '../engine/lexer';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadExample: (code: string) => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose, onLoadExample }) => {
  const [activeSection, setActiveSection] = useState<'keywords' | 'viva' | 'grammar'>('keywords');

  if (!isOpen) return null;

  const keywordList = [
    { kw: 'bismillah', js: '(Program Start)', desc: 'প্রোগ্রাম শুরু করার আবশ্যিক কী-ওয়ার্ড', example: 'bismillah ... khatam' },
    { kw: 'khatam', js: '(Program End)', desc: 'প্রোগ্রাম শেষ করার আবশ্যিক কী-ওয়ার্ড', example: 'khatam' },
    { kw: 'rakh', js: 'let / var', desc: 'নতুন ভ্যারিয়েবল ডিক্লেয়ার ও মান রাখা', example: 'rakh dam = 250;' },
    { kw: 'chilla', js: 'console.log(...)', desc: 'টার্মিনালে আউটপুট প্রিন্ট করা', example: 'chilla "আরে মামা!";' },
    { kw: 'jodi', js: 'if', desc: 'শর্ত সাপেক্ষে কোড চালানো (কন্ডিশনাল)', example: 'jodi (x > 10) { ... }' },
    { kw: 'naile', js: 'else', desc: 'শর্ত মিথ্যা হলে অল্টারনেট কোড চালানো', example: 'naile { ... }' },
    { kw: 'chakkor', js: 'while', desc: 'চাক্কর বা লুপ চালানো (পুনরাবৃত্তি)', example: 'chakkor (taka > 0) { ... }' },
    { kw: 'asli', js: 'true', desc: 'বুলিয়ান সত্য (True)', example: 'rakh khabar_bhalo = asli;' },
    { kw: 'fapor', js: 'false', desc: 'বুলিয়ান মিথ্যা (False / ফাপর)', example: 'rakh fapor_baji = fapor;' },
    { kw: 'khali', js: 'null', desc: 'খালি বা নাল ভ্যালু (Null)', example: 'rakh pocket = khali;' },
    { kw: 'ebong', js: '&&', desc: 'লজিক্যাল অ্যান্ড (Logical AND)', example: 'jodi (x > 0 ebong y > 0)' },
    { kw: 'othoba', js: '||', desc: 'লজিক্যাল অর (Logical OR)', example: 'jodi (x > 0 othoba y > 0)' },
    { kw: 'nah', js: '!', desc: 'লজিক্যাল নট (Logical NOT)', example: 'jodi (nah asli)' },
  ];

  const vivaQuestions = [
    {
      q: "১. আপনার কম্পাইলারের আর্কিটেকচার কি? (What is the architecture?)",
      a: "DhakaiyaLang একটি পিওর জাভাস্ক্রিপ্ট-ভিত্তিক Source-to-Source Transpiler এবং AST Tree-walking Interpreter। এর ৪টি মূল ফেজ রয়েছে: Lexer (Lexical Analysis) ➔ Parser (Recursive Descent Syntax Analysis) ➔ AST (Abstract Syntax Tree) ➔ Code Generator (Transpiler to JavaScript V8 Engine) & Evaluator।"
    },
    {
      q: "২. লেক্সার (Lexer/Tokenizer) কীভাবে কাজ করে?",
      a: "lexer.ts কোডের ক্যারেক্টার বাই ক্যারেক্টার স্ক্যান করে। হোয়াইটস্পেস ও কমেন্ট বাদ দিয়ে কি-ওয়ার্ড, আইডেন্টিফায়ার, লিটারেল এবং অপারেটরগুলোকে টোকেন অবজেক্টে রূপান্তর করে, যেখানে প্রতিটি টোকেনের Type, Value, Line এবং Column সংরক্ষিত থাকে।"
    },
    {
      q: "৩. পার্সারে কোন অ্যালগরিদম ব্যবহার করা হয়েছে? (Parsing technique)",
      a: "আমরা একটি হ্যান্ড-রিটেন Top-Down 'Recursive Descent Parser' (LL(1) ব্যাকরণ) ব্যবহার করেছি। কোনো থার্ড-পার্টি লাইব্রেরি (যেমন ANTLR বা Babel) ছাড়া পিওর কোডে গ্রামার রুলস লিখে ESTree-স্ট্যান্ডার্ড Abstract Syntax Tree (AST) তৈরি করা হয়েছে।"
    },
    {
      q: "৪. সিম্বল টেবিল (Symbol Table / Scope) কীভাবে হ্যান্ডেল করছেন?",
      a: "আমাদের Environment ক্লাস একটি চেইনড হ্যাশ-ম্যাপ হিসেবে কাজ করে। প্রতিটি ব্লকের (`{ ... }`) জন্য নতুন লোকাল এনভায়রনমেন্ট তৈরি হয় যা প্যারেন্ট এনভায়রনমেন্টের রেফারেন্স রাখে। ফলে লেক্সিক্যাল স্কোপিং এবং নেস্টেড ভ্যারিয়েবল শ্যাডোয়িং সঠিকভাবে বাস্তবায়িত হয়।"
    },
    {
      q: "৫. ইনফিনিট লুপ (Infinite loop guard) কীভাবে হ্যান্ডেল করা হয়েছে?",
      a: "chakkor (while) লুপের ভেতর একটি সেফটি এক্সিকিউশন লিমিট (১,০০,০০০ ইটারেশন) যুক্ত রয়েছে। কোনো ইউজার ভুল কন্ডিশন দিলে ব্রাউজার ক্র্যাশ না করে উপযুক্ত ঢাকাইয়া এরর মেসেজ দেয়।"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-dhaka-card border border-dhaka-border rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-dhaka-elevated border-b border-dhaka-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <div>
              <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                <span>DhakaiyaLang ডকুমেন্টেশন ও ভাইভা গাইড</span>
              </h2>
              <p className="text-xs text-dhaka-textMuted">
                Compiler Design Lab Guide & Viva Q&A Cheat-Sheet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-dhaka-textMuted hover:text-white bg-dhaka-bg rounded-lg border border-dhaka-border transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-dhaka-border bg-dhaka-bg px-6 gap-2">
          <button
            onClick={() => setActiveSection('keywords')}
            className={`py-3 px-4 text-xs md:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeSection === 'keywords'
                ? 'border-dhaka-gold text-dhaka-gold'
                : 'border-transparent text-dhaka-textMuted hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>কী-ওয়ার্ড অভিধান</span>
          </button>

          <button
            onClick={() => setActiveSection('viva')}
            className={`py-3 px-4 text-xs md:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeSection === 'viva'
                ? 'border-dhaka-terracotta text-dhaka-terracottaLight'
                : 'border-transparent text-dhaka-textMuted hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>ল্যাব ভাইভা প্রশ্নোত্তর (Q&A)</span>
          </button>

          <button
            onClick={() => setActiveSection('grammar')}
            className={`py-3 px-4 text-xs md:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeSection === 'grammar'
                ? 'border-dhaka-teal text-dhaka-teal'
                : 'border-transparent text-dhaka-textMuted hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>ব্যাকরণ (EBNF Grammar)</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs md:text-sm">
          {/* Section 1: Keywords Table */}
          {activeSection === 'keywords' && (
            <div className="border border-dhaka-border rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-dhaka-elevated text-dhaka-gold border-b border-dhaka-border text-xs">
                  <tr>
                    <th className="py-2.5 px-3">ঢাকাইয়া কী-ওয়ার্ড</th>
                    <th className="py-2.5 px-3">জাভাস্ক্রিপ্ট ইকুইভ্যালেন্ট</th>
                    <th className="py-2.5 px-3">বিবরণ</th>
                    <th className="py-2.5 px-3">উদাহরণ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dhaka-border/40 font-mono text-xs">
                  {keywordList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-dhaka-elevated/40">
                      <td className="py-2 px-3 font-bold text-dhaka-terracottaLight">
                        {item.kw}
                      </td>
                      <td className="py-2 px-3 text-dhaka-textMuted">
                        {item.js}
                      </td>
                      <td className="py-2 px-3 font-sans text-dhaka-textLight">
                        {item.desc}
                      </td>
                      <td className="py-2 px-3 text-dhaka-gold">
                        {item.example}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Section 2: Viva Q&A */}
          {activeSection === 'viva' && (
            <div className="space-y-4">
              <div className="p-3 bg-dhaka-gold/10 border border-dhaka-gold/30 rounded-xl text-dhaka-gold text-xs">
                💡 <strong>ল্যাব স্পেশাল টিপ:</strong> ল্যাব ভাইভাতে শিক্ষক সাধারণত জিজ্ঞাসা করেন আপনার কম্পাইলার কিভাবে টোকেনাইজ করে, ব্যাকরণ কি, এবং AST কীভাবে ইন্টারপ্রেট বা ট্রান্সপাইল করা হয়। নিচের উত্তরগুলো মনে রাখুন!
              </div>
              {vivaQuestions.map((viva, i) => (
                <div key={i} className="p-4 rounded-xl bg-dhaka-bg border border-dhaka-border space-y-1.5">
                  <h3 className="font-bold text-dhaka-terracottaLight">{viva.q}</h3>
                  <p className="text-dhaka-textLight font-sans leading-relaxed text-xs md:text-sm">
                    {viva.a}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Section 3: Grammar */}
          {activeSection === 'grammar' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 bg-dhaka-bg rounded-xl border border-dhaka-border text-dhaka-teal leading-relaxed whitespace-pre-wrap">
{`Program            ::= "bismillah" Statement* "khatam"
Statement          ::= VarDecl | PrintStmt | IfStmt | WhileStmt | Block | AssignOrExpr
VarDecl            ::= "rakh" IDENTIFIER ("=" Expression)? ";"
PrintStmt          ::= "chilla" Expression ";"
IfStmt             ::= "jodi" "(" Expression ")" Block ("naile" (IfStmt | Block))?
WhileStmt          ::= "chakkor" "(" Expression ")" Block
Block              ::= "{" Statement* "}"
AssignOrExpr       ::= (IDENTIFIER "=" Expression ";") | (Expression ";")
Expression         ::= LogicalOr
LogicalOr          ::= LogicalAnd ("othoba" LogicalAnd)*
LogicalAnd         ::= Equality ("ebong" Equality)*
Equality           ::= Comparison (("==" | "!=") Comparison)*
Comparison         ::= Additive (("<" | "<=" | ">" | ">=") Additive)*
Additive           ::= Multiplicative (("+" | "-") Multiplicative)*
Multiplicative     ::= Unary (("*" | "/" | "%") Unary)*
Unary              ::= ("-" | "nah" | "!") Unary | Primary
Primary            ::= NUMBER | STRING | "asli" | "fapor" | "khali" | IDENTIFIER | "(" Expression ")"`}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-dhaka-elevated border-t border-dhaka-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-dhaka-gold text-dhaka-bg font-bold text-xs hover:bg-dhaka-goldLight transition-colors"
          >
            বুঝে গেছি মামা!
          </button>
        </div>
      </div>
    </div>
  );
};
