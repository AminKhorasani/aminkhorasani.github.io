const THEME_STORAGE_KEY='amin-theme';
function applyPortfolioTheme(theme,persist=false){
  const next=theme==='light'?'light':'dark';
  document.documentElement.dataset.theme=next;
  document.documentElement.style.colorScheme=next;
  const toggle=document.getElementById('theme-toggle');
  if(toggle){
    const target=next==='dark'?'light':'dark';
    toggle.setAttribute('aria-label','Switch to '+target+' mode');
    toggle.setAttribute('title','Switch to '+target+' mode');
    toggle.setAttribute('aria-pressed',next==='light'?'true':'false');
  }
  if(persist){
    try{localStorage.setItem(THEME_STORAGE_KEY,next)}catch(_){}
  }
  window.dispatchEvent(new CustomEvent('portfolio-theme-change',{detail:{theme:next}}));
}
applyPortfolioTheme(document.documentElement.dataset.theme||'dark');
const themeToggle=document.getElementById('theme-toggle');
if(themeToggle){
  themeToggle.addEventListener('click',()=>{
    applyPortfolioTheme(document.documentElement.dataset.theme==='light'?'dark':'light',true);
  });
}

const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
const reveals=document.querySelectorAll('.reveal');
if('IntersectionObserver'in window&&!reduceMotion){const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -24px'});reveals.forEach(el=>o.observe(el))}else reveals.forEach(el=>el.classList.add('visible'));
const glow=document.querySelector('.cursor-glow');if(glow&&!reduceMotion)addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true});
const fmtDate=d=>new Intl.DateTimeFormat(document.documentElement.lang==='fa'?'fa-IR':'en-US',{month:'short',day:'numeric',year:'numeric'}).format(new Date(d));
const evtLabel=e=>{const repo=e.repo?.name?.split('/')[1]||'GitHub';if(e.type==='PushEvent')return['Pushed code',repo];if(e.type==='CreateEvent')return['Created '+(e.payload?.ref_type||'repository item'),repo];if(e.type==='PullRequestEvent')return['Updated a pull request',repo];if(e.type==='IssuesEvent')return['Updated an issue',repo];if(e.type==='WatchEvent')return['Starred a repository',repo];if(e.type==='ForkEvent')return['Forked a repository',repo];return['Worked on '+repo,repo]};
async function loadGitHub(){
  try{
    const [u,e,c]=await Promise.all([
      fetch('https://api.github.com/users/AminKhorasani',{headers:{Accept:'application/vnd.github+json'}}),
      fetch('https://api.github.com/users/AminKhorasani/events/public?per_page=100',{headers:{Accept:'application/vnd.github+json'}}),
      fetch('https://github-contributions-api.jogruber.de/v4/AminKhorasani?y=last')
    ]);
    if(u.ok){
      const d=await u.json();
      const r=document.getElementById('repo-count'),f=document.getElementById('follower-count');
      if(r)r.textContent=d.public_repos??'—';
      if(f)f.textContent=d.followers??'—';
    }
    let events=[];
    if(e.ok){
      events=await e.json();
    }
    if(c.ok){
      const calendar=await c.json();
      renderContributionCalendar(calendar);
    }else if(events.length){
      renderContributionFallback(events);
    }
  }catch(_){}
}
function renderContributionCalendar(calendar){
  const map=document.getElementById('activity-map');
  const count=document.getElementById('event-count');
  if(!map)return;
  const rows=Array.isArray(calendar?.contributions)?calendar.contributions:[];
  map.innerHTML='';
  rows.slice(-371).forEach(day=>{
    const n=Number(day.count||0);
    const apiLevel=Number(day.level);
    const level=Number.isFinite(apiLevel)?Math.max(0,Math.min(4,apiLevel)):(n===0?0:n===1?1:n<=3?2:n<=6?3:4);
    const cell=document.createElement('i');
    cell.className='activity-cell level-'+level;
    cell.title=(day.date||'')+(n?' · '+n+' contribution'+(n>1?'s':''):'');
    map.appendChild(cell);
  });
  const total=calendar?.total;
  const n=typeof total==='number'?total:Number(total?.lastYear??total?.['lastYear']??rows.reduce((s,d)=>s+Number(d.count||0),0));
  if(count)count.textContent=Number.isFinite(n)?n:'—';
}
function renderContributionFallback(events){
  const map=document.getElementById('activity-map'),count=document.getElementById('event-count');
  if(!map)return;
  const days=371,now=new Date(),hits={};
  events.forEach(ev=>{const k=new Date(ev.created_at).toISOString().slice(0,10);hits[k]=(hits[k]||0)+1});
  map.innerHTML='';
  let total=0;
  for(let i=days-1;i>=0;i--){
    const d=new Date(now);d.setDate(now.getDate()-i);
    const k=d.toISOString().slice(0,10),n=hits[k]||0;total+=n;
    const level=n===0?0:n===1?1:n<=3?2:n<=6?3:4;
    const cell=document.createElement('i');
    cell.className='activity-cell level-'+level;
    cell.title=k+(n?' · '+n+' public event'+(n>1?'s':''):'');
    map.appendChild(cell);
  }
  if(count)count.textContent=total;
}
loadGitHub();
const buildPhrases={
  en:['intelligent AI systems','data products','analytical experiences','decision systems'],
  fa:['سیستم‌های هوشمند AI','محصولات داده‌ای','تجربه‌های تحلیلی','سیستم‌های تصمیم‌یار']
};
let buildTimer=null;
function runBuildTypewriter(){
  const textEl=document.getElementById('typewriter-text');
  const prefixEl=document.getElementById('build-prefix');
  if(!textEl||!prefixEl)return;
  if(buildTimer)clearTimeout(buildTimer);
  const lang=document.documentElement.lang==='fa'?'fa':'en';
  prefixEl.textContent=lang==='fa'?'می‌سازم':'I build';
  if(reduceMotion){
    textEl.textContent=buildPhrases[lang][0];
    return;
  }
  const phrases=buildPhrases[lang];
  let p=0,i=0,deleting=false;
  const tick=()=>{
    const phrase=phrases[p];
    if(!deleting){
      i++;
      textEl.textContent=phrase.slice(0,i);
      if(i>=phrase.length){
        deleting=true;
        buildTimer=setTimeout(tick,1450);
        return;
      }
      buildTimer=setTimeout(tick,58+Math.random()*42);
    }else{
      i--;
      textEl.textContent=phrase.slice(0,i);
      if(i<=0){
        deleting=false;
        p=(p+1)%phrases.length;
        buildTimer=setTimeout(tick,320);
        return;
      }
      buildTimer=setTimeout(tick,30+Math.random()*22);
    }
  };
  textEl.textContent='';
  buildTimer=setTimeout(tick,320);
}
runBuildTypewriter();
window.addEventListener('portfolio-language-change',runBuildTypewriter);


