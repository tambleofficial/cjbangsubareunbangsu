(() => {
  'use strict';
  const root = document.getElementById('services');
  const track = document.getElementById('waterproofing-carousel-track');
  if (!root || !track) return;
  const cards = Array.from(track.children);
  const previous = root.querySelector('[data-carousel-prev]');
  const next = root.querySelector('[data-carousel-next]');
  const counter = root.querySelector('[data-carousel-count]');
  const controls = root.querySelector('.carousel-controls');
  if (!cards.length || !previous || !next || !counter || !controls) return;
  controls.hidden = false;
  const pad = value => String(value).padStart(2, '0');
  const maximum = () => Math.max(0, track.scrollWidth - track.clientWidth);
  const behavior = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  const step = () => cards[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
  function update() {
    const bounds = track.getBoundingClientRect();
    const visible = cards.map((card, index) => ({rect:card.getBoundingClientRect(), index})).filter(({rect}) => Math.min(rect.right,bounds.right)-Math.max(rect.left,bounds.left)>Math.min(40,rect.width/4));
    const first = (visible[0]?.index ?? 0) + 1;
    const last = (visible.at(-1)?.index ?? 0) + 1;
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= maximum() - 2;
    counter.textContent = (first === last ? pad(first) : pad(first) + '–' + pad(last)) + ' / ' + pad(cards.length);
    counter.setAttribute('aria-label', `전체 ${cards.length}개 중 ${first}번부터 ${last}번 시공 분야`);
  }
  function move(direction) {
    track.scrollTo({left:Math.max(0,Math.min(maximum(),track.scrollLeft+direction*step())),behavior:behavior()});
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  let scheduled = false;
  track.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {scheduled=false;update();});
  }, {passive:true});
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();move(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();track.scrollTo({left:event.key === 'Home' ? 0 : maximum(),behavior:behavior()});
    }
  });
  window.addEventListener('resize', update);
  window.addEventListener('pageshow', update);
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
  update();
})();
