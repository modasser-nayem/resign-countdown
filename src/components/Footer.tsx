import React from "react";
import { Heart, Terminal, Coffee } from "lucide-react";
import { RESIGNATION_DETAILS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 mt-16 py-8 text-center text-xs text-slate-500 bg-slate-950/60 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 space-y-2">
        <div className="flex items-center justify-center gap-2 text-slate-400 font-medium">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span>Exit Code: 0 (Graceful Resignation)</span>
          <span>•</span>
          <Coffee className="w-4 h-4 text-orange-400" />
          <span>Fuel: Banasree Tong-er Cha</span>
        </div>

        <p className="text-slate-500">
          Crafted for{" "}
          <span className="text-slate-300 font-semibold">{RESIGNATION_DETAILS.name}</span>{" "}
          (Executive, Backend @ {RESIGNATION_DETAILS.company}).
        </p>

        <p className="text-[11px] text-slate-600">
          Last Working Day: 21 October 2026, 5:00 PM. Post 5:00 PM, responses will be{" "}
          <code className="text-amber-500/80">HTTP 410 Gone (Permanently)</code>.
        </p>
      </div>
    </footer>
  );
}
