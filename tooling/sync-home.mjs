import { cp, mkdtemp, rename, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(process.argv[2] || join(root, "../home/flat-3d"));
const temporary = await mkdtemp(join(tmpdir(), "landing-home-"));
const destination = join(root, "public/flat-3d");
const staging = join(root, "public/.flat-3d-staging");

try {
  // Build a snapshot so the original project and its dist stay unchanged.
  for (const entry of ["src", "public", "index.html", "package.json", "tsconfig.json", "vite.config.ts"]) {
    await cp(join(source, entry), join(temporary, entry), { recursive: true });
  }
  await symlink(join(source, "node_modules"), join(temporary, "node_modules"), "dir");
  const build = spawnSync("npm", ["run", "build"], { cwd: temporary, stdio: "inherit" });
  if (build.error) throw build.error;
  if (build.status !== 0) throw new Error(`Flat build failed (${build.status}).`);

  await cp(join(temporary, "dist"), staging, { recursive: true });
  await rm(destination, { recursive: true, force: true });
  await rename(staging, destination);
  console.log("Updated public/flat-3d. Run npm run build to check the full site.");
} finally {
  await rm(temporary, { recursive: true, force: true });
  await rm(staging, { recursive: true, force: true });
}
