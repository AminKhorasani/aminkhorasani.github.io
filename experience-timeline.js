// Scroll-linked line, branded visuals, and theme-matched pin gradient.
(() => {
  const timeline = document.getElementById('career-timeline');
  if (!timeline) return;
  const stops = Array.from(timeline.querySelectorAll('.career-stop'));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
  const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
  const palettes={
    dark:[[42,99,255],[120,173,255],[188,217,255]],
    light:[[10,27,51],[23,63,115],[73,111,156]]
  };
  function railColor(t,palette){
    const index=t<=.51?0:1;
    const begin=index===0?0:.51;
    const span=index===0?.51:.49;
    return mix(palette[index],palette[index+1],clamp((t-begin)/span,0,1));
  }
  let pending=false;
  function paint(){
    pending=false;
    const rect=timeline.getBoundingClientRect();
    const focus=window.innerHeight*.58;
    const reduced=prefersReduced.matches;
    const progress=reduced?1:clamp((focus-rect.top)/Math.max(1,rect.height),0,1);
    timeline.style.setProperty('--career-progress',progress.toFixed(4));
    const light=document.documentElement.dataset.theme==='light';
    const palette=palettes[light?'light':'dark'];
    let nearest=null,dist=Infinity;
    for(const stop of stops){
      const box=stop.getBoundingClientRect();
      const center=box.top+box.height/2;
      const delta=Math.abs(center-focus);
      if(delta<dist){nearest=stop;dist=delta}
      // Continuous distance fade; the nearest stop remains fully opaque.
      const ratio=clamp(delta/Math.max(window.innerHeight*.83,350),0,1);
      const opacity=reduced?1:clamp(1-Math.pow(ratio,1.4)*.84,.16,1);
      stop.style.setProperty('--focus-opacity',opacity.toFixed(3));
      // Same normalized vertical coordinate and color stops as the rail gradient.
      const t=clamp((center-rect.top-16)/Math.max(1,rect.height-32),0,1);
      const rgb=railColor(t,palette);
      stop.style.setProperty('--rail-pin-rgb',rgb.join(','));
      stop.style.setProperty('--rail-pin-color','rgb('+rgb.join(',')+')');
    }
    const visible=rect.bottom>0&&rect.top<window.innerHeight;
    stops.forEach(stop=>stop.classList.toggle('is-current-in-view',reduced||(visible&&stop===nearest)));
  }
  function requestPaint(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(paint);
  }
  window.addEventListener('scroll',requestPaint,{passive:true});
  window.addEventListener('resize',requestPaint,{passive:true});
  window.addEventListener('portfolio-theme-change',requestPaint);
  if(prefersReduced.addEventListener)prefersReduced.addEventListener('change',requestPaint);
  requestPaint();
})();
