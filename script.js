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


// i18n: bilingual portfolio
const I18N_KEY = 'amin-portfolio-language';

const translations = {
  en: {
    title: 'Amin Khorasani — Data · AI · Analytics',
    description: 'Amin Khorasani — Data, AI, Analytics and Product Engineering. Selected work, experiments and open-source projects.',
    nav: ['About', 'Experience', 'Work', 'Contact'],
    navAria: 'Primary navigation',
    github: 'GitHub ↗',
    eyebrow: 'DATA · AI · ANALYTICS · PRODUCT ENGINEERING',
    heroTitle: 'I build systems that turn <span class="gradient-text">messy signals</span> into clear decisions.',
    heroLede: 'I’m Amin Khorasani. I work at the intersection of analytics, AI, data systems and product — from finding the signal to shipping the software.',
    explore: 'Explore the orbit <span>↓</span>',
    linkedin: 'LinkedIn ↗',
    stats: ['public repos', 'GitHub followers', 'focus areas'],
    statsAria: 'Live GitHub profile stats',
    space: ['AI', 'DATA', 'PRODUCT', 'ANALYTICS'],
    aboutKicker: '01 / MISSION CONTROL',
    aboutTitle: 'The useful part is not the dashboard.<br />It’s the decision after it.',
    aboutP1: 'Most of my work starts with an ambiguous problem: a metric that needs explanation, a workflow that should be automated, a backend that needs structure, or an idea that needs to become a real product.',
    aboutP2: 'I like building systems that do more than report what happened. They should preserve context, explain drivers, surface what matters and make the next action easier.',
    capabilities: [
      ['Analytics', 'KPI systems, root-cause thinking, experimentation and decision support.'],
      ['AI', 'LLM-powered workflows, agentic systems and reasoning layers around real data.'],
      ['Data', 'SQL-heavy analysis, data products, reliable metrics and pragmatic architecture.'],
      ['Product', 'Turning analysis into interfaces, tools and products people can actually use.']
    ],
    expKicker: '02 / EXPERIENCE ORBIT',
    expTitle: 'Where I’m building now.',
    careerLink: 'Full career history on LinkedIn ↗',
    currentOrbit: 'CURRENT ORBIT',
    dataDecisions: 'Data × Decisions',
    current: 'CURRENT',
    companyRole: 'Data · Analytics · AI',
    workKicker: '03 / SELECTED MISSIONS',
    workTitle: 'Things I’ve shipped,<br />tested and learned from.',
    workIntro: 'A mix of product engineering and analytical work. These are public projects — not a list of employers.',
    projectTypes: ['PRODUCT / FINTECH', 'PRODUCT / COMMUNITY', 'ANALYTICS / CASE STUDY'],
    projectDescriptions: [
      'A personal-finance Telegram Mini App for accounts, transactions, budgets, goals and safe-to-spend — built with finance-safe money handling.',
      'A Persian, mobile-first food-discovery community for Tehran with reviews, collections, events, reputation and an admin moderation layer.',
      'A data-analysis case study spanning collection, cleaning, modeling, visualization, dashboarding and database design for restaurant data.'
    ],
    viewRepo: 'View repository ↗',
    workFooter: 'More experiments, coursework and open-source work live on GitHub.',
    browseRepos: 'Browse all repositories ↗',
    stackKicker: '04 / TOOLKIT',
    stackTitle: 'The stack changes.<br />The problem-solving loop doesn’t.',
    stackAria: 'Technology stack',
    contactKicker: '05 / OPEN CHANNEL',
    contactTitle: 'Have a messy problem<br />worth turning into a system?',
    contactCopy: 'The easiest way to reach me is on LinkedIn. You can also explore the code trail on GitHub.',
    connectLinkedin: 'Connect on LinkedIn ↗',
    orbitOnline: 'Orbit online',
    backTop: 'Back to top ↑',
    footerName: 'Amin Khorasani',
    switchAria: 'Language',
    switchToEn: 'Switch to English',
    switchToFa: 'Switch to Persian'
  },
  fa: {
    title: 'امین خراسانی — داده · هوش مصنوعی · تحلیل',
    description: 'وب‌سایت شخصی امین خراسانی؛ داده، هوش مصنوعی، تحلیل، مهندسی محصول و پروژه‌های منتخب.',
    nav: ['درباره من', 'تجربه', 'کارها', 'ارتباط'],
    navAria: 'ناوبری اصلی',
    github: 'گیت‌هاب ↗',
    eyebrow: 'داده · هوش مصنوعی · تحلیل · مهندسی محصول',
    heroTitle: 'سیستم‌هایی می‌سازم که <span class="gradient-text">سیگنال‌های پراکنده</span> را به تصمیم‌های روشن تبدیل می‌کنند.',
    heroLede: 'من امین خراسانی‌ام. در تقاطع تحلیل، هوش مصنوعی، سیستم‌های داده و محصول کار می‌کنم؛ از پیدا کردن سیگنال تا ساخت و تحویل نرم‌افزار.',
    explore: 'مسیر کارها را ببین <span>↓</span>',
    linkedin: 'لینکدین ↗',
    stats: ['ریپوی عمومی', 'دنبال‌کننده در گیت‌هاب', 'حوزه‌ی تمرکز'],
    statsAria: 'آمار زنده‌ی پروفایل گیت‌هاب',
    space: ['هوش مصنوعی', 'داده', 'محصول', 'تحلیل'],
    aboutKicker: '۰۱ / مرکز کنترل',
    aboutTitle: 'بخش مفید کار، داشبورد نیست.<br />تصمیمی است که بعد از آن گرفته می‌شود.',
    aboutP1: 'بیشتر کارهای من از یک مسئله‌ی مبهم شروع می‌شود: متریکی که نیاز به توضیح دارد، فرایندی که باید خودکار شود، بک‌اندی که به ساختار نیاز دارد، یا ایده‌ای که باید به یک محصول واقعی تبدیل شود.',
    aboutP2: 'دوست دارم سیستم‌هایی بسازم که فقط نگویند چه اتفاقی افتاده؛ بلکه زمینه را حفظ کنند، درایورها را توضیح دهند، چیزهای مهم را برجسته کنند و تصمیم بعدی را آسان‌تر کنند.',
    capabilities: [
      ['تحلیل', 'سیستم‌های KPI، تحلیل علت ریشه‌ای، آزمایش و پشتیبانی از تصمیم‌گیری.'],
      ['هوش مصنوعی', 'فلوهای مبتنی بر LLM، سیستم‌های Agentic و لایه‌های استدلال روی داده‌ی واقعی.'],
      ['داده', 'تحلیل عمیق با SQL، محصولات داده‌ای، متریک‌های قابل اتکا و معماری عمل‌گرا.'],
      ['محصول', 'تبدیل تحلیل به رابط، ابزار و محصولی که واقعاً قابل استفاده باشد.']
    ],
    expKicker: '۰۲ / مدار تجربه',
    expTitle: 'جایی که الان در آن می‌سازم.',
    careerLink: 'مسیر کامل کاری در لینکدین ↗',
    currentOrbit: 'مدار فعلی',
    dataDecisions: 'داده × تصمیم',
    current: 'فعلی',
    companyRole: 'داده · تحلیل · هوش مصنوعی',
    workKicker: '۰۳ / ماموریت‌های منتخب',
    workTitle: 'چیزهایی که ساخته‌ام،<br />آزموده‌ام و از آن‌ها یاد گرفته‌ام.',
    workIntro: 'ترکیبی از مهندسی محصول و کار تحلیلی. این‌ها پروژه‌های عمومی‌اند، نه فهرست محل‌های کار من.',
    projectTypes: ['محصول / فین‌تک', 'محصول / کامیونیتی', 'تحلیل / مطالعه‌ی موردی'],
    projectDescriptions: [
      'یک Telegram Mini App برای مدیریت مالی شخصی؛ از حساب و تراکنش تا بودجه، هدف مالی و محاسبه‌ی پول آزاد، با منطق امن برای محاسبات مالی.',
      'یک کامیونیتی فارسی و موبایل‌فرست برای کشف تجربه‌های غذایی تهران، با ریویو، کالکشن، رویداد، اعتبار کاربر و لایه‌ی مدیریت و moderation.',
      'یک مطالعه‌ی موردی تحلیل داده از جمع‌آوری و پاک‌سازی تا مدل‌سازی، ویژوالایزیشن، داشبورد و طراحی دیتابیس برای داده‌های رستوران.'
    ],
    viewRepo: 'مشاهده‌ی ریپو ↗',
    workFooter: 'آزمایش‌ها، تمرین‌ها و پروژه‌های اوپن‌سورس بیشتری در گیت‌هابم هست.',
    browseRepos: 'مشاهده‌ی همه‌ی ریپوها ↗',
    stackKicker: '۰۴ / ابزارها',
    stackTitle: 'ابزارها عوض می‌شوند.<br />چرخه‌ی حل مسئله نه.',
    stackAria: 'تکنولوژی‌ها و ابزارها',
    contactKicker: '۰۵ / کانال باز',
    contactTitle: 'یک مسئله‌ی پیچیده داری<br />که ارزش تبدیل‌شدن به سیستم را داشته باشد؟',
    contactCopy: 'ساده‌ترین راه ارتباط با من لینکدین است. رد کدها و پروژه‌ها را هم می‌توانی در گیت‌هاب ببینی.',
    connectLinkedin: 'ارتباط در لینکدین ↗',
    orbitOnline: 'مدار آنلاین',
    backTop: 'بازگشت به بالا ↑',
    footerName: 'امین خراسانی',
    switchAria: 'تغییر زبان',
    switchToEn: 'تغییر به انگلیسی',
    switchToFa: 'تغییر به فارسی'
  }
};

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}

