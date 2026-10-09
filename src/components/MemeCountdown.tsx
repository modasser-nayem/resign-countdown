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

// 🐱 Hammer Cat (হাতুড়ে পিন্টু 🔨) pokes, nudges (guta-guti) & smashes with a hammer to crack the minute!
function HammerCatSvg({ isHammering }: { isHammering: boolean }) {
  return (
    <svg viewBox="-10 0 120 120" className="w-full h-full drop-shadow-xl overflow-visible">
      {/* Wagging Tail */}
      <path
        d="M80 90 Q98 75 92 60 Q85 50 78 60"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="6"
        strokeLinecap="round"
        className="animate-pulse"
      />

      {/* Body & Belly */}
      <ellipse cx="50" cy="74" rx="26" ry="22" fill="#fef3c7" stroke="#d97706" strokeWidth="2.5" />
      <ellipse cx="48" cy="76" rx="16" ry="14" fill="#ffffff" />

      {/* Feet perched on card ledge */}
      <ellipse cx="36" cy="94" rx="8" ry="6" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
      <ellipse cx="68" cy="94" rx="8" ry="6" fill="#ffffff" stroke="#d97706" strokeWidth="2" />

      {/* Head */}
      <circle cx="48" cy="42" r="22" fill="#fef3c7" stroke="#d97706" strokeWidth="2.5" />

      {/* Ears */}
      <polygon points="30,28 34,10 44,22" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
      <polygon points="66,28 62,10 52,22" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />

      {/* Yellow Safety Hardhat */}
      <ellipse cx="48" cy="24" rx="18" ry="10" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
      <rect x="28" y="26" width="40" height="4" rx="2" fill="#ca8a04" />
      <circle cx="48" cy="20" r="3" fill="#ffffff" />

      {/* Eyes & Face */}
      {isHammering ? (
        // Determined squinting face when swinging hammer: > <
        <>
          <path d="M36 40 L42 44 L36 48" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M60 40 L54 44 L60 48" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* Gritted teeth */}
          <rect x="42" y="52" width="12" height="6" rx="1.5" fill="#ffffff" stroke="#78350f" strokeWidth="1.2" />
          <line x1="48" y1="52" x2="48" y2="58" stroke="#78350f" strokeWidth="1" />
        </>
      ) : (
        // Playful mischievous face when poking (guta-guti)
        <>
          <ellipse cx="40" cy="42" rx="4" ry="5" fill="#0f172a" />
          <circle cx="39" cy="40" r="1.5" fill="#ffffff" />
          <ellipse cx="58" cy="42" rx="4" ry="5" fill="#0f172a" />
          <circle cx="57" cy="40" r="1.5" fill="#ffffff" />
          {/* W-smile */}
          <path d="M44 52 Q48 55 52 52" fill="none" stroke="#78350f" strokeWidth="1.5" />
        </>
      )}

      {/* Whiskers */}
      <line x1="28" y1="46" x2="16" y2="44" stroke="#b45309" strokeWidth="1.2" />
      <line x1="28" y1="50" x2="16" y2="52" stroke="#b45309" strokeWidth="1.2" />

      {/* TOOL: Heavy Hammer (হাতুড়ি 🔨) OR Pry Chisel (গুঁতাগুঁতি ⛏️) */}
      {isHammering ? (
        // HEAVY CARTOON HAMMER (হাতুড়ি) raised and swinging down!
        <g className="origin-[35px_50px] animate-[hammerSwingDown_0.4s_cubic-bezier(0.2,0.9,0.3,1)_forwards]">
          {/* Wooden Handle */}
          <rect x="18" y="8" width="7" height="42" rx="2" fill="#92400e" stroke="#78350f" strokeWidth="1.5" transform="rotate(-35 20 30)" />
          {/* Heavy Steel Hammer Head */}
          <rect x="0" y="2" width="28" height="15" rx="3" fill="#64748b" stroke="#334155" strokeWidth="2" transform="rotate(-35 14 10)" />
          <rect x="-2" y="4" width="6" height="11" rx="1" fill="#94a3b8" transform="rotate(-35 1 10)" />
          {/* Paws gripping hammer shaft */}
          <ellipse cx="26" cy="38" rx="6" ry="6" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="36" cy="46" rx="6" ry="6" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
        </g>
      ) : (
        // PRY CHISEL / CROWBAR POKING & NUDGING (গুঁতাগুঁতি)
        <g className="animate-[gutaGutiPoke_0.8s_ease-in-out_infinite] origin-[30px_60px]">
          {/* Red pry rod pointing down towards digit */}
          <path d="M12 75 L30 55" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
          <path d="M8 78 L16 70" stroke="#991b1b" strokeWidth="6" strokeLinecap="round" />
          {/* Hands holding rod */}
          <ellipse cx="28" cy="56" rx="5.5" ry="5.5" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="36" cy="62" rx="5.5" ry="5.5" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
        </g>
      )}
    </svg>
  );
}

