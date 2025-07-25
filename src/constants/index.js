// constants/index.js - Application constants for better maintainability

export const CATEGORIES = [
  "Electronics",
  "Clothing", 
  "Home & Garden",
  "Books",
  "Sports & Outdoors",
  "Beauty & Personal Care",
  "Toys & Games",
  "Health & Wellness"
];

export const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'rating', label: 'Rating' },
  { value: 'category', label: 'Category' }
];

export const PAGINATION_OPTIONS = ['10', '20', '50', '100'];

export const LOCAL_STORAGE_KEYS = {
  CART: 'shopping-cart',
  FILTERS: 'product-filters',
  PREFERENCES: 'user-preferences'
};

export const API_CONFIG = {
  PRODUCTS_COUNT: 10000,
  DEFAULT_PAGE_SIZE: 20,
  SEARCH_DEBOUNCE_MS: 300,
  IMAGE_BASE_URL: 'https://picsum.photos/seed'
};

export const ROUTES = {
  HOME: '/',
  PRODUCT: '/product/:id',
  CART: '/cart'
};

export const MESSAGES = {
  ADDED_TO_CART: 'added to cart!',
  REMOVED_FROM_CART: 'removed from cart!',
  ORDER_PLACED: 'Order placed successfully!',
  CART_CLEARED: 'Cart cleared successfully!',
  ERROR_LOADING: 'Error loading products. Please try again.',
  NO_PRODUCTS: 'No products found matching your criteria.'
};
