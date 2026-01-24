const body = document.body;
const lockScroll = () => {
  body.style.overflow = "hidden";
};
const unlockScroll = () => {
  body.style.overflow = "";
};

// modal

const openBtns = document.querySelectorAll("[data-modal-open]");
const modals = document.querySelectorAll("[data-modal]");

const closeAllModals = () => {
  modals.forEach((m) => m.classList.remove("is-open"));
  unlockScroll();
};

const openModal = (key) => {
  const modal = document.querySelector(`[data-modal="${key}"]`);
  if (!modal) return;
  closeAllModals();
  modal.classList.add("is-open");
  lockScroll();
};

if (openBtns.length && modals.length) {
  openBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-modal-open");
      if (!key) return;
      openModal(key);
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      const closeEl = e.target.closest("[data-modal-close]");
      if (closeEl) {
        modal.classList.remove("is-open");
        unlockScroll();
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeAllModals();
  });
}

// burger menu

const menu = document.querySelector("[data-menu]");
const menuOpenBtn = document.querySelector("[data-menu-open]");
const menuCloseEls = document.querySelectorAll("[data-menu-close]");

const closeMenu = () => {
  if (!menu) return;
  menu.classList.remove("is-open");
  unlockScroll();
};

const openMenu = () => {
  if (!menu) return;
  menu.classList.add("is-open");
  lockScroll();
};

menuOpenBtn.addEventListener("click", openMenu);

menuCloseEls.forEach((el) => {
  el.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  closeMenu();
});

// slider
document.addEventListener("DOMContentLoaded", () => {
  const points = document.querySelector(".sec__points");
  const slides = Array.from(document.querySelectorAll(".sec__point"));
  const prevBtn = document.querySelector("[data-slider-prev]");
  const nextBtn = document.querySelector("[data-slider-next]");

  if (!points || !slides.length) return;

  const isSliderLayout = () => getComputedStyle(points).display === "flex";

  let index = 0;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  const getGap = () => {
    const gapValue =
      getComputedStyle(points).columnGap ||
      getComputedStyle(points).gap ||
      "0px";
    const gap = parseFloat(gapValue);
    return Number.isFinite(gap) ? gap : 0;
  };

  const getSlideWidth = () => {
    const first = slides[0];
    if (!first) return 0;
    return first.getBoundingClientRect().width;
  };

  const getStep = () => {
    return getSlideWidth() + getGap();
  };

  const applyTransform = (offsetPx, withAnim = true) => {
    points.style.transition = withAnim ? "0.3s ease" : "none";
    points.style.transform = `translateX(${-offsetPx}px)`;
  };

  const setIndex = (nextIndex, withAnim = true) => {
    if (!isSliderLayout()) {
      points.style.transform = "";
      points.style.transition = "";
      return;
    }

    index = (nextIndex + slides.length) % slides.length;

    const step = getStep();
    const offset = step * index;

    applyTransform(offset, withAnim);
  };

  const next = () => setIndex(index + 1, true);
  const prev = () => setIndex(index - 1, true);

  if (nextBtn) nextBtn.addEventListener("click", next);
  if (prevBtn) prevBtn.addEventListener("click", prev);

  const onStart = (x) => {
    if (!isSliderLayout()) return;
    isDragging = true;
    startX = x;
    currentX = x;
    points.style.transition = "none";
  };

  const onMove = (x) => {
    if (!isDragging || !isSliderLayout()) return;

    currentX = x;
    const dx = currentX - startX;

    const step = getStep();
    const baseOffset = step * index;

    points.style.transform = `translateX(calc(${-baseOffset}px + ${dx}px))`;
  };

  const onEnd = () => {
    if (!isDragging || !isSliderLayout()) return;
    isDragging = false;

    const dx = currentX - startX;
    const threshold = 60;

    if (dx < -threshold) next();
    else if (dx > threshold) prev();
    else setIndex(index, true);
  };

  points.addEventListener("touchstart", (e) => onStart(e.touches[0].clientX), {
    passive: true,
  });
  points.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX), {
    passive: true,
  });
  points.addEventListener("touchend", onEnd);

  points.addEventListener("mousedown", (e) => onStart(e.clientX));
  window.addEventListener("mousemove", (e) => onMove(e.clientX));
  window.addEventListener("mouseup", onEnd);

  window.addEventListener("resize", () => setIndex(index, false));
  setIndex(0, false);
});
