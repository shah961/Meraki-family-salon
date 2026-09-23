/**
 * MERAKI FAMILY SALON — ANIMATIONS & SCROLL EFFECTS
 * GSAP ScrollTrigger Integration with Reduced Motion Safety
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;

  // Check for reduced motion preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Section Animations
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

  heroTl.from('.hero-title', { opacity: 0, y: 30, delay: 0.2 })
        .from('.hero-subtitle', { opacity: 0, y: 20 }, '-=0.6')
        .from('.hero-actions', { opacity: 0, y: 20 }, '-=0.6');

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.service-card, .gallery-item, .contact-form, .bridal-banner');

  revealElements.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 35,
      duration: 0.8,
      ease: 'power2.out'
    });
  });
});
