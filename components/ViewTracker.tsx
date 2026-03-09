"use client";

import { useEffect } from "react";

export function ViewTracker({ businessId }: { businessId: string }) {
  useEffect(() => {
    fetch("/api/hub/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId }),
    });
  }, [businessId]);
  return null;
}
