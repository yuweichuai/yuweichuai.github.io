import { disableAnalytics, enableAnalytics, readAnalyticsChoice, saveAnalyticsChoice, validAnalyticsId } from "./analytics";

export function mountAnalytics() {
  document.querySelectorAll<HTMLElement>("[data-analytics-id]").forEach(root => {
    const id = root.dataset.analyticsId ?? "";
    if (root.dataset.analyticsReady || !validAnalyticsId(id) || window.location.protocol !== "https:" ||
      ["localhost", "127.0.0.1", "terminal.local"].includes(window.location.hostname)) return;
    root.dataset.analyticsReady = "true";
    const banner = root.querySelector<HTMLElement>(".consent-banner")!;
    const preferences = root.querySelector<HTMLButtonElement>("[data-consent-preferences]")!;
    const close = root.querySelector<HTMLButtonElement>("[data-consent-close]")!;
    let choice = readAnalyticsChoice(id);
    function setOpen(open: boolean) {
      banner.hidden = !open;
      preferences.setAttribute("aria-expanded", String(open));
      close.hidden = choice === "unknown";
    }
    root.hidden = false;
    setOpen(choice === "unknown");
    if (choice === "granted") enableAnalytics(id);
    preferences.addEventListener("click", () => setOpen(banner.hidden));
    close.addEventListener("click", () => { setOpen(false); preferences.focus({ preventScroll: true }); });
    root.querySelectorAll<HTMLButtonElement>("[data-consent-choice]").forEach(button => {
      button.addEventListener("click", () => {
        const next = button.dataset.consentChoice;
        if (next !== "granted" && next !== "denied") return;
        const previous = choice;
        saveAnalyticsChoice(id, next);
        choice = next;
        setOpen(false);
        if (next === "granted") enableAnalytics(id);
        else disableAnalytics(id);
        preferences.focus({ preventScroll: true });
        if (next === "denied" && previous === "granted") window.location.reload();
      });
    });
  });
}
