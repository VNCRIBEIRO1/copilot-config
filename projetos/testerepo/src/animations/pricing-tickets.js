import { gsap } from 'gsap';

const instances = new WeakMap();

export function initPricingTickets(section) {
  if (!section || instances.has(section)) return instances.get(section);

  const ticketsRoot = section.querySelector('[data-pricing-tickets]');
  const detailRoot = section.querySelector('[data-pricing-detail]');
  if (!ticketsRoot || !detailRoot) return null;

  const tickets = Array.from(ticketsRoot.querySelectorAll('.ticket'));
  const panes = Array.from(detailRoot.querySelectorAll('.pricing-pane'));

  function setActivePane(name) {
    panes.forEach(pane => {
      const isMatch = pane.getAttribute('data-pane') === name;
      pane.classList.toggle('is-active', isMatch);
    });
  }

  function setActiveTicket(name) {
    tickets.forEach(t => {
      t.classList.toggle('is-active', t.getAttribute('data-ticket') === name);
    });
  }

  function activate(name) {
    if (!name) return;
    setActiveTicket(name);
    setActivePane(name);
  }

  tickets.forEach(ticket => {
    ticket.addEventListener('click', () => {
      const name = ticket.getAttribute('data-ticket');
      activate(name);
    });
    ticket.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(ticket.getAttribute('data-ticket'));
      }
    });
  });

  function reset() {
    setActivePane('default');
    setActiveTicket('essential');
  }

  const api = { activate, reset, tickets, panes };
  instances.set(section, api);
  return api;
}

export async function revealPricingTickets(section) {
  if (!section) return;
  const api = initPricingTickets(section);
  if (!api) return;

  api.reset();

  const tickets = api.tickets;
  const activePane = section.querySelector('.pricing-pane.is-active');

  gsap.set([...tickets, activePane].filter(Boolean), { clearProps: 'opacity,x,y,rotateY' });

  const tl = gsap.timeline();

  tl.from(tickets, {
    opacity: 0,
    x: -50,
    rotateY: -12,
    duration: 0.65,
    stagger: 0.1,
    ease: 'power3.out',
  }, 0);

  if (activePane) {
    tl.from(activePane, {
      opacity: 0,
      x: 30,
      duration: 0.6,
      ease: 'power2.out',
    }, 0.05);
  }

  await tl.then();
}

export async function hidePricingTickets(section) {
  if (!section) return;
  const tickets = section.querySelectorAll('.ticket');
  const panes = section.querySelectorAll('.pricing-pane.is-active');

  await gsap.to([...tickets, ...panes], {
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
  });
}
