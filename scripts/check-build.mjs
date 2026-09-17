import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const dist = resolve("dist");
const base = `/${process.env.BASE_PATH || "/"}`.replace(/\/{2,}/g, "/").replace(/\/?$/, "/");
const required = [
  "index.html",
  "work/turbofan/index.html",
  "404.html",
  "og.png",
];

for (const path of required) {
  if (!existsSync(join(dist, path))) throw new Error(`Missing required build output: ${path}`);
}

const walk = (directory) => readdirSync(directory).flatMap((name) => {
  const path = join(directory, name);
  return statSync(path).isDirectory() ? walk(path) : [path];
});

const outputs = walk(dist);
if (outputs.some((path) => /\.pdf$/i.test(path))) throw new Error("Personal PDFs must not be published");
if (existsSync(join(dist, "work/hotel-ranking"))) throw new Error("Removed case study is still published");

const htmlFiles = outputs.filter((path) => path.endsWith(".html"));
const attributePattern = /\b(?:href|src)=["']([^"']+)["']/g;

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, "utf8");
  if (/resume\.pdf|work\/hotel-ranking|tel:/i.test(html)) {
    throw new Error(`${relative(dist, htmlFile)} contains a removed public contact or route`);
  }
  for (const match of html.matchAll(attributePattern)) {
    const raw = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|#)/.test(raw)) continue;
    const url = new URL(raw, "https://build.invalid/");
    let pathname = decodeURIComponent(url.pathname);
    if (base !== "/") {
      const prefix = base.slice(0, -1);
      if (!pathname.startsWith(`${prefix}/`) && pathname !== prefix) {
        throw new Error(`${relative(dist, htmlFile)} contains a path outside BASE_PATH: ${raw}`);
      }
      pathname = pathname.slice(prefix.length) || "/";
    }
    const outputPath = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
    if (!existsSync(join(dist, outputPath.replace(/^\//, "")))) {
      throw new Error(`${relative(dist, htmlFile)} links to missing output: ${raw}`);
    }
  }
}

console.log(`Verified ${htmlFiles.length} HTML files for base ${base}`);
