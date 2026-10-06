// Standalone verification of the /live proxy rewrite logic against real HTML.
// Mirrors rewriteText() in app/live/[project]/[[...path]]/route.ts — keep in sync.

const project = "multiclima";
const upstreamOrigin = "https://app.multiclimainc.com";
const publicBase = "https://tribai.site/live/multiclima";
const prefix = `/live/${project}`;
const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function rewriteText(text, project, upstreamOrigin, publicBase) {
  const prefix = `/live/${project}`;
  const rest = prefix.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  text = text.split(upstreamOrigin).join(publicBase);
  text = text.split(`//${new URL(upstreamOrigin).host}`).join(publicBase);
  text = text.replace(
    /((?:srcset|imagesrcset)\s*=\s*")([^"]*)(")/gi,
    (_m, before, value, after) =>
      `${before}${value.replace(/(^|[\s,])\/(?!\/)((?![\s,"']))/g, (match, sep) =>
        match.slice(sep.length).startsWith(prefix)
          ? match
          : `${sep}${prefix}${match.slice(sep.length)}`,
      )}${after}`,
  );
  text = text.replace(
    new RegExp(`(["'])(?!//)\\/(?!${rest}(?:/|["']|$))`, "g"),
    `$1${prefix}/`,
  );
  text = text.replace(new RegExp(`url\\(\\s*\\/(?!${rest}/)`, "gi"), `url(${prefix}/`);
  return text;
}

const res = await fetch(upstreamOrigin + "/", { signal: AbortSignal.timeout(15_000) });
const html = await res.text();
console.log(`fetched ${res.status}, ${html.length} chars`);

const out = rewriteText(html, project, upstreamOrigin, publicBase);

let failures = 0;
function check(name, bad) {
  const hits = bad;
  if (hits > 0) {
    failures++;
    console.log(`FAIL  ${name}: ${hits} occurrence(s)`);
  } else {
    console.log(`ok    ${name}`);
  }
}

// 1. No leftover absolute upstream URLs.
check("no leftover upstream origin", (out.match(/app\.multiclimainc\.com/g) ?? []).length);

// 2. No root-absolute refs left in href/src (each must be prefixed).
check(
  "no unprefixed href/src root-refs",
  (out.match(/(?:href|src)\s*=\s*["']\/(?!live\/multiclima(?:\/|["']))/gi) ?? []).length,
);

// 3. No double-prefixing.
check("no double prefix", (out.match(/\/live\/multiclima\/live\/multiclima/g) ?? []).length);

// 4. Key assets got prefixed.
const cssRefs = (out.match(/\/live\/multiclima\/_next\/static\/[^"'\s)]+\.css/g) ?? []).length;
console.log(`      css refs rewritten: ${cssRefs}`);
if (cssRefs === 0) failures++;

const jsRefs = (out.match(/\/live\/multiclima\/_next\/static\/chunks\/[^"'\s)]+\.js/g) ?? []).length;
console.log(`      js chunk refs rewritten: ${jsRefs}`);
if (jsRefs === 0) failures++;

// 5. Root-absolute route hrefs rewritten (e.g. /login -> /live/multiclima/login).
const loginRefs = (out.match(/href="\/live\/multiclima\/[a-z]+"/gi) ?? []).length;
console.log(`      route hrefs rewritten: ${loginRefs}`);

// 6. origin URL became publicBase.
console.log(`      publicBase occurrences: ${(out.match(/https:\/\/tribai\.site\/live\/multiclima/g) ?? []).length}`);

// 7. srcset entries all prefixed (if any).
const srcsets = out.match(/srcset="([^"]*)"/gi) ?? [];
for (const s of srcsets) {
  const inner = s.slice(8, -1);
  const bad = inner.split(",").filter((e) => {
    const t = e.trim();
    return t.startsWith("/") && !t.startsWith(prefix + "/");
  });
  if (bad.length) {
    failures++;
    console.log(`FAIL  srcset has unprefixed entries: ${s.slice(0, 120)}`);
  }
}
console.log(`      srcset attrs checked: ${srcsets.length}`);

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
