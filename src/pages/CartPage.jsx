// pages/CartPage.jsx
import { Button, Card, Table, Space, Typography } from 'antd';
import  {useCart}  from '../hooks/useCart';
import { Link } from 'react-router-dom';
import { App as AntApp } from "antd";

const { Title, Text } = Typography;

const CartPage = () => {
  const { message } = AntApp.useApp();
  const {
    cart,
    totalItems,
    totalPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Link to={`/product/${record.id}`}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={record.image}
              alt={record.name}
              style={{ width: 50, height: 50, marginRight: 10 }}
            />
            <span>{text}</span>
          </div>
        </Link>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => updateQuantity(record.id, quantity - 1)}
          >
            -
          </Button>
          <span>{quantity}</span>
          <Button
            size="small"
            onClick={() => updateQuantity(record.id, quantity + 1)}
          >
            +
          </Button>
        </Space>
      ),
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => `$${(record.price * record.quantity).toFixed(2)}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          danger
          onClick={() => removeFromCart(record.id)}
        >
          Remove
        </Button>
      ),
    },
  ];

  const handleCheckout = () => {
    message.success('Order placed successfully!');
    clearCart();
  };

  return (
    <div className="cart-page">
      <Title level={2}>Your Shopping Cart</Title>
      
      {cart.length === 0 ? (
        <Card>
          <Text>Your cart is empty.</Text>
          <br />
          <Link to="/">
            <Button type="primary" style={{ marginTop: 10 }}>
              Continue Shopping
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={cart}
            rowKey="id"
            pagination={false}
          />
          
          <div className="cart-summary">
            <Card>
              <Title level={4}>Order Summary</Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Items ({totalItems}):</Text>
                  <Text>${totalPrice.toFixed(2)}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Total:</Text>
                  <Text strong>${totalPrice.toFixed(2)}</Text>
                </div>
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </Space>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;