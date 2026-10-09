import React from "react";
import { Terminal, Coffee } from "lucide-react";
import { RESIGNATION_DETAILS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 mt-12 py-8 text-center text-xs text-slate-400 bg-slate-950/70 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 space-y-2">
        <div className="flex items-center justify-center gap-2 text-slate-300 font-medium">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span>সফল দায়িত্ব সমাপনী ও বিদায়</span>
          <span>•</span>
          <Coffee className="w-4 h-4 text-orange-400" />
          <span>বনশ্রীর মধুর স্মৃতি</span>
        </div>

        <p className="text-slate-400">
          ভালোবাসা ও শুভকামনায় নিবেদিত:{" "}
          <span className="text-white font-semibold">{RESIGNATION_DETAILS.name}</span>{" "}
          ({RESIGNATION_DETAILS.role} • {RESIGNATION_DETAILS.company})।
        </p>

        <p className="text-[11px] text-slate-500">
          শেষ কর্মদিবস: ২১ অক্টোবর ২০২৬, বিকাল ৫:০০ টা। নতুন ঠিকানায় আপনার উত্তরোত্তর সাফল্য ও সমৃদ্ধি কাম্য! 🌟
        </p>
      </div>
    </footer>
  );
}
