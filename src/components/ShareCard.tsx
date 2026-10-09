"use client";

import React, { useState } from "react";
import { Share2, Copy, Check, MessageCircle, Send } from "lucide-react";
import { soundEffects } from "@/lib/audio";
import confetti from "canvas-confetti";

export default function ShareCard() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      soundEffects.playKaChing();
      confetti({ particleCount: 40, spread: 50 });
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareText = encodeURIComponent(
    "Ali Modasser Nayem bhai r koydin ache office e? Live Resignation Countdown dekhe nin! ⏳😂 21 Oct 5:00 PM Freedom:"
  );

  const getUrl = () => (typeof window !== "undefined" ? window.location.href : "");

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8 text-center">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <Share2 className="w-3.5 h-3.5" /> Viral Share Protocol
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          📢 Share This With Colleagues
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mb-6">
          Office group ba Slack-e share korun jokhon-i keu jiggnesh korbe &ldquo;Bhai tumi r kobe jaba?&rdquo;
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-950" />
                <span>Link Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Website Link</span>
              </>
            )}
          </button>

          {/* WhatsApp Button */}
          <a
            href={`https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(getUrl())}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </a>

          {/* Telegram Button */}
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(getUrl())}&text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-sky-600/20 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Share on Telegram</span>
          </a>
        </div>
      </div>
    </section>
  );
}
