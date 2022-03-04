import type { Plugin } from "unified";
import { mdastToPdf, Opts, ImageDataMap } from "./transformer";

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

const fonts = {
	Roboto: {
		normal: "Roboto-Regular.ttf",
		bold: "Roboto-Medium.ttf",
		italics: "Roboto-Italic.ttf",
		bolditalics: "Roboto-MediumItalic.ttf",
	  },
	Courier: {
	  normal: "Courier",
	  bold: "Courier-Bold",
	  italics: "Courier-Oblique",
	  bolditalics: "Courier-BoldOblique",
	},
	Helvetica: {
	  normal: "Helvetica",
	  bold: "Helvetica-Bold",
	  italics: "Helvetica-Oblique",
	  bolditalics: "Helvetica-BoldOblique",
	},
	Times: {
	  normal: "Times-Roman",
	  bold: "Times-Bold",
	  italics: "Times-Italic",
	  bolditalics: "Times-BoldItalic",
	},
	Symbol: {
	  normal: "Symbol",
	},
	ZapfDingbats: {
	  normal: "ZapfDingbats",
	},
  };

export type Options = Opts;

const remarkPdf: Plugin<[Options?]> = function (opts = {}) {
  let images: ImageDataMap = {};
  console.log(`output 1 ${opts.output}`); 
  this.Compiler = async (node) => {
	console.log(`Calling PDF compiler`);
    const out =  await mdastToPdf(node as any, opts, images, async (def): Promise<Buffer | Blob | undefined> => {
      const pdf = pdfMake.createPdf(def, undefined, fonts, pdfFonts.pdfMake.vfs);
	  console.log(`output ${opts.output}`); 
	  switch (opts.output ?? "buffer") {
        case "buffer":
          return new Promise((resolve) => {
            pdf.getBuffer(resolve);
          });
        case "blob":
          return new Promise((resolve) => {
            pdf.getBlob(resolve);
          });
		default:
			console.log(`Bad output ${opts.output}`);
      }
    });
	console.trace(`mdastToPdf completed`)
	return out as Buffer | Blob;
  };
};
export default remarkPdf;
