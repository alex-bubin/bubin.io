(function () {
  // Public Storefront API token — scoped read-only, safe in client JS.
  const SHOPIFY_DOMAIN = '7g0zrp-pf.myshopify.com';
  const STOREFRONT_ACCESS_TOKEN = '3b0c8315e6443f9bb58542171111bea6';
  const PRODUCTS = [
    { id: '7994625032240', nodeId: 'shopify-buy-button-2026' },
    { id: '7965888217136', nodeId: 'shopify-buy-button' }
  ];

  const SDK_URL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

  const buttonStyle = {
    'font-weight': 'bold',
    'font-size': '16px',
    'padding-top': '16px',
    'padding-bottom': '16px',
    'color': '#000000',
    'background-color': '#e8ff00',
    ':hover': { 'color': '#000000', 'background-color': '#d1e600' },
    ':focus': { 'background-color': '#d1e600' }
  };

  function loadSDK() {
    if (window.ShopifyBuy && window.ShopifyBuy.UI) { init(); return; }
    const script = document.createElement('script');
    script.async = true;
    script.src = SDK_URL;
    script.onload = init;
    script.onerror = renderFallback;
    document.head.appendChild(script);
  }

  function renderFallback() {
    PRODUCTS.forEach(function (p) {
      const node = document.getElementById(p.nodeId);
      if (node) node.innerHTML = '<p style="color:var(--grey);font-family:var(--font-mono);font-size:0.75rem;">Shop temporarily unavailable. Email photos@bubin.io to order.</p>';
    });
  }

  function createButton(ui, product) {
    ui.createComponent('product', {
      id: product.id,
      node: document.getElementById(product.nodeId),
      moneyFormat: '%24%7B%7Bamount%7D%7D',
      options: {
          product: {
            buttonDestination: 'checkout',
            contents: { img: false, title: false, price: false, options: false, description: false, quantity: false },
            text: { button: 'Buy now' },
            styles: {
              product: { 'text-align': 'left' },
              button: buttonStyle
            }
          },
          modalProduct: {
            contents: { img: false, imgWithCarousel: true, button: false, buttonWithQuantity: true },
            styles: {
              product: { '@media (min-width: 601px)': { 'max-width': '100%', 'margin-left': '0px', 'margin-bottom': '0px' } },
              button: buttonStyle,
              quantityInput: { 'font-size': '16px', 'padding-top': '16px', 'padding-bottom': '16px' }
            },
            text: { button: 'Add to cart' }
          },
          cart: {
            styles: { button: buttonStyle },
            text: { total: 'Subtotal', button: 'Checkout' }
          },
          toggle: {
            styles: {
              toggle: {
                'font-weight': 'bold',
                'background-color': '#e8ff00',
                ':hover': { 'background-color': '#d1e600' },
                ':focus': { 'background-color': '#d1e600' }
              },
              count: { 'font-size': '16px', 'color': '#000000', ':hover': { 'color': '#000000' } },
              iconPath: { 'fill': '#000000' }
            }
          }
        }
    });
  }

  function init() {
    const client = ShopifyBuy.buildClient({
      domain: SHOPIFY_DOMAIN,
      storefrontAccessToken: STOREFRONT_ACCESS_TOKEN
    });

    ShopifyBuy.UI.onReady(client).then(function (ui) {
      PRODUCTS.forEach(function (p) { createButton(ui, p); });
    }).catch(function (err) {
      console.error('Shopify Buy Button init failed:', err);
      renderFallback();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSDK);
  } else {
    loadSDK();
  }
})();
