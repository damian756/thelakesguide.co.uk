"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function PostcodeCopy({ postcode }: { postcode: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(postcode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback — select all text in a temp input
      const el = document.createElement("input");
      el.value = postcode;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors text-xs font-medium"
      title="Copy postcode"
    >
      {copied ? (
        <><Check className="w-3.5 h-3.5 text-green-500" /><span className="text-green-600">Copied</span></>
      ) : (
        <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>
      )}
    </button>
  );
}
