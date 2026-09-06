"use client";

import { useEffect } from "react";
import { mountAnalytics } from "@/lib/analytics-dom";

export default function AnalyticsRuntime() {
  useEffect(mountAnalytics, []);
  return null;
}
