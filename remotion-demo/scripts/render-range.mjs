import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compId = process.argv[2] || "walkthrough";
const outFile = process.argv[3] || `/mnt/documents/${compId}.mp4`;
const startFrame = parseInt(process.argv[4] ?? "0", 10);
const endFrameArg = process.argv[5];

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (c) => c,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

const composition = await selectComposition({ serveUrl: bundled, id: compId, puppeteerInstance: browser });
const endFrame = endFrameArg ? parseInt(endFrameArg, 10) : composition.durationInFrames - 1;

console.log(`Rendering ${compId} frames ${startFrame}-${endFrame} -> ${outFile}`);

await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: outFile,
  puppeteerInstance: browser,
  muted: true,
  concurrency: 2,
  frameRange: [startFrame, endFrame],
  jpegQuality: 80,
  crf: 23,
});

await browser.close({ silent: false });
console.log("Done:", outFile);
