import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { formatDate } from '../../utils/formatters';
import { Transaction, Category, Account } from '../../types';
import { ArrowDown, ArrowUp, Edit, Trash2 } from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
  category: Category | undefined;
  account: Account | undefined;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  category,
  account,
  onEdit,
  onDelete
}) => {
  // Default colors if category not found
  const categoryColor = category?.color || (
    transaction.type === 'income' ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)'
  );
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-3 
                  border-l-4 transition-all hover:shadow-md"
         style={{ borderLeftColor: categoryColor }}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="rounded-full p-2 flex-shrink-0" 
               style={{ backgroundColor: `${categoryColor}20` }}>
            {transaction.type === 'income' ? (
              <ArrowUp size={18} style={{ color: categoryColor }} />
            ) : (
              <ArrowDown size={18} style={{ color: categoryColor }} />
            )}
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {category?.name || (transaction.type === 'income' ? 'Income' : 'Expense')}
            </h4>
            <div className="flex flex-col sm:flex-row sm:items-center text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">
                {account?.name || 'Unknown Account'}
              </span>
              <span className="hidden sm:block text-gray-400 dark:text-gray-500 mx-2">•</span>
              <span className="text-gray-500 dark:text-gray-400">
                {formatDate(transaction.date, 'short')}
              </span>
            </div>
            
            {transaction.notes && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {transaction.notes}
              </p>
            )}
            
            {transaction.tags && transaction.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {transaction.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                              bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <span className={`font-semibold ${
            transaction.type === 'income' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {transaction.type === 'income' ? '+' : '-'} 
            {formatCurrency(transaction.amount)}
          </span>
          
          {onEdit && onDelete && (
            <div className="flex mt-3 space-x-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(transaction.id);
                }}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                          rounded focus:outline-none"
                aria-label="Edit transaction"
              >
                <Edit size={16} />
              </button>
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(transaction.id);
                }}
                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400
                          rounded focus:outline-none"
                aria-label="Delete transaction"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;