"use client";

import React, { useSyncExternalStore } from "react";
import {
   Coffee,
   CheckCircle2,
   Presentation,
   Database,
   Heart,
   Clock,
} from "lucide-react";
import { RESIGNATION_DETAILS } from "@/lib/constants";

let currentNow = typeof window !== "undefined" ? Date.now() : 0;

function subscribeNow(callback: () => void) {
   const timer = setInterval(() => {
      currentNow = Date.now();
      callback();
   }, 1000);
   return () => clearInterval(timer);
}

function getNowSnapshot(): number {
   return currentNow;
}

function getServerNowSnapshot(): number {
   return new Date(RESIGNATION_DETAILS.submissionDate).getTime() + 1000 * 60 * 60 * 24 * 10;
}

export default function SurvivalStats() {
   const now = useSyncExternalStore(subscribeNow, getNowSnapshot, getServerNowSnapshot);

   const target = new Date(RESIGNATION_DETAILS.targetDate).getTime();
   const diffDays = Math.max(
      0,
      Math.ceil((target - now) / (1000 * 60 * 60 * 24)),
   );

   const officeDays = Math.max(1, Math.round(diffDays * 0.7));

   const stats = {
      chaiCups: officeDays * 3,
      standupsLeft: officeDays,
      handoverPercent: Math.min(
         100,
         +(92 + (1 - diffDays / 30) * 7.9).toFixed(1),
      ),
      officeWorkingHours: officeDays * 8,
   };

   const items = [
      {
         title: "বাকি থাকা চায়ের কাপ",
         value: `~${stats.chaiCups} কাপ`,
         subtitle: "বনশ্রীর টংয়ে সহকর্মীদের সাথে আনন্দঘন আড্ডা",
         icon: Coffee,
         color: "text-amber-400",
         bgColor: "bg-amber-500/10",
         borderColor: "border-amber-500/20",
      },
      {
         title: "বাকি থাকা ডেইলি স্ট্যান্ডআপ",
         value: `${stats.standupsLeft} টি মিটিং`,
         subtitle: "টিমের সাথে হাসিমুখে কাজের আপডেট ও পরিকল্পনা",
         icon: Presentation,
         color: "text-blue-400",
         bgColor: "bg-blue-500/10",
         borderColor: "border-blue-500/20",
      },
      {
         title: "হ্যান্ডওভার সম্পন্ন",
         value: `${stats.handoverPercent}%`,
         subtitle: "সব প্রজেক্টের এপিআই ও আর্কিটেকচার গোছানো",
         icon: Database,
         color: "text-emerald-400",
         bgColor: "bg-emerald-500/10",
         borderColor: "border-emerald-500/20",
      },
      {
         title: "সহকর্মীদের ভালোবাসা ও দোয়া",
         value: "১০০%",
         subtitle: "একসাথে কাটানো দারুণ কাজের অভিজ্ঞতা ও স্মৃতি",
         icon: Heart,
         color: "text-pink-400",
         bgColor: "bg-pink-500/10",
         borderColor: "border-pink-500/20",
      },
      {
         title: "ডকুমেন্টেশন স্ট্যাটাস",
         value: "সম্পূর্ণ রেডি",
         subtitle: "যেকোনো সময়ে নতুন ডেভেলপারের কাজ শুরু করার উপযুক্ত",
         icon: CheckCircle2,
         color: "text-cyan-400",
         bgColor: "bg-cyan-500/10",
         borderColor: "border-cyan-500/20",
      },
      {
         title: "অবশিষ্ট অফিস কর্মঘণ্টা",
         value: `~${stats.officeWorkingHours} ঘণ্টা`,
         subtitle: "প্রতিটি দিন সুন্দর ও আনন্দময়ভাবে কাটানোর সংকল্প",
         icon: Clock,
         color: "text-purple-400",
         bgColor: "bg-purple-500/10",
         borderColor: "border-purple-500/20",
      },
   ];

   return (
      <section className="w-full max-w-5xl mx-auto px-4 py-6">
         <div className="text-center mb-6">
            <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
               📊 অফিসের শেষ দিনগুলোর আনন্দময় পরিসংখ্যান
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
               এসএম টেকনোলজির সাথে নায়েম ভাইয়ের শেষ কর্মদিবসগুলোর সুন্দর কিছু হিসাব
            </p>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {items.map((item, idx) => {
               const Icon = item.icon;
               return (
                  <div
                     key={idx}
                     className={`glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border ${item.borderColor} flex flex-col justify-between`}
                  >
                     <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-300">
                           {item.title}
                        </span>
                        <div className={`p-2 rounded-xl ${item.bgColor}`}>
                           <Icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                     </div>
                     <div>
                        <div
                           className={`text-2xl sm:text-3xl font-black font-mono ${item.color} mb-1`}
                        >
                           {item.value}
                        </div>
                        <div className="text-[11px] sm:text-xs text-slate-400 leading-normal">
                           {item.subtitle}
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
      </section>
   );
}
