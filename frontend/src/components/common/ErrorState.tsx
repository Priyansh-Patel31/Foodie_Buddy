import { AlertCircle, RefreshCw, FilterX, SearchX, ShoppingBag } from 'lucide-react';

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
  icon?: 'error' | 'empty' | 'search' | 'cart';
}

export default function ErrorState({ title, message, onRetry, icon = 'error' }: ErrorStateProps) {
  const IconComponent = {
    error: AlertCircle,
    empty: FilterX,
    search: SearchX,
    cart: ShoppingBag
  }[icon];

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
        <IconComponent className="w-10 h-10 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-6">{message}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
