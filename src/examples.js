import { tween, bindHover } from './motion.js';
export function initExamples(){
 document.querySelectorAll('[data-comparison]').forEach(root=>{
  const buttons=[...root.querySelectorAll('[data-view]')];let running;
  buttons.forEach(button=>button.addEventListener('click',()=>{
   if(button.getAttribute('aria-pressed')==='true')return;
   running?.stop();const mode=button.dataset.view;
   buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   root.querySelectorAll('.example-view').forEach(panel=>{panel.hidden=panel.id!==button.getAttribute('aria-controls');});
   const panel=document.getElementById(button.getAttribute('aria-controls'));
   running=tween(panel,{opacity:[.2,1]},.4);
   root.querySelector('.comparison-state').textContent=root.dataset[mode+'State'];
   root.querySelector('.comparison-caption').textContent=root.dataset[mode+'Caption'];
  }));
 });
 bindHover('.segmented button',element=>[{element,values:{scale:1.025}}]);
}
