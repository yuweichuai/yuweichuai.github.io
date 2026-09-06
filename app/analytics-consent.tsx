import { Button } from "@/components/ui/button";
import { validAnalyticsId } from "@/lib/analytics";
import AnalyticsRuntime from "./analytics-runtime";

export default function AnalyticsConsent({ measurementId }: { measurementId: string }) {
  if (!validAnalyticsId(measurementId)) return null;

  return (
    <aside className="analytics-controls" data-preview-omit="analytics" data-analytics-id={measurementId} hidden>
      <Button variant="link" className="analytics-preferences" data-consent-preferences aria-expanded="false" aria-controls="analytics-consent">
        Analytics preferences
      </Button>
        <section className="consent-banner" id="analytics-consent" aria-labelledby="consent-heading" hidden>
          <h2 id="consent-heading">Optional visitor analytics</h2>
          <p>With your permission, Google Analytics uses cookies to measure visits and interactions on this site. Information about your browser and visit is sent to Google. No advertising features are enabled.</p>
          <p>You can decline without affecting the website, or change your choice here later. Your choice is saved on this device for six months. <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">How Google uses this data</a>.</p>
          <div className="consent-actions">
            <Button variant="outline" data-consent-choice="denied">Decline analytics</Button>
            <Button variant="outline" data-consent-choice="granted">Allow analytics</Button>
            <Button variant="link" data-consent-close hidden>Close</Button>
          </div>
        </section>
      <AnalyticsRuntime />
    </aside>
  );
}
