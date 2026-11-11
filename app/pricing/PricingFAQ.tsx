"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "What is featured placement?",
    a: "Part of Pro, once it opens: your listing shown above standard listings in its category, with a Featured badge. Pro is not on sale yet.",
  },
  {
    q: "Can I cancel Pro at any time?",
    a: "Yes. Pro ends when you cancel. Adverts have the minimum term shown on the advertise page.",
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
