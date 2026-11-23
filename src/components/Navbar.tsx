'use client';

import React from 'react';
import { Play, BookOpen, Volume2, VolumeX, Sparkles, Code2, RotateCcw } from 'lucide-react';
import { PRESETS, Preset } from '../engine/presets';

interface NavbarProps {
  onRun: () => void;
  isRunning: boolean;
  selectedPreset: string;
  onSelectPreset: (preset: Preset) => void;
  onOpenDocs: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetCode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onRun,
  isRunning,
  selectedPreset,
  onSelectPreset,
  onOpenDocs,
  soundEnabled,
  onToggleSound,
  onResetCode
}) => {
  return (
    <header className="border-b border-dhaka-border bg-dhaka-card/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dhaka-terracotta to-dhaka-amber flex items-center justify-center shadow-lg shadow-dhaka-terracotta/25 border border-dhaka-gold/30">
            <span className="text-xl">🍲</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-dhaka-gold to-dhaka-terracotta bg-clip-text text-transparent font-mono">
                DhakaiyaLang
              </span>

            </div>
            <p className="text-xs text-dhaka-textMuted hidden sm:block">
              Compiler Design Lab • Pure JS AST Engine
            </p>
          </div>
        </div>

        {/* Center: Presets Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              aria-label="স্যাম্পল কোড বাছুন"
              value={selectedPreset}
              onChange={(e) => {
                const found = PRESETS.find(p => p.id === e.target.value);
                if (found) onSelectPreset(found);
              }}
              className="bg-dhaka-bg text-dhaka-textLight text-xs md:text-sm font-medium border border-dhaka-border rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-dhaka-gold hover:border-dhaka-border/80 transition-colors cursor-pointer appearance-none"
            >
              <option value="" disabled>স্যাম্পল কোড বাছুন...</option>
              {PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id} className="bg-dhaka-card text-white py-1">
                  {preset.name}
                </option>
              ))}
            </select>
            <Sparkles className="w-3.5 h-3.5 text-dhaka-gold absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={onResetCode}
            title="কোড রিসেট করুন"
            className="p-2 text-dhaka-textMuted hover:text-white bg-dhaka-bg border border-dhaka-border rounded-lg hover:border-dhaka-border/80 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? "সাউন্ড বন্ধ করুন" : "ঢাকাইয়া সাউন্ড চালু করুন"}
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled
                ? 'bg-dhaka-gold/10 border-dhaka-gold/40 text-dhaka-gold'
                : 'bg-dhaka-bg border-dhaka-border text-dhaka-textMuted hover:text-white'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Docs Modal Button */}
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg bg-dhaka-bg text-dhaka-textLight border border-dhaka-border hover:border-dhaka-gold/50 hover:bg-dhaka-elevated transition-all"
          >
            <BookOpen className="w-4 h-4 text-dhaka-gold" />
            <span className="hidden md:inline">ডকুমেন্টেশন ও ভাইভা</span>
            <span className="md:hidden">গাইড</span>
          </button>

          {/* RUN BUTTON */}
          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-bold rounded-lg bg-gradient-to-r from-dhaka-terracotta via-dhaka-amber to-dhaka-terracotta text-white shadow-lg shadow-dhaka-terracotta/30 hover:shadow-dhaka-terracotta/50 hover:scale-[1.02] active:scale-[0.98] transition-all border border-dhaka-gold/30 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            <Play className={`w-4 h-4 fill-white transition-transform ${isRunning ? 'animate-spin' : 'group-hover:scale-110'}`} />
            <span>চালাও মামা!</span>
            <span className="hidden xl:inline text-[10px] opacity-75 font-mono ml-1 px-1.5 py-0.5 rounded bg-black/20">
              Ctrl+Enter
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
