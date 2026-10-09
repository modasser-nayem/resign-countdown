"use client";

import React, { useState } from "react";
import { ChevronDown, MessageSquareQuote, Copy, Check } from "lucide-react";
import { FUNNY_FAQS } from "@/lib/constants";
import { soundEffects } from "@/lib/audio";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    soundEffects.playPop();
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const handleCopy = (punchline: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(punchline);
    soundEffects.playKaChing();
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <section id="faq" className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
          <MessageSquareQuote className="w-3.5 h-3.5" /> সহকর্মীদের প্রশ্নোত্তর
        </div>
        <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
          💬 সচরাচর জিজ্ঞাসিত হাসিমুখের উত্তর (FAQ)
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          অফিসের প্রিয় সহকর্মীরা যখনই কোনো প্রশ্ন করবেন, হাসিমুখে এই উত্তরগুলো উপহার দিন!
        </p>
      </div>

      <div className="space-y-3">
        {FUNNY_FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          const isCopied = copiedIdx === idx;

          return (
            <div
              key={idx}
              className={`glass-card rounded-2xl border transition-all overflow-hidden ${
                isOpen ? "border-amber-500/40 bg-slate-900/90" : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0">
                    প্রশ্ন {idx + 1}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-slate-100">
                    {faq.question}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-amber-400" : ""
                    }`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-slate-300 border-t border-slate-800/80 bg-slate-950/40">
                  <div className="p-3 sm:p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                    <p className="text-xs sm:text-sm md:text-base font-bold text-amber-300 leading-snug">
                      🎯 &ldquo;{faq.punchline}&rdquo;
                    </p>
                    <button
                      onClick={(e) => handleCopy(faq.punchline, idx, e)}
                      title="উত্তর কপি করুন"
                      className="self-start sm:self-auto px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">কপি হয়েছে!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>উত্তর কপি করুন</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400">
                    💡 প্রসঙ্গ: {faq.detail}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
