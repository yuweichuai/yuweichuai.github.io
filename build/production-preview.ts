import { readFileSync, statSync } from "node:fs";
import { resolve, extname } from "node:path";
import type { Plugin } from "vite";

// Development-only endpoints for testing the exact GitHub Pages output.
// Not routes, assets or runtime code in the deployed website.
export function productionPreview(): Plugin {
  return {
    name: "production-output-preview",
    configureServer(server) {
      const root = resolve(server.config.root, "dist/client");
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url || "/", "http://preview.invalid");
        if (url.pathname === "/__mobile-check") {
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end('<!doctype html><title>Mobile-width production check</title><style>body{margin:0;background:#e9edf2}iframe{display:block;width:390px;height:844px;border:0;margin:12px auto}</style><iframe title="Mobile website" src="/__production__/index.html"></iframe>');
          return;
        }
        if (!url.pathname.startsWith("/__production__/")) { next(); return; }
        const name = decodeURIComponent(url.pathname.slice("/__production__/".length)) || "index.html";
        const path = resolve(root, name);
        if (!path.startsWith(root + "/")) { res.statusCode = 403; res.end(); return; }
        try {
          if (!statSync(path).isFile()) throw new Error("Not a file");
          const mime: Record<string, string> = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".pdf": "application/pdf", ".json": "application/json" };
          res.setHeader("Content-Type", mime[extname(path)] || "application/octet-stream");
          res.setHeader("Cache-Control", "no-store");
          res.end(readFileSync(path));
        } catch { res.statusCode = 404; res.end("Build the website first."); }
      });
    },
  };
}
