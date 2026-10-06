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
      renderActivity(events);
    }
    if(c.ok){
      const calendar=await c.json();
      renderContributionCalendar(calendar);
    }else if(events.length){
      renderContributionFallback(events);
    }
  }catch(_){}
}
function renderActivity(events){
  const box=document.getElementById('activity-list');
  if(!box)return;
  box.innerHTML='';
  const items=events.slice(0,4);
  if(!items.length){
    box.innerHTML='<div class="activity-placeholder">No recent public activity found.</div>';
    return;
  }
  items.forEach(ev=>{
    const [title,repo]=evtLabel(ev);
    const a=document.createElement('a');
    a.className='activity-item';
    a.href='https://github.com/'+ev.repo.name;
    a.target='_blank';
    a.rel='noreferrer';
    a.innerHTML='<span class="activity-date">'+fmtDate(ev.created_at)+'</span><span class="activity-title">'+title+'</span><span class="activity-meta">'+repo+' ↗</span>';
    box.appendChild(a);
  });
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
