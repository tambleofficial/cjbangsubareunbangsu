'use strict';
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
function closeMenu(){nav?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){closeMenu();toggle.focus();}});
const track=document.querySelector('#service-track');
if(track){
 const prev=document.querySelector('[data-prev]'),next=document.querySelector('[data-next]'),count=document.querySelector('[data-count]');
 const step=()=>track.children[0].getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap);
 const move=n=>track.scrollBy({left:n*step(),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 const update=()=>{const end=track.scrollWidth-track.clientWidth;prev.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft>=end-2;const idx=Math.min(5,Math.round(track.scrollLeft/step())+1);count.textContent=String(idx).padStart(2,'0')+' / 05';};
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 track.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
 track.addEventListener('keydown',e=>{if(e.target===track&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});update();
}
