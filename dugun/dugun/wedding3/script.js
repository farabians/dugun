/* ══════════════════════════════════════════
   Düğün Davetiye — Script
   Envelope reveal + Countdown + Scroll FX
   ══════════════════════════════════════════ */

const envelope = document.getElementById("envelope");
const experience = document.getElementById("experience");
const hintButton = document.getElementById("hintButton");
const scrollHint = document.getElementById("scrollHint");

let opened = false;
let revealTimer = null;

/* ── Wedding Date ─────────────────────── */
const WEDDING_DATE = new Date("2026-07-26T00:00:00+03:00");

/* ══════════════════════════════════════════
   Envelope Open Logic
   ══════════════════════════════════════════ */

function openEnvelope() {
  if (opened) return;
  opened = true;

  /* Phase 1 — Envelope opens, card rises */
  experience.classList.add("opened");

  /* Phase 2 — After pause, reveal full card (zarf2 stays visible) */
  revealTimer = setTimeout(() => {
    experience.classList.add("revealed");

    /* Allow scrolling to content sections */
    document.body.classList.add("revealed-mode");

    revealTimer = null;

    /* Start countdown */
    startCountdown();

    /* Observe sections for scroll-in animation */
    observeSections();

    /* Show scroll hint after a moment */
    setTimeout(() => {
      if (scrollHint) scrollHint.style.opacity = "1";
    }, 1200);
  }, 900);

  envelope.setAttribute("aria-label", "Davetiye açıldı");
}

envelope.addEventListener("click", openEnvelope);
hintButton.addEventListener("click", openEnvelope);

/* Keyboard a11y */
envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    openEnvelope();
  }
});

/* ══════════════════════════════════════════
   Countdown Timer
   ══════════════════════════════════════════ */

function startCountdown() {
  const daysEl = document.getElementById("countDays");
  const hoursEl = document.getElementById("countHours");
  const minutesEl = document.getElementById("countMinutes");
  const secondsEl = document.getElementById("countSeconds");

  if (!daysEl) return;

  function update() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      daysEl.textContent = "0";
      hoursEl.textContent = "0";
      minutesEl.textContent = "0";
      secondsEl.textContent = "0";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

/* ══════════════════════════════════════════
   Scroll-In Animations (IntersectionObserver)
   ══════════════════════════════════════════ */

function observeSections() {
  const sections = document.querySelectorAll(".content-section");
  const footer = document.querySelector(".site-footer");

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));

  if (footer) {
    footer.style.opacity = "0";
    footer.style.transform = "translateY(20px)";
    footer.style.transition = "opacity 0.7s ease, transform 0.7s ease";

    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            footerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    footerObserver.observe(footer);
  }
}

/* ── Hide scroll hint on scroll ────────── */
let scrollHintHidden = false;
window.addEventListener("scroll", () => {
  if (!scrollHintHidden && window.scrollY > 80 && scrollHint) {
    scrollHint.style.opacity = "0";
    scrollHint.style.transition = "opacity 0.4s ease";
    scrollHintHidden = true;
  }
}, { passive: true });
