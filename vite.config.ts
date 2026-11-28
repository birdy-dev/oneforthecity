import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
  lint: {
    ignorePatterns: ["/src/archive/**", "/src/route-tree.gen.ts"],
    options: { typeAware: true },
    plugins: ["typescript", "unicorn", "oxc", "react", "jsx-a11y"],
    rules: {
      "typescript/no-floating-promises": "error",
      "typescript/no-explicit-any": "error",
      "react/rules-of-hooks": "error",
      "react/exhaustive-deps": "error",
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/control-has-associated-label": "error",
    },
    overrides: [
      {
        files: ["**/*.test.ts", "**/*.test.tsx"],
        rules: { "typescript/no-explicit-any": "off" },
      },
    ],
  },
  fmt: {
    ignorePatterns: ["/src/route-tree.gen.ts"],
    sortTailwindcss: {
      stylesheet: "./src/tailwind.css",
      functions: ["clsx", "cn"],
      preserveWhitespace: true,
    },
  },
  plugins: lazyPlugins(() => {
    if (process.env.VITEST === "true") return [];

    return [
      tailwindcss(),
      tanstackStart({ router: { generatedRouteTree: "route-tree.gen.ts" } }),
      viteReact({ compiler: true }),
      cloudflare({ viteEnvironment: { name: "ssr" } }),
      svgr(),
    ];
  }),
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    globals: false,
  },
});
