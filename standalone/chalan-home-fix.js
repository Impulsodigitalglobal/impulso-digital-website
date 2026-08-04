(() => {
  if (window.__chalanHomeFixLoaded) return;
  window.__chalanHomeFixLoaded = true;


  // PANFI stable UI cleanup: the drag interaction was retired.
  const removeRetiredWheelUi = () => {
    document.querySelectorAll('.wheel-drag-hand, .drag-hint').forEach(element => element.remove());
    document.querySelectorAll('.wheel-control').forEach(control => {
      if (!control.querySelector('.wheel-nav-label')) {
        const label = document.createElement('div');
        label.className = 'wheel-nav-label';
        label.textContent = 'NAV';
        label.setAttribute('aria-hidden', 'true');
        const down = control.querySelector('.wheel-step-down');
        control.insertBefore(label, down || null);
      }
    });
  };

  const projects = [
    {
      name: 'KT STUDIOS',
      url: 'www.ktstudiost.com',
      websiteUrl: 'https://ktstudiost.com',
      type: 'BEAUTY • BOOKING',
      headline: 'Beauty, revealed with intention.',
      tone: 'beauty',
      shots: [
        './standalone/project-assets/kt-home.png',
        './standalone/project-assets/kt-services.png',
        './standalone/project-assets/kt-about.png',
      ],
    },
    {
      name: 'MARIA’S HOUSEKEEPING',
      url: 'mariashousekeeping.com',
      websiteUrl: 'https://marias-housekeeping-website.vercel.app',
      type: 'CLEANING • QUOTES',
      headline: 'Cleaner spaces. Better lives.',
      tone: 'cleaning',
      shots: [
        './standalone/project-assets/maria-home.png',
        './standalone/project-assets/maria-quote.png',
        './standalone/project-assets/maria-mobile.png',
      ],
    },
    {
      name: 'LUIS LANDSCAPING',
      url: 'luislandscaping.com',
      websiteUrl: '',
      type: 'LANDSCAPING • MOBILE',
      headline: 'Outdoor spaces built to last.',
      tone: 'landscape',
      shots: [
        './standalone/project-assets/luis-home.png',
        './standalone/project-assets/luis-services.png',
        './standalone/project-assets/luis-gallery.png',
      ],
    },
  ];
  let selectedProjectIndex = 0;
  let selectedPrototypePage = 0;
  let showcaseMode = 'website';
  let selectedProjectShotIndex = 0;
  let lastProjectSwitch = 0;
  let activeSectionId = 'inicio';
  let lastRenderedLanguage = '';
  let lastSectionNavAt = 0;
  let lastSectionNavPointerId = null;
  let lastUtilityActionAt = 0;
  let utilityButtonsHome = null;
  document.documentElement.dataset.chalanDesktopMode = 'false';
  document.documentElement.dataset.chalanPreviewMode = 'false';

  const sectionIds = ['inicio', 'beneficios', 'paquetes', 'portafolio', 'contacto'];
  const sectionLabelsEs = ['INICIO', '¿POR QUÉ UNA WEBSITE?', 'PLANES', 'PORTAFOLIO', 'COTIZACIÓN'];
  const sectionLabelsEn = ['HOME', 'WHY A WEBSITE?', 'PLANS', 'PORTFOLIO', 'QUOTE'];
  const navDomIndices = [0, 1, 2, 3, 5];
  const sectionIndexFromDomIndex = index => navDomIndices.indexOf(index);
  const domIndexFromSectionIndex = index => navDomIndices[index] ?? index;
  const normalizeNavText = text => (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim();
  const navLabelFor = element => element?.querySelector?.('small, .wheel-item-inner span, span span');
  const rememberOriginalNavLabel = element => {
    const label = navLabelFor(element);
    const text = normalizeNavText(label?.textContent || '');
    if (!element?.dataset || !text) return '';
    if (!element.dataset.chalanOriginalLabel) element.dataset.chalanOriginalLabel = text;
    return element.dataset.chalanOriginalLabel;
  };
  const sectionIndexFromElement = (element, domIndex) => {
    const original = rememberOriginalNavLabel(element);
    const current = normalizeNavText(navLabelFor(element)?.textContent || '');
    const text = `${original} ${current}`;

    if (text.includes('PROCESO') || text.includes('PROCESS')) return -1;
    if (text.includes('INICIO') || text.includes('HOME')) return 0;
    if (text.includes('POR QUE') || text.includes('WHY A WEBSITE')) return 1;
    if (text.includes('PLAN') || text.includes('PAQUETE') || text.includes('PACKAGE')) return 2;
    if (text.includes('PORTAFOLIO') || text.includes('PORTFOLIO') || text.includes('PROYECTO') || text.includes('PROJECT')) return 3;
    if (text.includes('COTIZ') || text.includes('QUOTE') || text.includes('CONTACT')) return 4;
    return sectionIndexFromDomIndex(domIndex);
  };
  const hideNavElement = element => {
    if (!element) return;
    element.hidden = true;
    element.style.display = 'none';
    element.dataset.slot = 'hidden';
    element.classList.remove('active');
    element.setAttribute('aria-hidden', 'true');
    element.setAttribute('tabindex', '-1');
  };
  const showNavElement = element => {
    if (!element) return;
    element.hidden = false;
    element.style.display = '';
    element.removeAttribute('aria-hidden');
    element.removeAttribute('tabindex');
  };

  const prototypes = [
    { name: 'LA CEIBA & EL COMAL', type: 'RESTAURANTE • FOOD TRUCK', typeEn: 'RESTAURANT • FOOD TRUCK', tone: 'prototype-blue', image: './standalone/project-assets/prototype-la-ceiba.png' },
    { name: 'PASITOS DAYCARE', type: 'DAYCARE • INSCRIPCIONES', typeEn: 'DAYCARE • ENROLLMENT', tone: 'prototype-cyan', image: './standalone/project-assets/prototype-pasitos-daycare.png' },
    { name: 'CARMEL ART', type: 'DOG TRAINING • EDUCACIÓN', typeEn: 'DOG TRAINING • EDUCATION', tone: 'prototype-violet', image: './standalone/project-assets/prototype-sarah-dogs.png' },
    { name: 'Construcción Local', type: 'CONTRACTOR • LEADS', typeEn: 'CONTRACTOR • LEADS', tone: 'prototype-steel' },
    { name: 'Fitness Coach', type: 'FITNESS • BRAND', tone: 'prototype-neon' },
    { name: 'Auto Detailing', type: 'SERVICE • BOOKING', tone: 'prototype-indigo' },
  ];

  [...projects.flatMap(project => project.shots || []), ...prototypes.map(proto => proto.image).filter(Boolean)].forEach(src => {
    const image = new Image();
    image.decoding = 'async';
    image.src = src;
  });

  const isEnglish = () => document.documentElement.lang === 'en';

  const iconSvg = () => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  const contentCopy = {
    inicio: {
      kicker: 'WEBSITES QUE GENERAN CONFIANZA',
      title: 'HAZ QUE TU NEGOCIO<br><b>INSPIRE CONFIANZA</b><br>DESDE EL PRIMER CLICK.',
      description: 'Una buena website no solo se ve bien. Genera confianza, responde las preguntas de tus clientes y convierte visitas en oportunidades de negocio.',
    },
    beneficios: {
      kicker: 'PRIMERA IMPRESIÓN DIGITAL',
      title: 'NO ES SOLO VERSE BIEN.<br>ES <b>INSPIRAR CONFIANZA.</b>',
      description: 'Tu website trabaja por tu negocio todos los días: explica lo que haces, presenta tu valor y facilita que nuevos clientes den el siguiente paso.',
      features: [
        ['PRIMERA IMPRESIÓN PROFESIONAL', 'Los clientes forman una opinión en segundos.'],
        ['COMPATIBLE CON CELULARES', 'La mayoría de tus visitas llegarán desde un teléfono.'],
        ['PREPARADA PARA CRECER', 'Lista para integrar citas, pagos o tienda cuando tu negocio lo necesite.'],
      ],
    },
    paquetes: {
      kicker: '',
      title: 'PLANES',
      description: 'No pagues por funciones que no necesitas. Elige la opción que mejor se adapta a tu negocio.',
      features: [
        ['ENTREGA RÁPIDA', 'Tu website avanza con un proceso claro para publicarla sin vueltas innecesarias.'],
        ['DISEÑO PERSONALIZADO', 'Cada website se diseña para reflejar la identidad de tu negocio.'],
        ['OPTIMIZADA PARA CELULAR', 'Diseñada para verse profesional y funcionar perfecto desde un teléfono.'],
      ],
    },
    portafolio: {
      kicker: 'PORTAFOLIO',
      title: 'NO UTILIZAMOS PLANTILLAS.<br><b>CREAMOS IDENTIDADES DIGITALES.</b>',
      description: 'Cada website nace desde cero para reflejar la identidad de cada negocio. No reutilizamos plantillas porque ninguna empresa es igual a otra.',
      features: [
        ['IDENTIDAD PROPIA', 'Cada website se diseña alrededor del negocio.'],
        ['EXPERIENCIA PREMIUM', 'Diseño pensado para proyectar calidad, claridad y confianza.'],
        ['CADA NEGOCIO ES DIFERENTE', 'Creamos una presencia digital alineada a su personalidad y objetivos.'],
      ],
    },
    contacto: {
      kicker: 'EMPECEMOS TU PROYECTO',
      title: 'DALE A TU NEGOCIO<br>LA PRESENCIA QUE <b>MERECE.</b>',
      description: 'Cuéntanos qué haces y qué necesitas. Te ayudaremos a elegir el plan correcto o a preparar una solución personalizada.',
    },
  };

  const contentCopyEn = {
    inicio: {
      kicker: 'WEBSITES THAT BUILD TRUST',
      title: 'MAKE YOUR BUSINESS<br><b>INSPIRE TRUST</b><br>FROM THE FIRST CLICK.',
      description: 'A good website does more than look good. It builds trust, answers your customers’ questions, and turns visits into business opportunities.',
    },
    beneficios: {
      kicker: 'FIRST DIGITAL IMPRESSION',
      title: 'IT IS NOT JUST ABOUT LOOKING GOOD.<br>IT IS ABOUT <b>BUILDING TRUST.</b>',
      description: 'Your website works for your business every day: it explains what you do, presents your value, and helps new customers take the next step.',
      features: [
        ['PROFESSIONAL FIRST IMPRESSION', 'Customers form an opinion in seconds.'],
        ['MOBILE FRIENDLY', 'Most of your visitors will arrive from a phone.'],
        ['READY TO GROW', 'Ready to add appointments, payments, or a store when your business needs it.'],
      ],
    },
    paquetes: {
      kicker: '',
      title: 'PLANS',
      description: 'Do not pay for features you do not need. Choose the option that best fits your business.',
      features: [
        ['FAST DELIVERY', 'Your website moves forward through a clear process so it can launch without unnecessary delays.'],
        ['CUSTOM DESIGN', 'Every website is designed to reflect your business identity.'],
        ['OPTIMIZED FOR MOBILE', 'Designed to look professional and work perfectly from a phone.'],
      ],
    },
    portafolio: {
      kicker: 'PORTFOLIO',
      title: 'WE DO NOT USE TEMPLATES.<br><b>WE CREATE DIGITAL IDENTITIES.</b>',
      description: 'Every website starts from scratch to reflect each business identity. We do not reuse templates because no two companies are the same.',
      features: [
        ['OWN IDENTITY', 'Every website is designed around the business.'],
        ['PREMIUM EXPERIENCE', 'Design built to project quality, clarity, and trust.'],
        ['EVERY BUSINESS IS DIFFERENT', 'We create a digital presence aligned with its personality and goals.'],
      ],
    },
    contacto: {
      kicker: 'START YOUR PROJECT',
      title: 'GIVE YOUR BUSINESS<br>THE PRESENCE IT <b>DESERVES.</b>',
      description: 'Tell us what you do and what you need. We will help you choose the right plan or prepare a custom solution.',
    },
  };

  const copyFor = id => (isEnglish() ? contentCopyEn : contentCopy)[id] || (isEnglish() ? contentCopyEn.inicio : contentCopy.inicio);

  const instagramSvg = () => `
    <svg class="social-brand-svg instagram-svg" viewBox="0 0 448 512" role="img" aria-hidden="true">
      <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141Zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7Zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8Zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9s-58-34.4-93.9-36.2c-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2s34.4-58 36.2-93.9c2.1-37 2.1-147.8 0-184.8ZM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1Z"/>
    </svg>`;

  const facebookSvg = () => `
    <svg class="social-brand-svg facebook-svg" viewBox="0 0 320 512" role="img" aria-hidden="true">
      <path fill="currentColor" d="M279.14 288 293 197.7h-86.6v-58.6c0-24.7 12.1-48.8 50.9-48.8H296V13.7S260.4 7.6 226.4 7.6c-73.2 0-121.1 44.4-121.1 124.7v65.4H24V288h81.3v216h101.1V288Z"/>
    </svg>`;

  const portfolioSocialBlock = () => {
    const english = isEnglish();
    return `
      <div class="portfolio-social-block">
        <p><strong>${english ? 'Want to see more projects?' : '¿Quieres ver más proyectos?'}</strong><br>${english ? 'Explore our full portfolio on Instagram and Facebook, where we publish new designs, prototypes, and recent work.' : 'Explora nuestro portafolio completo en Instagram y Facebook, donde publicamos nuevos diseños, prototipos y trabajos recientes.'}</p>
        <div class="portfolio-social-links">
          <a class="portfolio-social-link instagram" href="https://www.instagram.com/impulso.dgtal?utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram Impulso Digital">${instagramSvg()}<span>Instagram</span></a>
          <a class="portfolio-social-link facebook" href="https://www.facebook.com/profile.php?id=61578292694571" target="_blank" rel="noopener noreferrer" aria-label="Facebook Impulso Digital">${facebookSvg()}<span>Facebook</span></a>
        </div>
      </div>
    `;
  };

  const syncUtilityButtons = () => {
    const english = isEnglish();
    document.querySelectorAll('.utility-buttons button').forEach(button => {
      const label = normalizeNavText(button.textContent || '');
      if (label === 'ES') button.classList.toggle('is-active', !english);
      if (label === 'EN') button.classList.toggle('is-active', english);
    });
  };

  const setImportant = (element, property, value) => {
    if (!element) return;
    element.style.setProperty(property, value, 'important');
  };

  const clearImportantStyles = element => {
    if (!element) return;
    [
      'position', 'top', 'right', 'left', 'bottom', 'width', 'min-width', 'max-width',
      'height', 'min-height', 'max-height', 'margin', 'padding', 'display',
      'flex-direction', 'align-items', 'justify-content', 'gap', 'transform',
      'translate', 'z-index', 'inset', 'border-radius', 'font-size', 'line-height',
      'letter-spacing', 'pointer-events', 'opacity', 'visibility',
    ].forEach(property => element.style.removeProperty(property));
  };

  const isPhoneLikeViewport = () => {
    const viewportWidth = window.visualViewport?.width || window.innerWidth || document.documentElement.clientWidth || 9999;
    const screenMin = Math.min(screen.width || 9999, screen.height || 9999);
    const coarseTouch = (navigator.maxTouchPoints || 0) > 0 && window.matchMedia?.('(pointer: coarse)').matches;
    return viewportWidth <= 760 || (coarseTouch && screenMin <= 932);
  };

  const pinMobileLanguageControls = () => {
    const utilityButtons = document.querySelector('.utility-buttons');
    const topbar = document.querySelector('.topbar');
    if (!utilityButtons || !topbar) return;

    if (!utilityButtonsHome) utilityButtonsHome = utilityButtons.parentElement || topbar;
    const shouldPin = isPhoneLikeViewport();

    if (!shouldPin) {
      if (utilityButtons.classList.contains('chalan-mobile-lang-pinned')) {
        utilityButtonsHome?.appendChild(utilityButtons);
        utilityButtons.classList.remove('chalan-mobile-lang-pinned');
        clearImportantStyles(utilityButtons);
        utilityButtons.querySelectorAll('button').forEach(button => clearImportantStyles(button));
      }
      return;
    }

    if (utilityButtons.parentElement !== document.body) {
      document.body.appendChild(utilityButtons);
    }
    utilityButtons.classList.add('chalan-mobile-lang-pinned');

    setImportant(utilityButtons, 'position', 'fixed');
    setImportant(utilityButtons, 'top', 'calc(env(safe-area-inset-top, 0px) + 18px)');
    setImportant(utilityButtons, 'right', 'calc(env(safe-area-inset-right, 0px) + 14px)');
    setImportant(utilityButtons, 'left', 'auto');
    setImportant(utilityButtons, 'bottom', 'auto');
    setImportant(utilityButtons, 'width', 'auto');
    setImportant(utilityButtons, 'min-width', '0');
    setImportant(utilityButtons, 'max-width', 'none');
    setImportant(utilityButtons, 'height', '42px');
    setImportant(utilityButtons, 'margin', '0');
    setImportant(utilityButtons, 'padding', '0');
    setImportant(utilityButtons, 'display', 'flex');
    setImportant(utilityButtons, 'flex-direction', 'row');
    setImportant(utilityButtons, 'align-items', 'center');
    setImportant(utilityButtons, 'justify-content', 'flex-end');
    setImportant(utilityButtons, 'gap', '8px');
    setImportant(utilityButtons, 'transform', 'none');
    setImportant(utilityButtons, 'translate', 'none');
    setImportant(utilityButtons, 'z-index', '2147483647');
    setImportant(utilityButtons, 'pointer-events', 'auto');

    utilityButtons.querySelectorAll('.desktop-mode, .mobile-mode').forEach(button => {
      button.hidden = true;
      button.setAttribute('aria-hidden', 'true');
      setImportant(button, 'display', 'none');
      setImportant(button, 'visibility', 'hidden');
      setImportant(button, 'opacity', '0');
      setImportant(button, 'pointer-events', 'none');
    });

    utilityButtons.querySelectorAll('button:not(.desktop-mode):not(.mobile-mode)').forEach(button => {
      button.hidden = false;
      button.setAttribute('aria-hidden', 'false');
      setImportant(button, 'position', 'relative');
      setImportant(button, 'inset', 'auto');
      setImportant(button, 'width', '40px');
      setImportant(button, 'min-width', '40px');
      setImportant(button, 'max-width', '40px');
      setImportant(button, 'height', '40px');
      setImportant(button, 'min-height', '40px');
      setImportant(button, 'max-height', '40px');
      setImportant(button, 'margin', '0');
      setImportant(button, 'padding', '0');
      setImportant(button, 'display', 'inline-flex');
      setImportant(button, 'align-items', 'center');
      setImportant(button, 'justify-content', 'center');
      setImportant(button, 'border-radius', '50%');
      setImportant(button, 'font-size', '11px');
      setImportant(button, 'line-height', '1');
      setImportant(button, 'letter-spacing', '.07em');
      setImportant(button, 'transform', 'none');
      setImportant(button, 'translate', 'none');
      setImportant(button, 'pointer-events', 'auto');
    });
  };

  const syncDesktopMode = () => {
    let enabled = document.documentElement.dataset.chalanDesktopMode === 'true';
    const shell = document.querySelector('.system-shell');
    const actualMobile = window.matchMedia?.('(max-width: 760px)').matches
      || ((navigator.maxTouchPoints || 0) > 0
        && window.matchMedia?.('(pointer: coarse)').matches
        && (screen.width <= 932 || screen.height <= 932));
    if (actualMobile && enabled) {
      enabled = false;
      document.documentElement.dataset.chalanDesktopMode = 'false';
    }
    const previewMobile = !actualMobile && !enabled && document.documentElement.dataset.chalanPreviewMode === 'true';
    const desktopScale = 1;

    shell?.classList.toggle('force-desktop', enabled);
    shell?.classList.toggle('real-mobile', !!actualMobile);
    shell?.classList.toggle('chalan-mobile-desktop', enabled && !!actualMobile);
    shell?.classList.toggle('mobile-preview', !!previewMobile);
    if (actualMobile || enabled) {
      document.documentElement.dataset.chalanPreviewMode = 'false';
      shell?.classList.remove('mobile-preview');
    }
    document.documentElement.classList.toggle('chalan-force-desktop', enabled);
    document.documentElement.classList.toggle('chalan-mobile-desktop', enabled && !!actualMobile);
    document.documentElement.classList.toggle('chalan-preview-mobile', !!previewMobile);
    document.body?.classList.toggle('chalan-force-desktop', enabled);
    document.body?.classList.toggle('chalan-mobile-desktop', enabled && !!actualMobile);
    document.body?.classList.toggle('chalan-preview-mobile', !!previewMobile);
    document.documentElement.style.setProperty('--chalan-desktop-scale', String(desktopScale));

    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }

    document.querySelectorAll('.utility-buttons .desktop-mode, .utility-buttons .mobile-mode').forEach(button => {
      if (actualMobile) {
        button.hidden = true;
        button.setAttribute('aria-hidden', 'true');
        button.classList.remove('is-active');
        button.style.pointerEvents = 'none';
        return;
      } else if (previewMobile) {
        button.hidden = false;
        button.setAttribute('aria-hidden', 'false');
        button.style.pointerEvents = '';
        button.textContent = 'DESKTOP';
      } else {
        button.hidden = false;
        button.setAttribute('aria-hidden', 'false');
        button.style.pointerEvents = '';
        button.textContent = isEnglish() ? 'MOBILE VERSION' : 'VERSIÓN CELULAR';
      }
      button.classList.toggle('is-active', previewMobile);
    });

    const utilityButtons = document.querySelector('.utility-buttons');
    if (actualMobile && utilityButtons) {
      setImportant(utilityButtons, 'position', 'fixed');
      setImportant(utilityButtons, 'top', 'calc(env(safe-area-inset-top, 0px) + 16px)');
      setImportant(utilityButtons, 'right', 'calc(env(safe-area-inset-right, 0px) + 12px)');
      setImportant(utilityButtons, 'left', 'auto');
      setImportant(utilityButtons, 'bottom', 'auto');
      setImportant(utilityButtons, 'width', 'auto');
      setImportant(utilityButtons, 'min-width', '0');
      setImportant(utilityButtons, 'max-width', 'none');
      setImportant(utilityButtons, 'height', '42px');
      setImportant(utilityButtons, 'margin', '0');
      setImportant(utilityButtons, 'padding', '0');
      setImportant(utilityButtons, 'display', 'flex');
      setImportant(utilityButtons, 'align-items', 'center');
      setImportant(utilityButtons, 'justify-content', 'flex-end');
      setImportant(utilityButtons, 'gap', '8px');
      setImportant(utilityButtons, 'transform', 'none');
      setImportant(utilityButtons, 'translate', 'none');
      setImportant(utilityButtons, 'z-index', '2147483647');

      utilityButtons.querySelectorAll('button:not(.desktop-mode):not(.mobile-mode)').forEach(button => {
        setImportant(button, 'position', 'relative');
        setImportant(button, 'inset', 'auto');
        setImportant(button, 'width', '40px');
        setImportant(button, 'min-width', '40px');
        setImportant(button, 'max-width', '40px');
        setImportant(button, 'height', '40px');
        setImportant(button, 'min-height', '40px');
        setImportant(button, 'max-height', '40px');
        setImportant(button, 'margin', '0');
        setImportant(button, 'padding', '0');
        setImportant(button, 'display', 'inline-flex');
        setImportant(button, 'align-items', 'center');
        setImportant(button, 'justify-content', 'center');
        setImportant(button, 'border-radius', '50%');
        setImportant(button, 'font-size', '11px');
        setImportant(button, 'line-height', '1');
        setImportant(button, 'letter-spacing', '.07em');
        setImportant(button, 'transform', 'none');
        setImportant(button, 'translate', 'none');
      });
    }
    pinMobileLanguageControls();
  };

  const setLanguage = lang => {
    if (!['es', 'en'].includes(lang)) return;
    document.documentElement.lang = lang;
    document.querySelector('.portfolio-v3-grid')?.removeAttribute('data-chalan-fixed');
    document.querySelector('.packages-v3')?.removeAttribute('data-chalan-plans');
    syncUtilityButtons();
    syncDesktopMode();
    syncNavigationLabels();
    syncActiveNav();
    renderContentPanel();
    renderRightPanel();
    setInicioCopy();
    setPackagesCopy();
    setBenefitsCopy();
    renderShowcase();
    renderPortfolio();
    renderPackages();
  };

  const setDesktopMode = enabled => {
    document.documentElement.dataset.chalanDesktopMode = enabled ? 'true' : 'false';
    if (enabled) document.documentElement.dataset.chalanPreviewMode = 'false';
    syncDesktopMode();
    syncNavigationLabels();
    syncActiveNav();
    syncWheelPose();
    normalizeMobileOrbitSlots();
    const actualMobile = window.matchMedia?.('(max-width: 760px)').matches
      || ((navigator.maxTouchPoints || 0) > 0
        && window.matchMedia?.('(pointer: coarse)').matches
        && (screen.width <= 932 || screen.height <= 932));
    const desktopLeft = 0;
    const scrollTarget = enabled && actualMobile ? { top: 0, left: desktopLeft, behavior: 'auto' } : { top: 0, left: 0, behavior: 'auto' };
    window.scrollTo(scrollTarget);
    window.setTimeout(() => {
      syncDesktopMode();
      window.dispatchEvent(new Event('resize'));
      ensureNavigationHitboxes();
      if (enabled && actualMobile) window.scrollTo({ top: 0, left: desktopLeft, behavior: 'auto' });
    }, 80);
    window.setTimeout(() => {
      if (enabled && actualMobile) window.scrollTo({ top: 0, left: desktopLeft, behavior: 'auto' });
    }, 260);
  };

  const syncNavigationLabels = () => {
    const labels = isEnglish() ? sectionLabelsEn : sectionLabelsEs;
    document.querySelectorAll('.wheel-item').forEach((item, index) => {
      const sectionIndex = sectionIndexFromElement(item, index);
      if (sectionIndex < 0) {
        hideNavElement(item);
        return;
      }
      showNavElement(item);
      const label = item.querySelector('.wheel-item-inner span, span span');
      if (label && labels[sectionIndex]) label.textContent = labels[sectionIndex];
    });
    document.querySelectorAll('.section-progress button').forEach((item, index) => {
      const sectionIndex = sectionIndexFromElement(item, index);
      if (sectionIndex < 0) {
        hideNavElement(item);
        return;
      }
      showNavElement(item);
    });
    document.querySelectorAll('.mobile-orbit-button').forEach((item, index) => {
      const sectionIndex = sectionIndexFromElement(item, index);
      if (sectionIndex < 0) {
        hideNavElement(item);
        return;
      }
      showNavElement(item);
      const label = item.querySelector('small');
      if (label && labels[sectionIndex]) label.textContent = labels[sectionIndex];
    });
  };

  const syncActiveNav = () => {
    const activeIndex = sectionIds.indexOf(activeSectionId);
    document.documentElement.dataset.chalanWheelIndex = String(Math.max(0, activeIndex));
    document.querySelectorAll('.wheel-item').forEach((item, index) => item.classList.toggle('active', sectionIndexFromElement(item, index) === activeIndex));
    document.querySelectorAll('.section-progress button').forEach((item, index) => item.classList.toggle('active', sectionIndexFromElement(item, index) === activeIndex));
    document.querySelectorAll('.mobile-orbit-button').forEach((item, index) => {
      const sectionIndex = sectionIndexFromElement(item, index);
      if (sectionIndex < 0) {
        hideNavElement(item);
        return;
      }
      showNavElement(item);
      item.classList.toggle('active', sectionIndex === activeIndex);
      let slot = sectionIndex - activeIndex;
      const half = sectionIds.length / 2;
      if (slot > half) slot -= sectionIds.length;
      if (slot < -half) slot += sectionIds.length;
      const nextSlot = String(slot);
      if (item.dataset.slot !== nextSlot) item.dataset.slot = nextSlot;
    });
  };

  const normalizeMobileOrbitSlots = () => {
    const buttons = Array.from(document.querySelectorAll('.mobile-orbit-button'))
      .map((button, domIndex) => ({ button, sectionIndex: sectionIndexFromElement(button, domIndex) }))
      .filter(entry => entry.sectionIndex >= 0);
    if (!buttons.length) return;
    const activeIndex = Math.max(0, buttons.find(entry => entry.button.classList.contains('active'))?.sectionIndex ?? 0);
    const half = sectionIds.length / 2;
    buttons.forEach(({ button, sectionIndex }) => {
      let slot = sectionIndex - activeIndex;
      if (slot > half) slot -= sectionIds.length;
      if (slot < -half) slot += sectionIds.length;
      const nextSlot = String(slot);
      if (button.dataset.slot !== nextSlot) button.dataset.slot = nextSlot;
    });
  };

  const syncWheelPose = () => {
    const index = Math.max(0, sectionIds.indexOf(activeSectionId));
    const wheelAngle = -index * 36;
    const shell = document.querySelector('.system-shell');
    const forceDesktop = document.documentElement.dataset.chalanDesktopMode === 'true' || shell?.classList.contains('force-desktop');
    const isMobileLayout = !forceDesktop && (shell?.classList.contains('real-mobile')
      || shell?.classList.contains('mobile-preview')
      || window.matchMedia?.('(max-width: 760px)').matches);

    if (isMobileLayout) {
      document.querySelectorAll('.mechanical-wheel,.wheel-items,.wheel-item,.wheel-item-inner,.bolt-ring,.blue-conduit,.inner-gear,.outer-bezel').forEach(element => {
        element.style.removeProperty('transform');
        element.style.removeProperty('transition');
      });
      return;
    }

    const mechanicalWheel = document.querySelector('.mechanical-wheel');
    if (mechanicalWheel) {
      mechanicalWheel.style.transform = 'none';
    }

    const wheelItems = document.querySelector('.wheel-items');
    if (wheelItems) {
      wheelItems.style.transform = 'none';
      wheelItems.style.transformOrigin = '50% 50%';
      wheelItems.style.transition = 'none';
      wheelItems.dataset.chalanAngle = String(wheelAngle);
    }

    document.querySelectorAll('.wheel-item').forEach((item, itemIndex) => {
      const sectionIndex = sectionIndexFromElement(item, itemIndex);
      if (sectionIndex < 0) return;
      const itemAngle = (sectionIndex - index) * 36;
      item.style.transform = `rotate(${itemAngle}deg) translateX(355px) rotate(${-itemAngle}deg) translateZ(0)`;
      item.style.transformOrigin = '50% 50%';
      item.style.transition = 'transform 1780ms cubic-bezier(.28,.02,.18,1), border-color 620ms ease, box-shadow 720ms ease, filter 620ms ease';
    });

    document.querySelectorAll('.wheel-item-inner').forEach(inner => {
      inner.style.transform = 'rotate(0deg) translateZ(0)';
      inner.style.transition = 'filter 620ms ease, opacity 620ms ease, scale 720ms cubic-bezier(.28,.02,.18,1)';
      inner.style.transformOrigin = '50% 50%';
    });

    document.querySelectorAll('.bolt-ring,.blue-conduit,.inner-gear,.outer-bezel').forEach((part, partIndex) => {
      const factor = partIndex === 0 ? .34 : partIndex === 1 ? .5 : partIndex === 2 ? .22 : .14;
      part.style.transform = `rotate(${wheelAngle * factor}deg) translateZ(0)`;
      part.style.transformOrigin = '50% 50%';
      part.style.transition = 'transform 1920ms cubic-bezier(.28,.02,.18,1)';
    });
  };

  const renderContentPanel = () => {
    const panel = document.querySelector('.content-panel');
    const copy = copyFor(activeSectionId);
    if (!panel) return;

    panel.className = `content-panel content-${activeSectionId}`;
    panel.id = activeSectionId;
    panel.setAttribute('aria-live', 'polite');
    panel.setAttribute('aria-label', isEnglish() ? `${sectionLabelsEn[sectionIds.indexOf(activeSectionId)]} section` : `Sección ${sectionLabelsEs[sectionIds.indexOf(activeSectionId)]}`);
    const featureHtml = copy.features ? `<div class="features">${copy.features.map(([title, text]) => `
      <div class="feature">
        <div class="feature-icon">${iconSvg()}</div>
        <strong>${title}</strong>
        <p>${text}</p>
      </div>
    `).join('')}</div>` : '';

    panel.innerHTML = `
      <div class="chalan-section-content">
        ${copy.kicker ? `<p class="kicker">${copy.kicker}</p>` : ''}
        <h1>${copy.title}</h1>
        <p class="description">${copy.description}</p>
        ${featureHtml}
        ${activeSectionId === 'portafolio' ? portfolioSocialBlock() : ''}
        ${activeSectionId === 'inicio' ? `<div class="hero-actions"><button type="button" data-target-section="beneficios">${isEnglish() ? 'WHY A WEBSITE?' : '¿POR QUÉ UNA WEBSITE?'} <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button><button type="button" class="secondary" data-target-section="paquetes">${isEnglish() ? 'VIEW PLANS' : 'VER PLANES'}</button></div>` : ''}
      </div>
    `;
  };

  const enhanceSeoAccessibility = () => {
    document.querySelectorAll('.seo-crawl-nav a').forEach(link => {
      const target = (link.getAttribute('href') || '').replace('#', '');
      link.setAttribute('aria-current', target === activeSectionId ? 'page' : 'false');
    });

    document.querySelectorAll('img').forEach(image => {
      if (!image.getAttribute('alt')) {
        const src = image.getAttribute('src') || '';
        const name = src.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]/g, ' ') || 'Impulso Digital visual';
        image.setAttribute('alt', name);
      }
      image.setAttribute('loading', image.classList.contains('brand-logo-official') ? 'eager' : 'lazy');
      image.setAttribute('decoding', 'async');
    });

    document.querySelectorAll('.section-progress button').forEach((button, index) => {
      const label = isEnglish() ? sectionLabelsEn[index] : sectionLabelsEs[index];
      if (label) button.setAttribute('aria-label', label);
    });
  };

  const replaceRightPanel = html => {
    const stage = document.querySelector('.mobile-scroll-stage');
    if (!stage) return null;
    const current = Array.from(stage.children).find(child => child.matches?.('.v3-panel, .hero-showcase-clean'));
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    const next = wrapper.firstElementChild;
    if (!next) return null;
    if (current) current.replaceWith(next);
    else stage.appendChild(next);
    return next;
  };

  const renderBenefitsPanel = () => {
    const english = isEnglish();
    const cards = english
      ? [
        ['BUILDS TRUST INSTANTLY.', 'A professional website communicates credibility from the first click.'],
        ['WORKS 24/7', 'It explains your services and receives leads even when you are busy.'],
        ['ATTRACTS CUSTOMERS', 'It makes it easier for people to find, understand, and contact you.'],
        ['STRENGTHENS YOUR BRAND', 'Your business no longer depends only on social media.'],
      ]
      : [
        ['GENERA CONFIANZA AL INSTANTE.', 'Una website profesional transmite seriedad desde el primer click.'],
        ['TRABAJA 24/7', 'Explica tus servicios y recibe contactos incluso cuando estás ocupado.'],
        ['ATRAE CLIENTES', 'Facilita que las personas te encuentren, te entiendan y te contacten.'],
        ['FORTALECE TU MARCA', 'Tu negocio deja de depender únicamente de redes sociales.'],
      ];
    return replaceRightPanel(`
      <aside class="v3-panel">
        <div class="v3-panel-head"><span>IMPULSO / ${english ? 'BENEFITS' : 'BENEFICIOS'}</span><i>04</i></div>
        <div class="benefit-grid">
          ${cards.map(([title, text], index) => `<div class="benefit-card">${iconSvg()}<span>${String(index + 1).padStart(2, '0')}</span><h3>${title}</h3><p>${text}</p></div>`).join('')}
        </div>
      </aside>
    `);
  };

  const renderContactPanel = () => {
    const english = isEnglish();
    return replaceRightPanel(`
      <aside class="v3-panel contact-v3">
        <div class="contact-glow"></div>
        <div class="v3-panel-head centered"><span>IMPULSO / ${english ? 'QUOTE' : 'COTIZACIÓN'}</span><strong>${english ? 'REQUEST YOUR QUOTE' : 'SOLICITA TU COTIZACIÓN'}</strong></div>
        <p class="contact-copy">${english ? 'Tell us about your business and we will help you choose the best way to get started.' : 'Cuéntanos sobre tu negocio y te ayudaremos a elegir la mejor forma de comenzar.'}</p>
        <a class="contact-email-button" href="mailto:daniel@impulsodigitalglobal.com?subject=${english ? 'Impulso%20Digital%20Quote' : 'Cotizaci%C3%B3n%20Impulso%20Digital'}">${english ? 'REQUEST A QUOTE' : 'SOLICITAR COTIZACIÓN'}</a>
        <p class="contact-free-note">${english ? 'The quote is free and there is no commitment.' : 'La cotización es gratuita y sin compromiso.'}</p>
        <div class="contact-next-steps">
          <strong>${english ? 'What happens next?' : '¿Qué sucede después?'}</strong>
          <span>✔ ${english ? 'We review your project.' : 'Revisamos tu proyecto.'}</span>
          <span>✔ ${english ? 'We recommend the right plan.' : 'Te recomendamos el plan adecuado.'}</span>
          <span>✔ ${english ? 'We send you a quote.' : 'Te enviamos una cotización.'}</span>
          <span>✔ ${english ? 'We begin the design.' : 'Comenzamos el diseño.'}</span>
        </div>
      </aside>
    `);
  };

  const renderRightPanel = () => {
    if (activeSectionId === 'inicio') {
      replaceRightPanel(`
        <aside class="v3-panel hero-showcase hero-showcase-clean">
          <div class="showcase-intro"><span>${isEnglish() ? 'THIS IS HOW YOUR BUSINESS COULD LOOK' : 'ASÍ PODRÍA VERSE TU NEGOCIO'}</span><i>01 / 03</i></div>
          <div class="showcase-monitor premium-monitor"><div class="showcase-top"><span></span><span></span><span></span><small></small></div><div class="showcase-screen"></div><div class="showcase-base"></div></div>
          <div class="showcase-selector"></div>
        </aside>
      `);
      renderShowcase();
      return;
    }
    if (activeSectionId === 'beneficios') return renderBenefitsPanel();
    if (activeSectionId === 'paquetes') {
      replaceRightPanel('<aside class="v3-panel packages-v3"></aside>');
      renderPackages();
      return;
    }
    if (activeSectionId === 'portafolio') {
      replaceRightPanel(`<aside class="v3-panel portfolio-v3-panel"><div class="v3-panel-head"><span>IMPULSO / ${isEnglish() ? 'PORTFOLIO' : 'PORTAFOLIO'}</span><i>WEBSITES + ${isEnglish() ? 'PROTOTYPES' : 'PROTOTIPOS'}</i></div><div class="portfolio-v3-grid"></div></aside>`);
      renderPortfolio();
      return;
    }
    if (activeSectionId === 'contacto') return renderContactPanel();
  };

  const setActiveSection = id => {
    if (!sectionIds.includes(id)) return;
    activeSectionId = id;
    document.documentElement.dataset.chalanActiveSection = id;
    syncNavigationLabels();
    syncActiveNav();
    syncWheelPose();
    renderContentPanel();
    renderRightPanel();
    window.setTimeout(ensureNavigationHitboxes, 1520);
  };

  const goToWheelIndex = targetIndex => {
    const id = sectionIds[targetIndex];
    if (!id || id === activeSectionId) return;
    setActiveSection(id);
  };

  window.chalanSetSection = setActiveSection;
  window.chalanGoToSectionIndex = goToWheelIndex;

  const ensureNavigationHitboxes = () => {
    let layer = document.querySelector('.chalan-nav-hitboxes');
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'chalan-nav-hitboxes';
      document.body.appendChild(layer);
    }
    layer.innerHTML = '';
  };

  const stepWheelToIndex = targetIndex => {
    const items = Array.from(document.querySelectorAll('.wheel-item'));
    const activeItem = items.find(item => item.classList.contains('active') && !item.hidden && item.getAttribute('aria-hidden') !== 'true');
    const activeIndex = activeItem ? sectionIndexFromElement(activeItem, items.indexOf(activeItem)) : -1;
    if (targetIndex < 0 || activeIndex < 0 || targetIndex === activeIndex) return;

    goToWheelIndex(targetIndex);
  };

  const sectionTargetIndex = event => {
    const hitbox = event.target.closest?.('.chalan-nav-hitbox');
    if (hitbox) return Number(hitbox.dataset.sectionIndex || -1);

    const wheelItem = event.target.closest?.('.wheel-item');
    if (wheelItem) return sectionIndexFromElement(wheelItem, Array.from(document.querySelectorAll('.wheel-item')).indexOf(wheelItem));

    const progressItem = event.target.closest?.('.section-progress button');
    if (progressItem) return sectionIndexFromElement(progressItem, Array.from(document.querySelectorAll('.section-progress button')).indexOf(progressItem));

    const mobileItem = event.target.closest?.('.mobile-orbit-button');
    if (mobileItem) return sectionIndexFromElement(mobileItem, Array.from(document.querySelectorAll('.mobile-orbit-button')).indexOf(mobileItem));

    const x = event.clientX;
    const y = event.clientY;
    if (Number.isFinite(x) && Number.isFinite(y)) {
      const rectSources = [
        ...Array.from(document.querySelectorAll('.wheel-item')),
        ...Array.from(document.querySelectorAll('.section-progress button')),
        ...Array.from(document.querySelectorAll('.mobile-orbit-button')),
      ].filter(element => !element.hidden && element.style.display !== 'none' && element.getAttribute('aria-hidden') !== 'true');
      const found = rectSources.find(element => {
        const rect = element.getBoundingClientRect();
        const pad = element.classList.contains('wheel-item') ? 18 : 10;
        return x >= rect.left - pad && x <= rect.right + pad && y >= rect.top - pad && y <= rect.bottom + pad;
      });
      if (found?.classList.contains('wheel-item')) return sectionIndexFromElement(found, Array.from(document.querySelectorAll('.wheel-item')).indexOf(found));
      if (found?.closest('.section-progress')) return sectionIndexFromElement(found, Array.from(document.querySelectorAll('.section-progress button')).indexOf(found));
      if (found?.classList.contains('mobile-orbit-button')) return sectionIndexFromElement(found, Array.from(document.querySelectorAll('.mobile-orbit-button')).indexOf(found));
    }

    return -1;
  };

  const clearWheelHover = () => {
    document.querySelectorAll('.wheel-item.chalan-nav-hover').forEach(item => item.classList.remove('chalan-nav-hover'));
  };

  const handleSectionNav = event => {
    if (event.target.closest?.('.utility-buttons, .topbar, .portfolio-preview-modal')) return;
    const targetIndex = sectionTargetIndex(event);
    if (targetIndex < 0 || !sectionIds[targetIndex]) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();

    const now = Date.now();
    const isPointerStart = event.type === 'pointerdown';
    const isKeyboardClick = event.type === 'click' && event.detail === 0;
    const isDuplicateGesture = event.type !== 'pointerdown'
      && event.detail !== 0
      && now - lastSectionNavAt < 900;

    if (event.type === 'pointerup' || isDuplicateGesture || (!isPointerStart && !isKeyboardClick)) return;
    if (isPointerStart && event.pointerId != null && lastSectionNavPointerId === event.pointerId && now - lastSectionNavAt < 900) return;

    lastSectionNavAt = now;
    lastSectionNavPointerId = event.pointerId ?? null;
    goToWheelIndex(targetIndex);
    window.setTimeout(ensureNavigationHitboxes, 1520);
  };

  document.addEventListener('pointerdown', handleSectionNav, true);
  document.addEventListener('pointerup', handleSectionNav, true);
  document.addEventListener('click', handleSectionNav, true);
  document.addEventListener('pointerleave', clearWheelHover, true);
  document.addEventListener('blur', clearWheelHover, true);

  const handleUtilityControls = event => {
    const button = event.target.closest?.('.utility-buttons button');
    if (!button) return;

    const label = normalizeNavText(button.textContent || '');
    const wantsEs = label === 'ES';
    const wantsEn = label === 'EN';
    const wantsDesktop = label.includes('DESKTOP');
    const wantsMobile = label.includes('CELULAR') || label.includes('MOBILE');
    if (!wantsEs && !wantsEn && !wantsDesktop && !wantsMobile) return;
    const actualMobile = window.matchMedia?.('(max-width: 760px)').matches
      || ((navigator.maxTouchPoints || 0) > 0
        && window.matchMedia?.('(pointer: coarse)').matches
        && (screen.width <= 932 || screen.height <= 932));
    const desktopMode = document.documentElement.dataset.chalanDesktopMode === 'true';
    const previewMobile = document.documentElement.dataset.chalanPreviewMode === 'true'
      || document.querySelector('.system-shell')?.classList.contains('mobile-preview');

    if ((wantsDesktop || wantsMobile) && actualMobile) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      document.documentElement.dataset.chalanDesktopMode = 'false';
      document.documentElement.dataset.chalanPreviewMode = 'false';
      syncDesktopMode();
      return;
    }

    if ((wantsDesktop || wantsMobile) && !actualMobile) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();

      const now = Date.now();
      if (event.type !== 'pointerdown' && event.detail !== 0 && now - lastUtilityActionAt < 700) return;
      if (event.type !== 'pointerdown' && event.detail !== 0) return;
      lastUtilityActionAt = now;

      if (wantsDesktop && previewMobile) {
        document.documentElement.dataset.chalanPreviewMode = 'false';
        document.documentElement.dataset.chalanDesktopMode = 'false';
        syncDesktopMode();
        window.dispatchEvent(new Event('resize'));
        return;
      }

      if (wantsMobile && !desktopMode) {
        document.documentElement.dataset.chalanPreviewMode = 'true';
        document.documentElement.dataset.chalanDesktopMode = 'false';
        syncDesktopMode();
        window.dispatchEvent(new Event('resize'));
        return;
      }

      if (wantsMobile && desktopMode) {
        setDesktopMode(false);
        return;
      }
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();

    const now = Date.now();
    if (event.type !== 'pointerdown' && event.detail !== 0 && now - lastUtilityActionAt < 700) return;
    if (event.type !== 'pointerdown' && event.detail !== 0) return;
    lastUtilityActionAt = now;

    if (wantsEs) setLanguage('es');
    if (wantsEn) setLanguage('en');
    if (wantsDesktop) setDesktopMode(true);
    if (wantsMobile) setDesktopMode(false);
  };

  document.addEventListener('pointerdown', handleUtilityControls, true);
  document.addEventListener('click', handleUtilityControls, true);

  document.addEventListener('click', event => {
    const control = event.target.closest?.('.wheel-step-up, .wheel-step-down, .wheel-drag-hand');
    if (!control) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();

    if (control.classList.contains('wheel-drag-hand')) return;

    const currentIndex = Math.max(0, sectionIds.indexOf(activeSectionId));
    const direction = control.classList.contains('wheel-step-up') ? -1 : 1;
    const nextIndex = (currentIndex + direction + sectionIds.length) % sectionIds.length;
    goToWheelIndex(nextIndex);
  }, true);

  const handleProjectSwitch = event => {
    const arrow = event.target.closest?.('.project-project-arrow');
    const selectorButton = event.target.closest?.('.showcase-selector button');
    const prototypeToggle = event.target.closest?.('.showcase-prototype-toggle');
    const prototypeArrow = event.target.closest?.('.portfolio-prototype-arrow');
    if (!arrow && !selectorButton && !prototypeToggle && !prototypeArrow) return;

    const now = Date.now();
    if (now - lastProjectSwitch < 180) return;
    lastProjectSwitch = now;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();

    if (arrow) {
      selectedProjectIndex = (selectedProjectIndex + Number(arrow.dataset.direction || 1) + projects.length) % projects.length;
      selectedProjectShotIndex = 0;
      showcaseMode = 'website';
    }

    if (selectorButton) {
      selectedProjectIndex = Number(selectorButton.dataset.projectIndex || 0);
      selectedProjectShotIndex = 0;
      showcaseMode = 'website';
    }

    if (prototypeToggle) {
      showcaseMode = showcaseMode === 'prototype' ? 'website' : 'prototype';
    }

    if (prototypeArrow) {
      selectedPrototypePage = (selectedPrototypePage + Number(prototypeArrow.dataset.direction || 1) + 2) % 2;
      const grid = document.querySelector('.portfolio-v3-grid');
      if (grid) grid.dataset.chalanFixed = '';
      renderPortfolio();
      return;
    }

    const screen = document.querySelector('.project-showcase-screen');
    if (screen) screen.dataset.chalanProject = '';
    renderShowcase();
  };

  document.addEventListener('pointerdown', handleProjectSwitch, true);
  document.addEventListener('click', handleProjectSwitch, true);

  const setModalUtilityVisibility = hidden => {
    document.documentElement.classList.toggle('chalan-modal-open', Boolean(hidden));
    document.body?.classList.toggle('chalan-modal-open', Boolean(hidden));
  };

  const openPortfolioPreview = (src, title) => {
    if (!src) return;
    document.querySelector('.portfolio-preview-modal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'portfolio-preview-modal';
    modal.innerHTML = `
      <button class="portfolio-preview-close" type="button" aria-label="${isEnglish() ? 'Close' : 'Cerrar'}">×</button>
      <div class="portfolio-preview-frame">
        <img src="${src}" alt="${title || (isEnglish() ? 'Preview' : 'Vista previa')}">
        <span>${title || ''}</span>
      </div>
    `;
    document.body.appendChild(modal);
    setModalUtilityVisibility(true);
    window.requestAnimationFrame(() => modal.classList.add('is-visible'));
  };

  const closePortfolioPreview = () => {
    const modal = document.querySelector('.portfolio-preview-modal');
    if (!modal) return;
    modal.classList.remove('is-visible');
    window.setTimeout(() => { modal.remove(); setModalUtilityVisibility(false); }, 260);
  };

  document.addEventListener('click', event => {
    const modalClose = event.target.closest?.('.portfolio-preview-close');
    const modalBackdrop = event.target.classList?.contains('portfolio-preview-modal');
    if (modalClose || modalBackdrop) {
      event.preventDefault();
      closePortfolioPreview();
      return;
    }

    const preview = event.target.closest?.('[data-portfolio-preview]');
    if (!preview) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    openPortfolioPreview(preview.dataset.previewSrc, preview.dataset.previewTitle);
  }, true);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closePortfolioPreview();
  });

  document.addEventListener('click', event => {
    const button = event.target.closest?.('.content-inicio .hero-actions button');
    if (!button) return;

    const buttons = Array.from(document.querySelectorAll('.content-inicio .hero-actions button'));
    const index = buttons.indexOf(button);
    if (index < 0) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    goToWheelIndex(index === 0 ? 1 : 2);
  }, true);

  document.addEventListener('click', event => {
    const planButton = event.target.closest?.('.quote-plan-button');
    const customButton = event.target.closest?.('.custom-project-button');
    const customClose = event.target.closest?.('.custom-project-close');
    const customBackdrop = event.target.classList?.contains('custom-project-modal');
    const closeButton = event.target.closest?.('.quote-form-close');
    const form = event.target.closest?.('.quote-form-panel form');

    if (planButton) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      showQuoteForm(planButton.dataset.plan || 'Website Starter');
    }

    if (customButton) {
      event.preventDefault();
      event.stopPropagation();
      showQuoteForm('Proyecto personalizado');
    }

    if (customClose || customBackdrop) {
      event.preventDefault();
      const modal = document.querySelector('.custom-project-modal');
      modal?.classList.remove('is-visible');
      window.setTimeout(() => { modal?.remove(); setModalUtilityVisibility(false); }, 220);
    }

    if (closeButton) {
      event.preventDefault();
      closeButton.closest('.custom-project-modal')?.remove();
      setModalUtilityVisibility(false);
    }

    if (form && event.type === 'submit') {
      event.preventDefault();
    }
  }, true);

  document.addEventListener('submit', async event => {
    const form = event.target.closest?.('[data-quote-form]');
    if (!form) return;
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.quote-form-status');
    const english = isEnglish();
    const original = button?.textContent || '';
    if (button) {
      button.disabled = true;
      button.textContent = english ? 'SENDING…' : 'ENVIANDO…';
    }
    if (status) status.textContent = '';
    try {
      const response = await fetch('https://formsubmit.co/ajax/daniel@impulsodigitalglobal.com', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error('Form submission failed');
      if (status) status.textContent = english ? 'Your request was sent successfully.' : 'Tu solicitud fue enviada correctamente.';
      form.reset();
      window.setTimeout(() => {
        const modal = form.closest('.custom-project-modal');
        modal?.classList.remove('is-visible');
        window.setTimeout(() => { modal?.remove(); setModalUtilityVisibility(false); }, 220);
      }, 1400);
    } catch (error) {
      if (status) status.textContent = english
        ? 'We could not send the request. Please email daniel@impulsodigitalglobal.com.'
        : 'No pudimos enviar la solicitud. Escríbenos a daniel@impulsodigitalglobal.com.';
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = original;
      }
    }
  }, true);


  document.addEventListener('click', event => {
    const contactButton = event.target.closest?.('.contact-cta, .contact-email-button');
    if (!contactButton) return;
    event.preventDefault();
    event.stopPropagation();
    showQuoteForm('Todavía no estoy seguro');
  }, true);

  const setInicioCopy = () => {
    const panel = document.querySelector('.content-inicio');
    if (!panel) return;
    const copy = copyFor('inicio');

    const kicker = panel.querySelector('.kicker');
    const title = panel.querySelector('h1');
    const description = panel.querySelector('.description');
    const buttons = panel.querySelectorAll('.hero-actions button');

    if (kicker) kicker.textContent = copy.kicker;
    if (title) title.innerHTML = copy.title;
    if (description) description.textContent = copy.description;
    if (buttons[0]) buttons[0].innerHTML = `${isEnglish() ? 'WHY A WEBSITE?' : '¿POR QUÉ UNA WEBSITE?'} <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
    if (buttons[1]) buttons[1].textContent = isEnglish() ? 'VIEW PLANS' : 'VER PLANES';
  };

  const setPackagesCopy = () => {
    const panel = document.querySelector('.content-paquetes');
    if (!panel) return;
    const copy = copyFor('paquetes');

    const kicker = panel.querySelector('.kicker');
    const title = panel.querySelector('h1');
    const description = panel.querySelector('.description');
    const features = copy.features || [];

    if (kicker) kicker.remove();
    if (title) title.textContent = copy.title;
    if (description) description.textContent = copy.description;

    panel.querySelectorAll('.feature').forEach((feature, index) => {
      const copy = features[index];
      if (!copy) return;
      const strong = feature.querySelector('strong');
      const text = feature.querySelector('p');
      if (strong) strong.textContent = copy[0];
      if (text) text.textContent = copy[1];
    });
  };

  const activeProjectIndex = () => {
    return selectedProjectIndex;
  };

  const renderShowcase = () => {
    const panel = document.querySelector('.hero-showcase-clean');
    const screen = panel?.querySelector('.showcase-screen');
    const topUrl = panel?.querySelector('.showcase-top small');
    const count = panel?.querySelector('.showcase-intro i');
    const selector = panel?.querySelector('.showcase-selector');
    if (!panel || !screen || !selector) return;

    const index = activeProjectIndex();
    const project = projects[index];
    const shotIndex = selectedProjectShotIndex % project.shots.length;
    const secondaryShots = project.shots.filter((_, imageIndex) => imageIndex !== shotIndex);
    if (topUrl) topUrl.textContent = project.url;
    if (count) count.textContent = String(index + 1).padStart(2, '0') + ' / 03';

    let projectNav = panel.querySelector('.project-project-nav');
    if (!projectNav) {
      projectNav = document.createElement('div');
      projectNav.className = 'project-project-nav';
      panel.appendChild(projectNav);
    }
    projectNav.innerHTML = `
      <button class="project-project-arrow" type="button" data-direction="-1" aria-label="Proyecto anterior">‹</button>
      <button class="project-project-arrow" type="button" data-direction="1" aria-label="Siguiente proyecto">›</button>
    `;

    screen.className = `showcase-screen project-showcase-screen ${project.tone}`;
    const projectKey = `${project.name}-${shotIndex}`;
    if (screen.dataset.chalanProject !== projectKey) {
      screen.dataset.chalanProject = projectKey;
      screen.innerHTML = `
        <img class="project-main-shot" src="${project.shots[shotIndex]}" alt="${project.name} website">
        <div class="project-showcase-caption">
          <strong>${project.name}</strong>
        </div>
        <div class="project-shot-stack">
          ${secondaryShots.map((shot, shotThumbIndex) => `<img src="${shot}" alt="${project.name} captura ${shotThumbIndex + 1}">`).join('')}
        </div>
      `;
    }

    if (selector.dataset.chalanProjects !== '3') {
      selector.dataset.chalanProjects = '3';
      selector.innerHTML = projects.map((item, projectButtonIndex) => `<button type="button" data-project-index="${projectButtonIndex}" aria-label="Mostrar ${item.name}"><span></span>${item.name}</button>`).join('');
    }
    const buttons = Array.from(selector.querySelectorAll('button'));
    buttons.forEach((button, buttonIndex) => {
      if (buttonIndex >= projects.length) {
        button.remove();
        return;
      }
      button.hidden = false;
      button.classList.toggle('active', buttonIndex === index);
      button.innerHTML = `<span></span>${projects[buttonIndex].name}`;
    });
  };

  const renderPortfolio = () => {
    const grid = document.querySelector('.portfolio-v3-grid');
    const english = isEnglish();
    const langKey = english ? 'en' : 'es';
    if (!grid || grid.dataset.chalanFixed === langKey) return;

    grid.dataset.chalanFixed = langKey;
    grid.classList.add('portfolio-v3-grid-three', 'portfolio-expanded-grid');
    const prototypeSlice = prototypes.slice(selectedPrototypePage * 3, selectedPrototypePage * 3 + 3);
    grid.innerHTML = `
      <div class="portfolio-section-label">${english ? 'PUBLISHED WEBSITES' : 'WEBSITES PUBLICADAS'}</div>
      <div class="portfolio-website-row">
        ${projects.map(project => `
          <div class="portfolio-v3-card portfolio-real-card ${project.tone === 'beauty' ? 'gold' : project.tone === 'cleaning' ? 'pink' : 'green'}">
            <button class="mini-browser real-mini-browser portfolio-image-trigger" type="button" data-portfolio-preview data-preview-src="${project.shots[0]}" data-preview-title="${project.name}">
              <span></span><span></span><span></span>
              <img src="${project.shots[0]}" alt="${project.name} preview">
            </button>
            <h3>${project.name}</h3>
            <p>${project.type}</p>
            ${project.websiteUrl ? `<a class="portfolio-website-link" href="${project.websiteUrl}" target="_blank" rel="noopener noreferrer">${english ? 'VIEW WEBSITE' : 'VER WEBSITE'}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </a>` : `<button class="portfolio-website-link is-disabled" type="button" aria-disabled="true">${english ? 'VIEW WEBSITE' : 'VER WEBSITE'}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>`}
          </div>
        `).join('')}
      </div>
      <div class="portfolio-prototype-head">
        <button class="portfolio-prototype-arrow" type="button" data-direction="-1" aria-label="${english ? 'Previous prototypes' : 'Prototipos anteriores'}">‹</button>
        <span>${english ? 'PROTOTYPES' : 'PROTOTIPOS'}</span>
        <button class="portfolio-prototype-arrow" type="button" data-direction="1" aria-label="${english ? 'More prototypes' : 'Más prototipos'}">›</button>
      </div>
      <div class="portfolio-prototype-row">
        ${prototypeSlice.map(proto => `
          <div class="portfolio-v3-card portfolio-prototype-card ${proto.tone}">
            <button class="prototype-mini portfolio-image-trigger" type="button" ${proto.image ? `data-portfolio-preview data-preview-src="${proto.image}" data-preview-title="${proto.name}"` : ''}>
              ${proto.image ? `<img src="${proto.image}" alt="${proto.name} prototype">` : '<i></i><i></i><i></i>'}
              <strong>${proto.name}</strong>
            </button>
            <h3>${proto.name}</h3>
            <p>${english ? (proto.typeEn || proto.type) : proto.type}</p>
            <button>${english ? 'VIEW PROTOTYPE' : 'VER PROTOTIPO'}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        `).join('')}
      </div>
      ${portfolioSocialBlock()}
    `;

    const headCount = document.querySelector('.v3-panel-head i');
    if (headCount) headCount.textContent = `WEBSITES + ${english ? 'PROTOTYPES' : 'PROTOTIPOS'}`;
  };

  const showQuoteForm = selectedPlan => {
    document.querySelector('.custom-project-modal')?.remove();
    const english = isEnglish();
    const options = [
      ['Website Starter', english ? 'Website Starter' : 'Website Starter'],
      ['Website Pro', english ? 'Website Pro' : 'Website Pro'],
      ['Proyecto personalizado', english ? 'Custom project' : 'Proyecto personalizado'],
      ['Todavía no estoy seguro', english ? 'I am not sure yet' : 'Todavía no estoy seguro'],
    ];
    const normalizedPlan = selectedPlan || 'Todavía no estoy seguro';
    const modal = document.createElement('div');
    modal.className = 'custom-project-modal quote-modal';
    modal.innerHTML = `
      <div class="custom-project-dialog quote-form-panel" role="dialog" aria-modal="true" aria-labelledby="quote-form-title">
        <button class="quote-form-close custom-project-close" type="button" aria-label="${english ? 'Close' : 'Cerrar'}">×</button>
        <small>IMPULSO / ${english ? 'QUOTE' : 'COTIZACIÓN'}</small>
        <h3 id="quote-form-title">${english ? 'Request your quote' : 'Solicita tu cotización'}</h3>
        <p>${english ? 'Choose a plan or tell us what your business needs.' : 'Selecciona un plan o cuéntanos qué necesita tu negocio.'}</p>
        <form data-quote-form>
          <label>${english ? 'Full name' : 'Nombre completo'}<input name="nombre" type="text" autocomplete="name" required></label>
          <label>${english ? 'Email address' : 'Correo electrónico'}<input name="email" type="email" autocomplete="email" required></label>
          <label>${english ? 'Business name' : 'Nombre del negocio'}<input name="empresa" type="text" autocomplete="organization" required></label>
          <label>${english ? 'Selected plan' : 'Plan seleccionado'}
            <select name="plan" required>${options.map(([value,label]) => `<option value="${value}"${normalizedPlan.toLowerCase().includes(value.toLowerCase().replace('proyecto ','').replace('todavía ','').slice(0,9)) || normalizedPlan === value ? ' selected' : ''}>${label}</option>`).join('')}</select>
          </label>
          <label class="full">${english ? 'What does your business do?' : '¿A qué se dedica tu negocio?'}<textarea name="actividad" rows="3" placeholder="${english ? 'Briefly describe what your business does.' : 'Describe brevemente a qué se dedica tu negocio.'}" required></textarea></label>
          <label class="full">${english ? 'What would you like to achieve with your website?' : '¿Qué te gustaría lograr con tu website?'}<textarea name="objetivo" rows="4" required></textarea></label>
          <label class="full">${english ? 'Examples or references (optional)' : 'Ejemplos o referencias (opcional)'}<input name="referencias" type="text" placeholder="${english ? 'Links or names of websites you like.' : 'Links o nombres de websites que te gustan.'}"></label>
          <input type="hidden" name="_subject" value="${english ? 'New quote request - Impulso Digital' : 'Nueva solicitud de cotización - Impulso Digital'}">
          <button type="submit">${english ? 'SEND QUOTE REQUEST' : 'ENVIAR SOLICITUD DE COTIZACIÓN'}</button>
          <p class="quote-form-status" role="status" aria-live="polite"></p>
        </form>
      </div>`;
    document.body.appendChild(modal);
    setModalUtilityVisibility(true);
    requestAnimationFrame(() => modal.classList.add('is-visible'));
    modal.querySelector('input')?.focus({ preventScroll: true });
  };

  const showCustomProjectForm = () => showQuoteForm('Proyecto personalizado');

  const renderPackages = () => {
    const panel = document.querySelector('.packages-v3');
    const english = isEnglish();
    const langKey = english ? 'en' : 'es';
    if (!panel || panel.dataset.chalanPlans === langKey) return;

    panel.dataset.chalanPlans = langKey;
    const check = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
    const starterItems = english
      ? ['Professional one-page website','Up to 6 sections','Responsive on computers, tablets, and phones','Contact form','Basic setup to appear on Google','Social media integration']
      : ['Website profesional de una sola página','Hasta 6 secciones','Adaptada a computadoras, tablets y celulares','Formulario de contacto','Configuración básica para aparecer en Google','Integración con redes sociales'];
    const proItems = english
      ? ['Website with up to 6 main pages','Better organization of services and content','Premium animations and interactions','A personalized experience for your business','Improved setup for search engines','Greater focus on turning visits into customers']
      : ['Website de hasta 6 páginas principales','Mayor organización de servicios y contenido','Animaciones e interacciones premium','Experiencia personalizada para tu negocio','Configuración mejorada para buscadores','Mayor enfoque en convertir visitas en clientes'];
    const supportText = english
      ? 'Includes corrections for spelling errors, broken links, incorrect images, contact details, and technical issues related to the agreed project.'
      : 'Incluye corrección de errores ortográficos, enlaces que no funcionen, imágenes incorrectas, datos de contacto y problemas técnicos relacionados con lo acordado en el proyecto.';
    const supportLimit = english
      ? 'Also includes minor text or image changes. It does not include new pages, features, additional sections, or redesigns.'
      : 'No incluye nuevas páginas, funciones, secciones adicionales ni rediseños.';

    panel.innerHTML = `
      <div class="package-grid">
        <div class="package-card">
          <div class="package-top"><span>01</span><em>${english ? 'IDEAL TO GET STARTED' : 'IDEAL PARA COMENZAR'}</em></div>
          <h2>WEBSITE STARTER</h2>
          <div class="package-price"><strong>$600</strong><small>${english ? 'PROJECT PRICE' : ''}</small></div>
          <ul>${starterItems.map(item => `<li>${check}${item}</li>`).join('')}</ul>
          <div class="package-delivery"><span>${english ? 'ESTIMATED DELIVERY TIME' : 'TIEMPO ESTIMADO DE ENTREGA'}</span><strong>${english ? '10–15 business days' : '10–15 días hábiles'}</strong></div>
          <button class="quote-plan-button" type="button" data-plan="Website Starter">${english ? 'REQUEST A QUOTE' : 'SOLICITAR COTIZACIÓN'}</button>
        </div>
        <div class="package-card featured">
          <div class="package-top"><span>02</span><em>${english ? 'IDEAL FOR GROWING BUSINESSES' : 'IDEAL PARA NEGOCIOS EN CRECIMIENTO'}</em></div>
          <h2>WEBSITE PRO</h2>
          <div class="package-price"><strong>$1200</strong><small>${english ? 'PROJECT PRICE' : ''}</small></div>
          <ul>${proItems.map(item => `<li>${check}${item}</li>`).join('')}</ul>
          <div class="package-delivery"><span>${english ? 'ESTIMATED DELIVERY TIME' : 'TIEMPO ESTIMADO DE ENTREGA'}</span><strong>${english ? '15–20 business days' : '15–20 días hábiles'}</strong></div>
          <button class="quote-plan-button" type="button" data-plan="Website PRO">${english ? 'REQUEST A QUOTE' : 'SOLICITAR COTIZACIÓN'}</button>
        </div>
      </div>
      <section class="shared-support-banner">
        <strong>${english ? '30 DAYS OF SUPPORT INCLUDED' : '30 DÍAS DE SOPORTE INCLUIDOS'}</strong>
        <p>${supportText}</p>
        <small>${supportLimit}</small>
      </section>
      <section class="custom-project-invitation" data-future-fields="business-type,products-services,competition,mission,vision,reference-websites,social-media,project-goals">
        <div class="custom-project-copy">
          <span>${english ? 'CUSTOM PROJECT' : 'PROYECTO PERSONALIZADO'}</span>
          <h3>${english ? 'DOES YOUR PROJECT NOT FIT THESE PLANS?' : '¿TU PROYECTO NO ENCAJA EN ESTOS PLANES?'}</h3>
          <p>${english ? 'Tell us what you need and we will prepare a custom proposal for your business. Ideal for special projects or needs beyond our standard plans.' : 'Cuéntanos qué necesitas y prepararemos una propuesta personalizada para tu negocio. Ideal para proyectos especiales o necesidades fuera de nuestros planes estándar.'}</p>
        </div>
        <button class="custom-project-button" type="button">${english ? 'DESIGN MY PROJECT' : 'DISEÑAR MI PROYECTO'}</button>
      </section>
    `;
  };

  const setBenefitsCopy = () => {
    const english = isEnglish();
    const featureCopy = copyFor('beneficios').features || [];

    document.querySelectorAll('.content-beneficios .feature').forEach((feature, index) => {
      const copy = featureCopy[index];
      if (!copy) return;
      const title = feature.querySelector('strong');
      const text = feature.querySelector('p');
      if (title) title.textContent = copy[0];
      if (text) text.textContent = copy[1];
    });

    const firstCard = document.querySelector('.benefit-grid .benefit-card');
    if (firstCard) {
      const title = firstCard.querySelector('h3');
      const text = firstCard.querySelector('p');
      if (title) title.textContent = english ? 'BUILDS TRUST INSTANTLY.' : 'GENERA CONFIANZA AL INSTANTE.';
      if (text) text.textContent = english ? 'A professional website communicates credibility from the first click.' : 'Una website profesional transmite seriedad desde el primer click.';
    }
  };

  const run = () => {
    if (!document.documentElement.dataset.chalanActiveSection) {
      document.documentElement.dataset.chalanActiveSection = activeSectionId;
    }
    syncUtilityButtons();
    syncDesktopMode();
    const currentLanguage = document.documentElement.lang || 'es';
    if (lastRenderedLanguage && lastRenderedLanguage !== currentLanguage) {
      document.querySelector('.portfolio-v3-grid')?.removeAttribute('data-chalan-fixed');
      document.querySelector('.packages-v3')?.removeAttribute('data-chalan-plans');
      renderContentPanel();
      renderRightPanel();
    }
    lastRenderedLanguage = currentLanguage;
    const pending = document.documentElement.dataset.chalanPendingSection;
    if (pending && sectionIds.includes(pending)) {
      delete document.documentElement.dataset.chalanPendingSection;
      setActiveSection(pending);
      return;
    }
    syncNavigationLabels();
    syncActiveNav();
    normalizeMobileOrbitSlots();
    syncWheelPose();
    ensureNavigationHitboxes();
    const panel = document.querySelector('.content-panel');
    if (panel && !panel.classList.contains(`content-${activeSectionId}`)) {
      setActiveSection(activeSectionId);
      return;
    }
    setInicioCopy();
    setPackagesCopy();
    setBenefitsCopy();
    renderShowcase();
    renderPortfolio();
    renderPackages();
    enhanceSeoAccessibility();
    window.requestAnimationFrame(normalizeMobileOrbitSlots);
  };

  window.setInterval(() => {
    if (activeSectionId !== 'inicio') return;
    const panel = document.querySelector('.hero-showcase-clean');
    if (!panel || showcaseMode !== 'website') return;
    const project = projects[selectedProjectIndex];
    if (!project?.shots?.length) return;
    const nextShotIndex = (selectedProjectShotIndex + 1) % project.shots.length;
    if (nextShotIndex === 0) {
      selectedProjectIndex = (selectedProjectIndex + 1) % projects.length;
    }
    selectedProjectShotIndex = nextShotIndex;
    const screen = document.querySelector('.project-showcase-screen');
    if (screen) screen.dataset.chalanProject = '';
    renderShowcase();
  }, 5400);

  const observer = new MutationObserver(() => {
    window.requestAnimationFrame(run);
  });

  window.addEventListener('load', run);
  document.addEventListener('DOMContentLoaded', run);
  document.addEventListener('click', event => {
    const socialButton = event.target.closest?.('.portfolio-social-link');
    if (!socialButton) return;
    document.querySelectorAll('.portfolio-social-link.is-active').forEach(button => {
      if (button !== socialButton) button.classList.remove('is-active');
    });
    socialButton.classList.add('is-active');
  }, true);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'data-slot'] });
  window.setInterval(run, 700);


  removeRetiredWheelUi();
  window.setInterval(removeRetiredWheelUi, 800);

  const ensureFloatingCallButton = () => {
    let button = document.querySelector('.floating-call-button');
    if (!button) {
      button = document.createElement('a');
      button.className = 'floating-call-button';
      button.href = 'tel:+18312881019';
      button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"/></svg><span></span>';
      document.body.appendChild(button);
    }
    button.setAttribute('aria-label', isEnglish() ? 'Call Impulso Digital' : 'Llamar a Impulso Digital');
    const label = button.querySelector('span');
    if (label) label.textContent = isEnglish() ? 'CALL US' : 'LLÁMANOS';
  };

  ensureFloatingCallButton();

  // Keep the floating call label synchronized with the active site language.
  const floatingCallLanguageObserver = new MutationObserver(() => {
    ensureFloatingCallButton();
  });
  floatingCallLanguageObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang'],
  });

  // Some language controls update React state before the html lang attribute is painted.
  // Recheck after clicks without changing the button's position, size, or animation.
  document.addEventListener('click', event => {
    const control = event.target.closest?.('button');
    const text = (control?.textContent || '').trim().toUpperCase();
    if (text === 'ES' || text === 'EN') {
      window.requestAnimationFrame(() => ensureFloatingCallButton());
      window.setTimeout(ensureFloatingCallButton, 80);
    }
  }, true);
})();
