// Highlight active nav link based on current page
(function () {
  const links = document.querySelectorAll('.nav-links a');
  const path = window.location.pathname.replace(/\/$/, '');
  const page = path.split('/').pop() || 'index.html';

  links.forEach(function (link) {
    const href = link.getAttribute('href');
    if (
      href === page ||
      (page === 'index.html' && href === '/') ||
      (href !== 'index.html' && page.startsWith(href.replace('.html', '')))
    ) {
      link.classList.add('active');
    }
  });
})();

// Mobile hamburger toggle
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', function () {
    toggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is tapped
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();
