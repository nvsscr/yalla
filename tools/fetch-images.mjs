// usage: node fetch-images.mjs <page.html> <paths.txt> <outDir>
import fs from "node:fs";
import path from "node:path";
const [page, pathsFile, outDir] = process.argv.slice(2);
const html = fs.readFileSync(page, "utf8");
const data = JSON.parse(html.split("/*DATA*/")[1].split("/*END*/")[0]);
const extra = ["Cat","Cat face","Hot beverage","Deciduous tree","Evergreen tree","Blossom","Sun with face","Cloud","Star","Party popper","Sparkles","Glowing star","Balloon","Trophy","Counterclockwise arrows button","House","Eyes","Video game","Speaker high volume","Speaking head","Red apple","Thumbs up","Thumbs down","Waving hand","Shuffle tracks button","Paw prints","Writing hand"];
const names = new Set(extra);
for (const c of data) { if (c.cover) names.add(c.cover); if (!c.type) c.items.forEach(i => names.add(i[3])); }
const paths = fs.readFileSync(pathsFile, "utf8").split(/\r?\n/).filter(Boolean);
const byName = new Map();
for (const p of paths) { const n = p.split("/")[1].toLowerCase(); (byName.get(n) || byName.set(n, []).get(n)).push(p); }
const slug = n => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
fs.mkdirSync(outDir, { recursive: true });
const missing = []; let total = 0;
for (const n of names) {
  const list = byName.get(n.toLowerCase());
  if (!list) { missing.push(n); continue; }
  const p = list.find(x => x.includes("/Medium-Light/")) || list.find(x => x.includes("/Default/")) || list[0];
  const out = path.join(outDir, slug(n) + ".png");
  if (!fs.existsSync(out)) {
    const url = "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/" + p.split("/").map(encodeURIComponent).join("/");
    const r = await fetch(url);
    if (!r.ok) { missing.push(n + " (HTTP " + r.status + ")"); continue; }
    fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
  }
  total += fs.statSync(out).size;
}
console.log("images:", names.size - missing.length, "total MB:", (total / 1e6).toFixed(1));
console.log("missing:", JSON.stringify(missing));
