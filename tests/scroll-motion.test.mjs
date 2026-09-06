import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync("app/globals.css", "utf8");
const network = readFileSync("public/research-network.js", "utf8");

test("anchor navigation cannot restart a section entrance animation", () => {
  assert.doesNotMatch(css, /scroll-behavior:\s*smooth/);
  assert.doesNotMatch(css, /gentle-arrival/);
  assert.doesNotMatch(css, /section:target[^{]*\{[^}]*animation:\s*none/s);
  assert.doesNotMatch(css, /section:focus-within[^{]*\{[^}]*animation:\s*none/s);
  assert.doesNotMatch(css, /profile:focus-within[^{]*\{[^}]*animation:\s*none/s);
});

test("the deployed page does not load a framework or intercept native anchors", () => {
  const html = readFileSync("dist/client/index.html", "utf8");
  assert.doesNotMatch(html, /__VINEXT|__NEXT|modulepreload|<script[^>]+src=|type="module"/);
  assert.match(html, /data-site-runtime="network"/);
  assert.match(html, /name="site-build"/);
  assert.doesNotMatch(network, /preventDefault|pushState|replaceState|scrollIntoView/);
});

test("sticky header and network avoid expensive work during scrolling", () => {
  assert.doesNotMatch(css, /backdrop-filter\s*:/);
  assert.match(network, /!scrolling/);
  assert.match(network, /addEventListener\("scroll"/);
  assert.match(network, /\{ passive: true \}/);
});
