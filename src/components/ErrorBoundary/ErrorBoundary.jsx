import React, { Component } from 'react';
import { Alert } from 'antd';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Alert
          message="Something went wrong"
          description={`Error: ${this.state.error && this.state.error.toString()}`}
          type="error"
          showIcon
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
