'use client';

import React, { useState, useEffect, useRef } from 'react';
import { runDhakaiya, RunResult, PRESETS, Preset } from '../engine';

// Documentation Snippets formatted exactly like Bhailang documentation
const DOC_SNIPPETS = {
  general: {
    category: 'General',
    keyword: 'bismillah ... khatam',
    title: 'প্রোগ্রাম সূচনা ও সমাপ্তি',
    description: "প্রতিটি DhakaiyaLang প্রোগ্রাম অবশ্যই 'bismillah' দিয়ে শুরু করতে হবে এবং 'khatam' দিয়ে শেষ করতে হবে (Bhailang-এর 'hi bhai / bye bhai' এর মতো)।",
    code: `bismillah\n  // পুরান ঢাকার কোড মামা\n  chilla "আরে মামা, কাম শুরু!";\nkhatam`,
    output: '>> আরে মামা, কাম শুরু!'
  },
  variables: {
    category: 'Variables',
    keyword: 'rakh',
    title: 'ভ্যারিয়েবল ডিক্লেয়ারেশন',
    description: "মান সংরক্ষণ করতে 'rakh' কী-ওয়ার্ড (Bhailang-এর 'bhai ye hai') ব্যবহার করুন। মান পরিবর্তন ও নতুন মান পুনরায় অ্যাসাইন করা যায়।",
    code: `bismillah\n  rakh a = 10;\n  rakh b = "হাজী কাচ্চি";\n  rakh c = 15;\n  a = a + 1;\n  c = 2 * c;\n  chilla a;\n  chilla b;\n  chilla c;\nkhatam`,
    output: '>> 11 | হাজী কাচ্চি | 30'
  },
  builtin: {
    category: 'Built-in I/O',
    keyword: 'chilla',
    title: 'টার্মিনাল আউটপুট প্রিন্ট',
    description: "টার্মিনাল স্ক্রিনে টেক্সট, নম্বর বা হিসাবের ফলাফল প্রিন্ট করতে 'chilla' ব্যবহার করুন (Bhailang-এর 'bol bhai' এর মতো)।",
    code: `bismillah\n  chilla "Hello World!";\n  rakh a = 100;\n  rakh b = 50;\n  chilla a + b;\n  chilla "বিরিয়ানি গরম গরম খাইবা!";\nkhatam`,
    output: '>> Hello World! | 150 | বিরিয়ানি...'
  },
  types: {
    category: 'Types',
    keyword: 'asli, fapor, khali',
    title: 'বুলিয়ান ও স্পেশাল টাইপ',
    description: "সত্যকে 'asli' (true), মিথ্যাকে 'fapor' (false) এবং খালিকে 'khali' (null) বলা হয় (Bhailang-এ 'sahi, galat, nalla')।",
    code: `bismillah\n  rakh a = asli;\n  rakh b = fapor;\n  rakh c = khali;\n  chilla a;\n  chilla b;\n  chilla c;\nkhatam`,
    output: '>> asli | fapor | khali'
  },
  conditionals: {
    category: 'Conditionals',
    keyword: 'jodi - naile',
    title: 'শর্তাধীন কোড (If-Else)',
    description: "লজিক্যাল সিদ্ধান্ত নিতে 'jodi' এবং বিকল্পের জন্য 'naile' ব্যবহার করুন (Bhailang-এ 'agar bhai / par bhai')।",
    code: `bismillah\n  rakh a = 10;\n  jodi (a < 20) {\n    chilla "a holo 20 er theke choto mama!";\n  } naile {\n    chilla "a holo 20 er theke boro ba soman!";\n  }\nkhatam`,
    output: '>> a holo 20 er theke choto mama!'
  },
  loops: {
    category: 'Loops',
    keyword: 'chakkor - thamo',
    title: 'চাক্কর লুপ ও ব্রেক (While Loop)',
    description: "পুনরাবৃত্তিমূলক কাজের জন্য 'chakkor' এবং মাঝপথে থামাতে 'thamo' ব্যবহার করুন (Bhailang-এ 'jab tak bhai / bas kar bhai')।",
    code: `bismillah\n  rakh a = 0;\n  chakkor (a < 10) {\n    a = a + 1;\n    jodi (a == 5) {\n      chilla "থামো মামা!";\n      thamo;\n    }\n    chilla a;\n  }\nkhatam`,
    output: '>> 1 | 2 | 3 | 4 | থামো মামা!'
  },
  functions: {
    category: 'Functions',
    keyword: 'kaam - ferot',
    title: 'ফাংশন ও মান রিটার্ন',
    description: "পুনর্ব্যবহারযোগ্য ফাংশন তৈরি করতে 'kaam' এবং হিসাব করা ফলাফল ফেরত পাঠাতে 'ferot' ব্যবহার করুন।",
    code: `bismillah\n  kaam jog(a, b) {\n    ferot a + b;\n  }\n  rakh fol = jog(20, 30);\n  chilla fol;\nkhatam`,
    output: '>> 50'
  },
  arrays: {
    category: 'Arrays',
    keyword: 'dekchi [ ... ]',
    title: 'ডেকচি / অ্যারে তালিকা ও ইনডেক্সিং',
    description: "আইটেমগুলোর তালিকা তৈরি করতে '[ ... ]' এবং নির্দিষ্ট উপাদান পড়তে 'menu[0]' ইনডেক্স ব্যবহার করা হয়।",
    code: `bismillah\n  rakh menu = ["কাচ্চি", "বোরহানি", "জর্দা"];\n  chilla menu[0];\n  chilla menu[1];\n  chilla menu;\nkhatam`,
    output: '>> কাচ্চি | বোরহানি | [...]'
  }
};

