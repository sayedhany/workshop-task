// components/Layout/ErrorBoundary.jsx - Error boundary for better error handling
import React from 'react';
import { Result, Button } from 'antd';
import { ExceptionOutlined } from '@ant-design/icons';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="500"
          title="Something went wrong"
          subTitle="We're sorry, but something unexpected happened. Please try refreshing the page."
          icon={<ExceptionOutlined />}
          extra={[
            <Button type="primary" key="reload" onClick={this.handleReload}>
              Reload Page
            </Button>,
            <Button key="reset" onClick={this.handleReset}>
              Try Again
            </Button>
          ]}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
