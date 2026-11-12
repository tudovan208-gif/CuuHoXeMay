/* ==========================================================================
   MINH THỨC MOTOR – Shared behaviour for sub pages
   (menu mobile, hiệu ứng xuất hiện, bộ đếm, tab chẩn đoán, lọc tin, carousel)
   ========================================================================== */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile menu & Dropdowns ---------- */
  const toggle = document.getElementById('mobileMenuToggle');
  const menu = document.getElementById('navMenu');
  const ICON_MENU = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
  const ICON_CLOSE = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

  const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));
  const closeDropdowns = (except = null) => {
    dropdowns.forEach((dd) => {
      if (dd !== except) {
        dd.classList.remove('open');
        const btn = dd.querySelector('.nav-dropdown-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  };

  dropdowns.forEach((dd) => {
    const btn = dd.querySelector('.nav-dropdown-toggle');
    if (!btn) return;
    if (dd.querySelector('.nav-dropdown-item.active') && window.innerWidth <= 1180) {
      dd.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
    btn.addEventListener('click', (e) => {
      const isMobile = window.innerWidth <= 1180;
      const isTouchNoHover = window.matchMedia('(hover: none)').matches;
      if (isMobile || (isTouchNoHover && !dd.classList.contains('open'))) {
        e.preventDefault();
        e.stopPropagation();
        const willOpen = !dd.classList.contains('open');
        closeDropdowns(dd);
        dd.classList.toggle('open', willOpen);
        btn.setAttribute('aria-expanded', String(willOpen));
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) closeDropdowns();
  });

  if (toggle && menu) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'navMenu');
    const setOpen = (open) => {
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
      toggle.innerHTML = open ? ICON_CLOSE : ICON_MENU;
      if (!open) closeDropdowns();
    };
    toggle.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
    menu.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      if (link.classList.contains('nav-dropdown-toggle') && window.innerWidth <= 1180) return;
      setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDropdowns();
        setOpen(false);
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Animated counters: <b data-count="15000" data-suffix="+"> ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const formatVi = (n) => n.toLocaleString('vi-VN');
  const runCounter = (el) => {
    const target = Number(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || '';
    const suffixHtml = suffix ? `<span>${suffix}</span>` : '';
    if (reduceMotion) { el.innerHTML = formatVi(target) + suffixHtml; return; }
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.innerHTML = formatVi(Math.round(target * eased)) + suffixHtml;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      const co = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { runCounter(entry.target); co.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach((el) => co.observe(el));
    } else {
      counters.forEach(runCounter);
    }
  }

  /* ---------- Tabs (trang xe máy: "Xe bạn đang bị gì?") ---------- */
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const tabs = Array.from(group.querySelectorAll('[role="tab"]'));
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', (e) => {
        const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
        if (e.key in keys) {
          e.preventDefault();
          select(tabs[(i + keys[e.key] + tabs.length) % tabs.length], true);
        } else if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        else if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
  });

  /* ---------- News filter (trang tin tức) ---------- */
  const filterWrap = document.querySelector('[data-filter-group]');
  if (filterWrap) {
    const chips = filterWrap.querySelectorAll('[data-filter]');
    const items = document.querySelectorAll('[data-cat]');
    const empty = document.getElementById('nwEmpty');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const cat = chip.dataset.filter;
        chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        let visible = 0;
        items.forEach((item) => {
          const show = cat === 'all' || item.dataset.cat === cat;
          item.hidden = !show;
          if (show && !item.classList.contains('nw-feature')) visible++;
        });
        if (empty) empty.hidden = visible !== 0;
      });
    });
  }

  /* ---------- Horizontal rail (trang Vespa) ---------- */
  document.querySelectorAll('[data-rail]').forEach((rail) => {
    const id = rail.id;
    const step = () => Math.max(rail.clientWidth * 0.8, 260);
    document.querySelectorAll(`[data-rail-prev="${id}"]`).forEach((b) =>
      b.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' })));
    document.querySelectorAll(`[data-rail-next="${id}"]`).forEach((b) =>
      b.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' })));
  });

  /* ---------- Contact form (trang liên hệ) → POST /api/contact qua js/api.js ---------- */
  const form = document.getElementById('contactPageForm');
  if (form) {
    const ok = document.getElementById('contactSuccess');
    const btn = form.querySelector('[type="submit"]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const fd = new FormData(form);
      const payload = {
        name: String(fd.get('name') || '').trim(),
        phone: String(fd.get('phone') || '').trim(),
        service: String(fd.get('service') || ''),
        message: String(fd.get('message') || '').trim()
      };
      const label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Đang gửi…'; }
      let msg = '';
      try {
        if (window.RescueApi) {
          const res = await window.RescueApi.sendContact(payload);
          if (res && res.message) msg = res.message;
        }
      } catch (err) {
        msg = 'Chưa gửi được yêu cầu. Vui lòng gọi trực tiếp 0902 117 116.';
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = label; }
      }
      if (ok) {
        if (msg) ok.textContent = '✓ ' + msg;
        ok.hidden = false;
        ok.focus();
      }
      form.reset();
    });
  }

  /* ---------- Năm hiện tại ở footer ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
