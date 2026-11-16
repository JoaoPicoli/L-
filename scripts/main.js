import { RELEASE } from "./release-config.js";

const downloadButton = document.querySelector("#download-button");
const releaseStatus = document.querySelector("#release-status");

if (downloadButton && releaseStatus && RELEASE.available && RELEASE.downloadUrl.startsWith("https://")) {
  downloadButton.disabled = false;
  downloadButton.querySelector("span:first-child").textContent = `Baixar Lû · v${RELEASE.version}`;
  releaseStatus.textContent = "APK oficial assinado, fornecido pela release pública do Lû.";
  downloadButton.addEventListener("click", () => {
    window.location.assign(RELEASE.downloadUrl);
  });
}

const header = document.querySelector("[data-smart-nav]");
const mascotButton = document.querySelector(".mascot-trigger");
const mascotImage = mascotButton?.querySelector(".nav-mascot-static");
const mascotMotion = mascotButton?.querySelector(".nav-mascot-motion");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (header) {
  let previousY = Math.max(0, window.scrollY);
  let direction = 0;
  let accumulated = 0;
  let framePending = false;

  const showHeader = () => {
    header.classList.remove("is-hidden");
  };

  const hideHeader = () => {
    if (header.contains(document.activeElement)) {
      showHeader();
      return;
    }

    header.classList.add("is-hidden");
  };

  const updateHeader = () => {
    framePending = false;
    const currentY = Math.max(0, window.scrollY);
    const delta = currentY - previousY;
    previousY = currentY;

    if (currentY <= 12) {
      direction = 0;
      accumulated = 0;
      showHeader();
      return;
    }

    if (Math.abs(delta) < 1) return;

    const nextDirection = Math.sign(delta);
    if (nextDirection !== direction) {
      direction = nextDirection;
      accumulated = 0;
    }
    accumulated += Math.abs(delta);

    if (direction > 0 && accumulated >= 10) hideHeader();
    if (direction < 0 && accumulated >= 3) showHeader();
  };

  window.addEventListener("scroll", () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateHeader);
  }, { passive: true });

  header.addEventListener("focusin", showHeader);
}

if (mascotButton && mascotImage && mascotMotion) {
  const shakeUrl = new URL("../assets/mascots/lu-bunny-shake.svg", import.meta.url);
  let shakeMarkupPromise;

  const loadShakeMarkup = () => {
    if (!shakeMarkupPromise) {
      shakeMarkupPromise = fetch(shakeUrl).then((response) => {
        if (!response.ok) throw new Error("Mascot animation unavailable");
        return response.text();
      }).catch(() => {
        shakeMarkupPromise = undefined;
        return null;
      });
    }
    return shakeMarkupPromise;
  };

  if (!reducedMotion.matches) void loadShakeMarkup();

  let isAnimating = false;
  let resetTimer = 0;

  const resetMascot = () => {
    window.clearTimeout(resetTimer);
    mascotMotion.replaceChildren();
    mascotButton.classList.remove("is-animating");
    mascotButton.setAttribute("aria-busy", "false");
    isAnimating = false;
  };

  const playShake = async () => {
    if (isAnimating || reducedMotion.matches) return;

    isAnimating = true;
    mascotButton.setAttribute("aria-busy", "true");

    try {
      const markup = await loadShakeMarkup();
      if (!markup || reducedMotion.matches) {
        resetMascot();
        return;
      }

      const parsed = new DOMParser().parseFromString(markup, "image/svg+xml");
      const sourceSvg = parsed.documentElement;
      if (sourceSvg.localName !== "svg" || parsed.querySelector("parsererror")) {
        resetMascot();
        return;
      }

      const svg = document.importNode(sourceSvg, true);
      const motionGroup = svg.querySelector(".sva");
      if (!motionGroup) {
        resetMascot();
        return;
      }

      svg.classList.add("nav-shake-svg");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      motionGroup.addEventListener("animationend", (event) => {
        if (event.target === motionGroup && event.animationName === "sva-shake") resetMascot();
      });

      mascotMotion.replaceChildren(svg);
      mascotButton.classList.add("is-animating");
      resetTimer = window.setTimeout(resetMascot, 2300);
    } catch {
      resetMascot();
    }
  };

  let activeTouchPointer = null;
  let lastTouchActivation = Number.NEGATIVE_INFINITY;

  mascotButton.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch" && event.isPrimary) {
      activeTouchPointer = event.pointerId;
    }
  });

  mascotButton.addEventListener("pointerup", (event) => {
    if (event.pointerType !== "touch" || event.pointerId !== activeTouchPointer) return;
    activeTouchPointer = null;

    const bounds = mascotButton.getBoundingClientRect();
    const endedInside = event.clientX >= bounds.left && event.clientX <= bounds.right
      && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    if (!endedInside) return;

    lastTouchActivation = performance.now();
    void playShake();
  });

  mascotButton.addEventListener("pointercancel", () => {
    activeTouchPointer = null;
  });

  mascotButton.addEventListener("click", (event) => {
    if (event.detail > 0 && performance.now() - lastTouchActivation < 750) return;
    void playShake();
  });
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches && isAnimating) resetMascot();
  });
}
