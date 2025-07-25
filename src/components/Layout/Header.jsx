// components/Layout/Header.jsx - Enhanced responsive header with advanced features
import React, { memo, useState, useEffect } from 'react';
import { 
  Layout, 
  Badge, 
  Space, 
  Typography, 
  Tooltip, 
  Button, 
  Drawer,
  Menu,
  Avatar,
  Dropdown,
  Input,
  Switch,
  Divider
} from 'antd';
import { 
  ShoppingCartOutlined, 
  HomeOutlined, 
  ShopOutlined,
  HeartOutlined,
  UserOutlined,
  MenuOutlined,
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/helpers.js';

const { Header } = Layout;
const { Text, Title } = Typography;
const { Search } = Input;

/**
 * Enhanced AppHeader component with responsive design, mobile menu, and advanced features
 */
const AppHeader = memo(() => {
  const { totalItems, totalPrice } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State management
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuVisible(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get current page for active menu highlighting
  const getCurrentPage = () => {
    switch (location.pathname) {
      case '/':
        return 'home';
      case '/cart':
        return 'cart';
      default:
        if (location.pathname.startsWith('/product/')) return 'home';
        return 'home';
    }
  };

  // Mobile search handler
  const handleMobileSearch = (value) => {
    if (value.trim()) {
      navigate(`/?search=${encodeURIComponent(value)}`);
      setSearchVisible(false);
    }
  };

  // User menu items
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      disabled: true
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: 'My Orders',
      disabled: true
    },
    {
      key: 'wishlist',
      icon: <HeartOutlined />,
      label: 'Wishlist',
      disabled: true
    },
    {
      type: 'divider'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      disabled: true
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      disabled: true
    }
  ];

  // Mobile menu items
  const mobileMenuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/" onClick={() => setMobileMenuVisible(false)}>Home</Link>
    },
    {
      key: 'cart',
      icon: <ShoppingCartOutlined />,
      label: (
        <Link to="/cart" onClick={() => setMobileMenuVisible(false)}>
          Cart ({totalItems})
        </Link>
      ),
      badge: totalItems
    },
    {
      type: 'divider'
    },
    {
      key: 'wishlist',
      icon: <HeartOutlined />,
      label: 'Wishlist',
      disabled: true
    },
    {
      key: 'account',
      icon: <UserOutlined />,
      label: 'My Account',
      disabled: true
    }
  ];

  // Logo component
  const Logo = memo(() => (
    <Link 
      to="/" 
      style={{ color: 'inherit', textDecoration: 'none' }}
      aria-label="ShopApp Home"
    >
      <Space align="center" size="small">
        <ShopOutlined 
          style={{ 
            fontSize: isMobile ? '20px' : '24px', 
            color: '#1890ff' 
          }} 
        />
        {!isMobile && (
          <div>
            <Text 
              strong 
              style={{ 
                color: 'white', 
                fontSize: '18px',
                lineHeight: 1.2
              }}
            >
              ShopApp
            </Text>
          </div>
        )}
      </Space>
    </Link>
  ));

  // Cart summary component
  const CartSummary = memo(() => (
    <div style={{ padding: '8px 0' }}>
      <Text type="secondary" style={{ fontSize: '12px' }}>
        {totalItems} {totalItems === 1 ? 'item' : 'items'} • {formatCurrency(totalPrice)}
      </Text>
    </div>
  ));

  // Desktop navigation
  const DesktopNav = memo(() => (
    <Space size="large" align="center">
      {/* Search */}
      <Search
        placeholder="Search products..."
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        onSearch={handleMobileSearch}
        style={{ width: 300 }}
        className="header-search"
      />

      {/* Navigation Links */}
      <Space size="large">
        <Link to="/">
          <Button 
            type={getCurrentPage() === 'home' ? 'primary' : 'text'}
            icon={<HomeOutlined />}
            style={{ 
              color: getCurrentPage() === 'home' ? undefined : 'white',
              borderColor: getCurrentPage() === 'home' ? '#1890ff' : 'transparent'
            }}
          >
            Products
          </Button>
        </Link>
      </Space>

      {/* Right Actions */}
      <Space size="middle">
        {/* Theme Toggle */}
        <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <Button
            type="text"
            icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ color: 'white' }}
            aria-label="Toggle theme"
          />
        </Tooltip>

        {/* Language */}
        <Tooltip title="Language (EN)">
          <Button
            type="text"
            icon={<GlobalOutlined />}
            style={{ color: 'white' }}
            disabled
            aria-label="Change language"
          />
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <Badge count={0} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ color: 'white' }}
              disabled
              aria-label="View notifications"
            />
          </Badge>
        </Tooltip>

        {/* Wishlist */}
        <Tooltip title="Wishlist">
          <Badge count={0} size="small">
            <Button
              type="text"
              icon={<HeartOutlined />}
              style={{ color: 'white' }}
              disabled
              aria-label="View wishlist"
            />
          </Badge>
        </Tooltip>

        {/* Cart */}
        <Tooltip 
          title={
            <div>
              <div>Shopping Cart</div>
              <CartSummary />
            </div>
          }
        >
          <Link to="/cart">
            <Badge count={totalItems} size="small" offset={[8, -2]}>
              <Button
                type="text"
                icon={<ShoppingCartOutlined style={{ fontSize: '18px' }} />}
                style={{ 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center',
                  height: '40px'
                }}
                aria-label={`Shopping cart with ${totalItems} items`}
              >
                <span style={{ marginLeft: 8 }}>
                  Cart
                </span>
              </Button>
            </Badge>
          </Link>
        </Tooltip>

        {/* User Account */}
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button
            type="text"
            style={{ 
              color: 'white',
              padding: '4px 8px',
              height: '40px'
            }}
            aria-label="User account menu"
          >
            <Space>
              <Avatar 
                size="small" 
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff' }}
              />
              <Text style={{ color: 'white' }}>Guest</Text>
            </Space>
          </Button>
        </Dropdown>
      </Space>
    </Space>
  ));

  // Mobile navigation
  const MobileNav = memo(() => (
    <Space size="middle" align="center">
      {/* Search Toggle */}
      <Button
        type="text"
        icon={<SearchOutlined />}
        onClick={() => setSearchVisible(!searchVisible)}
        style={{ color: 'white' }}
        aria-label="Toggle search"
      />

      {/* Cart */}
      <Link to="/cart">
        <Badge count={totalItems} size="small" offset={[8, -2]}>
          <Button
            type="text"
            icon={<ShoppingCartOutlined style={{ fontSize: '18px' }} />}
            style={{ color: 'white' }}
            aria-label={`Shopping cart with ${totalItems} items`}
          />
        </Badge>
      </Link>

      {/* Mobile Menu Toggle */}
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setMobileMenuVisible(true)}
        style={{ color: 'white' }}
        aria-label="Open menu"
      />
    </Space>
  ));

  return (
    <>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%',
          padding: isMobile ? '0 16px' : '0 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          backgroundColor: '#001529',
          borderBottom: '1px solid #003a8c'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%',
            height: '64px'
          }}
        >
          {/* Logo */}
          <Logo />

          {/* Navigation */}
          {isMobile ? <MobileNav /> : <DesktopNav />}
        </div>

        {/* Mobile Search Bar */}
        {isMobile && searchVisible && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#001529',
              padding: '12px 16px',
              borderBottom: '1px solid #003a8c',
              zIndex: 999
            }}
          >
            <Search
              placeholder="Search products..."
              allowClear
              enterButton
              size="large"
              onSearch={handleMobileSearch}
              autoFocus
              style={{ width: '100%' }}
            />
          </div>
        )}
      </Header>

      {/* Mobile Drawer Menu */}
      <Drawer
        title={
          <Space>
            <ShopOutlined style={{ color: '#1890ff' }} />
            <Text strong>ShopApp Menu</Text>
          </Space>
        }
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
        styles={{
          body: { padding: 0 }
        }}
      >
        <div style={{ padding: '16px' }}>
          {/* Cart Summary in Mobile Menu */}
          {totalItems > 0 && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <Title level={5} style={{ margin: 0 }}>
                  Cart Summary
                </Title>
                <Text type="secondary">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} • {formatCurrency(totalPrice)}
                </Text>
              </div>
              <Divider />
            </>
          )}

          {/* Theme Toggle */}
          <div style={{ marginBottom: '16px' }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Space>
                {isDarkMode ? <MoonOutlined /> : <SunOutlined />}
                <Text>Dark Mode</Text>
              </Space>
              <Switch
                checked={isDarkMode}
                onChange={setIsDarkMode}
                size="small"
              />
            </Space>
          </div>
          <Divider />
        </div>

        {/* Menu Items */}
        <Menu
          mode="inline"
          selectedKeys={[getCurrentPage()]}
          items={mobileMenuItems}
          style={{ border: 'none' }}
        />
      </Drawer>
    </>
  );
});

AppHeader.displayName = 'AppHeader';

export default AppHeader;