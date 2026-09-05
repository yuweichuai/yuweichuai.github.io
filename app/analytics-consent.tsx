"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { disableAnalytics, enableAnalytics, readAnalyticsChoice, saveAnalyticsChoice, validAnalyticsId } from "@/lib/analytics";
import type { AnalyticsChoice } from "@/lib/analytics";

export default function AnalyticsConsent({ measurementId }: { measurementId: string }) {
  const [choice, setChoice] = useState<AnalyticsChoice>("unknown");
  const [open, setOpen] = useState(false);
  const preferencesButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!validAnalyticsId(measurementId)) return;
    const saved = readAnalyticsChoice(measurementId);
    setChoice(saved);
    setOpen(saved === "unknown");
    if (saved === "granted") enableAnalytics(measurementId);
  }, [measurementId]);

  if (!validAnalyticsId(measurementId)) return null;

  function choose(next: "granted" | "denied") {
    saveAnalyticsChoice(measurementId, next);
    setChoice(next);
    setOpen(false);
    if (next === "granted") enableAnalytics(measurementId);
    else disableAnalytics(measurementId);
    preferencesButton.current?.focus({ preventScroll: true });
    // A previously loaded third-party script cannot be unloaded by removing
    // its element. Reload after withdrawal so the next page stays tag-free.
    if (next === "denied" && choice === "granted") window.location.reload();
  }

  return (
    <aside className="analytics-controls" data-preview-omit="analytics">
      <Button ref={preferencesButton} variant="link" className="analytics-preferences" aria-expanded={open} aria-controls="analytics-consent" onClick={() => setOpen(!open)}>
        Analytics preferences
      </Button>
      {open && (
        <section className="consent-banner" id="analytics-consent" aria-labelledby="consent-heading">
          <h2 id="consent-heading">Optional visitor analytics</h2>
          <p>With your permission, Google Analytics uses cookies to measure visits and interactions on this site. Information about your browser and visit is sent to Google. No advertising features are enabled.</p>
          <p>You can decline without affecting the website, or change your choice here later. Your choice is saved on this device for six months. <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">How Google uses this data</a>.</p>
          <div className="consent-actions">
            <Button variant="outline" onClick={() => choose("denied")}>Decline analytics</Button>
            <Button variant="outline" onClick={() => choose("granted")}>Allow analytics</Button>
            {choice !== "unknown" && <Button variant="link" onClick={() => { setOpen(false); preferencesButton.current?.focus(); }}>Close</Button>}
          </div>
        </section>
      )}
    </aside>
  );
}
