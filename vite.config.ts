import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
  lint: {},
  fmt: {
    ignorePatterns: ["/src/routeTree.gen.ts"],
    sortTailwindcss: {
      stylesheet: "./src/tailwind.css",
      functions: ["clsx", "cn"],
      preserveWhitespace: true,
    },
  },
  server: {
    port: 3000,
  },
  plugins: lazyPlugins(() => [
    tailwindcss(),
    tanstackStart({}),
    viteReact(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    svgr(),
  ]),
  resolve: {
    tsconfigPaths: true,
  },
});
