import { defineConfig } from "electron-vite"
import appPlugin from "@mimo-ai/app/vite"
import * as fs from "node:fs/promises"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

const channel = (() => {
  const raw = process.env.OPENCODE_CHANNEL
  if (raw === "dev" || raw === "beta" || raw === "prod") return raw
  return "dev"
})()

const OPENCODE_SERVER_DIST = "../opencode/dist/node"

const nodePtyPkg = `@lydell/node-pty-${process.platform}-${process.arch}`

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const serverModulePath = path.resolve(__dirname, OPENCODE_SERVER_DIST, "node.js").replaceAll("\\", "/")
const serverModuleUrl = `file:///${serverModulePath}`

export default defineConfig({
  main: {
    define: {
      "import.meta.env.OPENCODE_CHANNEL": JSON.stringify(channel),
    },
    build: {
      rollupOptions: {
        input: { index: "src/main/index.ts" },
        external: [serverModuleUrl],
      },
      externalizeDeps: { include: [nodePtyPkg] },
    },
    plugins: [
      {
        name: "opencode:node-pty-narrower",
        enforce: "pre",
        resolveId(s) {
          if (s === "@lydell/node-pty") return nodePtyPkg
        },
      },
      {
        name: "opencode:virtual-server-module",
        enforce: "pre",
        resolveId(id) {
          if (id === "virtual:opencode-server") {
            return { id: serverModuleUrl, external: true }
          }
        },
      },
      {
        name: "opencode:copy-server-assets",
        async writeBundle() {
          const outDir = path.resolve(__dirname, "out/main/chunks")
          await fs.mkdir(outDir, { recursive: true })
          for (const l of await fs.readdir(OPENCODE_SERVER_DIST)) {
            if (!l.endsWith(".wasm")) continue
            await fs.writeFile(path.join(outDir, l), await fs.readFile(path.join(OPENCODE_SERVER_DIST, l)))
          }
        },
      },
    ],
  },
  preload: {
    build: {
      rollupOptions: {
        input: { index: "src/preload/index.ts" },
        output: {
          format: "cjs",
          entryFileNames: "[name].js",
        },
      },
    },
  },
  renderer: {
    plugins: [appPlugin],
    publicDir: "../../../app/public",
    root: "src/renderer",
    define: {
      "import.meta.env.VITE_OPENCODE_CHANNEL": JSON.stringify(channel),
    },
    build: {
      rollupOptions: {
        input: {
          main: "src/renderer/index.html",
          loading: "src/renderer/loading.html",
        },
      },
    },
  },
})
