// Result clips play muted and looped while they are on screen; the BibTeX block copies on click.
(() => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const onScreen = new IntersectionObserver(
    (entries) => {
      for (const e of entries) e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause();
    },
    { threshold: 0.4 },
  );
  if (!reduceMotion) for (const v of document.querySelectorAll("video[data-autoplay]")) onScreen.observe(v);

  // Explorable figures: hovering, focusing or tapping a region shows its description. The panel stays
  // open while the pointer is on it (so a link inside can be clicked) and resets once the pointer leaves.
  for (const box of document.querySelectorAll("[data-stages]")) {
    const hots = box.querySelectorAll(".hot");
    const panel = box.querySelector(".stage-panel");
    let timer;
    const show = (n) => {
      clearTimeout(timer);
      for (const t of box.querySelectorAll(".stage-text")) t.hidden = t.dataset.stage !== n;
      for (const h of hots) h.classList.toggle("on", h.dataset.stage === n);
    };
    const resetSoon = () => {
      clearTimeout(timer);
      timer = setTimeout(() => show("0"), 300);
    };
    for (const h of hots) {
      for (const ev of ["mouseenter", "focus", "click"]) h.addEventListener(ev, () => show(h.dataset.stage));
      h.addEventListener("mouseleave", resetSoon);
      h.addEventListener("blur", (e) => panel.contains(e.relatedTarget) || resetSoon());
    }
    panel.addEventListener("mouseenter", () => clearTimeout(timer));
    panel.addEventListener("mouseleave", resetSoon);
    // On touch screens there is no mouseleave: a tap outside the targets and the panel resets it.
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".hot") && !panel.contains(e.target)) show("0");
    });
  }

  // "See how it is built": after the scroll, pulse the figure it points at.
  for (const a of document.querySelectorAll("a.jump")) {
    a.addEventListener("click", () => {
      const fig = document.querySelector(a.getAttribute("href"))?.nextElementSibling;
      if (!fig) return;
      setTimeout(() => {
        fig.classList.remove("flash");
        void fig.offsetWidth;
        fig.classList.add("flash");
      }, 600);
    });
  }

  // The policy's inputs: hovering a term shows what it is.
  for (const box of document.querySelectorAll("[data-obs]")) {
    const desc = box.querySelector(".obs-desc");
    for (const c of box.querySelectorAll(".chip")) {
      const on = () => (desc.innerHTML = c.dataset.desc);
      const off = () => (desc.textContent = desc.dataset.default);
      for (const ev of ["mouseenter", "focus"]) c.addEventListener(ev, on);
      for (const ev of ["mouseleave", "blur"]) c.addEventListener(ev, off);
    }
  }

  for (const b of document.querySelectorAll("button[data-copy]")) {
    b.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(document.getElementById(b.dataset.copy).textContent);
        b.textContent = "Copied";
      } catch {
        b.textContent = "Select and copy";
      }
      setTimeout(() => (b.textContent = "Copy"), 1600);
    });
  }
})();
