"use client";

import dynamic from "next/dynamic";

export const DynamicMapPicker = dynamic(() => import("@/components/map-picker").then((m) => m.MapPicker), {
  ssr: false,
  loading: () => <div className="h-[360px] animate-pulse rounded-md bg-muted" />
});
