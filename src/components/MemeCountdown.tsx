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
  Sparkles,
} from "lucide-react";
import { soundEffects } from "@/lib/audio";
import CatCountdownOverlay from "./CatCountdownOverlay";

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

function calculateTimeLeft(): TimeLeft {
  if (typeof window === "undefined") {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, isComplete: false, progress: 0 };
  }
  const now = Date.now();
  const rawDiff = TARGET_TIMESTAMP - now;

  if (rawDiff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, isComplete: true, progress: 100 };
  }

  const total = TARGET_TIMESTAMP - START_TIMESTAMP;
  const elapsed = Math.max(0, now - START_TIMESTAMP);
  const progress = Math.min(100, Math.round((elapsed / total) * 100));

  return {
    days: Math.floor(rawDiff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((rawDiff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((rawDiff / 1000 / 60) % 60),
    seconds: Math.floor((rawDiff / 1000) % 60),
    milliseconds: 0,
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

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
      label: "ভাই এটা ফিক্স করে দেন 🐞",
      title: "পরবর্তী ডেভেলপারের ওয়েলকাম গিফট!",
      text: "এটা কোনো বাগ না ভাই, নতুন ব্যাকএন্ড ইঞ্জিনিয়ারের জন্য ওয়েলকাম গিফট! টিকিট পেন্ডিং থাকুক! 😂",
      action: () => soundEffects.playSiren(),
    },
    {
      label: "প্রোডাকশনে ডেপ্লয় দিব? 🚀",
      title: "নোটিশ পিরিয়ডের ১ নম্বর নিয়ম:",
      text: "নোটিশ পিরিয়ডে `git push origin main` দেওয়া সম্পূর্ণ হারাম! কিছু ক্র্যাশ করলে আমি 404 Not Found! 💀",
      action: () => soundEffects.playSiren(),
    },
    {
      label: "ডকুমেন্টেশন কই? 📜",
      title: "The Code IS the Documentation!",
      text: "কোড লিখতে যখন এত কষ্ট হয়েছে, বুঝতেও একটু কষ্ট হোক! পোস্টম্যান কালেকশন দেখলেই বুঝে যাবেন 🫡",
      action: () => soundEffects.playKaChing(),
    },
    {
      label: "ট্রিট কবে দিবেন? 🍕",
      title: "ট্রিট প্রোটোকল: 404 Not Found",
      text: "২১ অক্টোবর বিকেল ৪:৫৯ মিনিটে বিকাশ চেক কইরেন! আর বনশ্রীর টংয়ের চা তো অলওয়েজ আনলিমিটেড! ☕",
      action: () => soundEffects.playFanfare(),
    },
    {
      label: "মিটিংয়ে কী বলব? ☕",
      title: "মিটিংয়ের সর্বজনীন স্ক্রিপ্ট:",
      text: "মুখে একটাই কথা: 'ডকুমেন্টেশন আর হ্যান্ডওভার গোছাচ্ছি।' (এই একই ডায়লগ বলে পুরো ৩ সপ্তাহ পার!) 🤝",
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

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col items-center text-center">

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
      <div className="w-full bg-slate-900/90 border border-amber-500/40 rounded-3xl p-5 sm:p-7 pb-12 sm:pb-14 shadow-2xl mb-5 relative backdrop-blur-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-base sm:text-lg font-extrabold text-amber-300 mb-2 tracking-wide">
          &ldquo;ভাই তুমি আর কয়দিন আছো?&rdquo; ➔ Live Freedom Ticker ⏳
        </div>

        {/* Humorous Status Speech Bubble */}
        <div className="inline-block bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-2xl mb-5 animate-pulse">
          ডেস্কে বসে কাজের ভান করতেছি... 🥱
        </div>

        {/* Core 4-Card Countdown Grid with Animated Action Seconds Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
          {/* Days */}
          <div className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col items-center justify-center min-h-[130px] sm:min-h-[150px] shadow-md">
            <span className="text-4xl sm:text-6xl font-black font-mono text-amber-400 tracking-tight my-auto">
              {String(timeLeft.days).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
              Days (দিন)
            </span>
          </div>

          {/* Hours */}
          <div className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col items-center justify-center min-h-[130px] sm:min-h-[150px] shadow-md">
            <span className="text-4xl sm:text-6xl font-black font-mono text-orange-400 tracking-tight my-auto">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
              Hours (ঘণ্টা)
            </span>
          </div>

          {/* Mins */}
          <div className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col items-center justify-center min-h-[130px] sm:min-h-[150px] shadow-md">
            <span className="text-4xl sm:text-6xl font-black font-mono text-cyan-400 tracking-tight my-auto">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
              Mins (মিনিট)
            </span>
          </div>

          {/* Secs */}
          <div className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col items-center justify-center min-h-[130px] sm:min-h-[150px] shadow-md relative">
            <span className="text-4xl sm:text-6xl font-black font-mono text-emerald-400 tracking-tight my-auto">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
              Secs (সেকেন্ড)
            </span>
          </div>
        </div>

        {/* 🐱 LIVING OVERLAY: Big Cat, Dustbin, Ninja Cat & Walking Scene */}
        <CatCountdownOverlay seconds={timeLeft.seconds} />
      </div>

      {/* Instant Colleague Response Buttons (Super Funny) */}
      <div className="w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-5 mb-5">
        <h3 className="text-sm font-bold text-white mb-1 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" /> ডেস্কে কলিগদের ইনস্ট্যান্ট জিজ্ঞাসা 💬
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
