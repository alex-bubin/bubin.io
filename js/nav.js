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
