"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Award, CheckCircle, ShieldCheck, Printer, X } from "lucide-react";
import { RESIGNATION_DETAILS } from "@/lib/constants";
import { soundEffects } from "@/lib/audio";
import confetti from "canvas-confetti";

export default function FreedomPassModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openPass = () => {
    soundEffects.playFanfare();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 },
    });
    setIsOpen(true);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-6 text-center">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent relative overflow-hidden">
        <Award className="w-12 h-12 text-amber-400 mx-auto mb-3 animate-bounce" />
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          📜 বিদায়ী শুভেচ্ছা স্মারক ও প্রত্যয়নপত্র (Farewell Certificate)
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-5 leading-relaxed">
          এসএম টেকনোলজি পরিবারে আলী মোদাচ্ছের নায়েম ভাইয়ের সফল ব্যাকএন্ড ইঞ্জিনিয়ারিং অবদানের প্রীতি স্মারক দেখতে ক্লিক করুন।
        </p>

        <button
          onClick={openPass}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>বিদায়ী স্মারকপত্র দেখুন 🪪</span>
        </button>
      </div>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-2 border-amber-500/60 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl text-left my-auto">
            {/* Background Stamp Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 sm:border-8 border-emerald-500/20 text-emerald-500/20 font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-widest px-4 sm:px-8 py-2 sm:py-4 pointer-events-none rounded-xl sm:rounded-2xl select-none">
              সম্পন্ন
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-amber-500/30 pb-3 sm:pb-4 mb-4 sm:mb-5 pr-8">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-amber-400 block">
                এসএম টেকনোলজি • বিদায়ী প্রীতি স্মারক
              </span>
              <div className="flex flex-wrap items-center justify-between gap-1.5 mt-0.5">
                <h4 className="text-base sm:text-xl font-black text-white">
                  সফল কর্মসমাপনী ও শুভেচ্ছা সনদ
                </h4>
                <span className="text-[10px] sm:text-xs font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  NOC-2026-11752
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start mb-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-amber-500/50 shrink-0 relative bg-slate-800">
                <Image
                  src={RESIGNATION_DETAILS.profilePhoto}
                  alt={RESIGNATION_DETAILS.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 flex-1">
                <p>
                  <strong className="text-slate-400">কর্মীর নাম:</strong>{" "}
                  <span className="text-white font-bold">{RESIGNATION_DETAILS.name}</span>
                </p>
                <p>
                  <strong className="text-slate-400">পদবী:</strong>{" "}
                  <span className="text-amber-400 font-semibold">{RESIGNATION_DETAILS.role}</span>
                </p>
                <p>
                  <strong className="text-slate-400">প্রতিষ্ঠান:</strong>{" "}
                  <span>{RESIGNATION_DETAILS.company}</span>
                </p>
                <p>
                  <strong className="text-slate-400">কর্মী আইডি:</strong>{" "}
                  <span className="font-mono text-slate-200">{RESIGNATION_DETAILS.employeeId}</span>
                </p>
                <p>
                  <strong className="text-slate-400">চূড়ান্ত কর্মদিবস:</strong>{" "}
                  <span className="text-emerald-400 font-bold">
                    ২১ অক্টোবর ২০২৬, বিকাল ৫:০০ টা
                  </span>
                </p>
              </div>
            </div>

            {/* Clearance checklist */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 mb-6 text-xs space-y-2.5">
              <div className="flex items-center gap-2.5 text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ব্যাকএন্ড সিস্টেম ও আর্কিটেকচার: সুন্দর ও সফলভাবে হ্যান্ডওভার সম্পন্ন</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>পোস্টম্যান এপিআই কালেকশন ও ডক: টিমের সাথে পূর্ণাঙ্গ শেয়ার্ড</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>অফিসিয়াল আনুষ্ঠানিকতা: ২১ অক্টোবর ৫:০০ টায় সুসম্পন্ন হবে</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>সহকর্মীদের সাথে ভালোবাসা ও সৌহার্দ্য: আজীবন স্মরণে থাকবে</span>
              </div>
            </div>

            {/* Footer with stamp & print */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="text-[11px] text-slate-400">
                নায়েম ভাইয়ের ভবিষ্যৎ কর্মজীবনের উত্তরোত্তর সাফল্য ও সমৃদ্ধি কামনা করি! 🚀
              </div>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>সনদটি প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
