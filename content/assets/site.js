(() => {
  const STORAGE_KEY = "kaja-lars-halvor-invitasjon-seen-v1";
  const intro = document.querySelector("#intro");
  const layout = document.querySelector(".layout");
  const video = document.querySelector("#intro-video");
  const progress = document.querySelector("#video-progress");
  const videoStage = document.querySelector("#video-stage");
  const readyStage = document.querySelector("#ready-stage");
  const envelopeForm = document.querySelector("#envelope_form");
  const openButton = document.querySelector("#open-card-btn");
  const skipButton = document.querySelector("#skip-intro");
  let stage = "closed"; // closed | video | ready | opening | card-open
  let fallbackTimer, animationTimer, readyToLeaveTimer;
  let previousFocus = null;

  const wasSeen = () => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "yes";
    } catch {
      return false;
    }
  };
  const markSeen = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "yes");
    } catch {
      /* Guest can still use the page when storage is disabled. */
    }
  };
  const clearTimers = () => {
    clearTimeout(fallbackTimer);
    clearTimeout(animationTimer);
    clearTimeout(readyToLeaveTimer);
  };
  const show = (which) => {
    videoStage.hidden = which !== "video";
    readyStage.hidden = which !== "ready";
    stage = which;
  };
  const removeCardOpenHint = () => {
    document.querySelector(".card-open-hint")?.remove();
  };
  const finish = () => {
    if (stage === "closed") return;
    clearTimers();
    video.pause();
    markSeen();
    intro.hidden = true;
    intro.classList.remove("is-card-open");
    removeCardOpenHint();
    layout.inert = false;
    document.body.classList.remove("intro-active");
    stage = "closed";
    (previousFocus?.isConnected
      ? previousFocus
      : document.querySelector("#hjem")
    ).focus?.();
  };
  const ready = () => {
    if (stage !== "video") return;
    clearTimeout(fallbackTimer);
    video.pause();
    show("ready");
    openButton.focus();
  };
  const start = () => {
    if (stage !== "closed") return;
    previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    clearTimers();
    removeCardOpenHint();
    intro.classList.remove("is-card-open");
    envelopeForm.classList.remove("is-open");
    openButton.disabled = false;
    skipButton.classList.remove("is-hidden");
    intro.hidden = false;
    layout.inert = true;
    document.body.classList.add("intro-active");
    show("video");
    progress.style.width = "0%";
    video.currentTime = 0;
    video.muted = true;
    video.play().catch(() => {
      /* Five-second timer still advances to the invite. */
    });
    fallbackTimer = setTimeout(ready, 5500);
    skipButton.focus();
  };

  video.addEventListener("timeupdate", () => {
    if (stage === "video")
      progress.style.width = `${Math.min(100, (video.currentTime / 5) * 100)}%`;
  });
  video.addEventListener("ended", ready);
  video.addEventListener("error", () => {
    if (stage === "video") fallbackTimer = setTimeout(ready, 5000);
  });

  // The one and only button: "Åpne kortet"
  openButton.addEventListener("click", (event) => {
    if (stage !== "ready") return;
    event.stopPropagation();
    stage = "opening";
    openButton.disabled = true;
    skipButton.classList.add("is-hidden");
    animationTimer = setTimeout(
      () => envelopeForm.classList.add("is-open"),
      50,
    );
    // After the animation, mark the intro as "click anywhere to continue".
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    readyToLeaveTimer = setTimeout(
      () => {
        if (stage !== "opening") return;
        stage = "card-open";
        intro.classList.add("is-card-open");
        const hint = document.createElement("p");
        hint.className = "card-open-hint";
        hint.setAttribute("aria-hidden", "true");
        intro.appendChild(hint);
        intro.setAttribute("tabindex", "-1");
        intro.focus();
      },
      reduce ? 1200 : 3600,
    );
  });

  // Clicking anywhere while the card is open continues to the site.
  intro.addEventListener("click", () => {
    if (stage === "card-open") finish();
  });

  // Skip button only works before the card is open.
  skipButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (stage === "card-open") return;
    finish();
  });

  document
    .querySelectorAll("[data-replay]")
    .forEach((button) => button.addEventListener("click", start));

  document.addEventListener("keydown", (event) => {
    // Escape always closes the intro.
    if (event.key === "Escape" && stage !== "closed") {
      finish();
      return;
    }
    // After the card is open, Enter/Space/any key continues too.
    if (stage === "card-open") {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "Spacebar"
      ) {
        event.preventDefault();
        finish();
      }
      return;
    }
    if (event.key === "Tab" && stage !== "closed") {
      const tabbables = [
        ...intro.querySelectorAll("button:not([hidden])"),
      ].filter((element) => element.getClientRects().length);
      if (tabbables.length === 0) return;
      const first = tabbables[0],
        last = tabbables[tabbables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  if (!wasSeen()) start();

  const flipButton = document.querySelector("#flip-save-date");
  flipButton.addEventListener("click", () => {
    const turned = flipButton.classList.toggle("is-flipped");
    flipButton.setAttribute("aria-pressed", String(turned));
    flipButton.setAttribute(
      "aria-label",
      turned
        ? "Vis forsiden av save the date-kortet"
        : "Vis baksiden av save the date-kortet",
    );
  });

  const nav = document.querySelector(".site-nav");
  if ("IntersectionObserver" in window) {
    const links = [...nav.querySelectorAll(".nav-links a")];
    const byId = new Map(links.map((link) => [link.hash.slice(1), link]));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            links.forEach((link) => link.removeAttribute("aria-current"));
            byId.get(entry.target.id)?.setAttribute("aria-current", "location");
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => observer.observe(section));
  }
})();
