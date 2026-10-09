"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import {
  PartyPopper,
  Volume2,
  Check,
  Coffee,
  Terminal,
  Bug,
  Flame,
  AlertTriangle,
  Smile,
  Share2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { soundEffects } from "@/lib/audio";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  isComplete: boolean;
  progress: number;
}

// 21 October 2026, 5:00 PM (17:00) Bangladesh Time (GMT+6)
const TARGET_TIMESTAMP = new Date("2026-10-21T17:00:00+06:00").getTime();
const START_TIMESTAMP = new Date("2026-09-21T09:00:00+06:00").getTime();

function calculateTimeLeft(dragPercent: number, daysTorn: number): TimeLeft {
  if (typeof window === "undefined") {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, isComplete: false, progress: 0 };
  }
  const now = Date.now();
  const rawDiff = TARGET_TIMESTAMP - now;

  if (rawDiff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, isComplete: true, progress: 100 };
  }

  const reductionFromDrag = rawDiff * (dragPercent / 100);
  const reductionFromDays = daysTorn * 1000 * 60 * 60 * 24;
  const diff = Math.max(0, rawDiff - reductionFromDrag - reductionFromDays);

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, isComplete: true, progress: 100 };
  }

  const total = TARGET_TIMESTAMP - START_TIMESTAMP;
  const elapsed = Math.max(0, now - START_TIMESTAMP + reductionFromDrag + reductionFromDays);
  const progress = Math.min(100, Math.round((elapsed / total) * 100));

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    milliseconds: Math.floor((diff % 1000) / 10),
    isComplete: false,
    progress,
  };
}

const subscribe = () => () => {};

