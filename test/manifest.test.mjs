import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("declares Pi's TUI as an optional host peer, with a build-only dependency", async () => {
  const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(manifest.peerDependencies["@mariozechner/pi-tui"], "*");
  assert.equal(manifest.peerDependenciesMeta["@mariozechner/pi-tui"].optional, true);
  assert.equal(manifest.dependencies?.["@mariozechner/pi-tui"], undefined);
  assert.equal(manifest.devDependencies["@mariozechner/pi-tui"], "^0.73.0");
});
