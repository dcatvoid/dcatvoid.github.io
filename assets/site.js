(function () {
 const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
 const root = document.documentElement, base = document.body.dataset.base || '', page = document.body.dataset.page;
 const links = [['home', 'index.html', 'Home'], ['projects', 'projects.html', 'Research Projects'], ['publications', 'publications.html', 'Publications']];
 document.body.insertAdjacentHTML('afterbegin', `<header><div class="wrap bar"><a class="brand" href="${base}index.html">Abdullah <span>Al Anan</span></a>
  <button class="ib" id="burger" aria-label="Menu">☰</button>
  <nav id="nav">${links.map(l => `<a href="${base + l[1]}" class="${l[0] === page ? 'on' : ''}">${l[2]}</a>`).join('')}</nav>
  <button class="ib" id="theme" aria-label="Toggle light or dark theme"></button></div><div id="prog"></div></header>`);
 document.body.insertAdjacentHTML('beforeend', `<footer><div class="wrap">© 2026 Abdullah Al Anan · Research Portfolio</div></footer><div id="lb"><img alt=""></div>`);

 /* theme */
 function setTheme(t, save) { root.dataset.theme = t; $('#theme').textContent = t === 'dark' ? '☀️' : '🌙'; if (save) try { localStorage.setItem('theme', t); } catch (e) {} }
 setTheme(root.dataset.theme || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'), false);
 $('#theme').onclick = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
 $('#burger').onclick = () => $('#nav').classList.toggle('open');

 /* scroll progress + reveal */
 addEventListener('scroll', () => { const h = root; $('#prog').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1) * 100) + '%'; }, { passive: true });
 const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('v'); io.unobserve(e.target); } }), { threshold: .12 });
 $$('.reveal').forEach(e => io.observe(e));

 /* tabs (project pages) */
 $$('.tabs').forEach(t => t.onclick = e => {
  const b = e.target.closest('.tab'); if (!b) return;
  $$('.tab').forEach(x => x.classList.toggle('on', x === b));
  $$('.panel').forEach(p => p.classList.toggle('on', p.dataset.p === b.dataset.t));
 });

 /* filters (projects page) */
 const chips = $('#chips');
 if (chips) chips.onclick = e => {
  const b = e.target.closest('.chip'); if (!b) return;
  $$('.chip').forEach(c => c.classList.toggle('on', c === b));
  let n = 0;
  $$('.proj[data-cat]').forEach(c => { const show = b.dataset.f === 'all' || c.dataset.cat.split(' ').includes(b.dataset.f); c.hidden = !show; if (show) n++; });
  $('#empty').hidden = n > 0;
 };

 /* lightbox */
 document.addEventListener('click', e => {
  const f = e.target.closest('.fig.wide');
  if (f && !f.classList.contains('ph')) { $('#lb img').src = $('img', f).src; $('#lb').classList.add('on'); }
 });
 $('#lb').onclick = () => $('#lb').classList.remove('on');
 addEventListener('keydown', e => { if (e.key === 'Escape') $('#lb').classList.remove('on'); });

 /* typing effect (home) */
 const el = $('#typed');
 if (el) {
  const words = ['Environmental Research', 'Climate Science', 'GeoAI', 'GIS & Remote Sensing']; let w = 0, c = 0, del = false;
  (function tick() {
   el.textContent = words[w].slice(0, c);
   if (!del && c === words[w].length) { del = true; return setTimeout(tick, 1400); }
   if (del && c === 0) { del = false; w = (w + 1) % words.length; }
   c += del ? -1 : 1; setTimeout(tick, del ? 35 : 75);
  })();
 }
})();
