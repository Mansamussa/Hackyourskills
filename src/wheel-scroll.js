import { springValue } from 'framer-motion/dom';
import { reduced } from './motion.js';

export function initWheelScroll() {
  let active=false, target=scrollY;
  const position=springValue(scrollY,{stiffness:75,damping:23,mass:1.5,restDelta:.2,restSpeed:2});
  const stop=()=>{active=false;target=scrollY;position.jump(scrollY);};
  position.on('change',y=>{if(active) window.scrollTo({top:y,behavior:'instant'});});
  position.on('animationComplete',()=>{active=false;target=scrollY;});
  const fine=matchMedia('(pointer:fine)');
  // Native scrolling remains available for touch, keyboard, zoom and inner panels.
  addEventListener('wheel',event=>{
    if(reduced.matches || !fine.matches || event.ctrlKey || event.metaKey || event.defaultPrevented || Math.abs(event.deltaX)>Math.abs(event.deltaY)) return;
    for(let el=event.target instanceof Element?event.target:null;el && el!==document.body;el=el.parentElement){
      if(el.matches('input,textarea,select,[contenteditable="true"]')) return;
      if(/auto|scroll/.test(getComputedStyle(el).overflowY) && el.scrollHeight>el.clientHeight+1) return;
    }
    if(!event.cancelable) return;
    const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
    if(!delta) return;
    event.preventDefault();
    if(!active) {target=scrollY;position.jump(scrollY);}
    target=Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight,target+delta*.65));
    active=true;
    position.set(target);
  },{passive:false});
  addEventListener('touchstart',stop,{passive:true});
  addEventListener('pointerdown',stop,{passive:true});
  addEventListener('keydown',stop);
  addEventListener('resize',stop);
  reduced.addEventListener('change',stop);
  document.addEventListener('click',stop);
}
