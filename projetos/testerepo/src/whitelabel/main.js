/* /whitelabel — reveal + count-up leves (IntersectionObserver, sem libs). */

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function formatBR(n) {
  return n.toLocaleString('pt-BR');
}

function countUp(el) {
  const target = parseFloat(el.dataset.count);
  if (Number.isNaN(target)) return;
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  if (reduce) { el.textContent = prefix + formatBR(target) + suffix; return; }
  const dur = 1100;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + formatBR(Math.round(target * eased)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + formatBR(target) + suffix;
  }
  requestAnimationFrame(tick);
}

const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const el = e.target;
    el.classList.add('is-in');
    el.querySelectorAll?.('[data-count]').forEach(countUp);
    if (el.matches('[data-count]')) countUp(el);
    io.unobserve(el);
  }
}, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal, .reveal-lines, .rule, [data-countgroup]').forEach((el) => io.observe(el));
