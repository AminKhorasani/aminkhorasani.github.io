// Career Constellation: progress-linked line and active branded stops.
// All content stays visible without JavaScript or when reduced motion is preferred.
(() => {
  const timeline = document.getElementById('career-timeline');
  if (!timeline) return;
  const stops = Array.from(timeline.querySelectorAll('.career-stop'));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  let scheduled = false;

  function paint() {
    scheduled = false;
    const rect = timeline.getBoundingClientRect();
    if (prefersReduced.matches) {
      timeline.style.setProperty('--career-progress', '1');
      stops.forEach(stop => stop.classList.add('is-current-in-view'));
      return;
    }
    // The progress marker advances as the reader's focus crosses the timeline.
    const focusLine = window.innerHeight * 0.58;
    const travel = Math.max(1, rect.height);
    const progress = clamp((focusLine - rect.top) / travel, 0, 1);
    timeline.style.setProperty('--career-progress', progress.toFixed(4));

    let closest = null;
    let distance = Infinity;
    for (const stop of stops) {
      const box = stop.getBoundingClientRect();
      const delta = Math.abs(box.top + box.height / 2 - focusLine);
      if (delta < distance) { closest = stop; distance = delta; }
    }
    const onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
    stops.forEach(stop => stop.classList.toggle('is-current-in-view', onScreen && stop === closest));
  }

  function requestPaint() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(paint);
  }

  window.addEventListener('scroll', requestPaint, { passive: true });
  window.addEventListener('resize', requestPaint, { passive: true });
  if (prefersReduced.addEventListener) prefersReduced.addEventListener('change', requestPaint);
  requestPaint();
})();
