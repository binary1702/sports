import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Play once when the element enters the viewport; never reverse. */
const ONCE: ScrollTrigger.Vars = {
  start: 'top 85%',
  toggleActions: 'play none none none',
  scroller: '.snap-container',
};

/**
 * The page's one reveal: fade + 16px rise, 0.5s, ease-out, once.
 * Pass several elements (or a selector matching several) for a small stagger.
 * `trigger` defaults to the first target.
 */
export function reveal(targets: gsap.TweenTarget, trigger?: Element | string) {
  // Guard: if selector string, check element exists
  if (typeof targets === 'string') {
    const el = document.querySelector(targets);
    if (!el) return null;
  }
  return gsap.from(targets, {
    opacity: 0,
    y: 16,
    duration: 0.5,
    ease: 'power2.out',
    stagger: 0.08,
    scrollTrigger: { trigger: trigger ?? (targets as Element | string), ...ONCE },
  });
}

/** Count 0 → `to` once, when the element enters the viewport. */
export function countUp(el: HTMLElement, to: number, duration = 0.8) {
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: to,
    duration,
    ease: 'power2.out',
    snap: { value: 1 },
    onUpdate: () => { el.textContent = Math.round(obj.value).toString(); },
    scrollTrigger: { trigger: el, ...ONCE },
  });
}

/** Wire every `[data-count]` element inside `scope` to a count-up. */
export function countAll(scope: Element) {
  scope.querySelectorAll<HTMLElement>('[data-count]').forEach(el => {
    countUp(el, Number(el.dataset.count));
  });
}

export { gsap, ScrollTrigger, useGSAP };
