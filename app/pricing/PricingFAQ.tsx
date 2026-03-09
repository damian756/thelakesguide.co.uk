"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "What is featured placement?",
    a: "Your listing appears above standard listings in your category on the public site, with a prominent Featured badge.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Your Pro benefits continue until the end of the billing period.",
  },
  {
    q: "What is a boost credit?",
    a: "One free category boost per month (worth £15), included with Pro. Use it anytime or let it accumulate.",
  },
  {
    q: "How do boosts work?",
    a: "A boost puts your listing at the top of your category for the chosen period. You choose the dates and optional label (e.g. \"Bank Holiday Weekend\").",
  },
] as const;

export default function PricingFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => (
        <div
          key={item.q}
          className="bg-white rounded-xl border border-gray-100 overflow-hidden"
        >
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-[#1B2E4B] hover:bg-gray-50/50 transition-colors"
          >
            {item.q}
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                openIdx === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {openIdx === i && (
            <div className="px-5 pb-4 pt-0 text-gray-600 text-sm border-t border-gray-50">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
