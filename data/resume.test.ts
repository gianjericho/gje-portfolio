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

test("EagleRev is its own employer, not a tool in someone else's bullet", () => {
  const eagleRev = DATA.experience.find((e) => e.company.startsWith("EagleRev"));
  assert.ok(eagleRev, "expected an EagleRev experience entry");
  assert.equal(eagleRev.location, "United States");
  assert.equal(eagleRev.period, "June 2026");
  assert.ok(eagleRev.description.length >= 3);

  const wiser = DATA.experience.find((e) => e.company.startsWith("Wiser"));
  assert.ok(wiser, "expected a Wiser experience entry");
  for (const bullet of wiser.description) {
    assert.ok(
      !bullet.includes("EagleRev"),
      "EagleRev was a separate employer and must not appear as one of Gian's tools",
    );
  }
});

test("Wiser engagement is closed out at June 2026", () => {
  const wiser = DATA.experience.find((e) => e.company.startsWith("Wiser"));
  assert.equal(wiser?.period, "July 2025 – June 2026");
});

test("exactly one engagement is ongoing", () => {
  const ongoing = DATA.experience.filter((e) => e.period.includes("Present"));
  assert.equal(ongoing.length, 1, "only Jonathan & Cyber should be marked Present");
  assert.ok(ongoing[0].company.startsWith("Jonathan & Cyber"));
});

test("closed roles do not describe themselves in present tense", () => {
  const closed = DATA.experience.filter((e) => !e.period.includes("Present"));
  for (const role of closed) {
    for (const bullet of role.description) {
      const firstWord = bullet.split(" ")[0];
      assert.ok(
        !["Execute", "Orchestrate", "Manage", "Build", "Lead"].includes(firstWord),
        `"${role.company}" ended but a bullet opens with present-tense "${firstWord}"`,
      );
    }
  }
});

test("the CYBEREYE engagement reflects its real scope", () => {
  const current = DATA.experience.find((e) => e.company.startsWith("Jonathan & Cyber"));
  assert.ok(current, "expected a Jonathan & Cyber experience entry");
  assert.equal(current.period, "July 2026 – Present");
  assert.ok(
    current.description.length >= 5,
    "four bullets undersold a month of production security work",
  );
});

test("the degree is complete, not expected", () => {
  const university = DATA.education.find((e) =>
    e.institution === "Cavite State University",
  );
  assert.equal(university?.period, "June 2026");
  assert.ok(
    !DATA.summary.includes("Currently completing"),
    "summary must not describe an unfinished degree",
  );
});

test("the lead-gen project links to its real repository", () => {
  const leadGen = DATA.projects.find((p) => p.id === "b2b-lead-gen-automation");
  assert.equal(leadGen?.githubUrl, "https://github.com/gianjericho/Lead-Gen");
});

test("the YouTube channel is a featured media project with no repo link", () => {
  const channel = DATA.projects.find((p) => p.id === "your-daily-kawaii");
  assert.ok(channel, "expected a your-daily-kawaii project entry");
  assert.equal(channel.category, "media");
  assert.equal(channel.liveUrl, "https://www.youtube.com/@yourdailykawaii");
  assert.equal(channel.githubUrl, "", "yt-automation is unrelated to this channel");
  assert.equal(channel.featured, true);
  assert.ok(channel.highlights.length >= 4);
});

test("no project cites channel growth metrics", () => {
  const channel = DATA.projects.find((p) => p.id === "your-daily-kawaii");
  const text = [
    channel?.description ?? "",
    channel?.longDescription ?? "",
    ...(channel?.highlights ?? []),
  ].join(" ");
  for (const term of ["subscriber", "monetized", "views"]) {
    assert.ok(
      !text.toLowerCase().includes(term),
      `metrics go stale in JSON and are out of scope, found "${term}"`,
    );
  }
});
