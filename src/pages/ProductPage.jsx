// pages/ProductPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Descriptions, Image,Spin } from 'antd';
import useProducts from '../hooks/useProducts';
import {useCart} from '../hooks/useCart';
import { App as AntApp } from "antd";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { message } = AntApp.useApp();

  const product = products.find(p => p.id === parseInt(id));
  console.log(product);
  
  if (!product) return <Spin size="large" />;

  const handleAddToCart = () => {
    addToCart(product);
    message.success(`${product.name} added to cart!`);
  };

  return (
    <div className="product-details">
      <Button type="link" onClick={() => navigate(-1)}>
        &larr; Back to Products
      </Button>
      
      <Card>
        <div className="product-content">
          <div className="product-image">
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              preview={false}
            />
          </div>
          <div className="product-info">
            <h1>{product.name}</h1>
            <Descriptions column={1}>
              <Descriptions.Item label="Price">
                ${product.price.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {product.category}
              </Descriptions.Item>
              <Descriptions.Item label="Rating">
                {Array.from({ length: product.rating }).map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="Stock">
                {product.stock > 0 ? (
                  <span style={{ color: 'green' }}>In Stock ({product.stock})</span>
                ) : (
                  <span style={{ color: 'red' }}>Out of Stock</span>
                )}
              </Descriptions.Item>
            </Descriptions>
            
            <p>{product.description}</p>
            
            <Button
              type="primary"
              size="large"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductPage;