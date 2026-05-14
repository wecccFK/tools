/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppLayout } from './components/AppLayout';
import { LanguageProvider } from './i18n/LanguageContext';
import { BrowserRouter } from 'react-router-dom';
import React, { Component, ErrorInfo, ReactNode } from 'react';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-white">
          <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mb-8">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-black mb-4 uppercase tracking-tighter italic">哎呀，出错了</h1>
          <p className="text-slate-400 max-w-sm mb-4">很抱歉，应用遇到了意料之外的问题。</p>
          {this.state.error && (
            <p className="text-slate-500 text-xs max-w-md mb-8 font-mono break-all">
              {this.state.error.message}
            </p>
          )}
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-blue-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-500 transition-colors"
          >
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <LanguageProvider>
          <AppLayout />
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
