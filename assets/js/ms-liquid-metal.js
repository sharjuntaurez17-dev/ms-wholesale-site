/**
 * Liquid metal shader on the history page's Enquire Now button.
 *
 * Progressive enhancement: the button in the HTML is the normal gold pill and
 * works on its own. This only upgrades it when WebGL is available and the
 * visitor has not asked for reduced motion, so any failure leaves the plain
 * button in place rather than a broken one.
 */
(function () {
  'use strict';

  var btn = document.querySelector('.ms-history .mh-btn');
  if (!btn || btn.dataset.metal === 'on') return;
  if (!window.MSShaders || !window.MSShaders.ShaderMount) return;

  // An animated shader is exactly what reduced motion is asking us not to run.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Probe for WebGL, then immediately release the probe's context. Browsers
  // cap how many live contexts a page may hold.
  var probe = document.createElement('canvas');
  var gl = probe.getContext('webgl2') || probe.getContext('webgl');
  if (!gl) return;
  var loseCtx = gl.getExtension('WEBGL_lose_context');
  if (loseCtx) loseCtx.loseContext();

  var label = btn.textContent.trim();

  var shaderEl = document.createElement('span');
  shaderEl.className = 'mh-btn__shader';

  var faceEl = document.createElement('span');
  faceEl.className = 'mh-btn__face';

  var labelEl = document.createElement('span');
  labelEl.className = 'mh-btn__label';
  labelEl.textContent = label;

  btn.textContent = '';
  btn.appendChild(shaderEl);
  btn.appendChild(faceEl);
  btn.appendChild(labelEl);
  btn.classList.add('is-metal');
  btn.dataset.metal = 'on';

  var mount;
  try {
    mount = new window.MSShaders.ShaderMount(
      shaderEl,
      window.MSShaders.liquidMetalFragmentShader,
      {
        u_repetition: 4,
        u_softness: 0.5,
        u_shiftRed: 0.3,
        u_shiftBlue: 0.3,
        u_distortion: 0,
        u_contour: 0,
        u_angle: 45,
        u_scale: 8,
        u_shape: 1,
        u_offsetX: 0.1,
        u_offsetY: -0.1
      },
      undefined,
      0.6
    );
  } catch (err) {
    // Roll back to the plain gold button rather than leaving a dead shell.
    btn.classList.remove('is-metal');
    delete btn.dataset.metal;
    btn.textContent = label;
    return;
  }

  function speed(value) {
    if (mount && typeof mount.setSpeed === 'function') mount.setSpeed(value);
  }

  var hovering = false;

  btn.addEventListener('mouseenter', function () { hovering = true; speed(1); });
  btn.addEventListener('mouseleave', function () { hovering = false; speed(0.6); });
  btn.addEventListener('focus', function () { speed(1); });
  btn.addEventListener('blur', function () { if (!hovering) speed(0.6); });

  // Pulse on press, and settle back to whatever state the pointer is in.
  btn.addEventListener('pointerdown', function () {
    speed(2.4);
    setTimeout(function () { speed(hovering ? 1 : 0.6); }, 300);
  });

  // The upstream component calls destroy() but leaves its canvas behind, so
  // every teardown leaks one. Clear the container as well.
  function teardown() {
    if (mount && typeof mount.destroy === 'function') mount.destroy();
    mount = null;
    while (shaderEl.firstChild) shaderEl.removeChild(shaderEl.firstChild);
  }

  window.addEventListener('pagehide', teardown);
})();
