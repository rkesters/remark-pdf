# remark-pdf

![npm](https://img.shields.io/npm/v/remark-pdf) ![check](https://github.com/inokawa/remark-pdf/workflows/check/badge.svg) ![demo](https://github.com/inokawa/remark-pdf/workflows/demo/badge.svg)

[remark](https://github.com/remarkjs/remark) plugin to compile markdown to pdf.

### 🚧 WIP 🚧

The goal is to support all nodes in [mdast](https://github.com/syntax-tree/mdast) syntax tree, but currently transformation and stylings may not be well.

If you have some feature requests or improvements, please create a [issue](https://github.com/inokawa/remark-pdf/issues) or [PR](https://github.com/inokawa/remark-pdf/pulls).

## Demo

https://inokawa.github.io/remark-pdf/

## Install

```sh
npm install remark-pdf
```

## Usage

### Browser

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import pdf from "remark-pdf";
import { saveAs } from "file-saver";

const processor = unified().use(markdown).use(pdf, { output: "blob" });

const text = "# hello world";

(async () => {
  const doc = await processor.process(text);
  const blob = await doc.result;
  saveAs(blob, "example.pdf");
})();
```

### Node.js

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import pdf from "remark-pdf/node";
import * as fs from "fs";

const processor = unified().use(markdown).use(pdf, { output: "buffer" });

const text = "# hello world";

(async () => {
  const doc = await processor.process(text);
  const buffer = await doc.result;
  fs.writeFileSync("example.pdf", buffer);
})();
```

## Options

| Key             | Default   | Type                  | Description                                                                                  |
| --------------- | --------- | --------------------- | -------------------------------------------------------------------------------------------- |
| output          | "buffer"  | `"buffer"` `"blob"`   | Set output type of `VFile.result`. `buffer` is `Promise<Buffer>`. `blob` is `Promise<Blob>`. |
| info            | undefined | TDocumentInformation? |                                                                                              |
| pageMargins     | undefined | Margins?              |                                                                                              |
| pageOrientation | undefined | PageOrientation?      |                                                                                              |
| pageSize        | undefined | PageSize?             |                                                                                              |
| userPassword    | undefined | string?               |                                                                                              |
| ownerPassword   | undefined | string?               |                                                                                              |
| permissions     | undefined | DocumentPermissions?  |                                                                                              |
| version         | undefined | PDFVersion?           |                                                                                              |
| watermark       | undefined | Watermark?            |                                                                                              |
