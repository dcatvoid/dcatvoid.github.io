(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const root = document.documentElement;
  const body = document.body;
  const base = body.dataset.base || '';
  const page = body.dataset.page || '';

  const links = [
    ['home', 'index.html', 'Home'],
    ['projects', 'projects.html', 'Research Projects'],
    ['publications', 'publications.html', 'Publications']
  ];

  /* Contact icons */
  const contactLinks = [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/abdullah-al-anan-158179255/',
      external: true,
      icon: '<rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle><path d="M10 21V9h4v2a4 4 0 0 1 8 2v8h-4v-7a2 2 0 0 0-4 0v7z"></path>'
    },
    {
      label: 'GitHub',
      href: 'https://github.com/dcatvoid',
      external: true,
      icon: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>'
    },
    {
      label: 'Email',
      href: 'mailto:ananavoid56@gmail.com',
      external: false,
      icon: '<rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-10 6L2 7"></path>'
    },
    {
      label: 'CV',
      href: `${base}Professional%20CV.pdf`,
      external: true,
      icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6M8 13h8M8 17h8"></path>'
    }
  ];

  /* Populate contact icon containers */
  $$('[data-icons]').forEach(container => {
    const iconList = document.createElement('ul');
    iconList.className = 'icons';
    iconList.setAttribute('aria-label', 'Contact links');

    contactLinks.forEach(({ label, href, external, icon }) => {
      const item = document.createElement('li');
      const anchor = document.createElement('a');

      anchor.href = href;
      anchor.setAttribute('aria-label', label);
      anchor.title = label;

      if (external) {
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
      }

      anchor.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          ${icon}
        </svg>
      `;

      item.appendChild(anchor);
      iconList.appendChild(item);
    });

    container.replaceChildren(iconList);
  });

  /* Prevent duplicate headers */
  if (!$('header')) {
    body.insertAdjacentHTML(
      'afterbegin',
      `<header>
        <div class="wrap bar">
          <a class="brand" href="${base}index.html">
            Abdullah <span>Al Anan</span>
          </a>

          <button class="ib" id="burger"
            type="button"
            aria-label="Menu"
            aria-expanded="false">☰</button>

          <nav id="nav" aria-label="Main navigation">
            ${links.map(([key, href, label]) =>
              `<a href="${base + href}"
                class="${key === page ? 'on' : ''}">
                ${label}
              </a>`
            ).join('')}
          </nav>

          <button class="ib" id="theme"
            type="button"
            aria-label="Toggle light or dark theme">◐</button>
        </div>

        <div id="prog" aria-hidden="true"></div>
      </header>`
    );
  }

  /* Prevent duplicate footers */
  if (!$('footer')) {
    body.insertAdjacentHTML(
      'beforeend',
      `<footer>
        <div class="wrap">
          © 2026 Abdullah Al Anan · Research Portfolio
        </div>
      </footer>`
    );
  }

  /* Create lightbox if needed */
  if (!$('#lb')) {
    body.insertAdjacentHTML(
      'beforeend',
      '<div id="lb" aria-hidden="true"><img alt=""></div>'
    );
  }

  /* Theme controls */
  const themeButton = $('#theme');

  if (themeButton) {
    let savedTheme = '';

    try {
      savedTheme = localStorage.getItem('theme') || '';
    } catch (error) {}

    const systemDark =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const setTheme = (theme, save) => {
      root.dataset.theme = theme;

      themeButton.textContent =
        theme === 'dark' ? '☀' : '◐';

      themeButton.setAttribute(
        'aria-label',
        theme === 'dark'
          ? 'Switch to light theme'
          : 'Switch to dark theme'
      );

      if (save) {
        try {
          localStorage.setItem('theme', theme);
        } catch (error) {}
      }
    };

    setTheme(
      savedTheme ||
      root.dataset.theme ||
      (systemDark ? 'dark' : 'light'),
      false
    );

    themeButton.addEventListener('click', () => {
      setTheme(
        root.dataset.theme === 'dark' ? 'light' : 'dark',
        true
      );
    });
  }

  /* Mobile navigation */
  const burger = $('#burger');
  const nav = $('#nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');

      burger.setAttribute(
        'aria-expanded',
        String(open)
      );
    });
  }

  /* Scroll progress */
  const progress = $('#prog');

  if (progress) {
    const updateProgress = () => {
      const scrollable =
        root.scrollHeight - window.innerHeight;

      const percent = scrollable > 0
        ? (window.scrollY / scrollable) * 100
        : 0;

      progress.style.width =
        `${Math.max(0, Math.min(100, percent))}%`;
    };

    window.addEventListener(
      'scroll',
      updateProgress,
      { passive: true }
    );

    updateProgress();
  }

  /* Reveal animations */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('v');
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    $$('.reveal').forEach(element => {
      observer.observe(element);
    });

  } else {
    $$('.reveal').forEach(element => {
      element.classList.add('v');
    });
  }

  /* Project tabs */
  $$('.tabs').forEach(tabGroup => {
    tabGroup.addEventListener('click', event => {
      const button = event.target.closest('.tab');

      if (!button || !tabGroup.contains(button)) return;

      $$('.tab', tabGroup).forEach(tab => {
        tab.classList.toggle('on', tab === button);
      });

      const container =
        tabGroup.parentElement || document;

      $$('.panel', container).forEach(panel => {
        panel.classList.toggle(
          'on',
          panel.dataset.p === button.dataset.t
        );
      });
    });
  });

  /* Project category filters */
  const chips = $('#chips');

  if (chips) {
    chips.addEventListener('click', event => {
      const button = event.target.closest('.chip');

      if (!button || !chips.contains(button)) return;

      $$('.chip', chips).forEach(chip => {
        chip.classList.toggle('on', chip === button);
      });

      let count = 0;

      $$('.proj[data-cat]').forEach(card => {
        const categories =
          (card.dataset.cat || '')
            .split(/\s+/)
            .filter(Boolean);

        const visible =
          button.dataset.f === 'all' ||
          categories.includes(button.dataset.f);

        card.hidden = !visible;

        if (visible) count++;
      });

      const empty = $('#empty');

      if (empty) {
        empty.hidden = count > 0;
      }
    });
  }

  /* Figure lightbox */
  const lightbox = $('#lb');

  if (lightbox) {
    const image = $('img', lightbox);

    document.addEventListener('click', event => {
      const figure = event.target.closest('.fig.wide');

      if (!figure || figure.classList.contains('ph')) {
        return;
      }

      const source = $('img', figure);

      if (!source || !image) return;

      event.preventDefault();

      image.src = source.currentSrc || source.src;

      lightbox.classList.add('on');
      lightbox.setAttribute('aria-hidden', 'false');
    });

    const close = () => {
      lightbox.classList.remove('on');
      lightbox.setAttribute('aria-hidden', 'true');
    };

    lightbox.addEventListener('click', close);

    window.addEventListener('keydown', event => {
      if (event.key === 'Escape') close();
    });
  }

  /* Optional typing effect */
  const typed = $('#typed');

  if (typed) {
    const words = [
      'GeoAI',
      'Climate Science',
      'Climate & Atmospheric Modelling',
      'Environmental Modelling'
    ];

    let word = 0;
    let index = 0;
    let deleting = false;

    const tick = () => {
      const current = words[word];

      typed.textContent = current.slice(0, index);

      if (!deleting && index === current.length) {
        deleting = true;
        window.setTimeout(tick, 1400);
        return;
      }

      if (deleting && index === 0) {
        deleting = false;
        word = (word + 1) % words.length;
      }

      index += deleting ? -1 : 1;

      window.setTimeout(
        tick,
        deleting ? 35 : 75
      );
    };

    tick();
  }

})();
