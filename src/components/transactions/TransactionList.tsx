import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import TransactionCard from './TransactionCard';
import { ChevronRight } from 'lucide-react';
import { Period } from '../../types';
import { isWithinPeriod } from '../../utils/dateUtils';

interface TransactionListProps {
  limit?: number;
  showViewAll?: boolean;
  filterByAccount?: string;
  filterByCategory?: string;
  filterByType?: 'income' | 'expense' | 'transfer';
  readOnly?: boolean;
  onEdit?: (id: string) => void;
  period?: Period;
}

const TransactionList: React.FC<TransactionListProps> = ({
  limit,
  showViewAll = false,
  filterByAccount,
  filterByCategory,
  filterByType,
  readOnly = false,
  onEdit,
  period
}) => {
  const { transactions, categories, accounts, deleteTransaction } = useData();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Filter and sort transactions (most recent first)
  const filteredTransactions = transactions
    .filter(transaction => {
      // Apply filters if they exist
      if (filterByAccount && transaction.accountId !== filterByAccount) return false;
      if (filterByCategory && transaction.categoryId !== filterByCategory) return false;
      if (filterByType && transaction.type !== filterByType) return false;
      if (period && !isWithinPeriod(transaction.date, period)) return false;
      return true;
    })
    .sort((a, b) => b.date - a.date); // Most recent first
  
  // Apply limit if specified
  const displayedTransactions = limit 
    ? filteredTransactions.slice(0, limit) 
    : filteredTransactions;
  
  const handleEdit = (id: string) => {
    if (onEdit) {
      onEdit(id);
    }
  };
  
  const handleDelete = (id: string) => {
    setShowDeleteConfirm(id);
  };
  
  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteTransaction(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  return (
    <div>
      {displayedTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No transactions found</p>
          <p className="text-sm mt-1">Add your first transaction to get started</p>
        </div>
      ) : (
        <>
          {displayedTransactions.map(transaction => {
            const category = categories.find(c => c.id === transaction.categoryId);
            const account = accounts.find(a => a.id === transaction.accountId);
            
            return (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                category={category}
                account={account}
                onEdit={readOnly ? undefined : handleEdit}
                onDelete={readOnly ? undefined : handleDelete}
              />
            );
          })}
        </>
      )}
      
      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Delete Transaction
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                          bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 
                          dark:hover:bg-gray-600 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 
                          rounded-md hover:bg-red-700 focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* View all link */}
      {showViewAll && filteredTransactions.length > (limit || 0) && (
        <div className="mt-3 text-center">
          <button 
            className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 
                      hover:text-blue-800 dark:hover:text-blue-300"
          >
            View all transactions
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;