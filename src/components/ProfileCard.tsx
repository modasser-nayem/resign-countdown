"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Building2, BadgeCheck, Phone, Mail, Sparkles, Briefcase } from "lucide-react";
import { RESIGNATION_DETAILS, FUNNY_MOODS } from "@/lib/constants";
import { soundEffects } from "@/lib/audio";

export default function ProfileCard() {
  const [isHonestMode, setIsHonestMode] = useState(false);
  const [photoSelected, setPhotoSelected] = useState<"square" | "full">("square");

  const toggleMood = () => {
    soundEffects.playPop();
    setIsHonestMode(!isHonestMode);
  };

  const moodData = isHonestMode ? FUNNY_MOODS.freedom : FUNNY_MOODS.work;

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center md:items-start relative z-10">
          {/* Profile Picture with animated border */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden ring-4 ring-amber-500/40 shadow-2xl bg-slate-800 relative transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={photoSelected === "square" ? RESIGNATION_DETAILS.profilePhoto : RESIGNATION_DETAILS.fullPhoto}
                  alt={RESIGNATION_DETAILS.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Status Indicator badge */}
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full border-2 border-slate-900 shadow-md flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping inline-block" />
                <span>Notice Period</span>
              </div>
            </div>

            {/* Photo View Switcher */}
            <div className="flex gap-2 mt-4 text-xs font-medium text-slate-400">
              <button
                onClick={() => setPhotoSelected("square")}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  photoSelected === "square"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-slate-800/80 hover:bg-slate-700 border-slate-700"
                }`}
              >
                Avatar View
              </button>
              <button
                onClick={() => setPhotoSelected("full")}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  photoSelected === "full"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-slate-800/80 hover:bg-slate-700 border-slate-700"
                }`}
              >
                Full Photo
              </button>
            </div>
          </div>

          {/* Details & Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> {RESIGNATION_DETAILS.company}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1.5">
                <BadgeCheck className="w-3.5 h-3.5" /> ID: {RESIGNATION_DETAILS.employeeId}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                📍 Banasree, Rampura
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {RESIGNATION_DETAILS.name}
            </h2>
            <p className="text-amber-400 font-semibold text-sm sm:text-base mb-4">
              {RESIGNATION_DETAILS.role} (The Backend Architect)
            </p>

            {/* Mode Toggle Switch */}
            <div className="bg-slate-900/90 rounded-2xl p-3.5 sm:p-4 border border-slate-800 mb-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-2.5 mb-2.5">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                  {isHonestMode ? (
                    <Sparkles className="w-4 h-4 text-orange-400" />
                  ) : (
                    <Briefcase className="w-4 h-4 text-blue-400" />
                  )}
                  Current Mindset Mode:
                </span>

                <button
                  onClick={toggleMood}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 border ${
                    isHonestMode
                      ? "bg-orange-500 text-slate-950 border-orange-400 shadow-md shadow-orange-500/30"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
                  }`}
                >
                  <span>{isHonestMode ? "🔥 Azadi Mode Active" : "👔 Official Mode"}</span>
                  <span className="text-[10px] opacity-80">(Click to Switch)</span>
                </button>
              </div>

              <div className="text-sm font-bold text-amber-300 mb-1">
                {moodData.status}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;{moodData.description}&rdquo;
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                <div>
                  <span className="text-slate-500">Commit Style:</span>{" "}
                  <span className="text-slate-300 font-mono text-[11px] block sm:inline">
                    {moodData.commitStatus}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Chai Consumption:</span>{" "}
                  <span className="text-amber-400 font-medium block sm:inline">
                    {moodData.coffeeCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Contacts & Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400">
              <a
                href={`mailto:${RESIGNATION_DETAILS.email}`}
                className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" /> {RESIGNATION_DETAILS.email}
              </a>
              <a
                href={`tel:${RESIGNATION_DETAILS.phone}`}
                className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> {RESIGNATION_DETAILS.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
