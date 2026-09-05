import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

// Exercise the consent/loader code without contacting Google or a browser.
const code = ts.transpileModule(readFileSync("lib/analytics.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function setup(address = "https://example.github.io/academic/") {
  const storage = new Map();
  const scripts = new Map();
  const window = { location: new URL(address) };
  const document = {
    referrer: "https://example.org/search?q=private",
    cookie: "yuwei_ga4_ga=abc",
    getElementById: (id) => scripts.get(id),
    createElement: () => ({}),
    head: { appendChild: (script) => {
      scripts.set(script.id, script);
      script.remove = () => scripts.delete(script.id);
    } },
  };
  const localStorage = { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  const api = {};
  vm.runInNewContext(code, { exports: api, window, document, localStorage, URL, Date });
  return { api, window, document, scripts, storage };
}

test("unknown and declined preferences do not load a tag", () => {
  const { api, scripts, storage } = setup();
  assert.equal(api.readAnalyticsChoice("G-TEST123"), "unknown");
  api.saveAnalyticsChoice("G-TEST123", "denied");
  assert.equal(api.readAnalyticsChoice("G-TEST123"), "denied");
  assert.equal(scripts.size, 0);
  for (const key of storage.keys()) storage.set(key, JSON.stringify({ choice: "granted", expires: 1 }));
  assert.equal(api.readAnalyticsChoice("G-TEST123"), "unknown");
});

test("an explicit grant loads one tag with ad consent denied", () => {
  const { api, scripts, window } = setup();
  api.saveAnalyticsChoice("G-TEST123", "granted");
  api.enableAnalytics("G-TEST123");
  api.enableAnalytics("G-TEST123");
  assert.equal(scripts.size, 1);
  assert.equal(scripts.get("analytics-G-TEST123").src, "https://www.googletagmanager.com/gtag/js?id=G-TEST123");
  const commands = window.dataLayer.map((item) => Array.from(item));
  assert.equal(commands[0][1], "default");
  assert.equal(commands[0][2].analytics_storage, "denied");
  assert.equal(commands[1][2].analytics_storage, "granted");
  assert.equal(commands[1][2].ad_storage, "denied");
  assert.equal(commands[1][2].ad_user_data, "denied");
  assert.equal(commands[1][2].ad_personalization, "denied");
  assert.equal(commands[3][2].allow_google_signals, false);
  assert.equal(commands[3][2].page_referrer, "https://example.org");
  assert.equal(commands[3][2].cookie_path, "/academic/");
});

test("offline previews and invalid IDs never load a tag", () => {
  for (const address of ["file:///tmp/preview.html", "http://localhost:3000", "https://terminal.local/"]) {
    const { api, scripts } = setup(address);
    api.enableAnalytics("G-TEST123");
    assert.equal(scripts.size, 0);
  }
  const { api, scripts } = setup();
  for (const id of ["", "G-", "not-a-measurement-id", 'G-ABC\"><script>']) api.enableAnalytics(id);
  assert.equal(scripts.size, 0);
});

test("withdrawal disables collection and removes the site's analytics cookie", () => {
  const { api, scripts, window, document } = setup();
  api.enableAnalytics("G-TEST123");
  api.disableAnalytics("G-TEST123");
  assert.equal(window["ga-disable-G-TEST123"], true);
  assert.equal(scripts.size, 0);
  assert.match(document.cookie, /Max-Age=0/);
  assert.match(document.cookie, /Path=\/academic\//);
});
