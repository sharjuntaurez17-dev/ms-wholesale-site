/**
 * Scroll reveal for the Apple-styled pages (history.html, customers.html).
 *
 * Reveals each element once as it enters view. Reduced-motion visitors get
 * everything shown immediately, so we skip the observer entirely.
 */
(function () {
    'use strict';

    var items = document.querySelectorAll('.ms-history .mh-reveal');
    if (!items.length) return;

    var still = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (still.matches || !('IntersectionObserver' in window)) {
        for (var i = 0; i < items.length; i++) items[i].classList.add('is-in');
        return;
    }

    var seen = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-in');
            seen.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

    items.forEach(function (el) { seen.observe(el); });
})();
