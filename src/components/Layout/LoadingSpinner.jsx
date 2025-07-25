// components/Layout/LoadingSpinner.jsx - Reusable loading component
import React from 'react';
import { Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

/**
 * Enhanced loading spinner component
 */
const LoadingSpinner = ({ 
  size = 'large', 
  message = 'Loading...', 
  tip = null,
  style = {},
  centered = true 
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 24 : 16 }} spin />;
  
  const defaultStyle = centered ? {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    ...style
  } : style;

  return (
    <div style={defaultStyle}>
      <Spin 
        indicator={antIcon} 
        size={size}
        tip={tip}
      />
      {message && (
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">{message}</Text>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
