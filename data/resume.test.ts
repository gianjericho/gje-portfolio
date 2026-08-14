import test from "node:test";
import assert from "node:assert/strict";
import { DATA } from "./resume";

test("youtube channel is a first-class social link", () => {
  assert.equal(DATA.youtube, "https://www.youtube.com/@yourdailykawaii");
});

test("media skills group is populated", () => {
  assert.ok(Array.isArray(DATA.skills.media));
  assert.ok(DATA.skills.media.length > 0, "expected at least one media skill");
});

test("no dead avatarUrl reference", () => {
  assert.ok(
    !("avatarUrl" in DATA),
    "avatarUrl points at a nonexistent file and is consumed by no component",
  );
});

test("every project category is one of the five valid values", () => {
  const valid = new Set(["web", "mobile", "iot", "automation", "media"]);
  for (const project of DATA.projects) {
    assert.ok(
      valid.has(project.category),
      `project "${project.id}" has invalid category "${project.category}"`,
    );
  }
});
