"use client";

import { useEffect } from "react";

export function TrackView({ token }: { token: string }) {
  useEffect(() => {
    fetch(`/api/business/${token}/views`, { method: "POST" }).catch(() => {});
  }, [token]);

  return null;
}
