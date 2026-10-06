import { tween, bindHover } from './motion.js';

export function initGuide() {
  const root=document.querySelector('.approach-slider');
  if(!root) return;
  const grid=root.querySelector('.guide-cards');
  const cards=[...grid.querySelectorAll('.guide-card')];
  const slides=[...root.querySelectorAll('.approach-slide')];
  root.querySelector('.guide-back')?.remove();
  root.querySelector('.approach-bottom')?.remove();
  let selected=-1,busy=false;
  const entries=cards.map((card,i)=>{
    const shell=document.createElement('div');shell.className='guide-shell';
    card.before(shell);shell.append(card);
    const panel=slides[i];panel.hidden=true;panel.removeAttribute('aria-hidden');panel.inert=true;
    shell.append(panel);
    const back=document.createElement('button');back.type='button';back.className='guide-return';
    back.innerHTML='<span aria-hidden="true">←</span> ' + (document.documentElement.lang === 'nl' ? 'Terug' : 'Back');panel.prepend(back);
    back.addEventListener('click',()=>change(-1));
    card.addEventListener('click',()=>{if(selected!==i)change(i);});
    const detail=panel.querySelector('details');
    detail.addEventListener('toggle',()=>tween(detail.querySelector('summary > span'),{rotate:detail.open?45:0},.25));
    return {shell,card,panel,back};
  });
  root.querySelector('.approach-stage')?.remove();
  async function change(next){
    if(busy)return;busy=true;
    const previous=selected;
    // Measure both layouts and let Motion interpolate their actual heights.
    const from=entries.map(e=>e.shell.getBoundingClientRect().height);
    entries.forEach((e,i)=>{
      e.shell.hidden=false;e.shell.style.height='auto';
      e.panel.hidden=i!==next;e.panel.inert=i!==next;
      e.card.setAttribute('aria-expanded',String(i===next));
      e.shell.classList.toggle('expanded',i===next);
    });
    const to=entries.map((e,i)=>next<0||i===next?e.shell.getBoundingClientRect().height:0);
    entries.forEach((e,i)=>{
      e.shell.style.height=`${from[i]}px`;
      e.shell.inert=next>=0&&i!==next;
    });
    selected=next;
    await Promise.all(entries.map((e,i)=>tween(e.shell,{height:`${to[i]}px`,opacity:next<0||i===next?1:0},.55)));
    entries.forEach((e,i)=>{e.shell.hidden=next>=0&&i!==next;e.shell.style.height='auto';});
    if(next>=0)entries[next].back.focus({preventScroll:true});
    else entries[previous]?.card.focus({preventScroll:true});
    busy=false;
  }
  root.addEventListener('keydown',event=>{if(event.key==='Escape'&&selected>=0){event.preventDefault();change(-1);}});
  bindHover('.guide-card',element=>[{element,values:{borderColor:'#ADDB66'}},{element:element.querySelector('img'),values:{scale:1.025}}]);
  bindHover('.guide-return',element=>[{element,values:{backgroundColor:'#c3e999',y:-2}}]);
}
