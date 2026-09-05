export type AnalyticsChoice = "granted" | "denied" | "unknown";

declare global {
  interface Window {
    dataLayer?: IArguments[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean;
  }
}

const preferenceLifetime = 180 * 24 * 60 * 60 * 1000;
const cookiePrefix = "yuwei_ga4";
const denied = {
  analytics_storage: "denied", ad_storage: "denied",
  ad_user_data: "denied", ad_personalization: "denied",
};
export const validAnalyticsId = (id: string) => /^G-[A-Z0-9]+$/.test(id);
const preferenceKey = (id: string) => `yuwei-analytics-consent-v1:${id}`;

export function readAnalyticsChoice(id: string): AnalyticsChoice {
  try {
    const saved = JSON.parse(localStorage.getItem(preferenceKey(id)) ?? "null");
    if (saved?.expires > Date.now() && ["granted", "denied"].includes(saved.choice)) return saved.choice;
  } catch { /* Storage may be unavailable; default to no consent. */ }
  return "unknown";
}

export function saveAnalyticsChoice(id: string, choice: Exclude<AnalyticsChoice, "unknown">) {
  try {
    localStorage.setItem(preferenceKey(id), JSON.stringify({ choice, expires: Date.now() + preferenceLifetime }));
  } catch { /* Consent still applies to this page, without persistence. */ }
}

export function enableAnalytics(id: string) {
  if (!validAnalyticsId(id) || window.location.protocol !== "https:" ||
    ["localhost", "127.0.0.1", "terminal.local"].includes(window.location.hostname)) return;

  const scriptId = `analytics-${id}`;
  if (document.getElementById(scriptId)) return;
  window[`ga-disable-${id}`] = false;
  window.dataLayer ??= [];
  window.gtag ??= function () { window.dataLayer!.push(arguments); };
  window.gtag("consent", "default", denied);
  window.gtag("consent", "update", { ...denied, analytics_storage: "granted" });
  window.gtag("js", new Date());
  window.gtag("config", id, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_prefix: cookiePrefix,
    cookie_domain: "none",
    cookie_path: new URL("./", window.location.href).pathname,
    cookie_expires: 60 * 60 * 24 * 180,
    page_location: window.location.origin + window.location.pathname,
    page_referrer: document.referrer ? new URL(document.referrer).origin : "",
  });
  const script = document.createElement("script");
  script.id = scriptId;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
}

export function disableAnalytics(id: string) {
  window[`ga-disable-${id}`] = true;
  window.gtag?.("consent", "update", denied);
  document.getElementById(`analytics-${id}`)?.remove();
  const path = new URL("./", window.location.href).pathname;
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (name.startsWith(`${cookiePrefix}_`)) {
      document.cookie = `${name}=; Max-Age=0; Path=${path}; SameSite=Lax; Secure`;
    }
  }
}
