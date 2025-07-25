// hooks/useProducts.js - Enhanced product management with better performance and features
import { useState, useEffect, useMemo, useCallback } from 'react';
import { generateProducts, searchProducts, filterByCategory, sortProducts } from '../utils/generateProducts';
import { debounce } from '../utils/helpers.js';
import { API_CONFIG, LOCAL_STORAGE_KEYS } from '../constants/index.js';
import { getStorageItem, setStorageItem } from '../utils/helpers.js';

const useProducts = (initialPage = 1) => {
  // Initialize products once and cache them
  const [allProducts] = useState(() => generateProducts(API_CONFIG.PRODUCTS_COUNT));
  
  // State management
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(API_CONFIG.DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter states with persistence
  const [filters, setFilters] = useState(() => {
    const savedFilters = getStorageItem(LOCAL_STORAGE_KEYS.FILTERS, {});
    return {
      searchTerm: '',
      category: '',
      sortBy: 'name',
      sortOrder: 'asc',
      ...savedFilters
    };
  });

  // Persist filters to localStorage
  useEffect(() => {
    setStorageItem(LOCAL_STORAGE_KEYS.FILTERS, filters);
  }, [filters]);

  // Memoized filtered and sorted products for performance
  const processedProducts = useMemo(() => {
    let result = allProducts;
    
    // Apply search filter
    if (filters.searchTerm) {
      result = searchProducts(filters.searchTerm, result);
    }
    
    // Apply category filter
    if (filters.category) {
      result = filterByCategory(filters.category, result);
    }
    
    // Apply sorting
    result = sortProducts(result, filters.sortBy, filters.sortOrder);
    
    return result;
  }, [allProducts, filters.searchTerm, filters.category, filters.sortBy, filters.sortOrder]);

  // Memoized paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return processedProducts.slice(startIndex, startIndex + pageSize);
  }, [processedProducts, page, pageSize]);

  // Update products when pagination or filters change
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Simulate API delay for realistic UX
    const timer = setTimeout(() => {
      try {
        setProducts(paginatedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error loading products:', error);
        setError('Failed to load products');
        setLoading(false);
      }
    }, API_CONFIG.SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [paginatedProducts]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters.searchTerm, filters.category, filters.sortBy, filters.sortOrder]);

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((term) => {
      setFilters(prev => ({ ...prev, searchTerm: term }));
    }, API_CONFIG.SEARCH_DEBOUNCE_MS),
    []
  );

  // Action handlers
  const handlePageChange = useCallback((newPage, newPageSize) => {
    setPage(newPage);
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
  }, [pageSize]);

  const handleSearch = useCallback((term) => {
    debouncedSearch(term);
  }, [debouncedSearch]);

  const handleCategoryFilter = useCallback((category) => {
    setFilters(prev => ({ ...prev, category: category || '' }));
  }, []);

  const handleSort = useCallback((sortBy, sortOrder = 'asc') => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
  }, []);

  const toggleSortOrder = useCallback(() => {
    setFilters(prev => ({ 
      ...prev, 
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      category: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  }, []);

  // Get product by ID
  const getProductById = useCallback((id) => {
    return allProducts.find(product => product.id === parseInt(id));
  }, [allProducts]);

  // Get categories with counts
  const categoriesWithCounts = useMemo(() => {
    const counts = allProducts.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(counts).map(([category, count]) => ({
      category,
      count
    }));
  }, [allProducts]);

  // Search suggestions
  const getSearchSuggestions = useCallback((term) => {
    if (!term || term.length < 2) return [];
    
    const suggestions = new Set();
    const lowerTerm = term.toLowerCase();
    
    allProducts.forEach(product => {
      // Add product names that match
      if (product.name.toLowerCase().includes(lowerTerm)) {
        suggestions.add(product.name);
      }
      
      // Add categories that match
      if (product.category.toLowerCase().includes(lowerTerm)) {
        suggestions.add(product.category);
      }
      
      // Add brands that match
      if (product.brand && product.brand.toLowerCase().includes(lowerTerm)) {
        suggestions.add(product.brand);
      }
    });
    
    return Array.from(suggestions).slice(0, 10);
  }, [allProducts]);

  return {
    // Product data
    products,
    allProducts,
    processedProducts,
    
    // State
    loading,
    error,
    page,
    pageSize,
    total: processedProducts.length,
    totalAll: allProducts.length,
    
    // Filters
    filters,
    categoriesWithCounts,
    
    // Actions
    handlePageChange,
    handleSearch,
    handleCategoryFilter,
    handleSort,
    toggleSortOrder,
    clearFilters,
    
    // Utilities
    getProductById,
    getSearchSuggestions,
    
    // Computed values
    hasResults: processedProducts.length > 0,
    isEmpty: products.length === 0,
    hasNextPage: page * pageSize < processedProducts.length,
    hasPrevPage: page > 1,
    currentPageStart: (page - 1) * pageSize + 1,
    currentPageEnd: Math.min(page * pageSize, processedProducts.length)
  };
};

export default useProducts;