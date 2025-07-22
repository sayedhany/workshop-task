// pages/HomePage.jsx
import React from 'react';
import { List, Card, Pagination, Input, Select, Spin } from 'antd';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/Product/ProductCard';

const { Search } = Input;
const { Option } = Select;

const HomePage = () => {
  const {
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
  } = useProducts();

  return (
    <div className="product-listing">
      <div className="filters">
        <Search
          placeholder="Search products"
          allowClear
          enterButton
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300, marginBottom: 20 }}
        />
        <Select
          placeholder="Filter by category"
          allowClear
          style={{ width: 200, marginLeft: 10,marginBottom: 20 }}
          onChange={handleCategoryFilter}
          value={categoryFilter}
        >
          <Option value="" >All Categories</Option>
          <Option value="Electronics">Electronics</Option>
          <Option value="Clothing">Clothing</Option>
          <Option value="Home">Home</Option>
          <Option value="Books">Books</Option>
        </Select>
      </div>

      {loading ? (
        <Spin style={{position:'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} size="large" />
      ) : (
        <>
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 5 }}
            dataSource={products}
            renderItem={(product) => (
              <List.Item>
                <ProductCard product={product} page={page} />
              </List.Item>
            )}
          />
          <div className="pagination">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={['10', '20', '50', '100']}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;