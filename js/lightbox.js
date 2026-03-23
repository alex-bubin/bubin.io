/**
 * Lightbox | pure vanilla JS, no dependencies.
 * Works with .photo-item elements that have data-band, data-show, data-index attributes
 * and contain an <img> child.
 */

(function () {
  'use strict';

  let photos = [];
  let currentIndex = 0;
  let lightboxEl = null;
  let lightboxImg = null;
  let lightboxBand = null;
  let lightboxShow = null;
  let lightboxCounter = null;

  function buildLightbox() {
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('role', 'dialog');
    lb.innerHTML = `
      <div id="lb-backdrop"></div>
      <button id="lb-close" aria-label="Close lightbox">&times;</button>
      <button id="lb-prev" aria-label="Previous photo">&#8592;</button>
      <button id="lb-next" aria-label="Next photo">&#8594;</button>
      <div id="lb-content">
        <div id="lb-img-wrap" style="position:relative;display:inline-block;">
          <img id="lb-img" src="" alt="">
          <span id="lb-watermark">@eyelickss</span>
        </div>
        <div id="lb-meta">
          <span id="lb-band"></span>
          <span id="lb-show"></span>
          <span id="lb-counter"></span>
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      #lightbox {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 9000;
        align-items: center;
        justify-content: center;
      }
      #lightbox.is-open {
        display: flex;
      }
      #lb-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.95);
        cursor: pointer;
      }
      #lb-content {
        position: relative;
        z-index: 1;
        max-width: 92vw;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      #lb-img {
        max-width: 92vw;
        max-height: 82vh;
        object-fit: contain;
        display: block;
        box-shadow: 0 0 60px rgba(0,0,0,0.8);
      }
      #lb-meta {
        width: 100%;
        display: flex;
        align-items: baseline;
        gap: 1rem;
        padding: 0.75rem 0 0;
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.75rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }
      #lb-band {
        color: #e8ff00;
        font-weight: bold;
      }
      #lb-show {
        color: #888880;
        flex: 1;
      }
      #lb-counter {
        color: #888880;
        font-size: 0.65rem;
      }
      #lb-watermark {
        position: absolute;
        bottom: 0.6rem;
        right: 0.75rem;
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.7rem;
        letter-spacing: 0.12em;
        color: rgba(255, 255, 255, 0.35);
        pointer-events: none;
        user-select: none;
        text-shadow: 0 1px 3px rgba(0,0,0,0.8);
      }
      #lb-close {
        position: absolute;
        top: 1rem;
        right: 1.25rem;
        z-index: 2;
        background: none;
        border: none;
        color: #f5f5f0;
        font-size: 2rem;
        line-height: 1;
        cursor: pointer;
        opacity: 0.7;
        padding: 0.25rem 0.5rem;
        transition: opacity 0.15s, color 0.15s;
      }
      #lb-close:hover { opacity: 1; color: #e8ff00; }
      #lb-prev, #lb-next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2;
        background: rgba(0,0,0,0.5);
        border: 1px solid #2a2a2a;
        color: #f5f5f0;
        font-size: 1.5rem;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.15s, color 0.15s, border-color 0.15s;
      }
      #lb-prev:hover, #lb-next:hover {
        opacity: 1;
        color: #e8ff00;
        border-color: #e8ff00;
      }
      #lb-prev { left: 1rem; }
      #lb-next { right: 1rem; }
      @media (max-width: 600px) {
        #lb-prev { left: 0.25rem; }
        #lb-next { right: 0.25rem; }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(lb);

    lightboxEl = lb;
    lightboxImg = lb.querySelector('#lb-img');
    lightboxBand = lb.querySelector('#lb-band');
    lightboxShow = lb.querySelector('#lb-show');
    lightboxCounter = lb.querySelector('#lb-counter');

    lb.querySelector('#lb-backdrop').addEventListener('click', close);
    lb.querySelector('#lb-close').addEventListener('click', close);
    lb.querySelector('#lb-prev').addEventListener('click', function (e) {
      e.stopPropagation();
      navigate(-1);
    });
    lb.querySelector('#lb-next').addEventListener('click', function (e) {
      e.stopPropagation();
      navigate(1);
    });
  }

  function open(index) {
    currentIndex = index;
    render();
    lightboxEl.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lightboxEl.focus();
  }

  function close() {
    lightboxEl.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + photos.length) % photos.length;
    render();
  }

  function render() {
    const photo = photos[currentIndex];
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.alt;
    lightboxBand.textContent = photo.band;
    lightboxShow.textContent = photo.show;
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + photos.length;
  }

  function init() {
    const items = document.querySelectorAll('.photo-item');
    if (!items.length) return;

    buildLightbox();

    items.forEach(function (item, i) {
      const img = item.querySelector('img');
      photos.push({
        src: img ? img.src : '',
        alt: img ? (img.alt || '') : '',
        band: item.dataset.band || '',
        show: item.dataset.show || '',
      });

      item.style.cursor = 'pointer';
      item.addEventListener('click', function () {
        open(i);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (!lightboxEl.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
