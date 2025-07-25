import { faker } from "@faker-js/faker";
import { CATEGORIES, API_CONFIG } from "../constants/index.js";

// utils/generateProducts.js - Enhanced product generation with better data quality
let cachedProducts = null;

/**
 * Generate mock products with realistic data
 * @param {number} num - Number of products to generate
 * @returns {Product[]} Array of generated products
 */
export const generateProducts = (num = API_CONFIG.PRODUCTS_COUNT) => {
  if (cachedProducts && cachedProducts.length >= num) {
    return cachedProducts.slice(0, num);
  }

  console.time('Product Generation');
  
  const products = [];
  
  // Pre-generate some realistic product name prefixes for better variety
  const productPrefixes = {
    Electronics: ['Smart', 'Pro', 'Ultra', 'Premium', 'Advanced'],
    Clothing: ['Classic', 'Modern', 'Vintage', 'Casual', 'Elegant'],
    'Home & Garden': ['Comfort', 'Luxury', 'Essential', 'Deluxe', 'Premium'],
    Books: ['Complete', 'Ultimate', 'Essential', 'Comprehensive', 'Definitive'],
    'Sports & Outdoors': ['Pro', 'Athletic', 'Performance', 'Extreme', 'Adventure'],
    'Beauty & Personal Care': ['Gentle', 'Natural', 'Premium', 'Professional', 'Organic'],
    'Toys & Games': ['Fun', 'Educational', 'Creative', 'Interactive', 'Adventure'],
    'Health & Wellness': ['Natural', 'Pure', 'Organic', 'Essential', 'Premium']
  };

  for (let i = 1; i <= num; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const prefix = productPrefixes[category][Math.floor(Math.random() * productPrefixes[category].length)];
    
    products.push({
      id: i,
      name: `${prefix} ${faker.commerce.productName()}`,
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 5, max: 999, dec: 2 })),
      image: `${API_CONFIG.IMAGE_BASE_URL}/${i}/400/300`,
      category,
      rating: Math.floor(Math.random() * 5) + 1,
      stock: Math.floor(Math.random() * 100) + 1,
      // Additional fields for better UX
      brand: faker.company.name(),
      sku: faker.string.alphanumeric(8).toUpperCase(),
      tags: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
        faker.commerce.productAdjective()
      ),
      createdAt: faker.date.past({ years: 2 }),
      discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 5 : 0
    });
  }
  
  cachedProducts = products;
  console.timeEnd('Product Generation');
  console.log(`Generated ${num} products`);
  
  return products;
};

/**
 * Get a single product by ID
 * @param {number} id - Product ID
 * @returns {Product|null} Product or null if not found
 */
export const getProductById = (id) => {
  if (!cachedProducts) {
    generateProducts();
  }
  return cachedProducts.find(product => product.id === parseInt(id)) || null;
};

/**
 * Search products by term
 * @param {string} term - Search term
 * @param {Product[]} products - Products to search
 * @returns {Product[]} Filtered products
 */
export const searchProducts = (term, products) => {
  if (!term.trim()) return products;
  
  const searchTerm = term.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.brand.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

/**
 * Filter products by category
 * @param {string} category - Category to filter by
 * @param {Product[]} products - Products to filter
 * @returns {Product[]} Filtered products
 */
export const filterByCategory = (category, products) => {
  if (!category) return products;
  return products.filter(product => product.category === category);
};

/**
 * Sort products by specified criteria
 * @param {Product[]} products - Products to sort
 * @param {string} sortBy - Field to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Product[]} Sorted products
 */
export const sortProducts = (products, sortBy = 'name', order = 'asc') => {
  return [...products].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle string sorting
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return order === 'asc' ? comparison : -comparison;
  });
};
