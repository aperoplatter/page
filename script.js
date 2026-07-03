/**
 * APÉRO PLATTER — script.js
 * Funções leves: menu mobile, rolagem suave, animações,
 * destaque de navegação, botão flutuante, ano no rodapé.
 * Sem bibliotecas externas.
 */

(function () {
  'use strict';

  /* ==========================================================
     UTILITÁRIOS
  ========================================================== */

  /**
   * Executa fn quando o DOM estiver pronto.
   */
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  /**
   * Seleciona um único elemento.
   * @param {string} selector
   * @param {Element} [ctx]
   * @returns {Element|null}
   */
  function qs(selector, ctx) {
    return (ctx || document).querySelector(selector);
  }

  /**
   * Seleciona múltiplos elementos.
   * @param {string} selector
   * @param {Element} [ctx]
   * @returns {NodeList}
   */
  function qsa(selector, ctx) {
    return (ctx || document).querySelectorAll(selector);
  }

  /* ==========================================================
     ANO NO RODAPÉ
  ========================================================== */

  function updateFooterYear() {
    var el = qs('#footer-year');
    if (el) {
      el.textContent = new Date().getFullYear();
    }
  }

  /* ==========================================================
     CABEÇALHO — SCROLL
  ========================================================== */

  function initHeaderScroll() {
    var header = qs('.site-header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ==========================================================
     MENU HAMBÚRGUER (MOBILE)
  ========================================================== */

  function initMobileMenu() {
    var btn = qs('#hamburger-btn');
    var menu = qs('#mobile-menu');
    if (!btn || !menu) return;

    var isOpen = false;

    function openMenu() {
      isOpen = true;
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Fechar menu de navegação');
      menu.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      isOpen = false;
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Abrir menu de navegação');
      menu.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', function () {
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Fechar ao clicar em um link do menu mobile
    var mobileLinks = qsa('.mobile-nav-link, .mobile-cta', menu);
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Fechar ao pressionar Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
        btn.focus();
      }
    });

    // Fechar ao clicar fora do menu (no overlay)
    menu.addEventListener('click', function (e) {
      if (e.target === menu) {
        closeMenu();
      }
    });
  }

  /* ==========================================================
     ROLAGEM SUAVE — LINKS DE ÂNCORA
  ========================================================== */

  function initSmoothScroll() {
    var anchorLinks = qsa('a[href^="#"]');
    var headerHeight = 70;

    anchorLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href === '#') return;

        var target = qs(href);
        if (!target) return;

        e.preventDefault();

        var targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });

        // Atualiza foco para acessibilidade
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ==========================================================
     DESTAQUE DA NAVEGAÇÃO CONFORME SEÇÃO (SCROLLSPY)
  ========================================================== */

  function initScrollSpy() {
    var navLinks = qsa('.nav-link');
    if (!navLinks.length) return;

    var sections = [];
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      var section = qs(href);
      if (section) {
        sections.push({ section: section, link: link });
      }
    });

    if (!sections.length) return;

    function onScroll() {
      var scrollY = window.scrollY;
      var headerH = 80;
      var current = null;

      sections.forEach(function (item) {
        var top = item.section.getBoundingClientRect().top + scrollY - headerH;
        if (scrollY >= top - 10) {
          current = item;
        }
      });

      sections.forEach(function (item) {
        item.link.classList.remove('active');
      });

      if (current) {
        current.link.classList.add('active');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ==========================================================
     ANIMAÇÕES DE ENTRADA (REVEAL ON SCROLL)
  ========================================================== */

  function initReveal() {
    var revealEls = qsa('.reveal');
    if (!revealEls.length) return;

    // Respeita prefers-reduced-motion
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      revealEls.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -48px 0px'
      }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ==========================================================
     HERO — EFEITO DE CARREGAMENTO DA IMAGEM
  ========================================================== */

  function initHeroImage() {
    var hero = qs('.hero');
    var heroImg = qs('.hero-bg');
    if (!hero || !heroImg) return;

    if (heroImg.complete) {
      hero.classList.add('loaded');
    } else {
      heroImg.addEventListener('load', function () {
        hero.classList.add('loaded');
      });
    }
  }

  /* ==========================================================
     BOTÃO FLUTUANTE WHATSAPP — VISIBILIDADE
  ========================================================== */

  function initWhatsappFloat() {
    var floatBtn = qs('#btn-whatsapp-float');
    if (!floatBtn) return;

    // Exibe após scroll inicial
    function onScroll() {
      if (window.scrollY > 300) {
        floatBtn.style.opacity = '1';
        floatBtn.style.pointerEvents = 'auto';
        floatBtn.style.transform = 'translateY(0)';
      } else {
        floatBtn.style.opacity = '0';
        floatBtn.style.pointerEvents = 'none';
        floatBtn.style.transform = 'translateY(12px)';
      }
    }

    // Estado inicial
    floatBtn.style.opacity = '0';
    floatBtn.style.pointerEvents = 'none';
    floatBtn.style.transform = 'translateY(12px)';
    floatBtn.style.transition = 'opacity 0.4s ease, transform 0.4s ease, background-color 0.35s ease, box-shadow 0.35s ease';

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ==========================================================
     LINKS DO WHATSAPP — ABERTURA EM NOVA ABA
     (garante target="_blank" em todos os links wa.me)
  ========================================================== */

  function initWhatsappLinks() {
    var links = qsa('a[href*="wa.me"]');
    links.forEach(function (link) {
      if (!link.getAttribute('target')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  /* ==========================================================
     DETALHE <details> — ACESSIBILIDADE
     Garante que o toggle seja anunciado corretamente.
  ========================================================== */

  function initDetailsAccessibility() {
    var detailsEls = qsa('details.card-details');
    detailsEls.forEach(function (det) {
      var summary = det.querySelector('summary');
      if (!summary) return;
      det.addEventListener('toggle', function () {
        var expanded = det.open;
        summary.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      });
    });
  }

  /* ==========================================================
     TABS / PRODUTOS — NAVEGAÇÃO POR TECLADO NA GRADE
  ========================================================== */

  function initProductCardsFocus() {
    var cards = qsa('.produto-card');
    cards.forEach(function (card) {
      // Não adiciona tabindex nos cards; o foco já é gerenciado pelos elementos filhos
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          var btn = card.querySelector('.btn-card');
          if (btn && e.target === card) {
            e.preventDefault();
            btn.click();
          }
        }
      });
    });
  }

  /* ==========================================================
     INICIALIZAÇÃO
  ========================================================== */

  ready(function () {
    updateFooterYear();
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollSpy();
    initReveal();
    initHeroImage();
    initWhatsappFloat();
    initWhatsappLinks();
    initDetailsAccessibility();
    initProductCardsFocus();
  });

})();
