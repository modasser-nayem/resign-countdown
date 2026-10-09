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
          📜 Official Freedom Pass & NOC (No Objection Certificate)
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mb-5">
          Download or view the official satirical clearance pass of Ali Modasser Nayem issued by the Department of Notice Period.
        </p>

        <button
          onClick={openPass}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>View Freedom Certificate 🪪</span>
        </button>
      </div>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-950 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-left overflow-hidden">
            {/* Background Stamp Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-8 border-red-500/20 text-red-500/20 font-black text-6xl sm:text-7xl uppercase tracking-widest px-8 py-4 pointer-events-none rounded-2xl select-none">
              APPROVED
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-amber-500/30 pb-4 mb-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  GOVERNMENT OF RESIGNED DEVELOPERS
                </span>
                <h4 className="text-lg sm:text-xl font-black text-white">
                  CERTIFICATE OF FREEDOM & LIBERATION
                </h4>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                NOC-2026-11752
              </span>
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
                  <strong className="text-slate-400">Employee Name:</strong>{" "}
                  <span className="text-white font-bold">{RESIGNATION_DETAILS.name}</span>
                </p>
                <p>
                  <strong className="text-slate-400">Designation:</strong>{" "}
                  <span className="text-amber-400">{RESIGNATION_DETAILS.role}</span>
                </p>
                <p>
                  <strong className="text-slate-400">Company:</strong>{" "}
                  <span>{RESIGNATION_DETAILS.company} (Banasree, Dhaka)</span>
                </p>
                <p>
                  <strong className="text-slate-400">Employee ID:</strong>{" "}
                  <span className="font-mono">{RESIGNATION_DETAILS.employeeId}</span>
                </p>
                <p>
                  <strong className="text-slate-400">Official Liberation:</strong>{" "}
                  <span className="text-emerald-400 font-bold">
                    21 October 2026 @ 5:00 PM Sharp
                  </span>
                </p>
              </div>
            </div>

            {/* Clearance checklist */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 mb-6 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Backend Endpoints: Deployed & handed over in faith</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Postman Collection: Shared in Slack channel</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Laptop & ID Card: Ready to return on 21st Oct 4:55 PM</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tong er mama chai dues: Cleared & approved</span>
              </div>
            </div>

            {/* Footer with stamp & print */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="text-[11px] text-slate-500">
                Issued with best wishes for your next engineering journey! 🚀
              </div>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
