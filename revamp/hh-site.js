/* halvorhansen.no – menu toggle and image placeholders */
(function () {
  "use strict";

  /* ---------- Phone menu (the three lines) ---------- */
  var nav = document.getElementById("site-nav");
  var toggle = nav && nav.querySelector(".site-nav__toggle");

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    // Close when a link is chosen, on Escape, or on a tap outside the menu
    nav.querySelectorAll(".site-nav__menu a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target)) setOpen(false);
    });
    // Reset if the window grows past the phone breakpoint
    window.matchMedia("(min-width: 768px)").addEventListener("change", function (m) {
      if (m.matches) setOpen(false);
    });
  }

  /* ---------- Image placeholders ---------- */
  function done(img) { img.classList.add("is-loaded"); }

  function watch(img) {
    img.classList.add("hh-ph");
    // Already finished (loaded or failed) before this script ran
    if (img.complete && img.getAttribute("src")) done(img);
  }

  // Catch every image load/error on the page, including images added later
  document.addEventListener("load", function (e) {
    if (e.target.tagName === "IMG") done(e.target);
  }, true);
  document.addEventListener("error", function (e) {
    if (e.target.tagName === "IMG") done(e.target);
  }, true);

  document.querySelectorAll("img").forEach(watch);

  // Images inserted by scripts (e.g. blog posts) get the same treatment
  if ("MutationObserver" in window) {
    new MutationObserver(function (records) {
      records.forEach(function (r) {
        r.addedNodes.forEach(function (n) {
          if (n.nodeType !== 1) return;
          if (n.tagName === "IMG") watch(n);
          else n.querySelectorAll && n.querySelectorAll("img").forEach(watch);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }
})();
