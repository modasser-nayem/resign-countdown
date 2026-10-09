"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Volume2, Pizza, PartyPopper, Bell, Music, HeartHandshake } from "lucide-react";
import { soundEffects } from "@/lib/audio";

export default function Soundboard() {
  const [treatClaims, setTreatClaims] = useState(48);
  const [lastClaimTime, setLastClaimTime] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("nayem_treat_claims");
    if (saved) {
      setTreatClaims(parseInt(saved, 10));
    }
  }, []);

  const handleClaimTreat = () => {
    const nextCount = treatClaims + 1;
    setTreatClaims(nextCount);
    localStorage.setItem("nayem_treat_claims", nextCount.toString());
    setLastClaimTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    soundEffects.playKaChing();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#f59e0b", "#ef4444", "#10b981"],
    });
  };

  const sounds = [
    {
      name: "Freedom Fanfare 🎺",
      action: () => {
        soundEffects.playFanfare();
        confetti({ particleCount: 30, spread: 50 });
      },
      desc: "Celebration sound when 5:00 PM hits",
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 hover:border-amber-400",
    },
    {
      name: "Emergency Siren 🚨",
      action: () => soundEffects.playSiren(),
      desc: "When someone says 'Eta emergency deploy'",
      color: "from-red-500/20 to-pink-500/20 border-red-500/30 hover:border-red-400",
    },
    {
      name: "Sad Violin 🎻",
      action: () => soundEffects.playSadViolin(),
      desc: "For the junior dev left behind with the legacy code",
      color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30 hover:border-blue-400",
    },
    {
      name: "Ka-Ching 💰",
      action: () => soundEffects.playKaChing(),
      desc: "Sound of final settlement / Provident Fund",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 hover:border-emerald-400",
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Soundboard Column */}
        <div className="glass-card rounded-3xl p-6 border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-bold text-white">Office Soundboard 🔊</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Click to trigger instant sound effects during your office meetings!
            </p>

            <div className="grid grid-cols-2 gap-3">
              {sounds.map((snd, idx) => (
                <button
                  key={idx}
                  onClick={snd.action}
                  className={`p-3.5 rounded-2xl bg-gradient-to-br ${snd.color} border text-left transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer flex flex-col justify-between h-28`}
                >
                  <span className="font-bold text-sm text-slate-100">{snd.name}</span>
                  <span className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                    {snd.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Powered by Web Audio API</span>
            <span className="text-amber-400/80">100% Client-side synth</span>
          </div>
        </div>

        {/* Treat Claimer Column */}
        <div className="glass-card rounded-3xl p-6 border border-slate-700/60 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Pizza className="w-5 h-5 text-orange-400" />
              <h3 className="text-xl font-bold text-white">Treat Dabi Meter 🍕</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Colleagues claiming their farewell feast from Nayem Bhai!
            </p>

            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 text-center mb-4">
              <div className="text-4xl sm:text-5xl font-black font-mono text-orange-400 mb-1">
                {treatClaims}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                People demanding Kacchi / Pizza
              </div>
              {lastClaimTime && (
                <div className="text-[11px] text-emerald-400 mt-2">
                  ✅ Last claimed today at {lastClaimTime}
                </div>
              )}
            </div>

            <button
              onClick={handleClaimTreat}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-orange-500/25 transition-all transform hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Nayem Bhai, Treat Chai! (+1 Dabi)</span>
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
            *Treat condition: Must be present on or before 21 Oct 2026, 4:59 PM!
          </div>
        </div>
      </div>
    </section>
  );
}
