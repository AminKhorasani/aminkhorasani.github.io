const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
const reveals=document.querySelectorAll('.reveal');
if('IntersectionObserver'in window&&!reduceMotion){const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -24px'});reveals.forEach(el=>o.observe(el))}else reveals.forEach(el=>el.classList.add('visible'));
const glow=document.querySelector('.cursor-glow');if(glow&&!reduceMotion)addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true});
const fmtDate=d=>new Intl.DateTimeFormat(document.documentElement.lang==='fa'?'fa-IR':'en-US',{month:'short',day:'numeric',year:'numeric'}).format(new Date(d));
const evtLabel=e=>{const repo=e.repo?.name?.split('/')[1]||'GitHub';if(e.type==='PushEvent')return['Pushed code',repo];if(e.type==='CreateEvent')return['Created '+(e.payload?.ref_type||'repository item'),repo];if(e.type==='PullRequestEvent')return['Updated a pull request',repo];if(e.type==='IssuesEvent')return['Updated an issue',repo];if(e.type==='WatchEvent')return['Starred a repository',repo];if(e.type==='ForkEvent')return['Forked a repository',repo];return['Worked on '+repo,repo]};
async function loadGitHub(){try{const [u,e]=await Promise.all([fetch('https://api.github.com/users/AminKhorasani',{headers:{Accept:'application/vnd.github+json'}}),fetch('https://api.github.com/users/AminKhorasani/events/public?per_page=100',{headers:{Accept:'application/vnd.github+json'}})]);if(u.ok){const d=await u.json();const r=document.getElementById('repo-count'),f=document.getElementById('follower-count');if(r)r.textContent=d.public_repos??'—';if(f)f.textContent=d.followers??'—'}if(!e.ok)return;const events=await e.json();renderActivity(events);renderMap(events)}catch(_){}}
function renderActivity(events){const box=document.getElementById('activity-list');if(!box)return;box.innerHTML='';const items=events.slice(0,4);if(!items.length){box.innerHTML='<div class="activity-placeholder">No recent public activity found.</div>';return}items.forEach(ev=>{const [title,repo]=evtLabel(ev);const a=document.createElement('a');a.className='activity-item';a.href='https://github.com/'+ev.repo.name;a.target='_blank';a.rel='noreferrer';a.innerHTML='<span class="activity-date">'+fmtDate(ev.created_at)+'</span><span class="activity-title">'+title+'</span><span class="activity-meta">'+repo+' ↗</span>';box.appendChild(a)})}
function renderMap(events){const map=document.getElementById('activity-map'),count=document.getElementById('event-count');if(!map)return;const days=182,now=new Date(),hits={};events.forEach(ev=>{const k=new Date(ev.created_at).toISOString().slice(0,10);hits[k]=(hits[k]||0)+1});map.innerHTML='';for(let i=days-1;i>=0;i--){const d=new Date(now);d.setDate(now.getDate()-i);const k=d.toISOString().slice(0,10),n=hits[k]||0,l=n===0?0:n===1?1:n<=3?2:n<=6?3:4;const cell=document.createElement('i');cell.className='activity-cell level-'+l;cell.title=k+(n?' · '+n+' event'+(n>1?'s':''):'');map.appendChild(cell)}if(count)count.textContent=events.length}
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

const sky=document.getElementById('skyfield');
if(sky){
  const sctx=sky.getContext('2d');
  let stars=[];
  const resizeSky=()=>{
    const dpr=Math.min(devicePixelRatio||1,2);
    sky.width=innerWidth*dpr; sky.height=innerHeight*dpr;
    sky.style.width=innerWidth+'px'; sky.style.height=innerHeight+'px';
    sctx.setTransform(dpr,0,0,dpr,0,0);
    const count=Math.min(240,Math.floor((innerWidth*innerHeight)/7200));
    stars=Array.from({length:count},()=>({
      x:Math.random()*innerWidth,
      y:Math.random()*innerHeight,
      r:Math.random()*1.15+.2,
      a:Math.random()*.55+.12,
      drift:Math.random()*.025+.005,
      tw:Math.random()*Math.PI*2
    }));
  };
  const drawSky=(t=0)=>{
    sctx.clearRect(0,0,innerWidth,innerHeight);
    for(const s of stars){
      const twinkle=.72+.28*Math.sin(t*.0015+s.tw);
      sctx.beginPath();
      sctx.fillStyle='rgba(185,210,255,'+(s.a*twinkle)+')';
      sctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      sctx.fill();
      if(!reduceMotion){
        s.y+=s.drift;
        if(s.y>innerHeight+3)s.y=-3;
      }
    }
    if(!reduceMotion)requestAnimationFrame(drawSky);
  };
  resizeSky();
  drawSky();
  addEventListener('resize',resizeSky,{passive:true});
}
