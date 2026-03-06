import { esbuildPlugin } from "@web/dev-server-esbuild";

export default {
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true })],
  files: ["**!(node_modules)/*.test.(j|t)s"],
  concurrency: 1,
  testFramework: {
    config: {
      timeout: "5000",
    },
  },
};
