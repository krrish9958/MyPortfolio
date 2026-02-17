const roles = [
  "Flutter Developer",
  "Firebase Integrator",
  "UI Focused Builder"
];

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const saveDataEnabled = Boolean(navigator.connection && navigator.connection.saveData);
const reduceEffects = prefersReducedMotion || saveDataEnabled;

const preloader = document.getElementById("preloader");
window.addEventListener("load", () => {
  setTimeout(() => {
    preloader.classList.add("hidden");
    document.body.classList.remove("preload");
  }, 1200);
});

const typingElement = document.getElementById("typing");
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentText = roles[roleIndex];
  typingElement.textContent = currentText.slice(0, charIndex);

  if (!isDeleting && charIndex < currentText.length) {
    charIndex += 1;
    setTimeout(typeEffect, 70);
    return;
  }

  if (isDeleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeEffect, 35);
    return;
  }

  if (!isDeleting) {
    isDeleting = true;
    setTimeout(typeEffect, 1200);
  } else {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeEffect, 260);
  }
}

typeEffect();

AOS.init({
  duration: reduceEffects ? 500 : 850,
  easing: "ease-out-cubic",
  once: true,
  disable: reduceEffects
});

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navbar = document.getElementById("navbar");
const progressBar = document.getElementById("scroll-progress");
const navItems = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

navItems.forEach((item) => {
  item.addEventListener("click", () => navLinks.classList.remove("show"));
});

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 24);
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const id = entry.target.getAttribute("id");
      navItems.forEach((item) => {
        item.classList.toggle("active", item.getAttribute("href") === `#${id}`);
      });
    });
  },
  { threshold: 0.55 }
);

sections.forEach((section) => sectionObserver.observe(section));

const revealCards = document.querySelectorAll(".reveal-card");
const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        cardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 120}ms`;
  cardObserver.observe(card);
});

const statNumbers = document.querySelectorAll(".hero-stats h3[data-target]");
const statsSection = document.querySelector(".hero-stats");
let countersStarted = false;

function animateCounter(element) {
  const target = Number(element.getAttribute("data-target"));
  const suffix = element.getAttribute("data-suffix") || "";
  const duration = 1400;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(progress * target);
    element.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
      return;
    }

    element.textContent = `${target}${suffix}`;
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || countersStarted) {
        return;
      }

      countersStarted = true;
      statNumbers.forEach((stat) => animateCounter(stat));
      statsObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.4 }
);

if (statsSection) {
  statsObserver.observe(statsSection);
}

const cursorGlow = document.getElementById("cursor-glow");
const trailContainer = document.getElementById("cursor-trail");
let mouseX = 0;
let mouseY = 0;
let cursorFrameRequested = false;
let lastTrailTime = 0;

function spawnTrailDot(x, y) {
  if (!trailContainer) {
    return;
  }

  const dot = document.createElement("span");
  dot.className = "trail-dot";
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;
  trailContainer.appendChild(dot);
  setTimeout(() => dot.remove(), 550);
}

if (!reduceEffects) {
  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (!cursorFrameRequested) {
      cursorFrameRequested = true;
      requestAnimationFrame(() => {
        cursorGlow.style.left = `${mouseX}px`;
        cursorGlow.style.top = `${mouseY}px`;
        cursorFrameRequested = false;
      });
    }

    const now = performance.now();
    if (now - lastTrailTime > 28) {
      spawnTrailDot(mouseX, mouseY);
      lastTrailTime = now;
    }
  });
}

const floatingIcons = document.querySelectorAll(".floating-icons img");
if (!reduceEffects) {
  document.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 10;
    const y = (event.clientY / window.innerHeight - 0.5) * 10;

    floatingIcons.forEach((icon, index) => {
      const speed = (index % 3) + 1;
      icon.style.transform = `translate(${x / speed}px, ${y / speed}px)`;
    });
  });
}

const projectCards = document.querySelectorAll(".project-card");
if (!reduceEffects) {
  projectCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -9;
      const rotateY = ((x / rect.width) - 0.5) * 9;
      card.style.transform = `translateY(-8px) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

const magneticButtons = document.querySelectorAll(".btn");
const supportsHover = window.matchMedia("(hover: hover)").matches;

if (supportsHover && !reduceEffects) {
  magneticButtons.forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const offsetX = event.clientX - rect.left - rect.width / 2;
      const offsetY = event.clientY - rect.top - rect.height / 2;
      const moveX = Math.max(-10, Math.min(10, offsetX * 0.22));
      const moveY = Math.max(-8, Math.min(8, offsetY * 0.28));
      button.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transition = "transform 0.35s cubic-bezier(0.2, 0.9, 0.2, 1.2)";
      button.style.transform = "translate(0, 0)";
      setTimeout(() => {
        button.style.transition = "";
      }, 360);
    });
  });
}

const contactForm = document.getElementById("contact-form");
const toast = document.getElementById("toast");
const copyEmailBtn = document.getElementById("copy-email-btn");

async function copyEmailToClipboard() {
  if (!copyEmailBtn) {
    return;
  }

  const email = copyEmailBtn.getAttribute("data-email");

  try {
    await navigator.clipboard.writeText(email);
    toast.textContent = "Email copied to clipboard.";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
  } catch (error) {
    toast.textContent = "Copy failed. Please copy email manually.";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2400);
  }
}

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", copyEmailToClipboard);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const message = (formData.get("message") || "").toString().trim();

  const recipient = "aryakrrish02@gmail.com";
  const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  );
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

  contactForm.reset();
  toast.textContent = "Email draft opened. Review and send it.";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
});
