"use client";

import React, { useSyncExternalStore } from "react";
import {
   Coffee,
   Bug,
   Presentation,
   Database,
   Flame,
   CheckCircle2,
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
      unfixedBugs: Math.max(5, diffDays * 2 + 3),
      handoverPercent: Math.min(
         99.9,
         +(90 + (1 - diffDays / 30) * 9.9).toFixed(1),
      ),
      officeWorkingHours: officeDays * 8,
   };

   const items = [
      {
         title: "Chai / Coffee Breaks Left",
         value: `${stats.chaiCups} Cups`,
         subtitle: "Tong er mama already preparing the invoice",
         icon: Coffee,
         color: "text-amber-400",
         bgColor: "bg-amber-500/10",
         borderColor: "border-amber-500/20",
      },
      {
         title: "Standup Meetings Remaining",
         value: `${stats.standupsLeft} Standups`,
         subtitle: "To answer: 'Working on handover doc & cleanup'",
         icon: Presentation,
         color: "text-blue-400",
         bgColor: "bg-blue-500/10",
         borderColor: "border-blue-500/20",
      },
      {
         title: "Bugs Rebranded as 'Features'",
         value: `${stats.unfixedBugs} Bugs`,
         subtitle: "Next backend engineer will love solving them",
         icon: Bug,
         color: "text-red-400",
         bgColor: "bg-red-500/10",
         borderColor: "border-red-500/20",
      },
      {
         title: "Handover Completion Status",
         value: `${stats.handoverPercent}%`,
         subtitle: "Secret API keys and db tricks still in brain",
         icon: Database,
         color: "text-emerald-400",
         bgColor: "bg-emerald-500/10",
         borderColor: "border-emerald-500/20",
      },
      {
         title: "New Task Acceptance Rate",
         value: "0.00%",
         subtitle: "'Eta toh amar release cycle er porer scope!'",
         icon: Flame,
         color: "text-orange-400",
         bgColor: "bg-orange-500/10",
         borderColor: "border-orange-500/20",
      },
      {
         title: "Pure Office Desk Hours",
         value: `~${stats.officeWorkingHours} hrs`,
         subtitle: "Countdown ticks sharply every afternoon till 5:00 PM",
         icon: CheckCircle2,
         color: "text-purple-400",
         bgColor: "bg-purple-500/10",
         borderColor: "border-purple-500/20",
      },
   ];

   return (
      <section className="w-full max-w-5xl mx-auto px-4 py-8">
         <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
               📊 Notice Period Survival Metrics
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
               Real-time hilarious telemetry of Nayem&apos;s final days at SM
               Technology
            </p>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, idx) => {
               const Icon = item.icon;
               return (
                  <div
                     key={idx}
                     className={`glass-card glass-card-hover rounded-2xl p-5 border ${item.borderColor} flex flex-col justify-between`}
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
