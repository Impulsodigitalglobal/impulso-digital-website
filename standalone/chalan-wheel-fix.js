(() => {
  if (window.__chalanWheelFixLoaded) return;
  window.__chalanWheelFixLoaded = true;

  const syncHandControls = () => {
    document.querySelectorAll('.wheel-control, .wheel-step, .wheel-control .wheel-drag-hand').forEach(control => {
      control.removeAttribute('aria-hidden');
      control.removeAttribute('tabindex');
      control.removeAttribute('aria-disabled');
      control.removeAttribute('disabled');
      control.classList.remove('is-disabled');
      control.disabled = false;
      control.style.removeProperty('display');
      control.style.removeProperty('opacity');
      control.style.removeProperty('pointer-events');
      control.style.removeProperty('visibility');
      control.style.removeProperty('cursor');
    });

    [
      ...document.querySelectorAll('.stable-grip, .wheel-hover-hand'),
      ...Array.from(document.querySelectorAll('.wheel-drag-hand')).filter(control => !control.closest('.wheel-control')),
    ].forEach(control => {
      control.setAttribute('aria-hidden', 'true');
      control.setAttribute('tabindex', '-1');
      control.style.display = 'none';
      control.style.opacity = '0';
      control.style.pointerEvents = 'none';
      control.style.visibility = 'hidden';
    });
    document.documentElement.classList.remove('chalan-wheel-grabbing');
  };

  const blockHandEvents = event => {
    const control = event.target.closest?.('.stable-grip, .wheel-hover-hand, .wheel-drag-hand');
    if (!control) return;
    if (control.classList.contains('wheel-drag-hand') && control.closest('.wheel-control')) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
  };

  const blockWheelMoveEvents = event => {
    if (!event.target.closest?.('.mechanical-wheel')) return;
    event.stopPropagation();
    event.stopImmediatePropagation?.();
  };

  document.addEventListener('pointerdown', blockHandEvents, true);
  document.addEventListener('click', blockHandEvents, true);
  document.addEventListener('pointermove', blockWheelMoveEvents, true);
  document.addEventListener('mousemove', blockWheelMoveEvents, true);
  document.addEventListener('touchstart', blockHandEvents, { capture: true, passive: false });
  document.addEventListener('touchmove', blockHandEvents, { capture: true, passive: false });
  document.addEventListener('touchmove', blockWheelMoveEvents, { capture: true, passive: false });
  document.addEventListener('DOMContentLoaded', syncHandControls);
  window.addEventListener('load', syncHandControls);
  new MutationObserver(syncHandControls).observe(document.documentElement, { childList: true, subtree: true });
  window.setInterval(syncHandControls, 1000);
  syncHandControls();
})();
