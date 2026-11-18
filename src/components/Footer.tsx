'use client';

import React from 'react';
import { Heart, Github, ExternalLink, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-dhaka-border bg-dhaka-bg py-6 px-4 text-xs text-dhaka-textMuted text-center font-sans">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span>DhakaiyaLang (পুরান ঢাকা)</span>
          <span>•</span>
          <span>Compiler Design Lab Project</span>
          <span>•</span>
          <span className="text-dhaka-gold">হ্যান্ড-ক্রাফটেড পিওর জাভাস্ক্রিপ্ট ইঞ্জিন</span>
        </div>

        <div className="flex items-center gap-4 text-dhaka-textLight">
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-dhaka-crimson fill-dhaka-crimson inline" /> in Old Dhaka
          </span>
        </div>
      </div>
    </footer>
  );
};
