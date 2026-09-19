'use strict';
(() => {
  // Coordinates refer to the approved 1659 × 948 poster, never generated imagery.
  const meals = [
    ['CLASSIC SMASH BURGER', 'FRIES + CAN OF POP', '10.99', [24,269,300,168]],
    ['DONAIR SMASH BURGER', 'FRIES + CAN OF POP', '11.99', [350,268,302,169]],
    ['GAME CHANGER BEEF POUTINE', '+ CAN OF POP', '13.99', [672,264,307,174]],
    ['WESTERN BEEF POUTINE', '+ CAN OF POP', '13.99', [999,264,309,174]],
    ['SPICY CHICKEN POUTINE', '+ CAN OF POP', '15.99', [1327,265,313,173]],
    ['ALBERTA CLASSIC BEEF', 'FRIES + CAN OF POP', '13.99', [17,598,312,166]],
    ['SWEET & SPICY BEEF', 'FRIES + CAN OF POP', '13.99', [347,598,309,166]],
    ['HONEY GARLIC CHICKEN', 'FRIES + CAN OF POP', '15.99', [674,598,309,166]],
    ['TASTY THAI RICE BOX', 'BEEF + CAN OF POP', '12.99', [1000,582,307,182]],
    ['CARIBBEAN RICE BOX', 'CHICKEN OR MIX + CAN OF POP', '14.99', [1327,588,313,176]]
  ];
  const screen = document.getElementById('screen');
  function resize() { screen.style.setProperty('--scale', Math.min(innerWidth / 1080, innerHeight / 1920)); }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Ordinary HTML images with percentage positioning avoid SVG/Safari cropping bugs.
  // Percentages remain correct if the same approved artwork is exported at a higher resolution.
  function crop(element, box, label) {
    const [x, y, w, h] = box;
    const image = new Image();
    image.src = 'approved-meal-deals.png';
    image.alt = label || '';
    image.draggable = false;
    image.style.cssText = `width:${1659 / w * 100}%;height:${948 / h * 100}%;left:${-x / w * 100}%;top:${-y / h * 100}%;`;
    element.appendChild(image);
  }
  document.querySelectorAll('[data-crop]').forEach(el => crop(el, el.dataset.crop.split(',').map(Number)));
  const sceneRoot = document.getElementById('scenes');
  const scenes = [];
  for (let group = 0; group < 2; group++) {
    const scene = document.createElement('section');
    scene.className = 'scene';
    scene.setAttribute('aria-label', group === 0 ? 'Deals 1–5' : 'Deals 6–10');
    scene.setAttribute('aria-hidden', 'true');
    meals.slice(group * 5, group * 5 + 5).forEach(([name, inclusion, price, box], index) => {
      const number = group * 5 + index + 1;
      const row = document.createElement('article');
      row.className = number % 2 === 0 ? 'deal light' : 'deal';
      row.dataset.deal = String(number);
      row.innerHTML = `<span class="number">${number}</span><div class="food-wrap"><div class="poster-crop food"></div></div><div class="details"><h2>${name}</h2><div class="inclusion">${inclusion}</div><div class="price">$${price}</div></div>`;
      const photo = row.querySelector('.food');
      const scale = Math.min(530 / box[2], 286 / box[3]);
      photo.style.width = `${box[2] * scale}px`;
      photo.style.height = `${box[3] * scale}px`;
      // Exclude the rice-box title above the food, retaining the full can on the right.
      if (number === 9) photo.style.clipPath = 'polygon(0 9%,74% 9%,74% 0,100% 0,100% 100%,0 100%)';
      if (number === 10) photo.style.clipPath = 'polygon(0 5%,74% 5%,74% 0,100% 0,100% 100%,0 100%)';
      crop(photo, box, `${name} — approved poster photograph`);
      scene.appendChild(row);
    });
    sceneRoot.appendChild(scene);
    scenes.push(scene);
  }
  const rows = scenes.map(scene => [...scene.children]);
  // Entries at 0, 1.15, 2.30, 3.45 and 4.60 seconds. Final entry ends at
  // 5.25s, followed by a full 7s hold. Fade out for .65s, then alternate.
  const stagger = 1150, fade = 650, hold = 7000;
  const holdEnd = 4 * stagger + fade + hold;
  const sceneMs = holdEnd + fade;
  let epoch = 0, timer;
  function render() {
    const elapsed = Math.max(0, performance.now() - epoch);
    const current = Math.floor(elapsed / sceneMs) % 2;
    const phase = elapsed % sceneMs;
    scenes.forEach((scene, i) => {
      const active = i === current && phase < holdEnd;
      scene.classList.toggle('active', active);
      scene.setAttribute('aria-hidden', String(!active));
      // Outgoing rows stay in place until the scene has fully faded.
      rows[i].forEach((row, index) => {
        const entered = i === current && phase >= index * stagger;
        row.classList.toggle('entered', entered);
        row.setAttribute('aria-hidden', String(!active || !entered));
      });
    });
  }
  const source = new Image();
  source.onload = () => {
    if (timer) return;
    epoch = performance.now();
    render();
    timer = window.setInterval(render, 50);
  };
  // Menu text still rotates if the poster fails to load.
  source.onerror = source.onload;
  source.src = 'approved-meal-deals.png';
  document.addEventListener('visibilitychange', () => { if (!document.hidden && timer) render(); });
})();
