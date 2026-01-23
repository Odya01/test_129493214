document.addEventListener("DOMContentLoaded", () => {
  const openBtns = document.querySelectorAll("[data-modal-open]");
  const modals = document.querySelectorAll("[data-modal]");

  if (!openBtns.length || !modals.length) return;

  const lockScroll = () => {
    document.body.style.overflow = "hidden";
  };

  const unlockScroll = () => {
    document.body.style.overflow = "";
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove("is-open");
    unlockScroll();
  };

  const closeAll = () => {
    modals.forEach((m) => m.classList.remove("is-open"));
    unlockScroll();
  };

  const openModal = (key) => {
    const modal = document.querySelector(`[data-modal="${key}"]`);
    if (!modal) return;
    closeAll();
    modal.classList.add("is-open");
    lockScroll();
  };

  openBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-modal-open");
      if (!key) return;
      openModal(key);
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      const closeBtn = e.target.closest("[data-modal-close]");
      if (closeBtn) {
        closeModal(modal);
        return;
      }

      if (e.target.classList.contains("modal__overlay")) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeAll();
  });
});
