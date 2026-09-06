import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Run the actual standalone consent driver with simulated DOM events. No
// third-party requests are made, and test IDs never enter the deployed config.
const code = ts.transpileModule(readFileSync("lib/analytics-dom.ts", "utf8").replace(/^import[^\n]+\n/, ""), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
function setup(protocol = "https:", initial = "unknown") {
  const element = dataset => ({ dataset, hidden: true, handlers: {}, attributes: {},
    addEventListener(name, callback) { this.handlers[name] = callback; },
    setAttribute(name, value) { this.attributes[name] = value; },
    focus() { this.focused = true; }, click() { this.handlers.click(); },
  });
  const banner = element({}), preferences = element({}), close = element({});
  const buttons = [element({consentChoice:"denied"}), element({consentChoice:"granted"})];
  const root = element({ analyticsId: "G-TEST123" });
  root.querySelector = name => name === ".consent-banner" ? banner : name === "[data-consent-preferences]" ? preferences : close;
  root.querySelectorAll = () => buttons;
  const calls = [];
  const api = {};
  vm.runInNewContext(code, {
    exports: api, document: {querySelectorAll: () => [root]},
    window: {location: {protocol, hostname:"example.github.io", reload:()=>calls.push("reload")}},
    validAnalyticsId: () => true, readAnalyticsChoice: () => initial,
    enableAnalytics: () => calls.push("enable"), disableAnalytics: () => calls.push("disable"),
    saveAnalyticsChoice: (_, value) => calls.push(value),
  });
  api.mountAnalytics();
  return {api, root, banner, preferences, close, buttons, calls};
}
test("static consent stays opt-in and supports allow, reopen and withdrawal", () => {
  const s = setup();
  assert.equal(s.root.hidden, false);
  assert.equal(s.banner.hidden, false);
  assert.deepEqual(s.calls, []);
  s.buttons[1].click();
  assert.deepEqual(s.calls, ["granted", "enable"]);
  assert.equal(s.banner.hidden, true);
  s.preferences.click();
  assert.equal(s.banner.hidden, false);
  s.buttons[0].click();
  assert.deepEqual(s.calls, ["granted", "enable", "denied", "disable", "reload"]);
});
test("saved refusal and local previews do not activate collection", () => {
  const denied = setup("https:", "denied");
  assert.equal(denied.banner.hidden, true);
  assert.deepEqual(denied.calls, []);
  const offline = setup("file:");
  assert.equal(offline.root.hidden, true);
  assert.deepEqual(offline.calls, []);
});
