// hooks/useProducts.js
import { useState, useEffect, useMemo } from 'react';
import { generateProducts } from '../utils/generateProducts';

const useProducts = (currPage) => {
  const [allProducts] = useState(() => generateProducts(10000));
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(currPage || 1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(false);

  // Memoize filtered products for performance
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return allProducts.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term);
      const matchesCategory =
        !categoryFilter || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [allProducts, searchTerm, categoryFilter]);

  // Memoize paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, page, pageSize]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setProducts(
        paginatedProducts.map(product => ({
          ...product,
          id: product.id,
        }))
      );
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [paginatedProducts]);

  const total = filteredProducts.length;

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleSearch = term => {
    setSearchTerm(term);
    // Only reset page if the search term actually changes
    setPage(prev => term !== searchTerm ? 1 : prev);
  };

  const handleCategoryFilter = category => {
    setCategoryFilter(category);
    // Only reset page if the category actually changes
    setPage(prev => category !== categoryFilter ? 1 : prev);
  };

  return {
    products,
    loading,
    page,
    pageSize,
    total,
    searchTerm,
    categoryFilter,
    handlePageChange,
    handleSearch,
    handleCategoryFilter,
  };
};

export default useProducts;