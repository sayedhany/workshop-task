// hooks/useProducts.js
import { useState, useEffect, useMemo } from 'react';
import { generateProducts } from '../utils/generateProducts';

const useProducts = () => {
  const [allProducts] = useState(() => generateProducts(10000));
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      const filtered = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
      });
      
      const startIndex = (page - 1) * pageSize;
      const paginated = filtered.slice(startIndex, startIndex + pageSize);
      
      setProducts(paginated);
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [allProducts, page, pageSize, searchTerm, categoryFilter]);

  const total = useMemo(() => {
    return allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    }).length;
  }, [allProducts, searchTerm, categoryFilter]);

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1); // Reset to first page when searching
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    setPage(1); // Reset to first page when filtering
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