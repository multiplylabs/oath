// Typesets every <span class="m" data-tex="..."> in index.html as inline SVG with MathJax, so the
// notation matches the paper exactly and the page needs no math library at runtime.
// Add class "d" for a display equation. Edit the TeX in data-tex, then re-run:
//
//     cd tools && npm install && node render-math.mjs
//
import { readFileSync, writeFileSync } from "node:fs";
import { mathjax } from "mathjax-full/js/mathjax.js";
import { TeX } from "mathjax-full/js/input/tex.js";
import { SVG } from "mathjax-full/js/output/svg.js";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor.js";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html.js";
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages.js";

const file = new URL("../index.html", import.meta.url);
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
// fontCache "none" writes each glyph's path inline, so every SVG is self-contained.
const doc = mathjax.document("", { InputJax: new TeX({ packages: AllPackages }), OutputJax: new SVG({ fontCache: "none" }) });

const unescape = (s) =>
  s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

let count = 0;
const html = readFileSync(file, "utf8").replace(
  /<span class="m( d)?" data-tex="([^"]*)">[\s\S]*?<\/span><!--\/m-->/g,
  (_, display, tex) => {
    const node = doc.convert(unescape(tex), { display: Boolean(display) });
    const svg = adaptor.innerHTML(node).replace(/ role="img"/, ' role="img" aria-hidden="true"');
    count += 1;
    return `<span class="m${display ?? ""}" data-tex="${tex}">${svg}</span><!--/m-->`;
  },
);
writeFileSync(file, html);
console.log(`Typeset ${count} expressions in index.html`);
