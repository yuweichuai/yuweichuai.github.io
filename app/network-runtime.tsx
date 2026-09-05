"use client";

import { useEffect } from "react";

export default function NetworkRuntime() {
  useEffect(() => {
    // Wait for hydration before animating the server-rendered SVG attributes.
    if (document.getElementById("research-network-runtime")) return;
    const script = document.createElement("script");
    script.id = "research-network-runtime";
    script.src = "./research-network.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  return null;
}
