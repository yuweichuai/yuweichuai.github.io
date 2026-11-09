(() => {
  function mountNetworks() {
    document.querySelectorAll("[data-research-network]").forEach((root) => {
      if (root.dataset.networkReady) return;
      root.dataset.networkReady = "true";

      const toggle = root.querySelector("[data-network-toggle]");
      const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
      let paused = false;
      const bounds = root.getBoundingClientRect();
      let visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
      let scrolling = false;
      let scrollTimer = null;
      function sync() {
        toggle.hidden = preference.matches;
        toggle.dataset.paused = String(paused);
        const label = paused ? "Play network animation" : "Pause network animation";
        toggle.setAttribute("aria-label", label);
        toggle.setAttribute("title", label);
        root.dataset.networkPlaying = String(!paused && !preference.matches && visible && !scrolling && !document.hidden);
      }

      toggle.addEventListener("click", () => { paused = !paused; sync(); });
      preference.addEventListener("change", sync);
      document.addEventListener("visibilitychange", sync);
      window.addEventListener("scroll", () => {
        if (!scrolling) { scrolling = true; sync(); }
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => { scrolling = false; sync(); }, 140);
      }, { passive: true });
      // Pause before the first scroll event on touch screens.
      window.addEventListener("touchmove", () => {
        if (!scrolling) { scrolling = true; sync(); }
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => { scrolling = false; sync(); }, 160);
      }, { passive: true });
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
        observer.observe(root);
      }
      sync();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountNetworks, { once: true });
  } else {
    mountNetworks();
  }
})();
