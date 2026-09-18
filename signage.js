'use strict';
(() => {
  const meals = [
    ['CLASSIC SMASH BURGER', 'FRIES + CAN OF POP', '10.99', [18,266,309,172]],
    ['DONAIR SMASH BURGER', 'FRIES + CAN OF POP', '11.99', [345,266,308,172]],
    ['GAME CHANGER BEEF POUTINE', '+ CAN OF POP', '13.99', [671,263,311,175]],
    ['WESTERN BEEF POUTINE', '+ CAN OF POP', '13.99', [999,264,309,174]],
    ['SPICY CHICKEN POUTINE', '+ CAN OF POP', '15.99', [1326,265,315,173]],
    ['ALBERTA CLASSIC BEEF', 'FRIES + CAN OF POP', '13.99', [17,599,311,165]],
    ['SWEET & SPICY BEEF', 'FRIES + CAN OF POP', '13.99', [344,599,313,165]],
    ['HONEY GARLIC CHICKEN', 'FRIES + CAN OF POP', '15.99', [673,598,310,166]],
    ['TASTY THAI RICE BOX', 'BEEF + CAN OF POP', '12.99', [1000,596,307,168]],
    ['CARIBBEAN RICE BOX', 'CHICKEN OR MIX + CAN OF POP', '14.99', [1326,596,313,168]]
  ];
  const screen = document.getElementById('screen');
  function resize() {
    screen.style.setProperty('--scale', Math.min(innerWidth / 1920, innerHeight / 1080));
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  const pairs = document.getElementById('pairs');
  for (let i = 0; i < meals.length; i += 2) {
    const pair = document.createElement('div');
    pair.className = 'pair';
    pair.setAttribute('aria-hidden', 'true');
    for (let j = i; j < i + 2; j++) {
      const [name, inclusion, price, crop] = meals[j];
      const card = document.createElement('article');
      card.className = 'deal';
      card.innerHTML = `<div class="number">${j + 1}</div><h2>${name}</h2><svg class="food" style="width:${crop[2] / crop[3] * 360}px" viewBox="${crop.join(' ')}" role="img" aria-label="${name}, approved poster photograph"><image href="assets/approved-meal-deals.png" width="1659" height="948"/></svg><div class="inclusion">${inclusion}</div><div class="price">$${price}</div>`;
      pair.appendChild(card);
    }
    pairs.appendChild(pair);
  }
  const overview = document.getElementById('overview');
  const features = document.getElementById('features');
  const slides = [...pairs.children];
  // 22 seconds for the complete approved poster, then 14 seconds per pair.
  // One timer and a fixed DOM keep the presentation bounded indefinitely.
  const overviewMs = 22000, pairMs = 14000, cycleMs = overviewMs + slides.length * pairMs;
  let epoch = performance.now(), current = -2;
  function tick() {
    const phase = (performance.now() - epoch) % cycleMs;
    const next = phase < overviewMs ? -1 : Math.floor((phase - overviewMs) / pairMs);
    if (next === current) return;
    current = next;
    overview.classList.toggle('active', next === -1);
    overview.setAttribute('aria-hidden', String(next !== -1));
    features.classList.toggle('active', next !== -1);
    features.setAttribute('aria-hidden', String(next === -1));
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === next);
      slide.setAttribute('aria-hidden', String(index !== next));
    });
  }
  const poster = document.querySelector('.poster');
  function start() { epoch = performance.now(); tick(); window.setInterval(tick, 250); }
  if (poster.complete && poster.naturalWidth) start();
  else poster.addEventListener('load', start, { once: true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
})();
