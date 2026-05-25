/* MS logo sparkle effect — vanilla port of the SparklesText React component.
   Generates animated gold SVG stars around the top-bar logo. */
(function () {
  var SVG_NS = "http://www.w3.org/2000/svg";
  var STAR_PATH =
    "M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z";

  // Bright sparkle palette — mostly white/cream so they pop on both
  // the crimson bar and the gold logo (gold-on-gold was too subtle)
  var COLORS = ["#FFFFFF", "#FFFFFF", "#FFF6DC", "#FFE9A8", "#E8C97A"];
  var SPARKLES_COUNT = 20;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function placeSparkle(svg) {
    var scale = rand(0.7, 1.6);
    svg.style.left = rand(-10, 102) + "%";
    svg.style.top = rand(-15, 105) + "%";
    svg.style.setProperty("--ms-scale", scale.toFixed(2));
    svg.style.animationDelay = rand(0, 1.6).toFixed(2) + "s";
    var size = (16 * scale + 12).toFixed(1);
    svg.style.width = size + "px";
    svg.style.height = size + "px";
    svg.querySelector("path").setAttribute(
      "fill",
      COLORS[Math.floor(Math.random() * COLORS.length)]
    );
    // lifespan in "ticks" before this star is recycled to a new position
    svg.dataset.life = Math.floor(rand(5, 15));
  }

  function createSparkle() {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "ms-sparkle");
    svg.setAttribute("viewBox", "0 0 21 21");
    var path = document.createElementNS(SVG_NS, "path");
    svg.appendChild(path);
    placeSparkle(svg);
    return svg;
  }

  function initLogo(wrap) {
    if (wrap.dataset.sparkled) return;
    wrap.dataset.sparkled = "1";
    var stars = [];
    for (var i = 0; i < SPARKLES_COUNT; i++) {
      var s = createSparkle();
      wrap.appendChild(s);
      stars.push(s);
    }
    // Recycle: every tick, decrement life; when depleted, re-place the star
    setInterval(function () {
      for (var j = 0; j < stars.length; j++) {
        var life = parseFloat(stars[j].dataset.life) - 1;
        if (life <= 0) {
          placeSparkle(stars[j]);
        } else {
          stars[j].dataset.life = life;
        }
      }
    }, 300);
  }

  function start() {
    var wraps = document.querySelectorAll(".top-style-two .logo a");
    for (var i = 0; i < wraps.length; i++) initLogo(wraps[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();

/* Products dropdown / footer category links — scroll to the categories
   section AND switch the carousel to the chosen rice. Capture phase so it
   runs before validnavs' own handlers. */
(function () {
  function catIndex(t) {
    t = (t || "").toLowerCase();
    if (t.indexOf("boiled") >= 0) return 0;
    if (t.indexOf("idli") >= 0) return 1;
    if (t.indexOf("raw") >= 0) return 2;
    if (t.indexOf("basmati") >= 0) return 3;
    if (t.indexOf("biryani") >= 0 || t.indexOf("seeraga") >= 0) return 4;
    if (t.indexOf("matta") >= 0 || t.indexOf("kerala") >= 0) return 5;
    return -1;
  }

  document.addEventListener(
    "click",
    function (e) {
      var a = e.target.closest ? e.target.closest('a[href*="categories"]') : null;
      if (!a) return;
      var cat = document.getElementById("categories");
      if (!cat) return; // not on the homepage -> let it navigate to index.html#categories

      e.preventDefault();
      e.stopPropagation();

      var idx = catIndex(a.textContent);
      if (idx >= 0 && window.bootstrap) {
        var carEl = document.getElementById("timeline-carousels");
        if (carEl) {
          try {
            window.bootstrap.Carousel.getOrCreateInstance(carEl).to(idx);
          } catch (err) {}
        }
      }
      cat.scrollIntoView({ behavior: "smooth", block: "start" });

      // best-effort close of the mobile menu/sidenav
      var menu = document.getElementById("navbar-menu");
      if (menu) menu.classList.remove("in", "show");
      document.body.classList.remove("menu-open", "nav-expanded", "sidebar-open");
    },
    true
  );
})();
