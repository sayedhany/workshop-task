import React, { memo } from "react";
import { Card, Button, Rate, Tag, Typography, Badge, Tooltip } from "antd";
import { ShoppingCartOutlined, EyeOutlined, HeartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { formatCurrency, calculateDiscountPrice, truncateText } from "../../utils/helpers.js";

const { Meta } = Card;
const { Text, Title } = Typography;

/**
 * Enhanced ProductCard component with better UX and performance
 * @param {Object} product - Product data
 * @param {number} page - Current page for navigation
 * @returns {JSX.Element} Product card component
 */
const ProductCard = memo(({ product, page }) => {
  const { addToCart, isInCart, getCartItem } = useCart();

  if (!product) return null;

  const {
    id,
    name,
    description,
    price,
    image,
    category,
    rating,
    stock,
    discount = 0,
    brand
  } = product;

  const isProductInCart = isInCart(id);
  const cartItem = getCartItem(id);
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock < 10;
  const discountedPrice = discount > 0 ? calculateDiscountPrice(price, discount) : price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const renderStockStatus = () => {
    if (isOutOfStock) {
      return <Tag color="red">Out of Stock</Tag>;
    }
    if (isLowStock) {
      return <Tag color="orange">Only {stock} left!</Tag>;
    }
    return <Tag color="green">In Stock</Tag>;
  };

  const renderPrice = () => (
    <div style={{ margin: "8px 0" }}>
      {discount > 0 ? (
        <div>
          <Text delete type="secondary" style={{ fontSize: 14 }}>
            {formatCurrency(price)}
          </Text>
          <br />
          <Text strong style={{ fontSize: 18, color: '#f5222d' }}>
            {formatCurrency(discountedPrice)}
          </Text>
          <Tag color="red" style={{ marginLeft: 8 }}>
            -{discount}%
          </Tag>
        </div>
      ) : (
        <Text strong style={{ fontSize: 18 }}>
          {formatCurrency(price)}
        </Text>
      )}
      {renderStockStatus()}
    </div>
  );

  const cardActions = [
    <Tooltip title="View Details" key="view">
      <Link to={`/product/${id}?page=${page}`}>
        <Button type="text" icon={<EyeOutlined />} size="large">
          View Details
        </Button>
      </Link>
    </Tooltip>,
    <Tooltip 
      title={isOutOfStock ? "Out of Stock" : isProductInCart ? "In Cart" : "Add to Cart"} 
      key="cart"
    >
      <Button
        type={isProductInCart ? "default" : "primary"}
        icon={<ShoppingCartOutlined />}
        disabled={isOutOfStock}
        onClick={handleAddToCart}
        size="large"
        danger={isProductInCart}
      >
        {isProductInCart ? `In Cart (${cartItem?.quantity})` : "Add to Cart"}
      </Button>
    </Tooltip>
  ];

  return (
    <Badge.Ribbon 
      text={discount > 0 ? `${discount}% OFF` : null} 
      color="red"
      style={{ display: discount > 0 ? 'block' : 'none' }}
    >
      <Card
        hoverable
        loading={false}
        className="product-card"
        cover={
          <Link to={`/product/${id}?page=${page}`}>
            <div className="product-image-container">
              <img
                alt={name}
                src={image}
                style={{
                  height: 200,
                  width: '100%',
                  objectFit: "cover",
                  padding: 10,
                }}
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(name)}`;
                }}
              />
              {isOutOfStock && (
                <div className="out-of-stock-overlay">
                  <Text strong style={{ color: 'white' }}>Out of Stock</Text>
                </div>
              )}
            </div>
          </Link>
        }
        actions={cardActions}
        bodyStyle={{ padding: '12px 16px' }}
      >
        <Meta
          title={
            <Link to={`/product/${id}?page=${page}`} style={{ color: 'inherit' }}>
              <Tooltip title={name}>
                <Title level={5} ellipsis={{ rows: 2 }} style={{ margin: 0, minHeight: '3em' }}>
                  {name}
                </Title>
              </Tooltip>
            </Link>
          }
          description={
            <div className="product-description">
              {/* Brand and Category */}
              <div style={{ marginBottom: 8 }}>
                <Tag color="blue" style={{ fontSize: '11px' }}>{category}</Tag>
                {brand && <Text type="secondary" style={{ fontSize: 12 }}>{brand}</Text>}
              </div>

              {/* Rating */}
              <div style={{ marginBottom: 8 }}>
                <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />
                <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                  ({rating}/5)
                </Text>
              </div>

              {/* Price */}
              {renderPrice()}

              {/* Description */}
              <Tooltip title={description}>
                <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.4 }}>
                  {truncateText(description, 80)}
                </Text>
              </Tooltip>
            </div>
          }
        />
      </Card>
    </Badge.Ribbon>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
