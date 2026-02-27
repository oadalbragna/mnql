import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private copyToClipboard = () => {
    const errorText = `
Error: ${this.state.error?.message}
Stack: ${this.state.error?.stack}
Component Stack: ${this.state.errorInfo?.componentStack}
    `;
    navigator.clipboard.writeText(errorText);
    alert("تم نسخ الخطأ بنجاح! قم بإرساله لي لحل المشكلة.");
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center font-sans" dir="rtl">
          <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[32px] max-w-2xl w-full shadow-2xl">
            <h1 className="text-3xl font-black mb-4 text-red-500">حدث خطأ في النظام ⚠️</h1>
            <p className="text-slate-400 mb-6 font-bold text-sm">توقف التطبيق عن العمل بسبب خطأ برجي. يمكنك نسخ تفاصيل الخطأ أدناه:</p>
            
            <div className="bg-black/50 p-6 rounded-2xl mb-6 overflow-auto max-h-[300px] border border-white/5">
              <code className="text-red-400 text-xs block whitespace-pre-wrap text-left" dir="ltr">
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </code>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={this.copyToClipboard}
                className="flex-1 bg-white text-slate-900 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all"
              >
                نسخ تفاصيل الخطأ
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-8 bg-slate-800 text-white py-4 rounded-2xl font-black hover:bg-slate-700 transition-all"
              >
                إعادة التحميل
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
