"use client";

import React, { useState, useSyncExternalStore, useCallback } from "react";
import { Send, Heart, Sparkles } from "lucide-react";
import { INITIAL_WISHES } from "@/lib/constants";
import { soundEffects } from "@/lib/audio";
import confetti from "canvas-confetti";

interface Wish {
   id: string;
   author: string;
   role: string;
   message: string;
   time: string;
}

const STORAGE_KEY = "nayem_colleague_wishes";
const wishListeners = new Set<() => void>();

function subscribeWishes(callback: () => void) {
   wishListeners.add(callback);
   const handleStorage = () => callback();
   window.addEventListener("storage", handleStorage);
   return () => {
      wishListeners.delete(callback);
      window.removeEventListener("storage", handleStorage);
   };
}

let cachedRaw: string | null = null;
let cachedParsed: Wish[] = INITIAL_WISHES;

function getWishesSnapshot(): Wish[] {
   const saved = localStorage.getItem(STORAGE_KEY);
   if (saved === cachedRaw) {
      return cachedParsed;
   }
   cachedRaw = saved;
   if (!saved) {
      cachedParsed = INITIAL_WISHES;
      return cachedParsed;
   }
   try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
         cachedParsed = parsed;
         return cachedParsed;
      }
   } catch {
      // ignore
   }
   cachedParsed = INITIAL_WISHES;
   return cachedParsed;
}

function getWishesServerSnapshot(): Wish[] {
   return INITIAL_WISHES;
}

export default function WishWall() {
   const wishes = useSyncExternalStore(subscribeWishes, getWishesSnapshot, getWishesServerSnapshot);
   const [name, setName] = useState("");
   const [role, setRole] = useState("");
   const [message, setMessage] = useState("");
   const [submitting, setSubmitting] = useState(false);

   const handleSubmit = useCallback((e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !message.trim()) return;

      setSubmitting(true);
      const newWish: Wish = {
         id: Date.now().toString(),
         author: name.trim(),
         role: role.trim() || "Colleague & Well Wisher",
         message: message.trim(),
         time: "Just now",
      };

      const current = getWishesSnapshot();
      const updated = [newWish, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      wishListeners.forEach((l) => l());

      soundEffects.playFanfare();
      confetti({
         particleCount: 60,
         spread: 70,
         origin: { y: 0.8 },
      });

      setName("");
      setRole("");
      setMessage("");
      setSubmitting(false);
   }, [name, role, message]);

   return (
      <section className="w-full max-w-5xl mx-auto px-4 py-8">
         <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold mb-2">
               <Heart className="w-3.5 h-3.5 fill-pink-500/20" /> Farewell
               Message Wall
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
               📝 Leave a Funny Memory / Farewell Wish for Nayem
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
               Bhai-er shate kono funny smriti, bug-fixing er kosto, ba
               shubheccha thakle likhe janan!
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-1 glass-card rounded-3xl p-6 border border-slate-700/60 h-fit">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Drop Your Note
               </h3>

               <form
                  onSubmit={handleSubmit}
                  className="space-y-3.5 text-xs"
               >
                  <div>
                     <label className="block text-slate-300 font-medium mb-1">
                        Your Name *
                     </label>
                     <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Tanvir / Sadia / Asif"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                     />
                  </div>

                  <div>
                     <label className="block text-slate-300 font-medium mb-1">
                        Your Role / Team (Optional)
                     </label>
                     <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Frontend Dev, QA, Friend"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                     />
                  </div>

                  <div>
                     <label className="block text-slate-300 font-medium mb-1">
                        Your Message / Funny Memory *
                     </label>
                     <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Nayem bhai, apnar banano API er response ekhono amar swapne ashe... Good luck!"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                     />
                  </div>

                  <button
                     type="submit"
                     disabled={submitting}
                     className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold text-xs shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                     <Send className="w-3.5 h-3.5" />
                     <span>Post on Wall</span>
                  </button>
               </form>
            </div>

            {/* Wishes Feed Column */}
            <div className="lg:col-span-2 space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
               {wishes.map((item) => (
                  <div
                     key={item.id}
                     className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 hover:border-slate-700 transition-all relative group"
                  >
                     <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                              {item.author.charAt(0).toUpperCase()}
                           </div>
                           <div>
                              <h4 className="text-sm font-bold text-white leading-tight">
                                 {item.author}
                              </h4>
                              <span className="text-[11px] text-slate-400 font-medium">
                                 {item.role}
                              </span>
                           </div>
                        </div>

                        <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                           {item.time}
                        </span>
                     </div>

                     <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic pl-10 border-l-2 border-amber-500/30">
                        &ldquo;{item.message}&rdquo;
                     </p>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
