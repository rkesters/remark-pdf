import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "umd",
		name: pkg.main
      },
    ],
    external: Object.keys(pkg.dependencies),
    plugins: [typescript()],
  },
  {
    input: "src/node.ts",
    output: [
      {
        file: "lib/node.js",
		name: "lib/node.js",
        format: "umd",
      },
    ],
    external: Object.keys(pkg.dependencies),
    plugins: [typescript()],
  },
];
