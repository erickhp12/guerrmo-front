const GA_MEASUREMENT_ID = 'G-KQJMXBS6Z4';

const isEnabled = () =>
  process.env.NODE_ENV === 'production' && typeof window.gtag === 'function';

const gtagCall = (command, ...args) => {
  if (!isEnabled()) return;
  window.gtag(command, ...args);
};

export const trackPageView = (path, title) => {
  gtagCall('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

export const trackSearch = (searchTerm) => {
  gtagCall('event', 'search', { search_term: searchTerm });
};

export const trackAddToCart = ({ clave, descripcion, precio, quantity }) => {
  gtagCall('event', 'add_to_cart', {
    currency: 'MXN',
    value: Number(precio) * quantity,
    items: [{ item_id: clave, item_name: descripcion, price: Number(precio), quantity }],
  });
};

export const trackPurchase = ({ cart, total, getItemKey, getItemName, getItemPrice, getItemQty }) => {
  gtagCall('event', 'purchase', {
    transaction_id: `order_${Date.now()}`,
    currency: 'MXN',
    value: Number(total),
    items: cart.map(item => ({
      item_id: getItemKey(item),
      item_name: getItemName(item),
      price: getItemPrice(item),
      quantity: getItemQty(item),
    })),
  });
};
