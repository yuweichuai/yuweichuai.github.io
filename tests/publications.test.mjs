import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { bibText, getPublications, parseBibtex } from "../lib/publications.mjs";
const venues = JSON.parse(readFileSync("data/venues.json", "utf8"));
const paper = fields => `@article{test, title={A {nested} title}, author={Doe, Jane and Chuai, Yuwei}, year=2026, ${fields}}`;

test("CSCW issue suffixes select the conference without mislabelling all PACM HCI papers", () => {
  const [p] = getPublications(paper('journal={Proceedings of the ACM on Human-Computer Interaction}, number={CSCW2}'), venues);
  assert.equal(p.venue, "PACM HCI · CSCW");
  assert(p.logo);
});

test("import common BibTeX exports, accents and explicit corresponding authors", () => {
  const [p] = getPublications(paper('journal={Nature Communications}, doi={10.1/test}, corresponding={Chuai, Yuwei}'), venues);
  assert.equal(p.title, "A nested title");
  assert.equal(p.venue, "Nature Communications");
  assert.deepEqual(p.authors, [{name:"Jane Doe", owner:false, corresponding:false}, {name:"Yuwei Chuai", owner:true, corresponding:true}]);
  assert.equal(bibText(String.raw`Pr{\"o}llochs, Troussel-Cl{\'e}ment \& {LLM}s`), "Pröllochs, Troussel-Clément & LLMs");
});
test("string macros, quoted values, numeric fields and concatenation", () => {
  const entries = parseBibtex('@string{v="Nature"} % comment\n@article(a, title="A {quoted} title", year=2026, journal=v # { Communications})');
  assert.equal(entries[0].fields.journal, "Nature Communications");
  assert.equal(entries[0].fields.year, "2026");
});
test("preserve file order, skip hidden entries and do not invent corresponding roles", () => {
  const list = getPublications(paper('journal={Example}') + paper('selected={false}').replace('{test,','{hidden,'), venues);
  assert.equal(list.length, 1);
  assert.equal(list[0].href, "");
  assert(list[0].authors.every(a => !a.corresponding));
});
test("venue inference, a shared logo, names with particles and corporate authors", () => {
  const [p] = getPublications('@inproceedings{a, title={Test}, author={{Research and Development} and van der Waals, Johannes and Chuai, Yuwei}, year=2026, booktitle={CHI Conference on Human Factors in Computing Systems}, corresponding={true}}', venues);
  assert.equal(p.venue, "ACM CHI");
  assert.equal(p.authors[0].name, "Research and Development");
  assert.equal(p.authors[1].name, "Johannes van der Waals");
  assert.equal(p.authors[2].corresponding, true);
});
test("bad entries stop deployment with an actionable error", () => {
  assert.throws(() => parseBibtex(paper('') + paper('')), /duplicate citation key/);
  assert.throws(() => parseBibtex('@article{x, title={unclosed'), /Unclosed/);
  assert.throws(() => getPublications(paper('corresponding={Someone Else}'), venues), /not in the author list/);
  assert.throws(() => getPublications(paper('url={javascript:alert(1)}'), venues), /http\(s\)/);
  assert.throws(() => getPublications(paper('venue={unknown}'), venues), /unknown venue/);
});
