'use client';

import { useEffect } from 'react';

export function RevealObserver() {
  useEffect(() => {
    const root = document.querySelector('.snap-container');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root,
        threshold: 0.1,
      }
    );

    const sections = document.querySelectorAll('.reveal-section');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return null;
}
