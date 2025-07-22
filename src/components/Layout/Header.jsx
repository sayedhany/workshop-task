// components/Layout/Header.jsx
import React from 'react';
import { Layout, Menu, Badge, Space } from 'antd';
import { ShoppingCartOutlined, HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {useCart}  from '../../hooks/useCart';

const { Header } = Layout;

const AppHeader = () => {
  const { totalItems } = useCart();
  console.log(totalItems);
  

  return (
    <Header style={{ position: 'sticky', top: 0, zIndex: 1, maxWidth: '100vw' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="logo" style={{ color: 'white', marginRight: '24px' }}>
          ShopApp
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ flex: 1 }}
          defaultSelectedKeys={['home']}
          items={[
            {
              key: 'home',
              icon: <HomeOutlined />,
              label: <Link to="/">Home</Link>,
            },
            {
              key: 'cart',
              icon: (
                <Badge count={totalItems} size="small">
                  <ShoppingCartOutlined style={{ fontSize: '18px' }} />
                </Badge>
              ),
              label: <Link to="/cart">Cart</Link>,
              style: { marginLeft: 'auto' },
            },
          ]}
        />
      </div>
    </Header>
  );
};

export default AppHeader;