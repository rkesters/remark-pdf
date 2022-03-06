import fs from "fs";
import path, { dirname } from "path";
import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import footnotes from "remark-footnotes";
import frontmatter from "remark-frontmatter";
import math from "remark-math";
import pdf from "../src/plugin.js";
import { fileURLToPath } from "url";
import sinon from "sinon";
import rimraf from "rimraf";

import ava, { TestFn } from "ava";
const __dirname = dirname(fileURLToPath(import.meta.url));

const FIXTURE_PATH = "../fixtures";

const toPdfProcessor = unified().use(markdown).use(gfm).use(footnotes, { inlineNotes: true }).use(frontmatter, ["yaml", "toml"]).use(math).use(pdf, { output: "buffer" });

const fixturesDir = path.join(__dirname, FIXTURE_PATH);
const filenames = fs.readdirSync(fixturesDir);

const pdfDir = path.join(__dirname, "./pdfs");

try {
  process.env.WRITE_PDF ? fs.mkdirSync(pdfDir, {}) : null;
} catch {
  process.env.WRITE_PDF ? rimraf.sync(pdfDir) : null;
  process.env.WRITE_PDF ? fs.mkdirSync(pdfDir, {}) : null;
}
interface TestContext {
  clock: sinon.SinonFakeTimers;
}
const test = ava as TestFn<TestContext>;
filenames.forEach((filename) => {
  test.beforeEach("setup", (t) => {
    t.context.clock = sinon.useFakeTimers({
      now: new Date(2018, 5, 27, 11, 30, 0).getTime() / 1000,
      shouldAdvanceTime: true,
    });
  });
  test.afterEach("cleanup", (t) => {
    t.context.clock.restore();
  });
  test(filename, async (t: any) => {
    try {
      const doc = await toPdfProcessor.process(fs.readFileSync(path.join(fixturesDir, filename)));
      const result: any = await doc.result;
      t.snapshot(result);
      process.env.WRITE_PDF ? fs.writeFileSync(path.join(pdfDir, filename), result) : null;
    } catch (e) {
      console.log("CAUGHT");
      t.fail((e as Error).message);
    }
  });
});
