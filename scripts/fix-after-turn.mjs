import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { lstatSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function runPnpm(cwd, ...args) {
  const { status, stdout, stderr, error } = spawnSync(
    "pnpm",
    ["--config.verify-deps-before-run=false", ...args],
    { cwd, encoding: "utf8" },
  );
  if (status === 0) return true;

  console.error([error?.message, stdout?.trim(), stderr?.trim()].filter(Boolean).join("\n"));
  return false;
}

function fingerprintFiles(root, paths) {
  const files = new Map();
  for (const file of new Set(paths.split("\0"))) {
    if (!file || file === "src/routeTree.gen.ts") continue;
    const path = resolve(root, file);
    if (lstatSync(path, { throwIfNoEntry: false })?.isFile() && realpathSync(path) === path) {
      files.set(`./${file}`, createHash("sha256").update(readFileSync(path)).digest("hex"));
    }
  }
  return files;
}

function readSnapshot(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function runHook({ cwd, hook_event_name: event, session_id: sessionId, turn_id: turnId = null }) {
  if (!cwd || !sessionId || (event !== "UserPromptSubmit" && event !== "Stop")) return true;
  const hookRoot = fileURLToPath(new URL("..", import.meta.url));
  const commonDirArgs = ["rev-parse", "--path-format=absolute", "--git-common-dir"];
  if (git(cwd, ...commonDirArgs) !== git(hookRoot, ...commonDirArgs)) return true;

  const root = realpathSync(git(cwd, "rev-parse", "--show-toplevel").slice(0, -1));
  const key = createHash("sha256")
    .update(JSON.stringify([root, sessionId]))
    .digest("hex");
  const snapshotPath = resolve(tmpdir(), `oneforthecity-turn-${key}.json`);
  const snapshot = readSnapshot(snapshotPath);
  if (event === "UserPromptSubmit") {
    if (turnId && snapshot?.turnId === turnId) return true;
    rmSync(snapshotPath, { force: true });
    const paths = git(root, "ls-files", "--cached", "--others", "--exclude-standard", "-z");
    const files = Object.fromEntries(fingerprintFiles(root, paths));
    writeFileSync(snapshotPath, JSON.stringify({ turnId, files }), { flag: "wx", mode: 0o600 });
    return true;
  }

  if (!snapshot || snapshot.turnId !== turnId) return true;
  rmSync(snapshotPath, { force: true });
  const tracked = git(root, "diff", "--name-only", "--diff-filter=d", "-z", "HEAD", "--");
  const untracked = git(root, "ls-files", "--others", "--exclude-standard", "-z");
  const files = [];
  for (const [file, fingerprint] of fingerprintFiles(root, tracked + untracked)) {
    if (snapshot.files[file] !== fingerprint) files.push(file);
  }
  if (files.length === 0) return true;

  const lintPassed = runPnpm(root, "exec", "vp", "lint", "--fix", "--", ...files);
  const formatPassed = runPnpm(root, "fmt", "--no-error-on-unmatched-pattern", "--", ...files);
  return lintPassed && formatPassed;
}

try {
  const input = JSON.parse(readFileSync(0, "utf8") || "{}");
  if (runHook(input)) {
    console.log("{}");
  } else {
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error.stderr?.trim() || error.message);
  process.exitCode = 1;
}
