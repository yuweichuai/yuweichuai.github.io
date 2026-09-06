// A small, build-time BibTeX reader. No parsing or requests in visitors' browsers.
// Supports nested braces, quoted/numeric values, comments, @string and # joins.
export function parseBibtex(source) {
  let pos = 0;
  const entries = [];
  const keys = new Set();
  const strings = Object.fromEntries("jan feb mar apr may jun jul aug sep oct nov dec".split(" ").map(x => [x, x]));
  const fail = message => { throw new Error(`publications.bib, line ${source.slice(0, pos).split("\n").length}: ${message}`); };
  function space() {
    while (pos < source.length) {
      if (/\s/.test(source[pos])) pos++;
      else if (source[pos] === "%") { while (pos < source.length && source[pos] !== "\n") pos++; }
      else break;
    }
  }
  function delimited(open, close) {
    if (source[pos++] !== open) fail(`Expected ${open}`);
    let value = "", depth = 0;
    while (pos < source.length) {
      const char = source[pos++];
      if (char === "\\") { value += char + (source[pos++] ?? ""); continue; }
      if (char === close && depth === 0) return value;
      if (char === "{") depth++;
      if (char === "}") depth--;
      value += char;
    }
    fail(`Unclosed ${open}`);
  }
  function value() {
    space();
    let result;
    if (source[pos] === "{") result = delimited("{", "}");
    else if (source[pos] === '"') result = delimited('"', '"');
    else {
      const token = source.slice(pos).match(/^[^\s,#})]+/)?.[0];
      if (!token) fail("Expected a field value");
      pos += token.length;
      result = /^\d+$/.test(token) ? token : strings[token.toLowerCase()];
      if (result === undefined) fail(`Unknown string ${token}; put text in braces`);
    }
    space();
    if (source[pos] === "#") { pos++; result += value(); }
    return result;
  }
  while (pos < source.length) {
    space();
    if (pos >= source.length) break;
    // BibTeX permits explanatory text between entries.
    if (source[pos] !== "@") { pos++; continue; }
    pos++;
    const type = source.slice(pos).match(/^[a-z]+/i)?.[0];
    if (!type) fail("Missing entry type after @");
    pos += type.length;
    space();
    const open = source[pos];
    const close = open === "{" ? "}" : ")";
    if (!["{", "("].includes(open)) fail("Expected { or (");
    if (type.toLowerCase() === "comment") { delimited(open, close); continue; }
    pos++;
    space();
    if (type.toLowerCase() === "preamble") { value(); space(); if (source[pos] === ",") pos++; space(); if (source[pos++] !== close) fail("Unclosed preamble"); continue; }
    let key = "";
    if (type.toLowerCase() !== "string") {
      key = source.slice(pos).match(/^[^\s,}()]+/)?.[0] ?? "";
      if (!key || keys.has(key)) fail(`Missing or duplicate citation key: ${key}`);
      keys.add(key); pos += key.length; space();
      if (source[pos++] !== ",") fail(`Expected comma after ${key}`);
    }
    const fields = Object.create(null);
    while (true) {
      space();
      if (source[pos] === close) { pos++; break; }
      const field = source.slice(pos).match(/^[\w-]+/)?.[0];
      if (!field) fail(`Invalid field in ${key || "@string"}`);
      pos += field.length; space();
      if (source[pos++] !== "=") fail(`Expected = after ${field}`);
      if (fields[field.toLowerCase()] !== undefined) fail(`Duplicate field ${field}`);
      fields[field.toLowerCase()] = value();
      space();
      if (source[pos] === ",") pos++;
      else if (source[pos] !== close) fail(`Expected comma after ${field}`);
    }
    if (type.toLowerCase() === "string") Object.assign(strings, fields);
    else entries.push({ key, type: type.toLowerCase(), fields });
  }
  return entries;
}

export function bibText(value = "") {
  const accents = { '"': "\u0308", "'": "\u0301", "`": "\u0300", "^": "\u0302", "~": "\u0303", "=": "\u0304", ".": "\u0307", c: "\u0327", v: "\u030c", u: "\u0306", H: "\u030b", r: "\u030a" };
  const letters = { ss: "ß", ae: "æ", AE: "Æ", oe: "œ", OE: "Œ", o: "ø", O: "Ø", l: "ł", L: "Ł", i: "i", j: "j", textendash: "–", textemdash: "—", textquotesingle: "’", textquoteright: "’", textasciitilde: "~", LaTeX: "LaTeX", TeX: "TeX" };
  return value
    .replace(/\\(["'`^~=\.cvuHr])\s*\{?([A-Za-z])\}?/g, (_, mark, char) => (char + accents[mark]).normalize("NFC"))
    .replace(/\\(textit|textbf|emph|textrm|textnormal|url)\s*/g, "")
    .replace(/\\([A-Za-z]+)\b(?:\{\})?/g, (match, name) => letters[name] ?? match)
    .replace(/\\([&%_#$ {}])/g, "$1")
    .replace(/[{}]/g, "").replace(/~/g, " ")
    .replace(/---/g, "—").replace(/--/g, "–")
    .replace(/\s+/g, " ").trim();
}

function splitNames(raw) {
  let depth = 0, start = 0;
  const result = [];
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === "\\") { i++; continue; }
    if (raw[i] === "{") depth++;
    if (raw[i] === "}") depth--;
    const separator = depth === 0 && raw.slice(i).match(/^\s+and\s+/i);
    if (separator) { result.push(raw.slice(start, i)); i += separator[0].length - 1; start = i + 1; }
  }
  result.push(raw.slice(start));
  return result.filter(x => x.trim()).map(rawName => {
    if (/^\s*\{[\s\S]*\}\s*$/.test(rawName)) return bibText(rawName);
    const parts = rawName.split(",").map(bibText);
    return parts.length === 1 ? parts[0] : parts.length === 2 ? `${parts[1]} ${parts[0]}` : `${parts[2]} ${parts[0]}, ${parts[1]}`;
  });
}
const normalize = name => name.normalize("NFC").toLocaleLowerCase().replace(/\s+/g, " ").trim();

export function getPublications(source, venues, owner = "Yuwei Chuai") {
  return parseBibtex(source).filter(({ fields }) => !/^(false|no|0)$/i.test(fields.selected ?? "")).map(({ key, fields }) => {
    for (const field of ["title", "author", "year"]) {
      if (!fields[field]?.trim()) throw new Error(`${key}: missing ${field}`);
    }
    const venueText = bibText(fields.journal || fields.booktitle || fields.venue || "Preprint");
    const hint = `${venueText} ${fields.number || ""} ${fields.series || ""}`;
    const venueKey = fields.venue?.toLowerCase() || Object.keys(venues).find(id => venues[id].patterns.some(pattern => new RegExp(pattern, "i").test(hint)));
    if (fields.venue && !venues[venueKey]) throw new Error(`${key}: unknown venue ${fields.venue}; add it to data/venues.json`);
    const venue = venues[venueKey];
    const names = splitNames(fields.author);
    const corresponding = /^(true|yes|1)$/i.test(fields.corresponding ?? "") ? [owner] : /^(false|no|0)$/i.test(fields.corresponding ?? "") ? [] : splitNames(fields.corresponding ?? "");
    for (const name of corresponding) {
      if (!names.some(author => normalize(author) === normalize(name))) throw new Error(`${key}: corresponding author "${name}" is not in the author list`);
    }
    const doi = fields.doi?.trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "");
    const href = doi ? `https://doi.org/${doi}` : fields.url?.trim() || "";
    if (href && !/^https?:\/\/[^\s]+$/i.test(href)) throw new Error(`${key}: use an http(s) DOI or URL`);
    const title = bibText(fields.title);
    if ([title, ...names].some(text => /\\[a-zA-Z]/.test(text))) throw new Error(`${key}: unsupported LaTeX command; use its UTF-8 equivalent`);
    return {
      key, title, year: bibText(fields.year), href,
      venue: venue?.label || venueText,
      logo: venue?.logos?.[fields.year] || venue?.logo || "",
      logoAlt: venue?.logos?.[fields.year] ? `${venue.label} ${fields.year} logo` : venue?.logoAlt || `${venue?.label || venueText} logo`,
      badge: venue?.badge || "Paper",
      authors: names.map(name => ({ name, owner: normalize(name) === normalize(owner), corresponding: corresponding.some(author => normalize(author) === normalize(name)) })),
    };
  });
}
