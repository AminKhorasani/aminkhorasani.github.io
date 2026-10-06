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

function buildStarTile() {
  const rand = mulberry32(0x02030a);
  const count = Math.round((TILE * TILE) / DENSITY_PX2);
  let starlight = "";
  let white = "";

  for (let i = 0; i < count; i++) {
    const x = (rand() * TILE).toFixed(1);
    const y = (rand() * TILE).toFixed(1);
    const b = rand();
    const r = (0.4 + 0.7 * b * b).toFixed(2);
    const o = (0.12 + 0.38 * b).toFixed(2);
    const dot = `<circle cx="${x}" cy="${y}" r="${r}" opacity="${o}"/>`;

    if (b > 0.88) white += dot;
    else starlight += dot;
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}">` +
    `<g fill="#bcd9ff">${starlight}</g><g fill="#ffffff">${white}</g></svg>`
  );
}

const STAR_TILE = `url("data:image/svg+xml,${encodeURIComponent(buildStarTile())}")`;

const BACKDROP = [
  "radial-gradient(120% 90% at 50% -20%, rgb(10 30 110 / 0.10), transparent 60%)",
  "radial-gradient(90% 70% at 85% 110%, rgb(42 99 255 / 0.05), transparent 55%)",
  STAR_TILE,
].join(", ");

const starfield = document.getElementById("skyfield");

if (starfield) {
  starfield.style.backgroundImage = BACKDROP;
  starfield.style.backgroundRepeat = "no-repeat, no-repeat, repeat";
}