function recommendationToggleLabel(expanded){
  const fa=document.documentElement.lang==='fa';
  return expanded?(fa?'کمتر':'Less'):(fa?'بیشتر':'More');
}
function syncRecommendationToggleLabels(){
  document.querySelectorAll('.recommendation-more').forEach(button=>{
    const card=button.closest('.recommendation-card');
    button.textContent=recommendationToggleLabel(card?.classList.contains('is-expanded'));
  });
}
function setupRecommendationExpanders(){
  const marquee=document.querySelector('.recommendation-marquee');
  document.querySelectorAll('.recommendation-card').forEach((card,index)=>{
    const quote=card.querySelector('blockquote');
    if(!quote||card.querySelector('.recommendation-more'))return;
    quote.classList.add('recommendation-copy');
    if(!quote.id)quote.id='recommendation-copy-'+index;

    const button=document.createElement('button');
    button.type='button';
    button.className='recommendation-more';
    button.textContent=recommendationToggleLabel(false);
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-controls',quote.id);

    if(card.closest('[aria-hidden="true"]')){
      button.tabIndex=-1;
    }

    button.addEventListener('click',()=>{
      const expanded=card.classList.toggle('is-expanded');
      button.setAttribute('aria-expanded',expanded?'true':'false');
      button.textContent=recommendationToggleLabel(expanded);
      if(marquee){
        marquee.classList.toggle(
          'is-paused',
          Boolean(document.querySelector('.recommendation-card.is-expanded'))
        );
      }
    });

    card.appendChild(button);
  });
}
setupRecommendationExpanders();
window.addEventListener('portfolio-language-change',syncRecommendationToggleLabels);


function setupRecommendationScroller(){
  const marquee=document.querySelector('.recommendation-marquee');
  const track=marquee?.querySelector('.recommendation-track');
  if(!marquee||!track)return;

  let raf=0;
  let lastTime=0;
  let userPauseUntil=0;
  let hovering=false;
  let dragging=false;
  let dragStartX=0;
  let dragStartScroll=0;
  const speed=28;
  const resumeDelay=2200;

  const pauseForUser=()=>{
    userPauseUntil=performance.now()+resumeDelay;
  };

  const loop=time=>{
    if(!lastTime)lastTime=time;
    const dt=Math.min(40,time-lastTime);
    lastTime=time;

    const expanded=Boolean(document.querySelector('.recommendation-card.is-expanded'));
    const paused=reduceMotion||expanded||dragging||hovering||time<userPauseUntil||marquee.classList.contains('is-paused');

    if(!paused){
      const loopWidth=track.scrollWidth/2;
      marquee.scrollLeft+=(speed*dt)/1000;
      if(loopWidth>0&&marquee.scrollLeft>=loopWidth){
        marquee.scrollLeft-=loopWidth;
      }
    }

    raf=requestAnimationFrame(loop);
  };

  marquee.addEventListener('mouseenter',()=>{hovering=true});
  marquee.addEventListener('mouseleave',()=>{hovering=false});

  marquee.addEventListener('wheel',event=>{
    if(Math.abs(event.deltaX)>0||event.shiftKey)pauseForUser();
  },{passive:true});

  marquee.addEventListener('touchstart',pauseForUser,{passive:true});
  marquee.addEventListener('touchmove',pauseForUser,{passive:true});

  marquee.addEventListener('pointerdown',event=>{
    if(event.pointerType!=='mouse')return;
    if(event.target.closest('button,a'))return;
    dragging=true;
    pauseForUser();
    dragStartX=event.clientX;
    dragStartScroll=marquee.scrollLeft;
    marquee.classList.add('is-dragging');
    marquee.setPointerCapture?.(event.pointerId);
  });

  marquee.addEventListener('pointermove',event=>{
    if(!dragging||event.pointerType!=='mouse')return;
    const dx=event.clientX-dragStartX;
    marquee.scrollLeft=dragStartScroll-dx;
    pauseForUser();
  });

  const stopDrag=event=>{
    if(!dragging)return;
    dragging=false;
    marquee.classList.remove('is-dragging');
    pauseForUser();
    if(event?.pointerId!=null&&marquee.hasPointerCapture?.(event.pointerId)){
      marquee.releasePointerCapture(event.pointerId);
    }
  };
  marquee.addEventListener('pointerup',stopDrag);
  marquee.addEventListener('pointercancel',stopDrag);
  marquee.addEventListener('lostpointercapture',stopDrag);

  raf=requestAnimationFrame(loop);

  window.addEventListener('beforeunload',()=>{
    if(raf)cancelAnimationFrame(raf);
  },{once:true});
}
setupRecommendationScroller();
