// types/index.js - Type definitions for better code structure

/**
 * @typedef {Object} Product
 * @property {number} id - Unique product identifier
 * @property {string} name - Product name
 * @property {string} description - Product description
 * @property {number} price - Product price
 * @property {string} image - Product image URL
 * @property {string} category - Product category
 * @property {number} rating - Product rating (1-5)
 * @property {number} stock - Available stock quantity
 */

/**
 * @typedef {Object} CartItem
 * @property {number} id - Product ID
 * @property {string} name - Product name
 * @property {number} price - Product price
 * @property {string} image - Product image URL
 * @property {number} quantity - Quantity in cart
 * @property {number} stock - Available stock
 */

/**
 * @typedef {Object} CartContextType
 * @property {CartItem[]} cart - Cart items
 * @property {number} totalItems - Total number of items
 * @property {number} totalPrice - Total cart price
 * @property {function} addToCart - Add item to cart
 * @property {function} removeFromCart - Remove item from cart
 * @property {function} updateQuantity - Update item quantity
 * @property {function} clearCart - Clear all items
 */

/**
 * @typedef {Object} FilterOptions
 * @property {string} searchTerm - Search query
 * @property {string} category - Selected category
 * @property {string} sortBy - Sort criteria
 * @property {string} sortOrder - Sort order (asc/desc)
 */

export {};