function setHtml(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.innerHTML = value;
}

function setTexts(selector, values) {
  document.querySelectorAll(selector).forEach((el, index) => {
    if (values[index] !== undefined) el.textContent = values[index];
  });
}

function applyLanguage(lang, persist = true) {
  const nextLang = translations[lang] ? lang : 'en';
  const t = translations[nextLang];
  const isFa = nextLang === 'fa';

  document.documentElement.lang = nextLang;
  document.documentElement.dir = isFa ? 'rtl' : 'ltr';
  document.body.dataset.language = nextLang;
  document.title = t.title;

  const description = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (description) description.setAttribute('content', t.description);
  if (ogTitle) ogTitle.setAttribute('content', t.title);
  if (ogDescription) ogDescription.setAttribute('content', t.description);

  const brand = document.querySelector('.brand');
  if (brand) brand.setAttribute('aria-label', isFa ? 'خانه امین خراسانی' : 'Amin Khorasani home');

  const nav = document.querySelector('.nav');
  if (nav) nav.setAttribute('aria-label', t.navAria);
  setTexts('.nav a', t.nav);
  setText('.nav-cta', t.github);

  setText('.eyebrow', t.eyebrow);
  setHtml('#hero-title', t.heroTitle);
  setText('.hero-lede', t.heroLede);
  setHtml('.hero-actions .button-primary', t.explore);
  setText('.hero-actions .button-ghost', t.linkedin);
  setTexts('.signal-strip span', t.stats);
  const signalStrip = document.querySelector('.signal-strip');
  if (signalStrip) signalStrip.setAttribute('aria-label', t.statsAria);
  setTexts('.space-label', t.space);

  setText('#about .section-kicker', t.aboutKicker);
  setHtml('#about-title', t.aboutTitle);
  setText('.about-copy p:nth-child(1)', t.aboutP1);
  setText('.about-copy p:nth-child(2)', t.aboutP2);
  document.querySelectorAll('.capability').forEach((card, index) => {
    const values = t.capabilities[index];
    if (!values) return;
    const h3 = card.querySelector('h3');
    const p = card.querySelector('p');
    if (h3) h3.textContent = values[0];
    if (p) p.textContent = values[1];
  });

  setText('#experience .section-kicker', t.expKicker);
  setText('#experience-title', t.expTitle);
  setText('#experience .text-link', t.careerLink);
  setText('.core-copy small', t.currentOrbit);
  setText('.core-copy strong', t.dataDecisions);
  setText('.company-status', t.current);
  setText('.company-copy p', t.companyRole);

  setText('#work .section-kicker', t.workKicker);
  setHtml('#work-title', t.workTitle);
  setText('.work-intro', t.workIntro);
  document.querySelectorAll('.project-card').forEach((card, index) => {
    const type = card.querySelector('.project-topline span:first-child');
    const descriptionEl = card.querySelector('.project-copy p');
    const link = card.querySelector('.project-link');
    if (type && t.projectTypes[index]) type.textContent = t.projectTypes[index];
    if (descriptionEl && t.projectDescriptions[index]) descriptionEl.textContent = t.projectDescriptions[index];
    if (link) link.textContent = t.viewRepo;
  });
  setText('.work-footer p', t.workFooter);
  setText('.work-footer .button', t.browseRepos);

  setText('.stack-section .section-kicker', t.stackKicker);
  setHtml('#stack-title', t.stackTitle);
  const stack = document.querySelector('.stack-marquee');
  if (stack) stack.setAttribute('aria-label', t.stackAria);

  setText('#contact .section-kicker', t.contactKicker);
  setHtml('#contact-title', t.contactTitle);
  setText('.contact-copy', t.contactCopy);
  setText('.contact-actions .button-primary', t.connectLinkedin);
  setText('.contact-actions .button-ghost', t.github);

  const footerStatus = document.querySelector('.site-footer div:first-child');
  if (footerStatus) footerStatus.innerHTML = '<span class="status-dot"></span>' + t.orbitOnline;
  const footerName = document.querySelector('.site-footer div:nth-child(2)');
  if (footerName) footerName.innerHTML = '© <span id="year"></span> ' + t.footerName;
  const footerTop = document.querySelector('.site-footer a');
  if (footerTop) footerTop.textContent = t.backTop;
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const languageSwitch = document.querySelector('.language-switch');
  if (languageSwitch) languageSwitch.setAttribute('aria-label', t.switchAria);
  document.querySelectorAll('.language-option').forEach((button) => {
    const active = button.dataset.lang === nextLang;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
    button.title = button.dataset.lang === 'en' ? t.switchToEn : t.switchToFa;
  });

  if (persist) {
    try { localStorage.setItem(I18N_KEY, nextLang); } catch (_) {}
  }
}

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(I18N_KEY);
    if (saved === 'fa' || saved === 'en') return saved;
  } catch (_) {}
  return (navigator.language || '').toLowerCase().startsWith('fa') ? 'fa' : 'en';
}

document.querySelectorAll('.language-option').forEach((button) => {
  button.addEventListener('click', () => applyLanguage(button.dataset.lang));
});

applyLanguage(getInitialLanguage(), false);
