"use client";

import React, { useEffect, useState, useRef } from "react";
import { soundEffects } from "@/lib/audio";

interface CatCountdownOverlayProps {
  seconds: number;
}

// Reusable SVG Biltu component for 100% design consistency
function BiltuCatSvg({
  isGrabbing,
  isCarryingOnHead,
  isDumping,
}: {
  isGrabbing?: boolean;
  isCarryingOnHead?: boolean;
  isDumping?: boolean;
}) {
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
      {/* Wagging Tail */}
      <path
        d={isDumping ? "M75 92 Q96 72 92 50 Q86 42 78 55" : "M75 100 Q95 85 92 65 Q88 55 80 68"}
        fill="none"
        stroke="#f59e0b"
        strokeWidth="8"
        strokeLinecap="round"
        className="animate-pulse"
      />

      {/* Body & White Belly */}
      <ellipse cx="50" cy="85" rx="32" ry="28" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
      <ellipse cx="50" cy="88" rx="20" ry="18" fill="#ffffff" />

      {/* Head */}
      <circle cx="50" cy="45" r="28" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />

      {/* Ears */}
      <polygon points="26,30 32,5 48,22" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
      <polygon points="30,27 34,12 44,22" fill="#f472b6" />
      <polygon points="74,30 68,5 52,22" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
      <polygon points="70,27 66,12 56,22" fill="#f472b6" />

      {/* Eyes: When dumping, eyes look downwards with focus at dustbin */}
      {isDumping ? (
        <>
          <ellipse cx="38" cy="46" rx="5" ry="6" fill="#0f172a" />
          <circle cx="37" cy="48" r="2" fill="#ffffff" />
          <ellipse cx="62" cy="46" rx="5" ry="6" fill="#0f172a" />
          <circle cx="61" cy="48" r="2" fill="#ffffff" />
        </>
      ) : (
        <>
          <ellipse cx="38" cy="42" rx="5" ry="6" fill="#0f172a" />
          <circle cx="36" cy="40" r="2" fill="#ffffff" />
          <ellipse cx="62" cy="42" rx="5" ry="6" fill="#0f172a" />
          <circle cx="60" cy="40" r="2" fill="#ffffff" />
        </>
      )}

      {/* Nose & Smile */}
      <polygon points="48,50 52,50 50,53" fill="#f472b6" />
      <path d="M46 53 Q50 57 54 53" fill="none" stroke="#78350f" strokeWidth="2" />

      {/* Whiskers */}
      <line x1="22" y1="48" x2="8" y2="45" stroke="#b45309" strokeWidth="1.5" />
      <line x1="22" y1="52" x2="8" y2="54" stroke="#b45309" strokeWidth="1.5" />
      <line x1="78" y1="48" x2="92" y2="45" stroke="#b45309" strokeWidth="1.5" />
      <line x1="78" y1="52" x2="92" y2="54" stroke="#b45309" strokeWidth="1.5" />

      {/* Paws */}
      {isDumping ? (
        // Paws extended downwards holding the dustbin below him!
        <>
          <ellipse cx="36" cy="98" rx="8" ry="7" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="64" cy="98" rx="8" ry="7" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
        </>
      ) : isCarryingOnHead ? (
        // Raised paws supporting the dustbin on top of head!
        <>
          <ellipse cx="32" cy="20" rx="7" ry="9" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="68" cy="20" rx="7" ry="9" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
        </>
      ) : isGrabbing ? (
        // Reaching up towards the second number
        <>
          <ellipse cx="32" cy="48" rx="7" ry="9" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="48" cy="48" rx="7" ry="9" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
        </>
      ) : (
        // Resting front paws
        <>
          <ellipse cx="38" cy="78" rx="7" ry="9" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="62" cy="78" rx="7" ry="9" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

// Dedicated Vector SVG Ninja Cat (লাথি মারু) - Custom designed karate martial artist!
function NinjaCatSvg({ isKicking }: { isKicking: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-2xl">
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

      {/* Body & Karate Belt */}
      <ellipse cx="60" cy="85" rx="30" ry="26" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
      <ellipse cx="60" cy="88" rx="18" ry="16" fill="#ffffff" />
      {/* Black Martial Arts Belt */}
      <rect x="34" y="80" width="52" height="8" rx="2" fill="#0f172a" />
      <path d="M56 88 L52 104 M62 88 L64 104" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

      {/* Karate Kick Extended Leg or Fighting Stance */}
      {isKicking ? (
        // Extended high side-kick leg kicking towards left!
        <g className="animate-pulse">
          <path d="M40 85 Q15 75 2 65" stroke="#d97706" strokeWidth="14" strokeLinecap="round" />
          <ellipse cx="2" cy="65" rx="8" ry="6" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
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

// Reusable Metallic Dustbin Component
function MetallicDustbin({ binCount }: { binCount: number }) {
  return (
    <div className="flex flex-col items-center">
      {/* Dustbin Lid (Mouth rim) */}
      <div className="w-13 sm:w-15 h-3 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-t-md border border-slate-300 shadow">
        <div className="w-3 h-1 bg-slate-700 mx-auto -mt-1 rounded-t" />
      </div>
      {/* Dustbin Body */}
      <div className="w-11 sm:w-13 h-14 sm:h-16 bg-gradient-to-b from-slate-600 via-slate-800 to-slate-950 border-2 border-slate-400 rounded-b-xl shadow-2xl flex flex-col items-center justify-between py-1 relative">
        <div className="w-full flex justify-around px-1 opacity-30">
          <div className="w-0.5 h-6 bg-slate-300" />
          <div className="w-0.5 h-6 bg-slate-300" />
          <div className="w-0.5 h-6 bg-slate-300" />
        </div>
        <span className="text-[9px] font-black font-mono text-amber-300 bg-slate-950/90 px-1 rounded border border-slate-700 shadow">
          🗑️ {binCount}
        </span>
      </div>
    </div>
  );
}

export default function CatCountdownOverlay({ seconds }: CatCountdownOverlayProps) {
  const prevSecRef = useRef<number>(seconds);
  const [activeNum, setActiveNum] = useState<number>(seconds);

  // States: 'idle' | 'grabbing' | 'walking' | 'dumping' | 'returning'
  const [phase, setPhase] = useState<"idle" | "grabbing" | "walking" | "dumping" | "returning">("idle");
  const [isRoaming, setIsRoaming] = useState<boolean>(false);
  const [binCount, setBinCount] = useState<number>(0);
  const [erasingNumbers, setErasingNumbers] = useState<number[]>([]);
  const [ninjaKickNum, setNinjaKickNum] = useState<number | null>(null);

  // 16-Second Grand Roam:
  // Goes UPWARDS first -> Circles across top -> Comes DOWNWARDS -> Dumps waste downwards from mouth!
  const start16SecRoamAndDump = () => {
    if (isRoaming) return;
    setIsRoaming(true);
    setPhase("walking");

    // Phase 1: Walks UP along right edge, crosses top, comes DOWN to lower-left (0s - 8.8s)
    setTimeout(() => {
      // Phase 2: At lower-left, holds dustbin BELOW him and dumps directly from mouth downwards! (8.8s - 12.6s)
      setPhase("dumping");
      soundEffects.playCannon();
      // 5 collected seconds pour out of the dustbin mouth one by one
      setErasingNumbers([
        (seconds + 19) % 60,
        (seconds + 14) % 60,
        (seconds + 9) % 60,
        (seconds + 4) % 60,
        seconds,
      ]);
    }, 8800);

    // Phase 3: Empty bin upright on head, waddles along bottom border back home (12.6s - 16s)
    setTimeout(() => {
      setPhase("returning");
      setBinCount(0);
    }, 12600);

    // Phase 4: Back at desk (16s)
    setTimeout(() => {
      setIsRoaming(false);
      setPhase("idle");
      setErasingNumbers([]);
    }, 16000);
  };

  useEffect(() => {
    if (prevSecRef.current === seconds) return;
    const oldSec = prevSecRef.current;
    prevSecRef.current = seconds;
    setActiveNum(oldSec);

    // EXACT USER SPECIFICATION: Collect for 20 seconds, then roam & dump!
    if (seconds % 20 === 0 && !isRoaming) {
      start16SecRoamAndDump();
      return;
    }

    // While Biltu is on his roaming journey:
    // Ninja Cat kicks incoming seconds visibly flying out of the website!
    if (isRoaming) {
      setNinjaKickNum(oldSec);
      soundEffects.playKick();
      const kickTimer = setTimeout(() => {
        setNinjaKickNum(null);
      }, 750);
      return () => clearTimeout(kickTimer);
    }

    // EXACT USER SPECIFICATION: Every 3 seconds (seconds % 3 === 0)
    // Biltu pulls the second from the top down into the dustbin!
    if (seconds % 3 === 0 && !isRoaming) {
      setPhase("grabbing");
      soundEffects.playTrashDrop();
      setBinCount((prev) => Math.min(prev + 1, 50));

      const grabTimer = setTimeout(() => {
        setPhase("idle");
      }, 950);
      return () => clearTimeout(grabTimer);
    }
  }, [seconds, isRoaming]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
      
      {/* ========================================================================= */}
      {/* 🐱 STATIONARY AT DESK: BILTU & METALLIC DUSTBIN */}
      {/* ========================================================================= */}
      {!isRoaming && (
        <div
          onClick={start16SecRoamAndDump}
          className="absolute -bottom-7 sm:-bottom-8 right-0 sm:right-2 flex items-end gap-2.5 pointer-events-auto cursor-pointer group select-none transition-transform duration-300 hover:scale-105"
          title="বিল্টুতে ক্লিক করলেই উপরে গিয়ে ঘুরে নিচে এসে ডাস্টবিনের মুখ দিয়ে ময়লা ফেলবে!"
        >
          {/* Metallic Dustbin */}
          <MetallicDustbin binCount={binCount} />

          {/* Biltu Cat */}
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-20 sm:w-20 sm:h-24 transition-transform duration-200 ${
                phase === "grabbing" ? "-translate-y-3 scale-105" : "translate-y-0"
              }`}
            >
              <BiltuCatSvg isGrabbing={phase === "grabbing"} isCarryingOnHead={false} />
            </div>

            <span className="text-[10px] font-extrabold text-amber-300 mt-0.5 bg-slate-900/95 px-2 py-0.5 rounded-full border border-amber-500/40 shadow">
              বিল্টু 🐱
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🫲 [NUM] 🫱 TWO HANDS PULLING THE NUMBER DOWN FROM TOP INTO DUSTBIN */}
      {/* ========================================================================= */}
      {!isRoaming && phase === "grabbing" && (
        <div
          key={`grab-${activeNum}-${seconds}`}
          className="absolute right-8 sm:right-14 bottom-22 sm:bottom-26 animate-[pullDownFromTopIntoDustbin_0.9s_cubic-bezier(0.25,0.8,0.25,1)_forwards] z-30 pointer-events-none"
        >
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 font-black font-mono text-sm sm:text-base shadow-2xl border-2 border-white">
            <span className="text-base sm:text-lg animate-pulse">🫲</span>
            <span>{String(activeNum).padStart(2, "0")}s</span>
            <span className="text-base sm:text-lg animate-pulse">🫱</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚶‍♂️🐱 16-SECOND GRAND ROAMING: */}
      {/* GOES UPWARDS -> CIRCLES TOP -> COMES DOWNWARDS -> DUSTBIN BELOW CAT -> DUMPS FROM MOUTH! */}
      {/* ========================================================================= */}
      {isRoaming && (
        <div className="absolute inset-0">
          
          <div className="absolute -bottom-8 right-2 roam-container flex flex-col items-center z-40 select-none">
            {phase === "dumping" ? (
              /* DUMPING VIEW: Cat on TOP, Dustbin BELOW cat, Borjo pouring DOWNWARDS from mouth! */
              <div className="flex flex-col items-center">
                {/* 1. Biltu looking down with paws extended downward */}
                <div className="w-16 h-20 sm:w-20 sm:h-24">
                  <BiltuCatSvg isGrabbing={false} isCarryingOnHead={false} isDumping={true} />
                </div>

                <span className="text-[10px] font-black text-amber-300 bg-slate-950/95 px-2 py-0.5 rounded-full border border-slate-700 shadow -mt-1 mb-1">
                  বিল্টু 🐱
                </span>

                {/* 2. Dustbin BELOW Biltu ('cat dasbinta cat er niser dike thakbe') */}
                <div className="relative flex flex-col items-center">
                  {/* Tilted dustbin upside-down so the open mouth points DOWNWARDS */}
                  <div className="transform rotate-180 scale-110 drop-shadow-2xl">
                    <MetallicDustbin binCount={0} />
                  </div>

                  {/* 3. Borjo (waste numbers) pouring DOWNWARDS directly from the mouth! */}
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 w-48 flex items-center justify-center pointer-events-none z-50">
                    {erasingNumbers.map((num, i) => (
                      <div
                        key={i}
                        className="absolute top-0 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 text-slate-950 font-black font-mono text-xs sm:text-sm shadow-2xl border-2 border-white whitespace-nowrap opacity-0 animate-[pourDownAndSlowErase_3.6s_cubic-bezier(0.25,0.8,0.25,1)_forwards]"
                        style={{ animationDelay: `${i * 260}ms` }}
                      >
                        {String(num).padStart(2, "0")}s 💨
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* WALKING / RETURNING VIEW: Dustbin ON HEAD */
              <div className="flex flex-col items-center">
                {/* Dustbin ON TOP of head */}
                <div className="relative">
                  <MetallicDustbin binCount={binCount} />
                </div>

                {/* Biltu with paws raised supporting bin on head */}
                <div className="w-16 h-20 sm:w-20 sm:h-24 -mt-3">
                  <BiltuCatSvg isGrabbing={false} isCarryingOnHead={true} isDumping={false} />
                </div>

                <span className="text-[10px] font-black text-amber-300 bg-slate-950/95 px-2 py-0.5 rounded-full border border-slate-700 shadow -mt-1">
                  বিল্টু 🐱
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🥷 NINJA CAT (লাথি মারু): KICKING SECONDS VISIBLY OUT OF THE WEBSITE */}
      {/* ========================================================================= */}
      {isRoaming && (
        <div className="absolute -bottom-7 sm:-bottom-8 right-2 sm:right-6 flex flex-col items-center z-30 select-none">
          <div className="w-20 h-24 sm:w-24 sm:h-28 relative">
            <NinjaCatSvg isKicking={ninjaKickNum !== null} />

            {/* Comic Impact Burst */}
            {ninjaKickNum !== null && (
              <div className="absolute top-4 -left-6 text-sm sm:text-base font-black text-amber-300 animate-ping z-40">
                💥 POW!
              </div>
            )}
          </div>

          {/* Kicked Number Badge: VISIBLY FLIES SPINNING WAY OUT OF THE WEBSITE! */}
          {ninjaKickNum !== null && (
            <div
              key={`ninja-kick-${ninjaKickNum}-${seconds}`}
              className="absolute top-2 right-12 animate-[kickedFlyFarOutOfScreen_0.8s_cubic-bezier(0.1,0.8,0.2,1)_forwards] z-50 pointer-events-none"
            >
              <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 text-white font-black font-mono text-base shadow-2xl border-2 border-yellow-200 flex items-center gap-1">
                <span>🦵</span>
                <span>{String(ninjaKickNum).padStart(2, "0")}s</span>
                <span>💨</span>
              </div>
            </div>
          )}

          <span className="text-[10px] font-extrabold text-emerald-400 mt-0.5 bg-slate-900/95 px-2 py-0.5 rounded-full border border-emerald-500/40 shadow">
            লাথি মারু 🥷
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CSS KEYFRAMES */}
      {/* ========================================================================= */}
      <style jsx>{`
        /* 3-second pull down from top (SECS number) down into the Dustbin */
        @keyframes pullDownFromTopIntoDustbin {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1.1);
          }
          35% {
            transform: translate(-10px, 35px) scale(0.95);
          }
          70% {
            transform: translate(-18px, 75px) scale(0.7) rotate(10deg);
          }
          100% {
            opacity: 0;
            transform: translate(-22px, 98px) scale(0.2) rotate(25deg);
          }
        }

        /* Responsive roaming animation container */
        .roam-container {
          animation: catRoamUpAcrossDownAndDump 16s ease-in-out forwards;
        }

        /* 16-second roaming:
           Upwards first -> Roams across top -> Comes downwards -> Dumps downwards from mouth -> Returns */
        @keyframes catRoamUpAcrossDownAndDump {
          0% {
            /* Start: Bottom-Right desk */
            transform: translate(0, 0) scale(1);
          }
          18% {
            /* UPWARDS along right edge to Top-Right */
            transform: translate(0, -185px) scale(1.05);
          }
          32% {
            /* Roams across top edge to Top-Center */
            transform: translate(-200px, -200px) scale(1.1);
          }
          46% {
            /* Roams across top edge to Top-Left */
            transform: translate(-380px, -185px) scale(1.1);
          }
          55% {
            /* Comes DOWNWARDS to Lower-Left */
            transform: translate(-380px, -35px) scale(1.2);
          }
          58% {
            /* DUMPING: Tilted dustbin held BELOW cat, mouth facing DOWN */
            transform: translate(-380px, -35px) scale(1.25);
          }
          76% {
            /* Finishes dumping waste */
            transform: translate(-380px, -35px) scale(1.25);
          }
          82% {
            /* Empty dustbin placed back upright on head */
            transform: translate(-380px, -30px) scale(1.15);
          }
          92% {
            /* Waddles along bottom edge back towards desk */
            transform: translate(-160px, 0px) scale(1.05);
          }
          100% {
            /* Back home at desk */
            transform: translate(0, 0) scale(1);
          }
        }

        /* Mobile adaptation for narrower screens */
        @media (max-width: 639px) {
          @keyframes catRoamUpAcrossDownAndDump {
            0% {
              transform: translate(0, 0) scale(0.95);
            }
            18% {
              transform: translate(0, -165px) scale(1);
            }
            32% {
              transform: translate(-120px, -175px) scale(1.05);
            }
            46% {
              transform: translate(-240px, -165px) scale(1.05);
            }
            55% {
              transform: translate(-240px, -25px) scale(1.1);
            }
            58% {
              transform: translate(-240px, -25px) scale(1.15);
            }
            76% {
              transform: translate(-240px, -25px) scale(1.15);
            }
            82% {
              transform: translate(-240px, -20px) scale(1.05);
            }
            92% {
              transform: translate(-100px, 0px) scale(1);
            }
            100% {
              transform: translate(0, 0) scale(0.95);
            }
          }
        }

        /* Numbers pouring DOWNWARDS directly out of dustbin mouth towards the floor and slowly erasing */
        @keyframes pourDownAndSlowErase {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.6) rotate(0deg);
            filter: blur(0px);
          }
          8% {
            opacity: 1;
            transform: translate(0, 15px) scale(1) rotate(10deg);
            filter: blur(0px);
          }
          35% {
            opacity: 0.95;
            transform: translate(-10px, 60px) scale(0.95) rotate(35deg);
            filter: blur(0px);
          }
          60% {
            opacity: 0.75;
            transform: translate(-18px, 115px) scale(0.8) rotate(75deg);
            filter: blur(1px);
          }
          80% {
            opacity: 0.4;
            transform: translate(-24px, 170px) scale(0.6) rotate(120deg);
            filter: blur(3px);
          }
          92% {
            opacity: 0.15;
            transform: translate(-28px, 220px) scale(0.35) rotate(165deg);
            filter: blur(5px);
          }
          100% {
            opacity: 0;
            transform: translate(-30px, 260px) scale(0.1) rotate(200deg);
            filter: blur(8px);
          }
        }

        /* Ninja kick: Second visibly flies spinning UP and FAR OUT of the website! */
        @keyframes kickedFlyFarOutOfScreen {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          20% {
            transform: translate(-40px, -30px) scale(1.25) rotate(-45deg);
          }
          50% {
            transform: translate(-160px, -120px) scale(1) rotate(-220deg);
          }
          80% {
            transform: translate(-340px, -240px) scale(0.7) rotate(-520deg);
            opacity: 0.8;
          }
          100% {
            transform: translate(-520px, -360px) scale(0.2) rotate(-720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
