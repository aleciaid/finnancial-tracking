import React, { useState } from 'react';
import { Search, Filter, Plus, Calendar } from 'lucide-react';
import TransactionList from './TransactionList';
import { useData } from '../../context/DataContext';
import { getCurrentMonth, getLastMonths } from '../../utils/dateUtils';
import FloatingActionButton from '../ui/FloatingActionButton';
import TransactionForm from './TransactionForm';

const TransactionsView: React.FC = () => {
  const { categories, accounts, transactions } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'income' | 'expense' | 'transfer' | ''>('');
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentMonth());
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [customDateRange, setCustomDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  const handleClearFilters = () => {
    setSelectedAccount('');
    setSelectedCategory('');
    setSelectedType('');
    setSearchTerm('');
    setSelectedPeriod(getCurrentMonth());
  };
  
  const periods = [
    { label: 'This Month', value: 'current' },
    { label: 'Last Month', value: 'last' },
    { label: 'Last 3 Months', value: '3months' },
    { label: 'Last 6 Months', value: '6months' },
    { label: 'Custom Range', value: 'custom' }
  ];
  
  const handlePeriodChange = (value: string) => {
    if (value === 'custom') {
      setSelectedPeriod({
        startDate: new Date(customDateRange.start).getTime(),
        endDate: new Date(customDateRange.end).getTime(),
        label: 'Custom Range'
      });
    } else if (value === 'current') {
      setSelectedPeriod(getCurrentMonth());
    } else {
      const monthCount = value === 'last' ? 1 : 
                        value === '3months' ? 3 : 6;
      setSelectedPeriod(getLastMonths(monthCount)[monthCount - 1]);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and track your financial activities
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 
                        rounded-md shadow-sm placeholder-gray-400 
                        focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                        dark:bg-gray-700 dark:text-white"
              placeholder="Search transactions..."
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 
                      rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 
                      bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter size={18} className="mr-1.5" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Account
              </label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                          rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                          dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Accounts</option>
                {accounts
                  .filter(account => !account.isArchived)
                  .map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                          rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                          dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Categories</option>
                <optgroup label="Income">
                  {categories
                    .filter(category => category.type === 'income' && !category.isArchived)
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Expense">
                  {categories
                    .filter(category => category.type === 'expense' && !category.isArchived)
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                          rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                          dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Period
              </label>
              <select
                value={selectedPeriod === getCurrentMonth() ? 'current' : 'custom'}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                          rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                          dark:bg-gray-700 dark:text-white"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {selectedPeriod.label === 'Custom Range' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => {
                    setCustomDateRange(prev => ({ ...prev, start: e.target.value }));
                    handlePeriodChange('custom');
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                            rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                            dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => {
                    setCustomDateRange(prev => ({ ...prev, end: e.target.value }));
                    handlePeriodChange('custom');
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                            rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                            dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClearFilters}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 
                        rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 
                        bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 
                        focus:outline-none"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Transactions List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
        <TransactionList 
          onEdit={(id) => {
            const transactionToEdit = transactions.find(tx => tx.id === id);
            if (transactionToEdit) {
              setEditTransaction(transactionToEdit);
            }
          }}
          period={selectedPeriod}
          filterByAccount={selectedAccount}
          filterByCategory={selectedCategory}
          filterByType={selectedType as any}
        />
      </div>
      
      {/* Floating Action Button */}
      <FloatingActionButton />
      
      {/* Edit Transaction Form */}
      {editTransaction && (
        <TransactionForm
          type={editTransaction.type}
          transaction={editTransaction}
          onClose={() => setEditTransaction(null)}
        />
      )}
    </div>
  );
};

export default TransactionsView;