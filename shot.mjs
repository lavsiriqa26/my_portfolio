import { chromium } from "playwright-core";

const url = process.argv[2] || "http://localhost:3001";
const out = process.argv[3] || "/tmp/shot.png";
const full = process.argv[4] === "full";
const scrollTo = process.argv[5] ? Number(process.argv[5]) : null;

const exe =
  "/Users/gprasad/Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell";
const browser = await chromium.launch({ headless: true, executablePath: exe });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
await page.goto(url, { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
await page.waitForTimeout(2500); // let canvases/animations settle
if (scrollTo !== null) {
  await page.evaluate((y) => window.scrollTo(0, y), scrollTo);
  await page.waitForTimeout(1200);
}
await page.screenshot({ path: out, fullPage: full });
console.log("saved", out);
await browser.close();
