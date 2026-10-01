const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('year').textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -30px' });
  revealItems.forEach((el) => observer.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add('visible'));
}

const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeStars() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.min(180, Math.floor((innerWidth * innerHeight) / 9500));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.1 + .2,
    a: Math.random() * .55 + .15,
    s: Math.random() * .08 + .015
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const s of stars) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(188,255,207,${s.a})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    if (!reduceMotion) {
      s.y += s.s;
      if (s.y > innerHeight + 4) s.y = -4;
    }
  }
  if (!reduceMotion) requestAnimationFrame(drawStars);
}

resizeStars();
drawStars();
window.addEventListener('resize', resizeStars, { passive: true });

const planet = document.getElementById('planet-wrap');
if (planet && !reduceMotion) {
  window.addEventListener('pointermove', (e) => {
    const x = (e.clientX / innerWidth - .5) * 10;
    const y = (e.clientY / innerHeight - .5) * -8;
    planet.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
  }, { passive: true });
}

async function loadGithubSignal() {
  try {
    const res = await fetch('https://api.github.com/users/AminKhorasani', {
      headers: { 'Accept': 'application/vnd.github+json' }
    });
    if (!res.ok) return;
    const data = await res.json();
    const repo = document.getElementById('repo-count');
    const followers = document.getElementById('follower-count');
    if (repo) repo.textContent = data.public_repos ?? '—';
    if (followers) followers.textContent = data.followers ?? '—';
  } catch (_) {}
}
loadGithubSignal();
