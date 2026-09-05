import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = process.argv[2];
assert(output && isAbsolute(output), "Supply an absolute output directory.");
assert(!output.startsWith(`${root}/`), "Keep exports outside the source repository.");
const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" });
assert.equal(git("status", "--porcelain").trim(), "", "Commit source changes before exporting.");
mkdirSync(output, { recursive: true });

const client = join(root, "dist/client");
const mimeTypes = { ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".pdf": "application/pdf" };
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
function localAsset(href) {
  const clean = href.replace(/^\.\//, "").replace(/^\/+/, "");
  const path = resolve(client, clean);
  assert(path.startsWith(`${client}/`) && existsSync(path), `Missing local asset: ${href}`);
  return path;
}
function dataUrl(href) {
  const path = localAsset(href);
  const mime = mimeTypes[extname(path)];
  assert(mime, `Unsupported embedded asset: ${href}`);
  return `data:${mime};base64,${readFileSync(path).toString("base64")}`;
}

let html = readFileSync(join(client, "index.html"), "utf8");
html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
// Offline design previews must not show inert consent controls or collect data.
html = html.replace(/<aside\b[^>]*data-preview-omit="analytics"[^>]*>[\s\S]*?<\/aside>/gi, "");
html = html.replace(/<link\b[^>]*>/gi, (tag) => {
  const rel = attr(tag, "rel");
  const href = attr(tag, "href");
  if (rel === "stylesheet") {
    const css = readFileSync(localAsset(href), "utf8");
    assert(!/<\/style/i.test(css), "Unexpected style end tag.");
    return `<style>${css}</style>`;
  }
  if (/preload|prefetch|modulepreload/.test(rel ?? "")) return "";
  if (/icon/.test(rel ?? "")) return tag.replace(`href="${href}"`, `href="${dataUrl(href)}"`);
  return tag;
});
html = html.replace(/<img\b[^>]*>/gi, (tag) => {
  const src = attr(tag, "src");
  return tag.replace(`src="${src}"`, `src="${dataUrl(src)}"`).replace(/\sloading="lazy"/, "");
});
html = html.replace(/<a\b[^>]*>/gi, (tag) => {
  const href = attr(tag, "href");
  if (!href || !/^\.\//.test(href)) return tag;
  const filename = href.slice(2);
  return tag.replace(`href="${href}"`, `href="${dataUrl(href)}" download="${filename}"`)
    .replace(/\starget="_blank"/, "");
});
assert(!/<script\b/i.test(html), "Preview must not require framework scripts.");
assert(!/(?:href|src)="(?:\.\/|\/)/.test(html), "Preview has unresolved local links.");
if (html.includes("data-research-network")) {
  const runtime = readFileSync(join(client, "research-network.js"), "utf8");
  assert(!/<\/script/i.test(runtime), "Unexpected script end tag in network runtime.");
  html = html.replace("</body>", `<script data-network-runtime="true">${runtime}</script></body>`);
}
const previewPath = join(output, "Yuwei_Chuai_Website_Preview.html");
writeFileSync(previewPath, html);

const zipPath = join(output, "Yuwei_Chuai_Academic_Website_GitHub.zip");
git("archive", "--format=zip", `--output=${zipPath}`, "HEAD", ".", ":(exclude).openai");
const staging = mkdtempSync(join(tmpdir(), "yuwei-portable-manifest-"));
mkdirSync(join(staging, ".openai"));
writeFileSync(join(staging, ".openai/hosting.json"), JSON.stringify({
  static: { directory: "dist/client" }, d1: null, r2: null,
}, null, 2) + "\n");
execFileSync("zip", ["-q", zipPath, ".openai/hosting.json"], { cwd: staging });
execFileSync("unzip", ["-tq", zipPath]);
const workflowPath = join(output, "deploy-pages.yml");
writeFileSync(workflowPath, readFileSync(join(root, ".github/workflows/deploy-pages.yml")));
console.log(JSON.stringify({ commit: git("rev-parse", "HEAD").trim(), previewPath, zipPath, workflowPath }, null, 2));