export default function MemeCountdown() {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  const [memeGlasses, setMemeGlasses] = useState(true);
  const [copied, setCopied] = useState(false);
  const [dialogContent, setDialogContent] = useState<{ title: string; text: string; sound: () => void } | null>(null);

  // DRAG / PULL TIME STATE (0 to 100 percent of remaining time dragged away!)
  const [dragPercent, setDragPercent] = useState(0);
  const [daysTorn, setDaysTorn] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(0, 0));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(dragPercent, daysTorn));
    }, 50);
    return () => clearInterval(timer);
  }, [dragPercent, daysTorn]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Dragging slider handler
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setDragPercent(val);
    soundEffects.playPop();

    if (val === 100) {
      soundEffects.playFanfare();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      showToast("🎉 টেনে টেনে ১০০% সময় শেষ করে দিয়েছেন! আপনি এখন মুক্ত!");
    } else if (val > 75) {
      showToast("🎒 ল্যাপটপ ব্যাগে ঢুকিয়ে ফেলেছেন! আর একটু টানলেই মুক্তি!");
    } else if (val > 40) {
      showToast("🏃💨 অর্ধেক সময় টেনে কমিয়ে দিলেন! বস এখনও টের পায়নি!");
    }
  };

  // Tear off 1 day button
  const handleTearOneDay = () => {
    soundEffects.playKaChing();
    setDaysTorn((prev) => prev + 1);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    showToast(`💨 ১টি দিন টেনে ছিঁড়ে ফেললেন! (মোট ${daysTorn + 1} দিন গায়েব)`);
  };

  // Reset to reality
  const handleReset = () => {
    soundEffects.playSiren();
    setDragPercent(0);
    setDaysTorn(0);
    showToast("🚨 বস দেখে ফেলেছে! আবার আসল টাইমে ফিরে এসেছেন!");
  };

  const triggerConfetti = () => {
    soundEffects.playFanfare();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#10b981", "#3b82f6", "#ec4899"],
    });
  };

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      soundEffects.playKaChing();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Funny excuses without any "standup" jargon
  const EXCUSES = [
    {
      label: "Bhai eta fix kore den 🐞",
      title: "পরবর্তী ডেভেলপারের ওয়েলকাম গিফট!",
      text: "Eta bug na bhai, eta new backend engineer er jonno joining bonus! Ticket pending thakuk! 😂",
      action: () => soundEffects.playSiren(),
    },
    {
      label: "Prod e deploy dibo? 🚀",
      title: "নোটিশ পিরিয়ডের ১ নম্বর নিয়ম:",
      text: "Notice period e `git push origin main` deoa haraam! Kisu crash korle ami 404 Not Found! 💀",
      action: () => soundEffects.playSiren(),
    },
    {
      label: "Documentation koi? 📜",
      title: "The Code IS the Documentation!",
      text: "If it was hard to write, it should be hard to read! Postman collection dekhlei bujhe jaben 🫡",
      action: () => soundEffects.playKaChing(),
    },
    {
      label: "Treat kobe diben? 🍕",
      title: "ট্রিট প্রোটোকল: 404 Not Found",
      text: "21 October 4:59 PM e bkash check koiren! Banasree tong er cha is unlimited though! ☕",
      action: () => soundEffects.playFanfare(),
    },
    {
      label: "মিটিংয়ে কী বলব? ☕",
      title: "মিটিংয়ের সর্বজনীন স্ক্রিপ্ট:",
      text: "'ডকুমেন্টেশন আর হ্যান্ডওভার গোছাচ্ছি।' (এই একই কথা বলে ৩ সপ্তাহ পার!) 🤝",
      action: () => soundEffects.playPop(),
    },
  ];

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500"></div>
      </div>
    );
  }

  // Real-time dragged quote
  let dragQuote = "ডেস্কে বসে কাজের ভান করতেছি... 🥱";
  if (dragPercent === 100 || timeLeft.isComplete) {
    dragQuote = "🎉 আলহামদুলিল্লাহ আমি সম্পূর্ণ মুক্ত! টাটা বাই বাই! 🏖️🍹";
  } else if (dragPercent >= 75) {
    dragQuote = "🎒 ল্যাপটপ ব্যাগে ভরে দরজার সামনে দাঁড়িয়ে আছি! 🚪🏃";
  } else if (dragPercent >= 50) {
    dragQuote = "🤫 অর্ধেক সময় টেনে কমিয়ে দিলাম, বস এখনও টের পায় নাই!";
  } else if (dragPercent >= 25) {
    dragQuote = "☕ হ্যান্ডওভার শেষ, এখন শুধু বনশ্রীর টংয়ে আড্ডা!";
  } else if (dragPercent > 0) {
    dragQuote = "🖐️ হাত দিয়ে টেনে সময় কমাচ্ছি! মজা পাইছেন?";
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col items-center text-center">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 z-50 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-2xl animate-bounce border border-amber-300">
          {toastMessage}
        </div>
      )}

      {/* Top Meme Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold mb-4 animate-pulse">
        <Terminal className="w-4 h-4 text-amber-400" />
        <span>NOTICE PERIOD SURVIVAL PROTOCOL</span>
      </div>

      {/* Developer Profile Header */}
      <div className="flex flex-col items-center mb-6">
        <div
          className="relative mb-3 group cursor-pointer"
          onClick={() => {
            soundEffects.playPop();
            setMemeGlasses(!memeGlasses);
          }}
        >
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden ring-4 ring-amber-500/60 shadow-2xl shadow-amber-500/20 bg-slate-800 relative transition-transform duration-300 group-hover:scale-105">
            <Image
              src={memeGlasses ? "/profile-meme.jpg" : "/profile-headshot.jpg"}
              alt="Ali Modasser Nayem"
              fill
              sizes="(max-width: 640px) 144px, 176px"
              quality={95}
              className="object-cover"
              priority
            />
          </div>

          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-900 border border-amber-500/50 text-[11px] text-amber-300 font-bold px-3 py-0.5 rounded-full whitespace-nowrap shadow-md flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 transition-colors">
            <span>{memeGlasses ? "🕶️ Thug Life Mode" : "👔 Clean Mode"}</span>
            <span className="text-[9px] text-slate-400">(ক্লিক করে টগল করুন)</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ali Modasser Nayem
        </h1>
        <p className="text-amber-400 font-semibold text-xs sm:text-sm mt-0.5">
          Executive, Backend Engineer @ SM Technology
        </p>
        <p className="text-slate-400 text-xs mt-1.5 flex items-center gap-1.5">
          <span>🔥 Status:</span>
          <span className="text-emerald-400 font-medium font-mono">
            Mentally on Vacation 🏖️ (Holding prod together)
          </span>
        </p>
      </div>

      {/* THE MAIN COUNTDOWN CARD */}
      <div className="w-full bg-slate-900/90 border border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl mb-5 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-sm sm:text-base font-bold text-slate-200 mb-3">
          &ldquo;Bhai tumi r koydin aso?&rdquo; ➔ Live Freedom Ticker ⏳
        </div>

        {/* Dynamic Reaction Speech Bubble */}
        <div className="inline-block bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-2xl mb-4 animate-pulse">
          {dragQuote}
        </div>

        {/* Big Digital Numbers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-5">
          <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 flex flex-col items-center">
            <span className="text-3xl sm:text-5xl font-black font-mono text-amber-400 tracking-tight">
              {String(timeLeft.days).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase mt-1">
              Days (দিন)
            </span>
          </div>

          <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 flex flex-col items-center">
            <span className="text-3xl sm:text-5xl font-black font-mono text-orange-400 tracking-tight">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase mt-1">
              Hours (ঘণ্টা)
            </span>
          </div>

          <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 flex flex-col items-center">
            <span className="text-3xl sm:text-5xl font-black font-mono text-cyan-400 tracking-tight">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase mt-1">
              Mins (মিনিট)
            </span>
          </div>

          <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 flex flex-col items-center">
            <span className="text-3xl sm:text-5xl font-black font-mono text-emerald-400 tracking-tight">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase mt-1">
              Secs (সেকেন্ড)
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-950/80 rounded-2xl p-3 border border-slate-800 flex flex-col items-center">
            <span className="text-3xl sm:text-5xl font-black font-mono text-purple-400 tracking-tight">
              {String(timeLeft.milliseconds).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase mt-1">
              Millis (ধৈর্য্য)
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 🔥 TENE TENE SOMOY KOMANOR SECTION (THE MAIN FUN FEATURE) */}
        {/* ========================================================= */}
        <div className="bg-slate-950/90 rounded-2xl p-4 sm:p-5 border border-amber-500/30 mb-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <span className="text-xs sm:text-sm font-extrabold text-amber-300 flex items-center gap-1.5">
              <span>🖐️ হাত দিয়ে টেনে টেনে সময় কমান (Drag to Freedom):</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">
              {dragPercent}% টেনে কমিয়ে ফেলা হয়েছে
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mb-3">
            স্লাইডারটি ডানে টেনে নিয়ে যান—দেখবেন ঘড়ির দিন ও ঘণ্টা চোখের সামনে কমে যাচ্ছে!
          </p>

          {/* Interactive Drag Track */}
          <div className="relative flex items-center mb-3">
            <input
              type="range"
              min="0"
              max="100"
              value={dragPercent}
              onChange={handleSliderChange}
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Waypoints under slider */}
          <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-400 font-mono">
            <span>💻 অফিস ডেস্ক</span>
            <span>☕ বনশ্রীর টং</span>
            <span>🚪 এক্সিট ডোর</span>
            <span>🏖️ পূর্ণ মুক্তি!</span>
          </div>

          {/* Extra Buttons: Rip 1 Day / Reset */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
            <button
              onClick={handleTearOneDay}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold border border-slate-700 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>📄 টেনে ১টি দিন ছিঁড়ে ফেলুন (-১ দিন)</span>
            </button>

            {(dragPercent > 0 || daysTorn > 0) && (
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-red-950 hover:bg-red-900 text-red-200 font-bold border border-red-800 transition-all active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>বাস্তবে ফিরুন (Reset)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Instant Colleague Response Buttons (Super Funny) */}
      <div className="w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-5 mb-5">
        <h3 className="text-sm font-bold text-white mb-1 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" /> Colleague Instant Jiggasha Buttons
        </h3>
        <p className="text-[11px] text-slate-400 mb-3.5">
          ডেস্কে এসে কোনো কোলিগ বা বস কিছু জিজ্ঞেস করলে বোতামে চাপুন:
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {EXCUSES.map((exc, idx) => (
            <button
              key={idx}
              onClick={() => {
                exc.action();
                setDialogContent({ title: exc.title, text: exc.text, sound: exc.action });
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-all transform active:scale-95 cursor-pointer"
            >
              {exc.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Crisp Developer Meme Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mb-5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col items-center">
          <Coffee className="w-4 h-4 text-amber-400 mb-1" />
          <span className="text-xs text-slate-400">Tong er Cha</span>
          <span className="text-base font-bold text-white font-mono">~36 Cups Left</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col items-center">
          <Bug className="w-4 h-4 text-red-400 mb-1" />
          <span className="text-xs text-slate-400">Pending Bugs</span>
          <span className="text-base font-bold text-white font-mono">404 Won&apos;t Fix</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col items-center">
          <Flame className="w-4 h-4 text-orange-400 mb-1" />
          <span className="text-xs text-slate-400">Git Commit</span>
          <span className="text-base font-bold text-white font-mono">`push & inshallah`</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col items-center">
          <Volume2 className="w-4 h-4 text-cyan-400 mb-1" />
          <span className="text-xs text-slate-400">Patience</span>
          <span className="text-base font-bold text-white font-mono">1% (Battery Low)</span>
        </div>
      </div>

      {/* Action Soundboard & Share Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
        <button
          onClick={triggerConfetti}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all transform active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          <PartyPopper className="w-4 h-4" />
          <span>Blast Confetti 🎉</span>
        </button>

        <button
          onClick={() => soundEffects.playSiren()}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5"
        >
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span>Deploy Siren 🚨</span>
        </button>

        <button
          onClick={handleCopy}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Copy Link for Slack / WhatsApp 📢</span>
            </>
          )}
        </button>
      </div>

      {/* Pop-up dialog when clicking excuse buttons */}
      {dialogContent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setDialogContent(null)}
        >
          <div
            className="bg-slate-950 border border-amber-500/60 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center relative cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Smile className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              {dialogContent.title}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              &ldquo;{dialogContent.text}&rdquo;
            </p>
            <button
              onClick={() => setDialogContent(null)}
              className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Haha Got It! 😂
            </button>
          </div>
        </div>
      )}

      {/* Ultra Compact Footer */}
      <div className="mt-10 text-[11px] text-slate-500">
        Made with ☕ by Ali Modasser Nayem • SM Technology • Exit Code: 0
      </div>
    </div>
  );
}
