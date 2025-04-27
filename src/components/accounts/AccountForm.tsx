import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { X } from 'lucide-react';

interface AccountFormProps {
  onClose: () => void;
  account?: {
    id: string;
    name: string;
    type: 'bank' | 'cash' | 'credit';
    initialBalance: number;
  };
}

const AccountForm: React.FC<AccountFormProps> = ({ onClose, account }) => {
  const { addAccount, updateAccount } = useData();
  
  const [formData, setFormData] = useState({
    name: account?.name || '',
    type: account?.type || 'bank',
    initialBalance: account?.initialBalance || 0,
  });
  
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.name.trim()) {
      setError('Account name is required');
      return;
    }
    
    try {
      if (account) {
        updateAccount({
          ...account,
          ...formData,
        });
      } else {
        addAccount({
          ...formData,
          currentBalance: formData.initialBalance,
          isArchived: false,
        });
      }
      onClose();
    } catch (err) {
      setError('Failed to save account');
      console.error('Account save error:', err);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {account ? 'Edit Account' : 'Add New Account'}
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
                Account Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                          rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
                          dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Main Bank Account"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Account Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  type: e.target.value as 'bank' | 'cash' | 'credit' 
                })}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                          rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
                          dark:bg-gray-700 dark:text-white"
              >
                <option value="bank">Bank Account</option>
                <option value="cash">Cash</option>
                <option value="credit">Credit Card</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Initial Balance
              </label>
              <input
                type="number"
                value={formData.initialBalance}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  initialBalance: parseFloat(e.target.value) || 0 
                })}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                          rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
                          dark:bg-gray-700 dark:text-white"
                step="0.01"
              />
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
              {account ? 'Update' : 'Add'} Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm