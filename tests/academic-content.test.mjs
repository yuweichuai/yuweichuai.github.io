import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const client = resolve("dist/client");
const html = readFileSync(resolve(client, "index.html"), "utf8")
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

test("academic profile and key CV corrections are present", () => {
  for (const text of ["Yuwei Chuai", "Postdoctoral Researcher", "Institute for Network Sciences and Cyberspace",
    "PhD in Computer Science", "Beihang University", "Hefei University of Technology",
    "CLARITY", "REMEDIS", "Co-developed the proposal", "(PI)", "(co-PI)"]) {
    assert(html.includes(text), `Missing CV content: ${text}`);
  }
  assert(!html.includes("School of Economics and Management"));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
});

test("six selected publications have a title, DOI, and highlighted author", () => {
  const papers = [...html.matchAll(/<article class="publication">([\s\S]*?)<\/article>/g)];
  assert.equal(papers.length, 6);
  for (const [, paper] of papers) {
    assert.match(paper, /<h3><a href="https:\/\/doi.org\//);
    assert.match(paper, /<strong>Yuwei Chuai<\/strong>/);
    assert.match(paper, /class="paper-link"/);
    assert.match(paper, /<p class="publication-meta"><span class="publication-venue">/);
    assert.match(paper, /class="publication-venue">(?:<span class="venue-badge|<a class="publication-thumbnail")/);
  }
  assert.match(html, /width="19" height="19"/);
});

test("all fragment links resolve and IDs are unique", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, "Duplicate HTML IDs");
  for (const [, fragment] of html.matchAll(/\bhref="#([^"]+)"/g)) {
    assert(ids.includes(fragment), `Unresolved anchor: ${fragment}`);
  }
});

test("local content assets exist and external tabs are protected", () => {
  for (const [tag, href] of [...html.matchAll(/<[^>]*\b(?:src|href)="(\.\/[^"#]+)"[^>]*>/g)]) {
    assert(existsSync(resolve(client, href)), `Missing asset: ${href}`);
    if (tag.startsWith("<img")) assert.match(tag, /\balt="[^"]+"/);
  }
  for (const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.match(tag, /rel="noopener noreferrer"/);
  }
});
