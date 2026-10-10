/*
 * Starfield implementation adapted from:
 * https://github.com/joshrlowe/velocity/blob/main/apps/web/src/components/starfield.tsx
 *
 * MIT License
 * Copyright (c) 2026 Josh Lowe
 *
 * See THIRD_PARTY_NOTICES.md for the full license text.
 */

const TILE = 720;
const DENSITY_PX2 = 4200;

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildStarTile(theme) {
  const rand = mulberry32(0x02030a);
  const count = Math.round((TILE * TILE) / DENSITY_PX2);
  let starlight = "";
  let highlights = "";

  for (let i = 0; i < count; i++) {
    const x = (rand() * TILE).toFixed(1);
    const y = (rand() * TILE).toFixed(1);
    const b = rand();
    const r = (0.4 + 0.7 * b * b).toFixed(2);
    const baseOpacity = theme === "light" ? 0.18 : 0.12;
    const rangeOpacity = theme === "light" ? 0.34 : 0.38;
    const o = (baseOpacity + rangeOpacity * b).toFixed(2);
    const dot = `<circle cx="${x}" cy="${y}" r="${r}" opacity="${o}"/>`;

    if (b > 0.88) highlights += dot;
    else starlight += dot;
  }

  const soft = theme === "light" ? "#173f73" : "#bcd9ff";
  const bright = theme === "light" ? "#0b2345" : "#ffffff";

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}">` +
    `<g fill="${soft}">${starlight}</g><g fill="${bright}">${highlights}</g></svg>`
  );
}

function buildBackdrop(theme) {
  const tile = `url("data:image/svg+xml,${encodeURIComponent(buildStarTile(theme))}")`;
  const glows = theme === "light"
    ? [
        "radial-gradient(120% 90% at 50% -20%, rgb(23 63 115 / 0.035), transparent 60%)",
        "radial-gradient(90% 70% at 85% 110%, rgb(15 39 77 / 0.025), transparent 55%)",
      ]
    : [
        "radial-gradient(120% 90% at 50% -20%, rgb(10 30 110 / 0.10), transparent 60%)",
        "radial-gradient(90% 70% at 85% 110%, rgb(42 99 255 / 0.05), transparent 55%)",
      ];

  return [...glows, tile].join(", ");
}

const starfield = document.getElementById("skyfield");

function applyStarfield(theme) {
  if (!starfield) return;
  const next = theme === "light" ? "light" : "dark";
  starfield.style.backgroundColor = next === "light" ? "#ffffff" : "#02030a";
  starfield.style.backgroundImage = buildBackdrop(next);
  starfield.style.backgroundRepeat = "no-repeat, no-repeat, repeat";
}

applyStarfield(document.documentElement.dataset.theme || "dark");

window.addEventListener("portfolio-theme-change", event => {
  applyStarfield(event.detail?.theme || document.documentElement.dataset.theme || "dark");
});
