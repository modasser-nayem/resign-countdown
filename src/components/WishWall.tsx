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
         role: role.trim() || "শুভাকাঙ্ক্ষী সহকর্মী",
         message: message.trim(),
         time: "এইমাত্র",
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
      <section className="w-full max-w-5xl mx-auto px-4 py-6">
         <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold mb-2">
               <Heart className="w-3.5 h-3.5 fill-pink-500/20" /> বিদায়ী শুভকামনা বার্তা
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
               📝 নায়েম ভাইয়ের জন্য একটি স্মৃতি বা শুভেচ্ছা বার্তা লিখুন
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
               একসাথে কাজ করার সুন্দর কোনো অনুভূতি বা ভবিষ্যৎ জীবনের জন্য দোয়া ও শুভাশীষ এখানে শেয়ার করুন!
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-1 glass-card rounded-3xl p-4 sm:p-6 border border-slate-700/60 h-fit">
               <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> আপনার বার্তা লিখুন
               </h3>

               <form
                  onSubmit={handleSubmit}
                  className="space-y-3.5 text-xs"
               >
                  <div>
                     <label className="block text-slate-300 font-medium mb-1">
                        আপনার নাম *
                     </label>
                     <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="যেমন: তানভীর / সাদিয়া / আসিফ"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-base sm:text-sm transition-colors"
                     />
                  </div>

                  <div>
                     <label className="block text-slate-300 font-medium mb-1">
                        আপনার ভূমিকা / পদবী (ঐচ্ছিক)
                     </label>
                     <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="যেমন: সহকর্মী, ফ্রন্টএন্ড ডেভেলপার, বন্ধু"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-base sm:text-sm transition-colors"
                     />
                  </div>

                  <div>
                     <label className="block text-slate-300 font-medium mb-1">
                        আপনার বার্তা বা স্মৃতি *
                     </label>
                     <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="নায়েম ভাই, একসাথে কাজ করার চমৎকার দিনগুলোর জন্য ধন্যবাদ। নতুন কর্মক্ষেত্রে অনেক শুভকামনা!"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-base sm:text-sm transition-colors resize-none"
                     />
                  </div>

                  <button
                     type="submit"
                     disabled={submitting}
                     className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                     <Send className="w-3.5 h-3.5" />
                     <span>শুভেচ্ছা বার্তা পোস্ট করুন</span>
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
                              {item.author.charAt(0)}
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

                        <span className="text-[10px] text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
                           {item.time}
                        </span>
                     </div>

                     <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic pl-10 border-l-2 border-amber-500/40">
                        &ldquo;{item.message}&rdquo;
                     </p>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
