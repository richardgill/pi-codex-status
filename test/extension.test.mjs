import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { Text } from "@earendil-works/pi-tui";
import codexUsageExtension from "../dist/extension.js";

test("declares Pi's TUI as an optional host peer, not a runtime dependency", async () => {
  const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(manifest.peerDependencies["@earendil-works/pi-tui"], "*");
  assert.equal(manifest.peerDependenciesMeta["@earendil-works/pi-tui"].optional, true);
  assert.equal(manifest.dependencies?.["@earendil-works/pi-tui"], undefined);
  assert.equal(manifest.dependencies?.["@mariozechner/pi-tui"], undefined);
});

test("compiled extension registers both aliases and renders with the supplied TUI", () => {
  const commands = new Map();
  const renderers = new Map();
  codexUsageExtension({
    registerCommand: (name, command) => commands.set(name, command),
    registerMessageRenderer: (name, renderer) => renderers.set(name, renderer),
    on: () => {},
  });

  assert.equal(typeof commands.get("codex-status")?.handler, "function");
  assert.equal(commands.get("status"), commands.get("codex-status"));
  const component = renderers.get("codex-status")({ content: "```\n>_ Codex usage\n```" }, {}, {});
  assert.ok(component instanceof Text);
  assert.deepEqual(component.render(80).map((line) => line.trimEnd()), [">_ Codex usage"]);
});
