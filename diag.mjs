import { chromium } from "playwright-core";
const exe =
  "/Users/gprasad/Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell";
const browser = await chromium.launch({ headless: true, executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("console", (m) => console.log("CONSOLE:", m.type(), m.text()));
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message));
await page.goto("http://localhost:3001", { waitUntil: "networkidle" }).catch(() => {});
await page.waitForTimeout(2500);
// sample center pixel color of the webgl canvas
const info = await page.evaluate(() => {
  const c = document.querySelector("canvas");
  if (!c) return { found: false };
  // average a few pixels via a 2d copy
  const tmp = document.createElement("canvas");
  tmp.width = 40; tmp.height = 25;
  const ctx = tmp.getContext("2d");
  ctx.drawImage(c, 0, 0, 40, 25);
  const d = ctx.getImageData(0, 0, 40, 25).data;
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i+1]; b += d[i+2]; n++; }
  return { found: true, w: c.width, h: c.height, avg: [Math.round(r/n), Math.round(g/n), Math.round(b/n)], canvases: document.querySelectorAll("canvas").length };
});
console.log("CANVAS_INFO:", JSON.stringify(info));
await browser.close();
