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

  const header = section.querySelector('.pricing-section__header');
  const tickets = api.tickets;
  const activePane = section.querySelector('.pricing-pane.is-active');

  gsap.set([header, ...tickets, activePane].filter(Boolean), { clearProps: 'all' });

  const tl = gsap.timeline();

  if (header) {
    tl.from(header, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
  }

  tl.from(tickets, {
    opacity: 0,
    x: -60,
    rotateY: -15,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power3.out',
  }, '-=0.2');

  if (activePane) {
    tl.from(activePane, {
      opacity: 0,
      x: 40,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.5');
  }

  await tl.then();
}

export async function hidePricingTickets(section) {
  if (!section) return;
  const tickets = section.querySelectorAll('.ticket');
  const panes = section.querySelectorAll('.pricing-pane');
  const header = section.querySelector('.pricing-section__header');

  await gsap.to([header, ...tickets, ...panes].filter(Boolean), {
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
  });
}
