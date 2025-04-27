import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { X } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';

interface TransactionFormProps {
  onClose: () => void;
  type: 'income' | 'expense';
  transaction?: {
    id: string;
    amount: number;
    categoryId: string;
    accountId: string;
    date: number;
    notes?: string;
    tags: string[];
  };
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  onClose, 
  type,
  transaction 
}) => {
  const { addTransaction, updateTransaction, categories, accounts } = useData();
  
  const [formData, setFormData] = useState({
    amount: transaction ? transaction.amount.toString() : '',
    categoryId: transaction?.categoryId || '',
    accountId: transaction?.accountId || '',
    date: transaction?.date || new Date().setHours(0, 0, 0, 0),
    notes: transaction?.notes || '',
    tags: transaction?.tags || [],
    newTag: ''
  });
  
  const [error, setError] = useState<string | null>(null);
  
  const filteredCategories = categories.filter(
    category => category.type === type && !category.isArchived
  );
  
  const activeAccounts = accounts.filter(account => !account.isArchived);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const amount = parseFloat(formData.amount);
    
    if (!amount || amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    
    if (!formData.categoryId) {
      setError('Please select a category');
      return;
    }
    
    if (!formData.accountId) {
      setError('Please select an account');
      return;
    }
    
    // For expenses, check if selected account has sufficient balance
    if (type === 'expense') {
      const selectedAccount = accounts.find(acc => acc.id === formData.accountId);
      if (!selectedAccount) {
        setError('Selected account not found');
        return;
      }
      if (selectedAccount.currentBalance < amount) {
        setError(`Insufficient balance in ${selectedAccount.name}. Available: ${formatCurrency(selectedAccount.currentBalance)}`);
        return;
      }
    }
    
    try {
      const transactionData = {
        amount,
        type: type,
        categoryId: formData.categoryId,
        accountId: formData.accountId,
        date: formData.date,
        notes: formData.notes,
        tags: formData.tags,
        isRecurring: false
      };
      
      if (transaction) {
        updateTransaction({
          ...transaction,
          ...transactionData,
          type: type // Ensure type is preserved when editing
        });
      } else {
        addTransaction(transactionData);
      }
      onClose();
    } catch (err) {
      setError('Failed to save transaction');
      console.error('Transaction save error:', err);
    }
  };
  
  const handleAddTag = () => {
    if (formData.newTag.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.newTag.trim()],
        newTag: ''
      });
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {transaction ? 'Edit' : 'Add'} {type === 'income' ? 'Income' : 'Expense'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount
                {type === 'expense' && formData.accountId && (
                  <span className="ml-2 text-xs text-gray-500">
                    Available: {formatCurrency(accounts.find(acc => acc.id === formData.accountId)?.currentBalance || 0)}
                  </span>
                )}
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  amount: e.target.value
                })}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                          rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
                          dark:bg-gray-700 dark:text-white"
                step="0.01"
                min="0"
                placeholder="Enter amount"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                          rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
                          dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a category</option>
                {filteredCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Account
              </label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                          rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
                          dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select an account</option>
                {activeAccounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={new Date(formData.date).toISOString().split('T')[0]}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  date: new Date(e.target.value).setHours(0, 0, 0, 0)
                })}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                          rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
                          dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                          rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
                          dark:bg-gray-700 dark:text-white"
                rows={3}
                placeholder="Add any additional notes..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <span 
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 
                                dark:hover:text-blue-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.newTag}
                  onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="block flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 
                            rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
                            dark:bg-gray-700 dark:text-white"
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                            rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                        bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 
                        dark:hover:bg-gray-600 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                        rounded-md hover:bg-blue-700 focus:outline-none"
            >
              {transaction ? 'Update' : 'Add'} {type === 'income' ? 'Income' : 'Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;