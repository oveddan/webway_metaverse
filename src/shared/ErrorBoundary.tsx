import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // You can also log the error to an error reporting service
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    // @ts-ignore
    return this.props.children;
  }
}
