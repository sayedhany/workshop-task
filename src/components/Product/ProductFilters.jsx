// components/Product/ProductFilters.jsx - Enhanced filtering component
import React, { memo } from 'react';
import { Input, Select, Button, Space, Row, Col, Card, Typography, Tag } from 'antd';
import { SearchOutlined, ClearOutlined, FilterOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { CATEGORIES, SORT_OPTIONS } from '../../constants/index.js';

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

/**
 * Enhanced ProductFilters component with better UX and features
 */
const ProductFilters = memo(({
  filters,
  onSearch,
  onCategoryFilter,
  onSort,
  onClearFilters,
  totalResults,
  categoriesWithCounts = [],
  isLoading = false
}) => {
  const { searchTerm, category, sortBy, sortOrder } = filters;

  const handleSortChange = (value) => {
    const [field, order] = value.split('-');
    onSort(field, order);
  };

  const getSortValue = () => {
    return `${sortBy}-${sortOrder}`;
  };

  const renderActiveFilters = () => {
    const activeFilters = [];
    
    if (searchTerm) {
      activeFilters.push(
        <Tag key="search" closable onClose={() => onSearch('')}>
          Search: {searchTerm}
        </Tag>
      );
    }
    
    if (category) {
      activeFilters.push(
        <Tag key="category" closable onClose={() => onCategoryFilter('')}>
          Category: {category}
        </Tag>
      );
    }
    
    if (activeFilters.length > 0) {
      return (
        <div style={{ marginTop: 8 }}>
          <Text type="secondary" style={{ marginRight: 8 }}>Active filters:</Text>
          {activeFilters}
          <Button 
            type="link" 
            size="small" 
            onClick={onClearFilters}
            icon={<ClearOutlined />}
          >
            Clear All
          </Button>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card className="product-filters" style={{ marginBottom: 24 }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8} lg={8}>
          <Search
            placeholder="Search products, brands, categories..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            loading={isLoading}
            style={{ width: '100%' }}
          />
        </Col>
        
        <Col xs={24} sm={6} md={4} lg={4}>
          <Select
            placeholder="All Categories"
            allowClear
            size="large"
            style={{ width: '100%' }}
            onChange={onCategoryFilter}
            value={category || undefined}
            suffixIcon={<FilterOutlined />}
          >
            {categoriesWithCounts.length > 0 ? (
              categoriesWithCounts.map(({ category: cat, count }) => (
                <Option key={cat} value={cat}>
                  {cat} ({count})
                </Option>
              ))
            ) : (
              CATEGORIES.map(cat => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))
            )}
          </Select>
        </Col>
        
        <Col xs={24} sm={6} md={4} lg={4}>
          <Select
            placeholder="Sort by"
            size="large"
            style={{ width: '100%' }}
            value={getSortValue()}
            onChange={handleSortChange}
            suffixIcon={sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
          >
            {SORT_OPTIONS.map(option => (
              <React.Fragment key={option.value}>
                <Option value={`${option.value}-asc`}>
                  {option.label} (A-Z)
                </Option>
                <Option value={`${option.value}-desc`}>
                  {option.label} (Z-A)
                </Option>
              </React.Fragment>
            ))}
          </Select>
        </Col>
        
        <Col xs={24} sm={24} md={8} lg={8}>
          <Space size="middle" style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Text type="secondary">
              {totalResults.toLocaleString()} {totalResults === 1 ? 'product' : 'products'}
            </Text>
            
            {(searchTerm || category) && (
              <Button 
                type="default" 
                icon={<ClearOutlined />} 
                onClick={onClearFilters}
                size="large"
              >
                Clear Filters
              </Button>
            )}
          </Space>
        </Col>
      </Row>
      
      {renderActiveFilters()}
    </Card>
  );
});

ProductFilters.displayName = 'ProductFilters';

export default ProductFilters;
