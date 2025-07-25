// pages/ProductPage.jsx - Enhanced product details page
import React, { useState, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Button, 
  Card, 
  Descriptions, 
  Image, 
  Rate, 
  InputNumber, 
  Typography, 
  Space, 
  Tag, 
  Row, 
  Col,
  Breadcrumb,
  Divider,
  Badge,
  Tooltip
} from 'antd';
import { 
  ArrowLeftOutlined, 
  ShoppingCartOutlined, 
  HeartOutlined,
  ShareAltOutlined,
  EyeOutlined
} from '@ant-design/icons';
import useProducts from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { formatCurrency, calculateDiscountPrice, formatDate } from '../utils/helpers.js';
import LoadingSpinner from '../components/Layout/LoadingSpinner';
import ErrorBoundary from '../components/Layout/ErrorBoundary';

const { Title, Text, Paragraph } = Typography;

/**
 * Enhanced ProductPage component with better UX and features
 */
const ProductPage = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart, isInCart, getCartItem } = useCart();
  
  const [quantity, setQuantity] = useState(1);

  const product = getProductById(parseInt(id));

  if (!product) {
    return (
      <div style={{ padding: '2rem', position: 'relative', minHeight: '60vh' }}>
        <LoadingSpinner message="Product not found..." />
      </div>
    );
  }

  const {
    name,
    description,
    price,
    image,
    category,
    rating,
    stock,
    brand,
    sku,
    tags = [],
    discount = 0,
    createdAt
  } = product;

  const isProductInCart = isInCart(product.id);
  const cartItem = getCartItem(product.id);
  const isOutOfStock = stock === 0;
  const discountedPrice = discount > 0 ? calculateDiscountPrice(price, discount) : price;
  const maxQuantity = Math.min(stock, 10); // Limit max quantity to 10

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= stock) {
      addToCart(product, quantity);
      setQuantity(1);
    }
  };

  const handleQuantityChange = (value) => {
    if (value >= 1 && value <= maxQuantity) {
      setQuantity(value);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: name,
        text: description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const renderPriceSection = () => (
    <Space direction="vertical" size="small">
      {discount > 0 ? (
        <>
          <Text delete type="secondary" style={{ fontSize: 18 }}>
            {formatCurrency(price)}
          </Text>
          <Space align="center">
            <Title level={2} style={{ margin: 0, color: '#f5222d' }}>
              {formatCurrency(discountedPrice)}
            </Title>
            <Badge count={`${discount}% OFF`} style={{ backgroundColor: '#f5222d' }} />
          </Space>
          <Text type="success" strong>
            You save {formatCurrency(price - discountedPrice)}
          </Text>
        </>
      ) : (
        <Title level={2} style={{ margin: 0 }}>
          {formatCurrency(price)}
        </Title>
      )}
    </Space>
  );

  const renderStockStatus = () => {
    if (isOutOfStock) {
      return <Tag color="red" style={{ fontSize: 14, padding: '4px 12px' }}>Out of Stock</Tag>;
    }
    if (stock < 10) {
      return <Tag color="orange" style={{ fontSize: 14, padding: '4px 12px' }}>Only {stock} left!</Tag>;
    }
    return <Tag color="green" style={{ fontSize: 14, padding: '4px 12px' }}>In Stock ({stock} available)</Tag>;
  };

  const renderActionButtons = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {!isOutOfStock && (
        <Space.Compact style={{ width: '100%' }}>
          <Text strong style={{ lineHeight: '32px', marginRight: 8 }}>Quantity:</Text>
          <InputNumber
            min={1}
            max={maxQuantity}
            value={quantity}
            onChange={handleQuantityChange}
            size="large"
            style={{ width: 80 }}
          />
        </Space.Compact>
      )}
      
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Button
          type="primary"
          size="large"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          disabled={isOutOfStock || quantity > stock}
          block
          style={{ height: 48 }}
        >
          {isOutOfStock 
            ? 'Out of Stock' 
            : isProductInCart 
              ? `Update Cart (${cartItem?.quantity} in cart)` 
              : 'Add to Cart'
          }
        </Button>
        
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button 
            icon={<HeartOutlined />} 
            size="large"
            style={{ flex: 1 }}
          >
            Wishlist
          </Button>
          <Button 
            icon={<ShareAltOutlined />} 
            size="large"
            onClick={handleShare}
            style={{ flex: 1 }}
          >
            Share
          </Button>
        </Space>
      </Space>
    </Space>
  );

  return (
    <ErrorBoundary>
      <div className="product-details" style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item>
            <Button type="link" onClick={() => navigate('/')} icon={<ArrowLeftOutlined />}>
              Home
            </Button>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{category}</Breadcrumb.Item>
          <Breadcrumb.Item>{name}</Breadcrumb.Item>
        </Breadcrumb>

        <Card className="product-detail-card">
          <Row gutter={[32, 32]}>
            {/* Product Images */}
            <Col xs={24} md={12}>
              <div className="product-images">
                <Image
                  src={image}
                  alt={name}
                  width="100%"
                  style={{ borderRadius: 8 }}
                  preview={{
                    toolbarRender: () => null,
                  }}
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/600x450?text=${encodeURIComponent(name)}`;
                  }}
                />
                
                {/* Additional product info overlay */}
                <div style={{ marginTop: 16 }}>
                  <Space>
                    <Tag icon={<EyeOutlined />}>Premium Quality</Tag>
                    {discount > 0 && <Tag color="red">Limited Time Offer</Tag>}
                    {stock < 10 && stock > 0 && <Tag color="orange">Low Stock</Tag>}
                  </Space>
                </div>
              </div>
            </Col>

            {/* Product Information */}
            <Col xs={24} md={12}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Header */}
                <div>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Text type="secondary">{brand}</Text>
                    <Title level={1} style={{ margin: 0, fontSize: '2rem' }}>
                      {name}
                    </Title>
                    <Space>
                      <Rate disabled value={rating} />
                      <Text type="secondary">({rating}/5)</Text>
                    </Space>
                  </Space>
                </div>

                {/* Price */}
                {renderPriceSection()}

                {/* Stock Status */}
                {renderStockStatus()}

                {/* Description */}
                <div>
                  <Title level={4}>Description</Title>
                  <Paragraph>{description}</Paragraph>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                  <div>
                    <Text strong style={{ marginRight: 8 }}>Features:</Text>
                    <Space wrap>
                      {tags.map((tag, index) => (
                        <Tag key={index} color="blue">{tag}</Tag>
                      ))}
                    </Space>
                  </div>
                )}

                {/* Action Buttons */}
                {renderActionButtons()}
              </Space>
            </Col>
          </Row>

          <Divider />

          {/* Product Specifications */}
          <div>
            <Title level={4}>Product Details</Title>
            <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }}>
              <Descriptions.Item label="SKU">{sku}</Descriptions.Item>
              <Descriptions.Item label="Category">{category}</Descriptions.Item>
              <Descriptions.Item label="Brand">{brand}</Descriptions.Item>
              <Descriptions.Item label="Rating">{rating}/5 stars</Descriptions.Item>
              <Descriptions.Item label="Stock">{stock} units</Descriptions.Item>
              <Descriptions.Item label="Added">{formatDate(createdAt)}</Descriptions.Item>
            </Descriptions>
          </div>
        </Card>
      </div>
    </ErrorBoundary>
  );
});

ProductPage.displayName = 'ProductPage';

export default ProductPage;