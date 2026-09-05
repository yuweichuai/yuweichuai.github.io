(() => {
  function mountNetworks() {
    document.querySelectorAll("[data-research-network]").forEach((root) => {
      if (root.dataset.networkReady) return;
      root.dataset.networkReady = "true";

      const nodes = Array.from(root.querySelectorAll("[data-network-node]"), (element) => ({
        element, core: element.querySelector(".network-core"), halo: element.querySelector(".network-halo"),
        x: Number(element.dataset.x), y: Number(element.dataset.y), z: Number(element.dataset.z),
        size: Number(element.dataset.size), phase: Number(element.dataset.phase),
      }));
      const edges = Array.from(root.querySelectorAll("[data-network-edge]"), (element) => ({
        element, from: Number(element.dataset.from), to: Number(element.dataset.to),
      }));
      const signals = Array.from(root.querySelectorAll("[data-network-signal]"));
      const toggle = root.querySelector("[data-network-toggle]");
      const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
      let paused = false;
      let visible = true;
      let frame = null;
      let previous = null;
      let elapsed = 0;

      function paint(time, moving) {
        const turn = moving ? time * 0.055 : 0;
        const tilt = moving ? Math.sin(time * 0.12) * 0.12 : 0;
        const points = nodes.map((node) => {
          const x = node.x + (moving ? Math.sin(time * 0.31 + node.phase) * 2.8 : 0);
          const y = node.y + (moving ? Math.cos(time * 0.26 + node.phase) * 2.8 : 0);
          const rotatedX = x * Math.cos(turn) + node.z * Math.sin(turn);
          const rotatedZ = node.z * Math.cos(turn) - x * Math.sin(turn);
          const projectedY = y * Math.cos(tilt) - rotatedZ * Math.sin(tilt);
          const z = y * Math.sin(tilt) + rotatedZ * Math.cos(tilt);
          const scale = 340 / (340 - z);
          return { x: 160 + rotatedX * scale, y: 125 + projectedY * scale, scale, depth: Math.max(0, Math.min(1, (z + 110) / 220)) };
        });
        nodes.forEach((node, index) => {
          const point = points[index];
          node.element.setAttribute("transform", `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
          node.core.setAttribute("r", (node.size * point.scale).toFixed(2));
          node.core.setAttribute("opacity", (0.35 + point.depth * 0.6).toFixed(2));
          node.halo.setAttribute("r", (node.size * point.scale * 2.8).toFixed(2));
          node.halo.setAttribute("opacity", (0.04 + point.depth * 0.08).toFixed(2));
        });
        edges.forEach(({ element, from, to }) => {
          element.setAttribute("x1", points[from].x.toFixed(2));
          element.setAttribute("y1", points[from].y.toFixed(2));
          element.setAttribute("x2", points[to].x.toFixed(2));
          element.setAttribute("y2", points[to].y.toFixed(2));
          element.setAttribute("opacity", (0.11 + (points[from].depth + points[to].depth) * 0.17).toFixed(2));
        });
        signals.forEach((signal) => {
          const edge = edges[Number(signal.dataset.edge)];
          const progress = (time / (7 + Number(signal.dataset.phase) * 3) + Number(signal.dataset.phase)) % 1;
          const start = points[edge.from];
          const end = points[edge.to];
          signal.setAttribute("cx", (start.x + (end.x - start.x) * progress).toFixed(2));
          signal.setAttribute("cy", (start.y + (end.y - start.y) * progress).toFixed(2));
          signal.setAttribute("opacity", moving ? (Math.sin(progress * Math.PI) * 0.8).toFixed(2) : "0");
        });
      }

      function canAnimate() {
        return !paused && !preference.matches && visible && !document.hidden;
      }
      function tick(now) {
        frame = null;
        if (!canAnimate()) { previous = null; return; }
        if (previous === null) previous = now;
        // Cap DOM updates at 30 fps and avoid jumps when returning to the tab.
        if (now - previous >= 1000 / 30) {
          elapsed += Math.min((now - previous) / 1000, 0.1);
          previous = now;
          paint(elapsed, true);
        }
        frame = window.requestAnimationFrame(tick);
      }
      function sync() {
        toggle.hidden = preference.matches;
        toggle.dataset.paused = String(paused);
        const label = paused ? "Play network animation" : "Pause network animation";
        toggle.setAttribute("aria-label", label);
        toggle.setAttribute("title", label);
        if (canAnimate() && frame === null) {
          previous = null;
          frame = window.requestAnimationFrame(tick);
        } else if (!canAnimate() && frame !== null) {
          window.cancelAnimationFrame(frame);
          frame = null;
          previous = null;
        }
        if (preference.matches) paint(0, false);
      }

      toggle.addEventListener("click", () => { paused = !paused; sync(); });
      preference.addEventListener("change", sync);
      document.addEventListener("visibilitychange", sync);
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