type DocKey = keyof typeof DOC_SNIPPETS;

export default function Home() {
  const [code, setCode] = useState<string>(PRESETS[0].code);
  const [selectedPreset, setSelectedPreset] = useState<string>('kacchi');
  const [activeTab, setActiveTab] = useState<'console' | 'symbols' | 'tokens' | 'ast' | 'transpiler' | 'preprocessor'>('console');
  const [result, setResult] = useState<RunResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [tokenSearch, setTokenSearch] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const terminalSectionRef = useRef<HTMLElement>(null);

  // Run on mount
  useEffect(() => {
    handleRunCode(PRESETS[0].code);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleRunCode = (codeToExecute: string = code) => {
    const res = runDhakaiya(codeToExecute);
    setResult(res);
  };

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    const found = PRESETS.find(p => p.id === presetId);
    if (found) {
      setCode(found.code);
      handleRunCode(found.code);
    }
  };

  const handleInsertSnippet = (snippet: string) => {
    if (!editorRef.current) {
      setCode(prev => prev + '\n' + snippet);
      return;
    }
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextCode = code.substring(0, start) + snippet + code.substring(end);
    setCode(nextCode);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
    }, 0);
  };

  const handleCopy = (text: string, keyIdentifier: string, successMessage: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(keyIdentifier);
      showToast(successMessage);
      setTimeout(() => {
        setCopiedKey(null);
      }, 2000);
    });
  };

  const handleLoadDocToEditor = (docCode: string) => {
    setCode(docCode);
    handleRunCode(docCode);
    showToast('🚀 কোড এডিটরে লোড করা হইছে!');
    terminalSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSaveFile = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'karmokando.dhaka';
    a.click();
    URL.revokeObjectURL(url);
    showToast('💾 karmokando.dhaka ডাউনলোড হইছে!');
  };

  const handleShareCode = () => {
    if (typeof window !== 'undefined') {
      const b64 = btoa(unescape(encodeURIComponent(code)));
      const shareUrl = `${window.location.origin}${window.location.pathname}#${b64}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('🔗 শেয়ারেবল লিংক কপি হইছে মামা!');
      });
    }
  };

  const lineCount = code.split('\n').length;
  const filteredTokens = (result?.tokens || []).filter(t =>
    t.type.toLowerCase().includes(tokenSearch.toLowerCase()) ||
    String(t.value).toLowerCase().includes(tokenSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#08090E] text-[#F8FAFC]">
      
      {/* Top Geometric Rickshaw Pattern Border */}
      <div className="rickshaw-pattern w-full"></div>

      {/* STICKY NAVBAR */}
      <header className="border-b border-[#242B42]/70 bg-[#10131E]/90 backdrop-blur-xl sticky top-0 z-50 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D94819] via-[#F59E0B] to-[#EC4899] p-0.5 shadow-lg shadow-[#D94819]/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#10131E] rounded-2xl flex items-center justify-center overflow-hidden">
                <img src="/assets/rickshaw.svg" alt="Rickshaw Logo" className="w-7 h-7 object-contain" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#FF5722] bg-clip-text text-transparent font-mono">
                  DhakaiyaLang
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D94819]/20 text-[#FF5722] border border-[#D94819]/40 font-mono">
                  পুরান ঢাকা v1.0
                </span>
              </div>
            </div>
          </a>

          {/* 3 Section Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold">
            <a href="#hero" className="text-[#94A3B8] hover:text-white transition-colors">
              🏠 পরিচিতি (Hero)
            </a>
            <a href="#terminal" className="text-[#F59E0B] hover:text-white transition-colors flex items-center gap-1.5">
              <span>📟 টার্মিনাল ও এডিটর</span>
            </a>
            <a href="#docs" className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-1.5">
              <span>📖 ডকুমেন্টেশন</span>
            </a>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-2.5">
            <a
              href="#terminal"
              className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-[#D94819] to-[#F59E0B] text-black hover:brightness-110 shadow-md transition-all"
            >
              প্লেগ্রাউন্ড 🚀
            </a>
          </div>

        </div>
      </header>

      {/* ================= SECTION 1: HERO SECTION ================= */}
      <section id="hero" className="hero-bg border-b border-[#242B42]/70 py-16 lg:py-24 px-4 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Headline & Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#171B2A] border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-bold">
              <span>🛺 পুরান ঢাকার ঐতিহ্য • Bhailang ও BongLang অনুপ্রাণিত</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              পুরান ঢাকার খাঁটি ভাষায় <br />
              <span className="bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#FF5722] bg-clip-text text-transparent">
                কোডিং হবে মামা!
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-2xl">
              <strong className="text-white">DhakaiyaLang</strong> হলো পুরান ঢাকার ৪০০ বছরের মুখের ভাষার রসে ভরপুর একটি খেলনা প্রোগ্রামিং ভাষা। নাজিরাবাজারের বিরিয়ানি থেকে শাঁখারীবাজারের দরদাম—সবকিছু এখন কোডের লাইনে লাইনে!
            </p>


            {/* CTA Buttons */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <a
                href="#terminal"
                className="px-6 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-[#D94819] via-[#F59E0B] to-[#FFD700] hover:brightness-110 text-black shadow-xl shadow-[#D94819]/30 transition-all flex items-center gap-2"
              >
                <span>টার্মিনালে কোড চালান</span>
              </a>

              <a
                href="#docs"
                className="px-6 py-3 rounded-2xl font-bold text-sm bg-[#171B2A] hover:bg-[#242B42] border border-[#242B42] text-white transition-all flex items-center gap-2"
              >
                <span>সম্পূর্ণ ডকুমেন্টেশন</span>
              </a>
            </div>

            <div className="flex items-center gap-6 text-xs text-[#94A3B8] pt-2">
              <span className="flex items-center gap-1.5">নোড/সার্ভার ডিপেন্ডেন্সি নাই</span>
              <span className="flex items-center gap-1.5">AST পার্স ট্রি ভিউয়ার</span>
              <span className="flex items-center gap-1.5">লাইভ মেমরি সিম্বল টেবিল</span>
            </div>
          </div>

          {/* Right: Cultural Hero Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-[#10131E] border border-[#242B42] rounded-3xl p-5 shadow-2xl glow-orange relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#242B42]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#D94819] inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B] inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-[#10B981] inline-block"></span>
                  <span className="text-xs font-bold text-[#F8FAFC] font-mono ml-2">haji_biriyani.dhaka</span>
                </div>
                <span className="text-[11px] text-[#F59E0B] font-bold">পুরান ঢাকা স্পেশাল</span>
              </div>

              <pre className="font-mono text-xs leading-relaxed text-[#F8FAFC] overflow-x-auto"><code><span className="text-[#FF5722] font-bold">bismillah</span>
  <span className="text-[#94A3B8]">// নাজিরাবাজারের কাচ্চির হিসাব</span>
  <span className="text-[#F59E0B] font-bold">rakh</span> plate = <span className="text-[#FFD700]">3</span>;
  <span className="text-[#F59E0B] font-bold">rakh</span> dam = <span className="text-[#FFD700]">280</span>;
  <span className="text-[#F59E0B] font-bold">rakh</span> borhani = <span className="text-[#FFD700]">60</span>;

  <span className="text-[#F59E0B] font-bold">rakh</span> mot = (plate * dam) + borhani;

  <span className="text-[#10B981] font-bold">chilla</span> <span className="text-[#FFD700]">"কাচ্চির বিল হইলো:"</span>;
  <span className="text-[#10B981] font-bold">chilla</span> mot;

  <span className="text-[#06B6D4] font-bold">jodi</span> (mot &gt; <span className="text-[#FFD700]">800</span>) &#123;
    <span className="text-[#10B981] font-bold">chilla</span> <span className="text-[#FFD700]">"মামা ডিসকাউন্ট চান!"</span>;
  &#125;
<span className="text-[#FF5722] font-bold">khatam</span></code></pre>

              <div className="mt-4 p-3 rounded-xl bg-[#171B2A] border border-[#242B42] flex items-center justify-between text-xs">
                <span className="text-[#94A3B8]">টার্মিনাল আউটপুট:</span>
                <span className="text-[#10B981] font-mono font-bold">&gt;&gt; 900 (ডিসকাউন্ট চান!)</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= SECTION 2: TERMINAL & PLAYGROUND (হিরো ব্যাকগ্রাউন্ড ও আর্টওয়ার্ক) ================= */}
      <section
        id="terminal"
        ref={terminalSectionRef}
        className="terminal-bg border-b border-[#242B42]/70 py-16 px-4 lg:px-8 relative overflow-hidden"
      >
        {/* Heritage Vector Silhouettes & Ambient Glow */}
        <div className="absolute inset-0 opacity-15 pointer-events-none flex justify-between items-end px-4 overflow-hidden">
          <img src="/assets/ahsan_manzil.svg" alt="Ahsan Manzil" className="w-80 h-auto -translate-x-6 translate-y-6" />
          <img src="/assets/kacchi.svg" alt="Kacchi Pot" className="w-64 h-auto opacity-30" />
          <img src="/assets/lalbagh.svg" alt="Lalbagh Fort" className="w-80 h-auto translate-x-6 translate-y-6" />
        </div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-[#D94819]/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          
          {/* Section Title & Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#242B42]/70">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white">DhakaiyaLang টার্মিনাল ও লাইভ এডিটর</h2>
              </div>
              <p className="text-xs text-[#94A3B8] font-medium mt-0.5">
                কোড লিখুন, টোকেন স্ট্রিম ও পার্স ট্রি দেখুন এবং ব্রাউজারে ইনস্ট্যান্ট আউটপুট উপভোগ করুন।
              </p>
            </div>

            {/* Presets & Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 bg-[#171B2A] px-3 py-1.5 rounded-xl border border-[#242B42] text-xs">
                <span className="text-[#94A3B8]">নমুনা কোড:</span>
                <select
                  value={selectedPreset}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="bg-transparent text-[#F59E0B] font-bold focus:outline-none cursor-pointer"
                >
                  {PRESETS.map(p => (
                    <option key={p.id} value={p.id} className="bg-[#10131E] text-white">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSaveFile}
                className="px-3 py-1.5 rounded-xl bg-[#171B2A] hover:bg-[#242B42] border border-[#242B42] text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5"
                title="ডাউনলোড .dhaka ফাইল"
              >
                <span>💾 সেভ</span>
              </button>

              <button
                onClick={handleShareCode}
                className="px-3 py-1.5 rounded-xl bg-[#171B2A] hover:bg-[#242B42] border border-[#242B42] text-xs font-semibold text-[#06B6D4] flex items-center gap-1.5"
                title="শেয়ারেবল লিংক"
              >
                <span>🔗 শেয়ার</span>
              </button>

              <button
                onClick={() => handleRunCode(code)}
                className="px-5 py-2 rounded-xl font-black text-sm bg-gradient-to-r from-[#D94819] via-[#F59E0B] to-[#FFD700] hover:brightness-110 text-black shadow-lg shadow-[#D94819]/40 border border-[#FFD700]/50 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>চালাও মামা! 🚀</span>
                <span className="text-[10px] bg-black/20 text-black px-1.5 py-0.5 rounded font-mono hidden md:inline">Ctrl+Enter</span>
              </button>
            </div>
          </div>

          {/* Quick Snippet Bar */}
          <div className="bg-[#10131E] border border-[#242B42] rounded-xl px-3 py-1.5 overflow-x-auto text-xs flex items-center gap-2 select-none">
            <span className="text-[#F59E0B] font-bold flex items-center gap-1 whitespace-nowrap">
              <span>⚡ এক ক্লিকে কোড:</span>
            </span>
            <button onClick={() => handleInsertSnippet('bismillah\n  \nkhatam')} className="px-2.5 py-0.5 rounded-lg bg-[#171B2A] hover:bg-[#D94819]/20 border border-[#242B42] text-[#FF5722] font-mono font-semibold whitespace-nowrap">bismillah ... khatam</button>
            <button onClick={() => handleInsertSnippet('rakh item = 100;')} className="px-2.5 py-0.5 rounded-lg bg-[#171B2A] hover:bg-[#F59E0B]/20 border border-[#242B42] text-[#F59E0B] font-mono font-semibold whitespace-nowrap">rakh (let)</button>
            <button onClick={() => handleInsertSnippet('chilla "আরে মামা!";')} className="px-2.5 py-0.5 rounded-lg bg-[#171B2A] hover:bg-[#10B981]/20 border border-[#242B42] text-[#10B981] font-mono font-semibold whitespace-nowrap">chilla (print)</button>
            <button onClick={() => handleInsertSnippet('jodi (taka > 500) {\n  \n} naile {\n  \n}')} className="px-2.5 py-0.5 rounded-lg bg-[#171B2A] hover:bg-[#06B6D4]/20 border border-[#242B42] text-[#06B6D4] font-mono font-semibold whitespace-nowrap">jodi-naile (if-else)</button>
            <button onClick={() => handleInsertSnippet('chakkor (count > 0) {\n  \n  count = count - 1;\n}')} className="px-2.5 py-0.5 rounded-lg bg-[#171B2A] hover:bg-[#EC4899]/20 border border-[#242B42] text-[#EC4899] font-mono font-semibold whitespace-nowrap">chakkor (while loop)</button>
            <button onClick={() => handleInsertSnippet('kaam hishab(dam, sonkha) {\n  ferot dam * sonkha;\n}')} className="px-2.5 py-0.5 rounded-lg bg-[#171B2A] hover:bg-[#F59E0B]/20 border border-[#242B42] text-[#FFD700] font-mono font-semibold whitespace-nowrap">kaam (function)</button>
            <button onClick={() => handleInsertSnippet('rakh dekchi = ["কাচ্চি", "বোরহানি", "বাকরখানি"];')} className="px-2.5 py-0.5 rounded-lg bg-[#171B2A] hover:bg-[#D94819]/20 border border-[#242B42] text-[#D94819] font-mono font-semibold whitespace-nowrap">dekchi (array)</button>
            <button onClick={() => handleInsertSnippet('thamo;')} className="px-2.5 py-0.5 rounded-lg bg-[#171B2A] hover:bg-[#EF4444]/20 border border-[#242B42] text-[#EF4444] font-mono font-semibold whitespace-nowrap">thamo (break)</button>
          </div>

          {/* Kacchi Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
            <div className="bg-[#10131E] border border-[#242B42] rounded-xl p-2.5 flex items-center justify-between shadow">
              <span className="text-[#94A3B8] flex items-center gap-1">📝 কোড লাইন:</span>
              <span className="font-mono font-bold text-[#F59E0B]">{lineCount}</span>
            </div>
            <div className="bg-[#10131E] border border-[#242B42] rounded-xl p-2.5 flex items-center justify-between shadow">
              <span className="text-[#94A3B8] flex items-center gap-1">🔍 মোট টোকেন:</span>
              <span className="font-mono font-bold text-[#10B981]">{result?.tokens?.length || 0}</span>
            </div>
            <div className="bg-[#10131E] border border-[#242B42] rounded-xl p-2.5 flex items-center justify-between shadow">
              <span className="text-[#94A3B8] flex items-center gap-1">🌳 AST নোড:</span>
              <span className="font-mono font-bold text-[#06B6D4]">{result?.astNodeCount || 0}</span>
            </div>
            <div className="bg-[#10131E] border border-[#242B42] rounded-xl p-2.5 flex items-center justify-between shadow">
              <span className="text-[#94A3B8] flex items-center gap-1">⚡ রান টাইম:</span>
              <span className="font-mono font-bold text-[#FF5722]">{result?.executionTimeMs || 0} ms</span>
            </div>
            <div className="bg-[#10131E] border border-[#242B42] rounded-xl p-2.5 flex items-center justify-between shadow col-span-2 sm:col-span-1">
              <span className="text-[#94A3B8] flex items-center gap-1">📦 মেমরি ভ্যারিয়েবল:</span>
              <span className="font-mono font-bold text-[#EC4899]">{result?.variables?.length || 0}</span>
            </div>
          </div>

          {/* Dual-Pane IDE Studio */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left Pane: Code Editor */}
            <div className="lg:col-span-6 bg-[#08090E] border border-[#242B42] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
              
              <div className="bg-[#10131E] border-b border-[#242B42] px-4 py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                  <span className="font-mono text-[#F8FAFC] font-bold ml-2">karmokando.dhaka</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#94A3B8]">DhakaiyaLang Source</span>
                  <button
                    onClick={() => handleCopy(code, 'editor', '📋 এডিটর কোড কপি হইছে!')}
                    className="text-[#F59E0B] hover:text-white"
                    title="কোড কপি করুন"
                  >
                    📋 কপি
                  </button>
                </div>
              </div>

              {/* Textarea with Line Numbers */}
              <div className="flex-1 flex overflow-hidden font-mono text-xs leading-relaxed relative bg-[#08090E]">
                <div className="w-10 bg-[#0B0E17] text-[#94A3B8]/40 select-none py-3 text-right pr-2 border-r border-[#242B42]/40 font-mono">
                  {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <textarea
                  ref={editorRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault();
                      handleRunCode(code);
                    }
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      const target = e.currentTarget;
                      const start = target.selectionStart;
                      const end = target.selectionEnd;
                      const nextCode = code.substring(0, start) + '  ' + code.substring(end);
                      setCode(nextCode);
                      setTimeout(() => {
                        target.selectionStart = target.selectionEnd = start + 2;
                      }, 0);
                    }
                  }}
                  className="flex-1 p-3 bg-transparent text-[#F8FAFC] focus:outline-none resize-none font-mono selection:bg-[#D94819]/40 leading-relaxed overflow-auto"
                  spellCheck={false}
                />
              </div>

              <div className="bg-[#10131E] border-t border-[#242B42] px-4 py-2 flex items-center justify-between text-[11px] text-[#94A3B8]">
                <span>Ctrl + Enter চাপলেই কোড রান হবে</span>
                <span className="font-mono text-[#10B981]">UTF-8 • Dhakaiya AST</span>
              </div>
            </div>

            {/* Right Pane: Compiler Studio Multi-Tabs */}
            <div className="lg:col-span-6 bg-[#10131E] border border-[#242B42] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
              
              {/* Studio Tabs Navigation */}
              <div className="bg-[#171B2A] border-b border-[#242B42] px-3 py-2 flex items-center justify-between gap-1 overflow-x-auto text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab('console')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                      activeTab === 'console' ? 'bg-[#D94819] text-white shadow-md' : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <span>📟 টার্মিনাল</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('symbols')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                      activeTab === 'symbols' ? 'bg-[#D94819] text-white shadow-md' : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <span>📦 সিম্বল টেবিল</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('tokens')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                      activeTab === 'tokens' ? 'bg-[#D94819] text-white shadow-md' : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <span>🔍 টোকেন স্ট্রিম</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('ast')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                      activeTab === 'ast' ? 'bg-[#D94819] text-white shadow-md' : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <span>🌳 AST ট্রি</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('transpiler')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                      activeTab === 'transpiler' ? 'bg-[#D94819] text-white shadow-md' : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <span>⚡ V8 JS</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('preprocessor')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                      activeTab === 'preprocessor' ? 'bg-[#D94819] text-white shadow-md' : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <span>🛠️ Phase 0</span>
                  </button>
                </div>
              </div>

              {/* Studio Body Panes */}
              <div className="flex-1 p-4 overflow-auto font-mono text-xs">
                
                {/* Tab 1: Terminal Console */}
                {activeTab === 'console' && (
                  <div className="h-full flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-[#242B42]/50 text-xs">
                        <span className="text-[#94A3B8] font-bold">লগ ও আউটপুট হিস্ট্রি:</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          result?.error ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40' : 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                        }`}>
                          {result?.error ? `⚠️ এরর: ${result.error.phase}` : '✓ এক্সিকিউশন সফল'}
                        </span>
                      </div>

                      {result?.logs && result.logs.length > 0 ? (
                        <div className="space-y-1.5 pt-1">
                          {result.logs.map((log, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-[#10B981]">
                              <span className="text-[#94A3B8]/50 select-none">&gt;&gt;</span>
                              <span className="text-white font-medium">{log}</span>
                            </div>
                          ))}
                        </div>
                      ) : !result?.error ? (
                        <div className="text-[#94A3B8]/50 italic py-12 text-center">
                          কোনো কিছু প্রিন্ট করা হয় নাই (chilla ব্যবহার করুন)।
                        </div>
                      ) : null}

                      {/* Error Banner */}
                      {result?.error && (
                        <div className="mt-4 p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/40 text-[#EF4444] space-y-1">
                          <div className="font-bold flex items-center gap-1.5">
                            <span>⚠️ {result.error.phase} ফেজে গোলমাল হইছে!</span>
                          </div>
                          <div className="text-xs text-white/90 leading-relaxed font-mono">
                            {result.error.message}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#242B42]/50 flex items-center justify-between text-[11px] text-[#94A3B8]">
                      <span>Phase: {result?.phase || 'IDLE'}</span>
                      <button
                        onClick={() => setResult(null)}
                        className="text-[#F59E0B] hover:text-white"
                      >
                        স্ক্রিন ক্লিয়ার করুন
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 2: Symbol Table */}
                {activeTab === 'symbols' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#242B42]/50 text-xs">
                      <span className="text-white font-bold">সক্রিয় ভ্যারিয়েবল ও মেমরি স্ট্যাটাস</span>
                      <span className="text-[#F59E0B]">{result?.variables?.length || 0} টি ভ্যারিয়েবল</span>
                    </div>

                    {result?.variables && result.variables.length > 0 ? (
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-[#94A3B8] border-b border-[#242B42]">
                            <th className="py-1.5 px-2">নাম (Identifier)</th>
                            <th className="py-1.5 px-2">টাইপ</th>
                            <th className="py-1.5 px-2">মান (Value)</th>
                            <th className="py-1.5 px-2">স্কোপ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.variables.map(([vName, vVal], i) => (
                            <tr key={i} className="border-b border-[#242B42]/30 hover:bg-[#171B2A]/40">
                              <td className="py-1.5 px-2 text-[#F59E0B] font-bold">{vName}</td>
                              <td className="py-1.5 px-2 text-[#06B6D4]">{Array.isArray(vVal) ? `Array(${vVal.length})` : typeof vVal}</td>
                              <td className="py-1.5 px-2 text-white">{JSON.stringify(vVal)}</td>
                              <td className="py-1.5 px-2 text-[#10B981]">Global</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-[#94A3B8]/50 italic py-12 text-center">
                        কোনো ভ্যারিয়েবল ডিক্লেয়ার করা হয়নি।
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 3: Tokens */}
                {activeTab === 'tokens' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#242B42]/50 text-xs gap-2">
                      <span className="text-white font-bold">Lexical Tokens ({result?.tokens?.length || 0})</span>
                      <input
                        type="text"
                        placeholder="টোকেন ফিল্টার..."
                        value={tokenSearch}
                        onChange={(e) => setTokenSearch(e.target.value)}
                        className="px-2 py-1 rounded bg-[#08090E] border border-[#242B42] text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="max-h-[380px] overflow-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-[#94A3B8] border-b border-[#242B42]">
                            <th className="py-1 px-2">#</th>
                            <th className="py-1 px-2">Token Type</th>
                            <th className="py-1 px-2">Lexeme / Value</th>
                            <th className="py-1 px-2">Line</th>
                            <th className="py-1 px-2">Col</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTokens.map((t, idx) => (
                            <tr key={idx} className="border-b border-[#242B42]/30 hover:bg-[#171B2A]/40">
                              <td className="py-1 px-2 text-[#94A3B8]">{idx + 1}</td>
                              <td className="py-1 px-2 font-bold text-[#FF5722]">{t.type}</td>
                              <td className="py-1 px-2 text-white">{String(t.value)}</td>
                              <td className="py-1 px-2 text-[#94A3B8]">{t.line}</td>
                              <td className="py-1 px-2 text-[#94A3B8]">{t.column}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Tab 4: AST Tree */}
                {activeTab === 'ast' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-[#242B42]/50 text-xs">
                      <span className="text-[#10B981] font-bold">Abstract Syntax Tree (AST Hierarchy)</span>
                      <button
                        onClick={() => handleCopy(JSON.stringify(result?.ast, null, 2), 'ast', '📋 AST JSON কপি হইছে!')}
                        className="px-2 py-1 bg-[#08090E] hover:bg-[#171B2A] rounded-lg border border-[#242B42] text-xs text-[#F59E0B]"
                      >
                        📋 কপি JSON
                      </button>
                    </div>
                    <pre className="p-3 bg-[#08090E] rounded-xl border border-[#242B42] text-[#10B981] overflow-x-auto max-h-[390px] leading-snug">
                      {JSON.stringify(result?.ast, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Tab 5: Transpiler V8 JS */}
                {activeTab === 'transpiler' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-[#242B42]/50 text-xs">
                      <span className="text-[#F59E0B] font-bold">V8 ইঞ্জিন উপযোগী সমতুল্য জাভাস্ক্রিপ্ট কোড (Transpiled)</span>
                      <button
                        onClick={() => handleCopy(result?.jsCode || '', 'transpiler', '📋 সমতুল্য JS কপি হইছে!')}
                        className="px-2 py-1 bg-[#08090E] hover:bg-[#171B2A] rounded-lg border border-[#242B42] text-xs text-[#F59E0B]"
                      >
                        📋 কপি JS
                      </button>
                    </div>
                    <pre className="p-3 bg-[#08090E] rounded-xl border border-[#242B42] text-[#FFD700] overflow-x-auto max-h-[390px] leading-snug">
                      {result?.jsCode || '// No JS generated yet'}
                    </pre>
                  </div>
                )}

                {/* Tab 6: Preprocessor */}
                {activeTab === 'preprocessor' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-[#242B42]/50 text-xs">
                      <span className="text-[#94A3B8] font-bold">Phase 0: প্রিপ্রসেসড কোড (কমেন্ট ক্লিনার ও লাইন স্যানিটাইজার)</span>
                    </div>
                    <pre className="p-3 bg-[#08090E] rounded-xl border border-[#242B42] text-[#94A3B8] overflow-x-auto max-h-[390px] leading-snug">
                      {result?.preprocessedCode || '// Preprocessed source code'}
                    </pre>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= SECTION 3 & FOOTER: TECHNICAL BLUEPRINT GRID CANVAS ================= */}
      <div className="grid-paper-bg border-t border-slate-300 shadow-inner">
        
        {/* ================= SECTION 3: DOCUMENTATION (BHAILANG STYLE) ================= */}
        <section id="docs" className="py-16 px-4 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 border border-[#D94819]/40 text-xs text-[#D94819] font-extrabold shadow-sm">
                <span>📖 BHAILANG STYLE DOCUMENTATION</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                সেকশন ৩: DhakaiyaLang ডকুমেন্টেশন
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                আপনার কোডে ব্যবহৃত প্রতিটি কী-ওয়ার্ড, ডেটা টাইপ, ফাংশন ও উদাহরণের বিস্তারিত ব্যাখ্যা। প্রতিটি কার্ডের কোড এক ক্লিকেই কপি করা যায়!
              </p>
            </div>

            {/* 8 Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(Object.keys(DOC_SNIPPETS) as DocKey[]).map((key) => {
                const item = DOC_SNIPPETS[key];
                const isCopied = copiedKey === key;
                return (
                  <div
                    key={key}
                    className="bg-[#0F1422] border border-slate-700/80 hover:border-[#D94819] rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-2xl transition-all hover:shadow-[#D94819]/10"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-lg bg-[#D94819]/20 text-[#FF5722] font-mono font-bold text-xs uppercase tracking-wider">
                          {item.category}
                        </span>
                        <button
                          onClick={() => handleCopy(item.code, key, `📋 ${item.category} কোড কপি হইছে!`)}
                          className={`px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                            isCopied
                              ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/60'
                              : 'bg-[#171B2A] hover:bg-[#D94819]/20 border-[#242B42] text-[#F59E0B]'
                          }`}
                        >
                          <span>{isCopied ? '✓ কপি হইছে!' : '📋 কপি কোড'}</span>
                        </button>
                      </div>

                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">{item.description}</p>

                      <div className="bg-[#080B12] p-4 rounded-2xl border border-[#242B42] font-mono text-xs text-[#F8FAFC]">
                        <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
                          <code>{item.code}</code>
                        </pre>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#242B42]/50 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-[#10B981] font-mono">{item.output}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(item.code, key, `📋 ${item.category} কোড কপি হইছে!`)}
                          className="px-2.5 py-1 rounded-xl bg-[#171B2A] hover:bg-[#D94819]/20 border border-[#242B42] text-xs text-[#F59E0B] font-bold transition-all"
                        >
                          📋 কপি
                        </button>
                        <button
                          onClick={() => handleLoadDocToEditor(item.code)}
                          className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#D94819] to-[#F59E0B] hover:brightness-110 text-xs text-black font-extrabold transition-all shadow-md"
                        >
                          এডিটরে চালান ⚡
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="border-t border-slate-300/80 bg-white/70 backdrop-blur-sm py-8 px-4 text-xs text-slate-600 text-center">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🛺</span>
              <span className="font-bold text-slate-900">DhakaiyaLang (পুরান ঢাকা)</span>
              <span>•</span>
              <span className="text-slate-600">CSE 3202: Compiler Design Sessional</span>
            </div>
            <div>
              <span className="text-slate-600 font-medium">Bhailang ও BongLang আদলে পিওর জাভাস্ক্রিপ্ট ইঞ্জিন • Made with ❤️ in Old Dhaka</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#0E121B] border border-[#10B981]/50 text-[#10B981] px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold font-sans animate-fade-in">
          <span className="text-base">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
