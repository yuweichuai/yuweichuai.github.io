import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";

const root = resolve(import.meta.dirname, "..");
const client = resolve(root, "dist/client");
const path = resolve(client, "index.html");
let html = readFileSync(path, "utf8");

// Keep the generated HTML/CSS. This single page needs no client-side router,
// hydration or RSC payloads; links should work immediately and without JS.
html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
html = html.replace(/<link\b[^>]*\brel="(?:modulepreload|preload|prefetch)"[^>]*>/gi, "");
html = html.replace(/<!--\$[!?]?-->|<!--\/\$-->/g, "");
// Relative, fingerprinted CSS works at both / and /repository-name/ and lets
// the agent test these exact bytes beneath its internal preview prefix.
html = html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/gi, tag => tag.replace(/href="(?!https?:)([^"]*\/)?assets\//, 'href="./assets/'));
assert(!/__VINEXT|__NEXT|type="module"/.test(html), "Framework runtime leaked into static HTML");

function runtime(name, code) {
  assert(!/<\/script/i.test(code), `Unsafe script end tag in ${name}`);
  html = html.replace("</body>", `<script data-site-runtime="${name}">${code}</script></body>`);
}
if (html.includes("data-research-network")) runtime("network", readFileSync(resolve(root, "public/research-network.js"), "utf8"));
if (html.includes("data-analytics-id=")) {
  const core = readFileSync(resolve(root, "lib/analytics.ts"), "utf8");
  const dom = readFileSync(resolve(root, "lib/analytics-dom.ts"), "utf8").replace(/^import[^\n]+from "\.\/analytics";\n/, "");
  const code = ts.transpileModule(`${core}\n${dom}\nmountAnalytics();`, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  }).outputText.replace(/^export /gm, "");
  assert(!/^import /m.test(code), "Static analytics contains an unresolved import");
  runtime("analytics", `(() => {\n${code}\n})();`);
}
const contentId = createHash("sha256").update(html).digest("hex").slice(0, 12);
html = html.replace("</head>", `<meta name="site-build" content="${contentId}"></head>`);
writeFileSync(path, html);
writeFileSync(resolve(client, ".nojekyll"), "");
writeFileSync(resolve(client, "build-info.json"), JSON.stringify({ contentId, mode: "static-html-native-anchors", builtAt: new Date().toISOString() }, null, 2) + "\n");
console.log(`Static HTML ready: ${contentId}. Native anchors; network animation retained.`);
