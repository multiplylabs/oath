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

  // Reference-generation figure: hovering, focusing or tapping a stage shows its description.
  for (const box of document.querySelectorAll("[data-stages]")) {
    const hots = box.querySelectorAll(".hot");
    const show = (n) => {
      for (const t of box.querySelectorAll(".stage-text")) t.hidden = t.dataset.stage !== n;
      for (const h of hots) h.classList.toggle("on", h.dataset.stage === n);
    };
    for (const h of hots) {
      for (const ev of ["mouseenter", "focus", "click"]) h.addEventListener(ev, () => show(h.dataset.stage));
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
