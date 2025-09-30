import { defineConfig } from "tsdown";

import postcss from "rollup-plugin-postcss";

export default defineConfig({
  entry: ["src/index.ts", "src/lib/types.ts"],
  platform: "neutral",
  dts: true,
  // unbundle: true, // TODO: Bundle client and server components separately
  // plugins: [
  //   postcss({
  //     plugins: [],
  //   }),
  // ],
});
