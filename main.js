/**
 * MERAKI FAMILY SALON — MAIN INTERACTION CONTROLLER
 * Vanilla JavaScript implementation for core UI logic, mobile accessibility,
 * lightweight WebGL canvas initialization, and contact fallback validations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeaderScroll();
  initContactForm();
  initThreeJsHero();
});

/* --------------------------------------------------------------------------
   1. ACCESSIBLE MOBILE MENU CONTROLLER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const overlay = document.getElementById('mobile-nav-overlay');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !overlay) return;

  function openMenu() {
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   2. HEADER SCROLL STATE
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   3. CONTACT FORM VALIDATION & FALLBACK
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('appointment-form');
  const feedback = document.getElementById('form-feedback');

  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name')?.value.trim();
    const phone = document.getElementById('form-phone')?.value.trim();
    const service = document.getElementById('form-service')?.value;

    if (!name || !phone) {
      feedback.className = 'form-feedback info';
      feedback.textContent = 'Please provide your name and phone number.';
      return;
    }

    feedback.className = 'form-feedback info';
    feedback.innerHTML = `Thank you, ${name}. Direct online booking submission is unavailable. Please contact Meraki Family Salon directly via call at <a href="tel:07696779698" style="text-decoration:underline;">076967 79698</a> or email <a href="mailto:merakifamilysalon@gmail.com" style="text-decoration:underline;">merakifamilysalon@gmail.com</a> to confirm your appointment.`;
  });
}

/* --------------------------------------------------------------------------
   4. LIGHTWEIGHT THREE.JS HERO PARTICLES (PRESERVES PERFORMANCE TARGET)
   -------------------------------------------------------------------------- */
function initThreeJsHero() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Respect reduced motion or low-power screens
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768) {
    canvas.style.display = 'none';
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const particlesCount = 80;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xC5A059,
    size: 0.035,
    transparent: true,
    opacity: 0.6
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  let animationFrameId;

  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    particleSystem.rotation.y += 0.0008;
    particleSystem.rotation.x += 0.0004;
    renderer.render(scene, camera);
  }

  animate();

  // Pause when offscreen using IntersectionObserver
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!animationFrameId) animate();
    } else {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  });

  observer.observe(canvas);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });
}
