// pages/HomePage.jsx - Enhanced homepage with better UX and performance
import React, { memo } from 'react';
import { List, Pagination, Empty, Alert, Row, Col, Affix } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/Product/ProductCard';
import ProductFilters from '../components/Product/ProductFilters';
import LoadingSpinner from '../components/Layout/LoadingSpinner';
import { PAGINATION_OPTIONS } from '../constants/index.js';

/**
 * Enhanced HomePage component with improved performance and UX
 */
const HomePage = memo(() => {
  const {
    products,
    loading,
    error,
    page,
    pageSize,
    total,
    filters,
    categoriesWithCounts,
    hasResults,
    isEmpty,
    currentPageStart,
    currentPageEnd,
    handlePageChange,
    handleSearch,
    handleCategoryFilter,
    handleSort,
    clearFilters,
  } = useProducts();

  // Error state
  if (error) {
    return (
      <div className="product-listing" style={{ padding: '2rem' }}>
        <Alert
          message="Error Loading Products"
          description={error}
          type="error"
          showIcon
          action={
            <button onClick={() => window.location.reload()}>
              Retry
            </button>
          }
        />
      </div>
    );
  }

  // Empty state
  const renderEmptyState = () => (
    <Empty
      image={<ShoppingOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
      imageStyle={{ height: 80 }}
      description={
        <div>
          <p>No products found matching your criteria.</p>
          {(filters.searchTerm || filters.category) && (
            <button 
              onClick={clearFilters}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#1890ff', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Clear filters to see all products
            </button>
          )}
        </div>
      }
      style={{ margin: '4rem 0' }}
    />
  );

  // Loading state
  if (loading && isEmpty) {
    return (
      <div className="product-listing" style={{ padding: '2rem', position: 'relative', minHeight: '60vh' }}>
        <ProductFilters
          filters={filters}
          onSearch={handleSearch}
          onCategoryFilter={handleCategoryFilter}
          onSort={handleSort}
          onClearFilters={clearFilters}
          totalResults={total}
          categoriesWithCounts={categoriesWithCounts}
          isLoading={loading}
        />
        <LoadingSpinner message="Loading products..." />
      </div>
    );
  }

  return (
    <div className="product-listing" style={{ padding: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Sticky Filters */}
      <Affix offsetTop={80}>
        <ProductFilters
          filters={filters}
          onSearch={handleSearch}
          onCategoryFilter={handleCategoryFilter}
          onSort={handleSort}
          onClearFilters={clearFilters}
          totalResults={total}
          categoriesWithCounts={categoriesWithCounts}
          isLoading={loading}
        />
      </Affix>

      {/* Results Summary */}
      {hasResults && (
        <div style={{ marginBottom: 16, padding: '0 8px' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Showing {currentPageStart} - {currentPageEnd} of {total.toLocaleString()} products
            {filters.searchTerm && ` for "${filters.searchTerm}"`}
            {filters.category && ` in ${filters.category}`}
          </p>
        </div>
      )}

      {/* Products Grid */}
      <div style={{ position: 'relative', minHeight: '400px' }}>
        {loading && (
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <LoadingSpinner centered={false} message="Loading..." />
          </div>
        )}

        {!hasResults && !loading ? renderEmptyState() : (
          <List
            grid={{ 
              gutter: [16, 24], 
              xs: 1, 
              sm: 2, 
              md: 3, 
              lg: 4, 
              xl: 5, 
              xxl: 6
            }}
            dataSource={products}
            renderItem={(product) => (
              <List.Item>
                <ProductCard product={product} page={page} />
              </List.Item>
            )}
            style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s ease' }}
          />
        )}
      </div>

      {/* Pagination */}
      {hasResults && (
        <Row justify="center" style={{ marginTop: 32, padding: '0 16px' }}>
          <Col>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => 
                `${range[0]}-${range[1]} of ${total} products`
              }
              pageSizeOptions={PAGINATION_OPTIONS}
              size="default"
              responsive
              style={{ textAlign: 'center' }}
            />
          </Col>
        </Row>
      )}
    </div>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;