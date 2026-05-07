import { gsap } from 'gsap';
import { decodeMatrixReveals, eraseMatrixReveals } from './arsenal-sequence.js';

const ITEM_STAGGER = 0.4;

function buildItemTimeline(item, baseDelay) {
  const tl = gsap.timeline({ delay: baseDelay });
  const spine = item.parentElement?.querySelector('.portfolio__spine');
  const branch = item.querySelector('.portfolio__branch');
  const top = item.querySelector('.portfolio__item-border-top');
  const right = item.querySelector('.portfolio__item-border-right');
  const bottom = item.querySelector('.portfolio__item-border-bottom');
  const nodes = item.querySelectorAll('.wf-node');
  const dimH = item.querySelector('.wf-dim--h');
  const dimV = item.querySelector('.wf-dim--v');
  const grid = item.querySelector('.wf-grid-overlay');
  const callout = item.querySelector('.wf-callout');
  const content = item.querySelector('.portfolio__item-content');

  if (spine && baseDelay === 0) {
    tl.to(spine, { scaleY: 1, duration: 0.6, ease: 'expo.out' }, 0);
  }
  if (branch) tl.to(branch, { scaleX: 1, duration: 0.4, ease: 'power2.out' }, 0.2);
  if (top) tl.to(top, { scaleX: 1, duration: 0.4, ease: 'power2.out' }, 0.4);
  if (right) tl.to(right, { scaleY: 1, duration: 0.4, ease: 'power2.out' }, 0.55);
  if (bottom) tl.to(bottom, { scaleX: 1, duration: 0.4, ease: 'power2.out' }, 0.7);
  if (nodes.length) {
    tl.to(nodes, { scale: 1, opacity: 1, duration: 0.35, stagger: 0.08, ease: 'back.out(2)' }, 0.85);
  }
  if (dimH) tl.to(dimH, { scaleX: 1, opacity: 1, duration: 0.35, ease: 'power2.out' }, 1.1);
  if (dimV) tl.to(dimV, { scaleX: 1, opacity: 1, duration: 0.35, ease: 'power2.out' }, 1.2);
  if (grid) tl.to(grid, { opacity: 0.12, duration: 0.5, ease: 'power2.out' }, 1.3);
  if (callout) tl.to(callout, { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 1.45);
  if (content) {
    tl.to(content, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', onStart: () => decodeMatrixReveals(content) }, 1.6);
  }

  return tl;
}

export function resetWireframeContent(section) {
  if (!section) return;
  const spine = section.querySelector('.portfolio__spine');
  if (spine) gsap.set(spine, { scaleY: 0 });
  section.querySelectorAll('.portfolio__branch').forEach(el => gsap.set(el, { scaleX: 0 }));
  section.querySelectorAll('.portfolio__item-border-top').forEach(el => gsap.set(el, { scaleX: 0 }));
  section.querySelectorAll('.portfolio__item-border-right').forEach(el => gsap.set(el, { scaleY: 0 }));
  section.querySelectorAll('.portfolio__item-border-bottom').forEach(el => gsap.set(el, { scaleX: 0 }));
  section.querySelectorAll('.wf-node').forEach(el => gsap.set(el, { scale: 0, opacity: 0 }));
  section.querySelectorAll('.wf-dim').forEach(el => gsap.set(el, { scaleX: 0, opacity: 0 }));
  section.querySelectorAll('.wf-grid-overlay').forEach(el => gsap.set(el, { opacity: 0 }));
  section.querySelectorAll('.wf-callout').forEach(el => gsap.set(el, { x: -20, opacity: 0 }));
  section.querySelectorAll('.portfolio__item-content').forEach(el => gsap.set(el, { opacity: 0, x: -20 }));
}

export async function revealWireframeContent(section) {
  resetWireframeContent(section);

  const header = section.querySelector('.portfolio__header');
  if (header) await decodeMatrixReveals(header);

  const items = Array.from(section.querySelectorAll('.portfolio__item'));
  if (!items.length) return;

  // Spine grows once at start (covers full list)
  const spine = section.querySelector('.portfolio__spine');
  if (spine) {
    await new Promise(resolve => {
      gsap.to(spine, { scaleY: 1, duration: 0.7, ease: 'expo.out', onComplete: resolve });
    });
  }

  await new Promise(resolve => {
    let completed = 0;
    items.forEach((item, i) => {
      const tl = buildItemTimeline(item, i * ITEM_STAGGER);
      tl.eventCallback('onComplete', () => {
        completed += 1;
        if (completed === items.length) resolve();
      });
    });
  });
}

export async function hideWireframeContent(section) {
  if (!section) return;

  await eraseMatrixReveals(section);

  const targets = section.querySelectorAll(
    '.portfolio__item-content, .wf-callout, .wf-dim, .wf-grid-overlay, .wf-node, ' +
    '.portfolio__item-border-top, .portfolio__item-border-right, .portfolio__item-border-bottom, ' +
    '.portfolio__branch'
  );

  await new Promise(resolve => {
    gsap.to(targets, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
      stagger: 0.01,
      onComplete: resolve,
    });
  });

  const spine = section.querySelector('.portfolio__spine');
  if (spine) {
    await new Promise(resolve => {
      gsap.to(spine, { scaleY: 0, transformOrigin: 'bottom', duration: 0.4, ease: 'power2.in', onComplete: resolve });
    });
  }
}
