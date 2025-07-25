// pages/CartPage.jsx - Enhanced shopping cart with better UX
import React, { memo } from 'react';
import { 
  Button, 
  Card, 
  Table, 
  Space, 
  Typography, 
  Empty, 
  Row, 
  Col, 
  InputNumber,
  Image,
  Tag,
  Tooltip,
  Divider,
  Alert
} from 'antd';
import { 
  DeleteOutlined, 
  ShoppingCartOutlined, 
  CreditCardOutlined,
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons';
import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers.js';

const { Title, Text } = Typography;

/**
 * Enhanced CartPage component with better UX and features
 */
const CartPage = memo(() => {
  const {
    cart,
    totalItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    incrementQuantity,
    decrementQuantity,
    getCartSummary
  } = useCart();

  const cartSummary = getCartSummary();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    // Here you would typically integrate with a payment processor
    clearCart();
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
      render: (text, record) => (
        <Link to={`/product/${record.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          <Space>
            <Image
              src={record.image}
              alt={record.name}
              width={60}
              height={60}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              preview={false}
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/60x60?text=${encodeURIComponent(record.name.charAt(0))}`;
              }}
            />
            <div>
              <Text strong style={{ display: 'block' }}>{text}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                SKU: {record.sku || `PROD-${record.id}`}
              </Text>
              {record.discount > 0 && (
                <Tag color="red" size="small">-{record.discount}%</Tag>
              )}
            </div>
          </Space>
        </Link>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '15%',
      render: (price, record) => (
        <div>
          {record.discount > 0 ? (
            <>
              <Text delete type="secondary" style={{ fontSize: 12 }}>
                {formatCurrency(price)}
              </Text>
              <br />
              <Text strong style={{ color: '#f5222d' }}>
                {formatCurrency(price * (1 - record.discount / 100))}
              </Text>
            </>
          ) : (
            <Text strong>{formatCurrency(price)}</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '20%',
      render: (quantity, record) => (
        <Space.Compact>
          <Button
            size="small"
            icon={<MinusOutlined />}
            onClick={() => decrementQuantity(record.id)}
            disabled={quantity <= 1}
          />
          <InputNumber
            min={1}
            max={record.stock}
            value={quantity}
            onChange={(value) => handleQuantityChange(record.id, value)}
            style={{ width: 60, textAlign: 'center' }}
            size="small"
          />
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => incrementQuantity(record.id)}
            disabled={quantity >= record.stock}
          />
        </Space.Compact>
      ),
    },
    {
      title: 'Total',
      key: 'total',
      width: '15%',
      render: (_, record) => {
        const itemPrice = record.discount > 0 
          ? record.price * (1 - record.discount / 100)
          : record.price;
        return (
          <Text strong style={{ fontSize: 16 }}>
            {formatCurrency(itemPrice * record.quantity)}
          </Text>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (_, record) => (
        <Tooltip title="Remove from cart">
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => removeFromCart(record.id)}
            size="small"
          />
        </Tooltip>
      ),
    },
  ];

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="cart-page" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <Card>
          <Empty
            image={<ShoppingCartOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
            imageStyle={{ height: 80 }}
            description={
              <div>
                <Title level={4}>Your cart is empty</Title>
                <Text type="secondary">
                  Looks like you haven&apos;t added anything to your cart yet.
                </Text>
              </div>
            }
          >
            <Link to="/">
              <Button type="primary" size="large" icon={<ShoppingCartOutlined />}>
                Start Shopping
              </Button>
            </Link>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <div className="cart-page" style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        <ShoppingCartOutlined /> Your Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
      </Title>

      <Row gutter={[24, 24]}>
        {/* Cart Items */}
        <Col xs={24} lg={16}>
          <Card>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong>Cart Items</Text>
              <Button
                type="link"
                danger
                onClick={clearCart}
                size="small"
              >
                Clear All
              </Button>
            </div>
            
            <Table
              columns={columns}
              dataSource={cart}
              rowKey="id"
              pagination={false}
              scroll={{ x: 700 }}
              size="middle"
            />
          </Card>
        </Col>

        {/* Order Summary */}
        <Col xs={24} lg={8}>
          <Card title="Order Summary" className="cart-summary">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {/* Pricing Breakdown */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Subtotal ({totalItems} items):</Text>
                  <Text>{formatCurrency(cartSummary.subtotal)}</Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Tax (10%):</Text>
                  <Text>{formatCurrency(cartSummary.tax)}</Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Shipping:</Text>
                  <Text style={{ color: cartSummary.shipping === 0 ? 'green' : 'inherit' }}>
                    {cartSummary.shipping === 0 ? 'FREE' : formatCurrency(cartSummary.shipping)}
                  </Text>
                </div>
                
                {cartSummary.shipping === 0 && cartSummary.subtotal < 50 && (
                  <Alert
                    message="Free shipping on orders over $50!"
                    type="info"
                    size="small"
                    style={{ margin: '8px 0' }}
                  />
                )}
              </div>

              <Divider style={{ margin: '12px 0' }} />

              {/* Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ margin: 0 }}>Total:</Title>
                <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                  {formatCurrency(cartSummary.total)}
                </Title>
              </div>

              {/* Action Buttons */}
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<CreditCardOutlined />}
                  onClick={handleCheckout}
                  block
                  style={{ height: 48 }}
                >
                  Proceed to Checkout
                </Button>
                
                <Link to="/">
                  <Button size="large" block>
                    Continue Shopping
                  </Button>
                </Link>
              </Space>

              {/* Security Notice */}
              <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f6f6f6', borderRadius: 6 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  🔒 Your payment information is secured with 256-bit SSL encryption
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
});

CartPage.displayName = 'CartPage';

export default CartPage;