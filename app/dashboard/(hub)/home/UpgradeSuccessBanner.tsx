"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const STORAGE_KEY = "hub-upgrade-success";

export default function UpgradeSuccessBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  });

  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setShow(true);
      router.replace("/dashboard/home");
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      sessionStorage.removeItem(STORAGE_KEY);
      setShow(false);
    }, 8000);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-center gap-3">
      <span className="text-2xl">🎉</span>
      <span className="font-medium">
        Welcome to Pro! Your featured placement is now live and benchmarks are
        unlocked.
      </span>
    </div>
  );
}