// 4 distinct trajectory directions for the kicked seconds
const KICK_ANIMATIONS = [
  "animate-[kickedFlyFarTopLeft_1s_cubic-bezier(0.15,0.85,0.25,1)_forwards]",
  "animate-[kickedFlyFarStraightLeft_1s_cubic-bezier(0.15,0.85,0.25,1)_forwards]",
  "animate-[kickedFlyFarHighSky_1s_cubic-bezier(0.15,0.85,0.25,1)_forwards]",
  "animate-[kickedFlyFarTopRight_1s_cubic-bezier(0.15,0.85,0.25,1)_forwards]",
];

const COMIC_WORDS = ["💥 POW!", "💥 HII-YAH!", "💥 WHAM!", "💥 KICK!"];

// Dedicated Vector SVG Ninja Cat (লাথি মারু 🥷)
function NinjaCatSvg({ isKicking }: { isKicking: boolean }) {
  return (
    <svg viewBox="-45 0 170 125" className="w-full h-full drop-shadow-xl overflow-visible">
      {/* Fluttering Headband Ribbon */}
      <path
        d="M20 40 Q8 32 4 45 Q12 48 22 46"
        fill="#0f172a"
        stroke="#dc2626"
        strokeWidth="1.5"
        className="animate-pulse"
      />
      <path
        d="M18 45 Q6 42 2 55 Q10 56 20 50"
        fill="#0f172a"
        stroke="#dc2626"
        strokeWidth="1.5"
      />

      {/* Body & Karate Belt - Recoils back when kicking */}
      <g className={isKicking ? "animate-[karateTorsoRecoil_0.45s_ease-out]" : ""}>
        <ellipse cx="60" cy="85" rx="30" ry="26" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
        <ellipse cx="60" cy="88" rx="18" ry="16" fill="#ffffff" />
        {/* Black Martial Arts Belt */}
        <rect x="34" y="80" width="52" height="8" rx="2" fill="#0f172a" />
        <path d="M56 88 L52 104 M62 88 L64 104" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Karate Kick Dynamic Leg or Standing Stance */}
      {isKicking ? (
        // Dynamic Karate Whip-Thrust Leg: Starts folded at hip, WHIPS out violently, striking with foot!
        <g className="animate-[karateLegWhip_0.45s_cubic-bezier(0.1,0.9,0.2,1)_forwards]">
          {/* Whoosh / Wind Motion Arcs */}
          <path d="M35 98 Q0 90 -28 75" fill="none" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
          <path d="M40 106 Q10 98 -20 85" fill="none" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" opacity="0.9" />

          {/* Extended Leg (Orange fur) */}
          <path d="M45 88 Q15 76 -10 65" stroke="#f59e0b" strokeWidth="16" strokeLinecap="round" />
          <path d="M45 88 Q15 76 -10 65" fill="none" stroke="#d97706" strokeWidth="2.5" />

          {/* Black Ninja Ankle Wrap */}
          <rect x="-14" y="55" width="9" height="19" rx="2" fill="#0f172a" stroke="#dc2626" strokeWidth="1.2" transform="rotate(22 -10 64)" />

          {/* Main White Cat Foot / Paw */}
          <ellipse cx="-24" cy="65" rx="15" ry="12" fill="#ffffff" stroke="#d97706" strokeWidth="2.5" transform="rotate(-15 -24 65)" />

          {/* 4 Pink Paw Toe Beans */}
          <circle cx="-33" cy="57" r="3.5" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
          <circle cx="-32" cy="68" r="3.5" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
          <circle cx="-24" cy="74" r="3.2" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
          <circle cx="-16" cy="74" r="3" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
          {/* Central large pad */}
          <ellipse cx="-22" cy="64" rx="5.5" ry="4.5" fill="#f472b6" opacity="0.9" />

          {/* Sharp White Claws protruding on kick impact! */}
          <path d="M-36 55 L-43 52" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
          <path d="M-36 67 L-43 68" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
          <path d="M-26 77 L-29 84" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />

          {/* Ground supporting foot */}
          <ellipse cx="66" cy="104" rx="9" ry="7" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
        </g>
      ) : (
        // Low crouching martial arts stance
        <g>
          <ellipse cx="44" cy="104" rx="8" ry="6" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="76" cy="104" rx="8" ry="6" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
        </g>
      )}

      {/* Head */}
      <circle cx="60" cy="45" r="28" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />

      {/* Ears */}
      <polygon points="36,30 42,5 58,22" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
      <polygon points="40,27 44,12 54,22" fill="#f472b6" />
      <polygon points="84,30 78,5 62,22" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
      <polygon points="80,27 76,12 66,22" fill="#f472b6" />

      {/* Black Ninja Headband across forehead */}
      <rect x="33" y="32" width="54" height="12" rx="3" fill="#0f172a" />
      {/* Red circular ninja crest in center */}
      <circle cx="60" cy="38" r="4" fill="#dc2626" />

      {/* Determined Ninja Eyes */}
      <ellipse cx="48" cy="46" rx="5" ry="4" fill="#0f172a" />
      <circle cx="47" cy="45" r="1.5" fill="#ffffff" />
      <ellipse cx="72" cy="46" rx="5" ry="4" fill="#0f172a" />
      <circle cx="71" cy="45" r="1.5" fill="#ffffff" />

      {/* Whiskers */}
      <line x1="32" y1="50" x2="18" y2="48" stroke="#b45309" strokeWidth="1.5" />
      <line x1="32" y1="54" x2="18" y2="56" stroke="#b45309" strokeWidth="1.5" />
      <line x1="88" y1="50" x2="102" y2="48" stroke="#b45309" strokeWidth="1.5" />
      <line x1="88" y1="54" x2="102" y2="56" stroke="#b45309" strokeWidth="1.5" />

      {/* Guarding Front Paws */}
      <ellipse cx={isKicking ? "78" : "48"} cy="72" rx="7" ry="8" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
      <ellipse cx={isKicking ? "92" : "74"} cy="72" rx="7" ry="8" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
    </svg>
  );
}

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
  const [isHammering, setIsHammering] = useState(false);
  const [isCracked, setIsCracked] = useState(false);
  const [isRoaming, setIsRoaming] = useState(false);
  const [ninjaKickNum, setNinjaKickNum] = useState<number | null>(null);
  const [kickDirIndex, setKickDirIndex] = useState(0);
  const [dialogContent, setDialogContent] = useState<{ title: string; text: string; sound: () => void } | null>(null);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft());
  const prevSecRef = React.useRef(timeLeft.seconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Quick alternating comic action on the minute card (2.4s cycle: guta-guti ➔ hammer smash ➔ repeat!)
  useEffect(() => {
    const hammerInterval = setInterval(() => {
      setIsHammering(true);
      setTimeout(() => {
        setIsCracked(true);
        soundEffects.playHammerClang();
        setTimeout(() => {
          setIsCracked(false);
          setIsHammering(false);
        }, 850);
      }, 250);
    }, 2400);

    return () => clearInterval(hammerInterval);
  }, []);

  // Trigger Ninja Cat Kick on the SECS card
  const triggerNinjaKick = React.useCallback((secToKick?: number) => {
    const num = secToKick ?? timeLeft.seconds;
    setNinjaKickNum(num);
    setKickDirIndex((prev) => (prev + 1) % 4);
    soundEffects.playKick();
    setTimeout(() => {
      setNinjaKickNum(null);
    }, 450);
  }, [timeLeft.seconds]);

  // While Biltu is roaming with dustbin, Ninja Cat kicks every single second!
  useEffect(() => {
    if (prevSecRef.current === timeLeft.seconds) return;
    const oldSec = prevSecRef.current;
    prevSecRef.current = timeLeft.seconds;

    if (isRoaming) {
      triggerNinjaKick(oldSec);
    }
  }, [timeLeft.seconds, isRoaming, triggerNinjaKick]);

  // Periodic fun kicks every 3.5 seconds when watching
  useEffect(() => {
    const kickInterval = setInterval(() => {
      if (!isRoaming) {
        triggerNinjaKick(timeLeft.seconds);
      }
    }, 3500);
    return () => clearInterval(kickInterval);
  }, [timeLeft.seconds, isRoaming, triggerNinjaKick]);

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

          {/* Mins - Interactive Scene: Digits 100% visible, Pintu pokes (guta-guti) & smashes with hammer (patal/fattle dhoray)! */}
          <div
            onClick={() => {
              setIsHammering(true);
              setTimeout(() => {
                setIsCracked(true);
                soundEffects.playHammerClang();
                setTimeout(() => {
                  setIsCracked(false);
                  setIsHammering(false);
                }, 1500);
              }, 250);
            }}
            className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col items-center justify-center min-h-[130px] sm:min-h-[150px] shadow-md relative overflow-visible cursor-pointer select-none group"
            title="হাতুড়ে পিন্টু গুঁতাগুঁতি করে মাঝে মাঝে হাতুড়ি দিয়ে বাড়ি মেরে ফাটল ধরায়! ক্লিক করুন বাড়ি মারতে!"
          >
            {/* Cartoon Cat (হাতুড়ে পিন্টু 🔨) perched on the TOP-RIGHT ledge - completely clear of the digits! */}
            <div className="absolute -top-7 sm:-top-8 right-1 sm:right-2 w-16 sm:w-18 h-20 sm:h-22 pointer-events-none z-30">
              <HammerCatSvg isHammering={isHammering} />
            </div>

            {/* Impact Spark Flash when hammer strikes */}
            {isCracked && (
              <div className="absolute top-2 right-6 sm:right-8 text-xs sm:text-sm font-black text-amber-300 animate-ping z-40 whitespace-nowrap pointer-events-none">
                💥 CLANG!
              </div>
            )}

            {/* Centered, completely unobstructed and crystal-clear Cyan Minute Number */}
            <div className="relative flex items-center justify-center my-auto w-full px-2">
              <span
                className={`text-4xl sm:text-6xl font-black font-mono text-cyan-400 tracking-tight transition-transform duration-200 select-none ${
                  isCracked
                    ? "animate-[digitImpactShock_0.35s_ease-out]"
                    : isHammering
                    ? "scale-98"
                    : "animate-[digitGutaTremor_1.6s_ease-in-out_infinite]"
                }`}
              >
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>

              {/* ⚡ Glowing Jagged Glass/Acrylic Crack lines across the digits when smashed! */}
              {isCracked && (
                <svg
                  viewBox="0 0 100 80"
                  className="absolute inset-0 w-full h-full pointer-events-none z-30 drop-shadow-[0_0_10px_rgba(34,211,238,0.95)] animate-in fade-in duration-75"
                >
                  <path
                    d="M32 10 L44 26 L36 38 L56 48 L48 70"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M32 10 L44 26 L36 38 L56 48 L48 70"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.8"
                  />
                  {/* Secondary branching crack veins */}
                  <path
                    d="M44 26 L64 22 M36 38 L22 44 M56 48 L72 56 M44 60 L60 68"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M44 26 L64 22 M36 38 L22 44 M56 48 L72 56 M44 60 L60 68"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.65"
                  />
                </svg>
              )}
            </div>

            {/* Label and Character Badge */}
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                Mins (মিনিট)
              </span>
              <span className="text-[8px] font-black text-cyan-300 bg-cyan-950/90 px-1 py-0.2 rounded border border-cyan-500/30">
                হাতুড়ে পিন্টু 🔨
              </span>
            </div>
          </div>

          {/* Secs - Ninja Cat perched on the top-right ledge right beside the unobstructed number! */}
          <div
            onClick={() => triggerNinjaKick(timeLeft.seconds)}
            className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col items-center justify-center min-h-[130px] sm:min-h-[150px] shadow-md relative overflow-visible cursor-pointer select-none group"
            title="লাথি মারু সেকেন্ডের পাশে বসে লাথি মারে! ক্লিক করুন লাথি মারতে!"
          >
            {/* Ninja Cat (লাথি মারু 🥷) perched on the TOP-RIGHT ledge - completely clear of the digits! */}
            <div className="absolute -top-7 sm:-top-8 right-1 sm:right-2 w-16 sm:w-18 h-20 sm:h-22 pointer-events-none z-30">
              <NinjaCatSvg isKicking={ninjaKickNum !== null} />

              {/* Comic Impact Burst */}
              {ninjaKickNum !== null && (
                <div className="absolute top-1 -left-10 text-xs sm:text-sm font-black text-amber-300 animate-ping z-40 whitespace-nowrap drop-shadow-md">
                  {COMIC_WORDS[kickDirIndex % COMIC_WORDS.length]}
                </div>
              )}
            </div>

            {/* Kicked Number Badge flying out in 4 directions */}
            {ninjaKickNum !== null && (
              <div
                key={`ninja-kick-${ninjaKickNum}-${kickDirIndex}`}
                className={`absolute top-2 -left-6 z-50 pointer-events-none ${
                  KICK_ANIMATIONS[kickDirIndex % KICK_ANIMATIONS.length]
                }`}
              >
                <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 text-white font-black font-mono text-sm sm:text-base shadow-2xl border-2 border-yellow-200 flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-base sm:text-lg">🐾</span>
                  <span>{String(ninjaKickNum).padStart(2, "0")}s</span>
                  <span>💨</span>
                </div>
              </div>
            )}

            {/* Completely unobstructed, crystal-clear Emerald Seconds Digit */}
            <div className="relative flex items-center justify-center my-auto w-full px-2">
              <span className="text-4xl sm:text-6xl font-black font-mono text-emerald-400 tracking-tight my-auto select-none">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>

            {/* Label and Character Badge */}
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                Secs (সেকেন্ড)
              </span>
              <span className="text-[8px] font-black text-emerald-400 bg-emerald-950/90 px-1 py-0.2 rounded border border-emerald-500/30">
                লাথি মারু 🥷
              </span>
            </div>
          </div>
        </div>

        {/* 🐱 LIVING OVERLAY: Big Cat, Dustbin, and Walking Scene */}
        <CatCountdownOverlay
          seconds={timeLeft.seconds}
          onRoamingChange={(roaming) => setIsRoaming(roaming)}
        />
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

      {/* Keyframe animations for Minute Poking (Guta-guti), Hammer Strike & Glass Cracks */}
      <style jsx>{`
        /* Guta-guti poking & nudging motion */
        @keyframes gutaGutiPoke {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          30% {
            transform: translate(-3px, 2px) rotate(-6deg);
          }
          60% {
            transform: translate(-1px, 1px) rotate(-2deg);
          }
          80% {
            transform: translate(-4px, 3px) rotate(-8deg);
          }
        }

        /* Subtle tremor on the digit when poked */
        @keyframes digitGutaTremor {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          30% {
            transform: translate(-1px, 0.5px) rotate(-0.8deg);
          }
          60% {
            transform: translate(0.5px, -0.5px) rotate(0.4deg);
          }
          80% {
            transform: translate(-1.5px, 0.8px) rotate(-1.2deg);
          }
        }

        /* Hammer swing down strike */
        @keyframes hammerSwingDown {
          0% {
            transform: translate(12px, -18px) rotate(-55deg) scale(0.9);
          }
          35% {
            transform: translate(6px, -10px) rotate(-20deg) scale(1.1);
          }
          75% {
            transform: translate(-10px, 14px) rotate(40deg) scale(1.25);
          }
          100% {
            transform: translate(-5px, 9px) rotate(22deg) scale(1.05);
          }
        }

        /* Violent shockwave vibration on the digit when smashed by hammer */
        @keyframes digitImpactShock {
          0% {
            transform: scale(1) translate(0, 0);
          }
          20% {
            transform: scale(1.08) translate(-3px, 4px) rotate(-3deg);
          }
          40% {
            transform: scale(0.96) translate(3px, -2px) rotate(2deg);
          }
          60% {
            transform: scale(1.04) translate(-2px, 2px) rotate(-1.5deg);
          }
          80% {
            transform: scale(0.98) translate(1px, -1px) rotate(0.5deg);
          }
          100% {
            transform: scale(1) translate(0, 0) rotate(0deg);
          }
        }
        /* Keyframe animations for Ninja Cat Karate Kick */
        @keyframes karateLegWhip {
          0% {
            transform: translate(25px, 15px) scale(0.3) rotate(35deg);
            opacity: 0.4;
          }
          35% {
            transform: translate(-10px, -4px) scale(1.2) rotate(-10deg);
            opacity: 1;
          }
          65% {
            transform: translate(-5px, -2px) scale(1.1) rotate(-6deg);
            opacity: 1;
          }
          100% {
            transform: translate(15px, 10px) scale(0.6) rotate(20deg);
            opacity: 0.7;
          }
        }

        @keyframes karateTorsoRecoil {
          0% {
            transform: rotate(0deg);
          }
          30% {
            transform: rotate(8deg) translate(3px, 2px);
          }
          70% {
            transform: rotate(4deg) translate(2px, 1px);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        /* Trajectories for kicked seconds */
        @keyframes kickedFlyFarTopLeft {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          25% {
            transform: translate(-70px, -50px) scale(1.25) rotate(-60deg);
          }
          55% {
            transform: translate(-240px, -180px) scale(1.05) rotate(-280deg);
          }
          85% {
            transform: translate(-420px, -320px) scale(0.7) rotate(-560deg);
            opacity: 0.85;
          }
          100% {
            transform: translate(-580px, -440px) scale(0.2) rotate(-780deg);
            opacity: 0;
          }
        }

        @keyframes kickedFlyFarStraightLeft {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          25% {
            transform: translate(-90px, -15px) scale(1.25) rotate(-45deg);
          }
          55% {
            transform: translate(-320px, -30px) scale(1.05) rotate(-360deg);
          }
          85% {
            transform: translate(-560px, -50px) scale(0.7) rotate(-720deg);
            opacity: 0.85;
          }
          100% {
            transform: translate(-780px, -70px) scale(0.2) rotate(-1080deg);
            opacity: 0;
          }
        }

        @keyframes kickedFlyFarHighSky {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          25% {
            transform: translate(-40px, -90px) scale(1.25) rotate(45deg);
          }
          55% {
            transform: translate(-80px, -260px) scale(1.05) rotate(240deg);
          }
          85% {
            transform: translate(-120px, -420px) scale(0.65) rotate(520deg);
            opacity: 0.85;
          }
          100% {
            transform: translate(-150px, -560px) scale(0.2) rotate(760deg);
            opacity: 0;
          }
        }

        @keyframes kickedFlyFarTopRight {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          25% {
            transform: translate(40px, -60px) scale(1.25) rotate(60deg);
          }
          55% {
            transform: translate(160px, -200px) scale(1.05) rotate(320deg);
          }
          85% {
            transform: translate(300px, -340px) scale(0.7) rotate(620deg);
            opacity: 0.85;
          }
          100% {
            transform: translate(440px, -480px) scale(0.2) rotate(880deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
