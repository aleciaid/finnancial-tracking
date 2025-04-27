import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Account, 
  Transaction, 
  Category, 
  BalanceHistory,
  STORAGE_KEYS 
} from '../types';
import { storageService } from '../utils/storage';
import { useAuth } from './AuthContext';

// Default categories
const DEFAULT_INCOME_CATEGORIES: Category[] = [
  {
    id: 'income-salary',
    name: 'Salary',
    type: 'income',
    color: '#10B981', // Green
    isDefault: true,
    isArchived: false
  },
  {
    id: 'income-freelance',
    name: 'Freelance',
    type: 'income',
    color: '#3B82F6', // Blue
    isDefault: true,
    isArchived: false
  },
  {
    id: 'income-investments',
    name: 'Investments',
    type: 'income',
    color: '#8B5CF6', // Purple
    isDefault: true,
    isArchived: false
  },
  {
    id: 'income-other',
    name: 'Other Income',
    type: 'income',
    color: '#F59E0B', // Yellow
    isDefault: true,
    isArchived: false
  }
];

const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  {
    id: 'expense-housing',
    name: 'Housing',
    type: 'expense',
    color: '#EF4444', // Red
    isDefault: true,
    isArchived: false
  },
  {
    id: 'expense-food',
    name: 'Food & Groceries',
    type: 'expense',
    color: '#F59E0B', // Yellow
    isDefault: true,
    isArchived: false
  },
  {
    id: 'expense-transport',
    name: 'Transportation',
    type: 'expense',
    color: '#3B82F6', // Blue
    isDefault: true,
    isArchived: false
  },
  {
    id: 'expense-utilities',
    name: 'Utilities',
    type: 'expense',
    color: '#10B981', // Green
    isDefault: true,
    isArchived: false
  },
  {
    id: 'expense-entertainment',
    name: 'Entertainment',
    type: 'expense',
    color: '#8B5CF6', // Purple
    isDefault: true,
    isArchived: false
  },
  {
    id: 'expense-health',
    name: 'Health & Medical',
    type: 'expense',
    color: '#EC4899', // Pink
    isDefault: true,
    isArchived: false
  },
  {
    id: 'expense-other',
    name: 'Other Expenses',
    type: 'expense',
    color: '#6B7280', // Gray
    isDefault: true,
    isArchived: false
  }
];

interface DataContextType {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  balanceHistory: BalanceHistory[];
  
  // Account actions
  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (accountId: string) => boolean;
  archiveAccount: (accountId: string) => void;
  
  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (transactionId: string) => void;
  
  // Category actions
  addCategory: (category: Omit<Category, 'id' | 'isDefault'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => boolean;
  archiveCategory: (categoryId: string) => void;
  
  // Data management
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  resetData: () => void;
  
  // Loading state
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data from localStorage when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Initialize default data if none exists
  const loadData = () => {
    setIsLoading(true);
    
    // Load or initialize accounts
    const storedAccounts = storageService.getItem<Account[]>(STORAGE_KEYS.ACCOUNTS, []);
    setAccounts(storedAccounts);
    
    // Load or initialize transactions
    const storedTransactions = storageService.getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    setTransactions(storedTransactions);
    
    // Load or initialize categories, or use defaults if none exist
    const storedCategories = storageService.getItem<Category[]>(
      STORAGE_KEYS.CATEGORIES, 
      [...DEFAULT_INCOME_CATEGORIES, ...DEFAULT_EXPENSE_CATEGORIES]
    );
    
    // If no stored categories, save the defaults
    if (storedCategories.length === 0) {
      const defaultCategories = [...DEFAULT_INCOME_CATEGORIES, ...DEFAULT_EXPENSE_CATEGORIES];
      setCategories(defaultCategories);
      storageService.setItem(STORAGE_KEYS.CATEGORIES, defaultCategories);
    } else {
      setCategories(storedCategories);
    }
    
    // Load or initialize balance history
    const storedBalanceHistory = storageService.getItem<BalanceHistory[]>(
      STORAGE_KEYS.BALANCE_HISTORY,
      []
    );
    setBalanceHistory(storedBalanceHistory);
    
    setIsLoading(false);
  };

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      storageService.setItem(STORAGE_KEYS.ACCOUNTS, accounts);
      storageService.setItem(STORAGE_KEYS.TRANSACTIONS, transactions);
      storageService.setItem(STORAGE_KEYS.CATEGORIES, categories);
      storageService.setItem(STORAGE_KEYS.BALANCE_HISTORY, balanceHistory);
    }
  }, [isAuthenticated, accounts, transactions, categories, balanceHistory, isLoading]);

  // Update balance history when transactions change
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      updateBalanceHistory();
    }
  }, [transactions, accounts, isLoading, isAuthenticated]);

  // Account CRUD operations
  const addAccount = (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAccount: Account = {
      ...accountData,
      id: `account-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    setAccounts(prev => [...prev, newAccount]);
    
    // Add initial balance history entry
    const historyEntry: BalanceHistory = {
      accountId: newAccount.id,
      date: Date.now(),
      balance: newAccount.initialBalance
    };
    
    setBalanceHistory(prev => [...prev, historyEntry]);
  };

  const updateAccount = (updatedAccount: Account) => {
    setAccounts(prev => 
      prev.map(account => 
        account.id === updatedAccount.id 
          ? { ...updatedAccount, updatedAt: Date.now() } 
          : account
      )
    );
  };

  const deleteAccount = (accountId: string): boolean => {
    // Check if there are transactions for this account
    const hasTransactions = transactions.some(
      tx => tx.accountId === accountId || tx.toAccountId === accountId
    );
    
    if (hasTransactions) {
      return false; // Can't delete account with transactions
    }
    
    setAccounts(prev => prev.filter(account => account.id !== accountId));
    setBalanceHistory(prev => prev.filter(history => history.accountId !== accountId));
    
    return true;
  };

  const archiveAccount = (accountId: string) => {
    setAccounts(prev => 
      prev.map(account => 
        account.id === accountId 
          ? { ...account, isArchived: true, updatedAt: Date.now() } 
          : account
      )
    );
  };

  // Transaction CRUD operations
  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    // For expenses, verify sufficient balance in the selected account
    if (transactionData.type === 'expense') {
      const selectedAccount = accounts.find(acc => acc.id === transactionData.accountId);
      if (!selectedAccount) {
        throw new Error('Selected account not found');
      }
      if (selectedAccount.currentBalance < transactionData.amount) {
        throw new Error(`Insufficient balance in ${selectedAccount.name}`);
      }
    }
    
    const newTransaction: Transaction = {
      ...transactionData,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    
    // Update account balances
    updateAccountBalances(newTransaction);
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    // Find the old transaction to reverse its effects
    const oldTransaction = transactions.find(tx => tx.id === updatedTransaction.id);
    
    if (!oldTransaction) return;
    
    // Reverse the old transaction's effect on account balances
    reverseTransaction(oldTransaction);
    
    // Apply the updated transaction
    setTransactions(prev => 
      prev.map(tx => 
        tx.id === updatedTransaction.id 
          ? { ...updatedTransaction, updatedAt: Date.now() } 
          : tx
      )
    );
    
    // Update account balances with the new transaction
    updateAccountBalances(updatedTransaction);
  };

  const deleteTransaction = (transactionId: string) => {
    // Find the transaction to delete
    const transactionToDelete = transactions.find(tx => tx.id === transactionId);
    
    if (!transactionToDelete) return;
    
    // Reverse the transaction's effect on account balances
    reverseTransaction(transactionToDelete);
    
    // Remove the transaction
    setTransactions(prev => prev.filter(tx => tx.id !== transactionId));
  };

  // Helper function to update account balances when adding a transaction
  const updateAccountBalances = (transaction: Transaction) => {
    setAccounts(prev => {
      const updatedAccounts = [...prev];
      const accountIndex = updatedAccounts.findIndex(acc => acc.id === transaction.accountId);
      
      if (accountIndex === -1) return prev;
      
      const account = { ...updatedAccounts[accountIndex] };
      
      // For expenses, verify sufficient balance
      if (transaction.type === 'expense' && account.currentBalance < transaction.amount) {
        throw new Error(`Insufficient balance in ${account.name}`);
      }
      
      // Update balance based on transaction type
      if (transaction.type === 'income') {
        account.currentBalance += transaction.amount;
      } else if (transaction.type === 'expense') {
        account.currentBalance -= transaction.amount;
      } else if (transaction.type === 'transfer' && transaction.toAccountId) {
        // For transfers, deduct from source account
        account.currentBalance -= transaction.amount;
        
        // Add to destination account
        const toAccountIndex = updatedAccounts.findIndex(acc => acc.id === transaction.toAccountId);
        
        if (toAccountIndex !== -1) {
          const toAccount = { ...updatedAccounts[toAccountIndex] };
          toAccount.currentBalance += transaction.amount;
          toAccount.updatedAt = Date.now();
          updatedAccounts[toAccountIndex] = toAccount;
        }
      }
      
      account.updatedAt = Date.now();
      updatedAccounts[accountIndex] = account;
      
      return updatedAccounts;
    });
  };

  // Helper function to reverse a transaction's effect on account balances
  const reverseTransaction = (transaction: Transaction) => {
    setAccounts(prev => {
      const updatedAccounts = [...prev];
      
      // Find the account
      const accountIndex = updatedAccounts.findIndex(acc => acc.id === transaction.accountId);
      
      if (accountIndex === -1) return prev;
      
      const account = { ...updatedAccounts[accountIndex] };
      
      // Reverse balance change based on transaction type
      if (transaction.type === 'income') {
        account.currentBalance -= transaction.amount;
      } else if (transaction.type === 'expense') {
        account.currentBalance += transaction.amount;
      } else if (transaction.type === 'transfer' && transaction.toAccountId) {
        // For transfers, add back to source account
        account.currentBalance += transaction.amount;
        
        // Deduct from destination account
        const toAccountIndex = updatedAccounts.findIndex(acc => acc.id === transaction.toAccountId);
        
        if (toAccountIndex !== -1) {
          const toAccount = { ...updatedAccounts[toAccountIndex] };
          toAccount.currentBalance -= transaction.amount;
          toAccount.updatedAt = Date.now();
          updatedAccounts[toAccountIndex] = toAccount;
        }
      }
      
      account.updatedAt = Date.now();
      updatedAccounts[accountIndex] = account;
      
      return updatedAccounts;
    });
  };

  // Update balance history
  const updateBalanceHistory = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    // For each account, check if we already have a balance history entry for today
    setBalanceHistory(prev => {
      const newHistory = [...prev];
      
      accounts.forEach(account => {
        const hasEntryForToday = newHistory.some(
          entry => entry.accountId === account.id && 
                  new Date(entry.date).setHours(0, 0, 0, 0) === todayTimestamp
        );
        
        if (!hasEntryForToday) {
          newHistory.push({
            accountId: account.id,
            date: todayTimestamp,
            balance: account.currentBalance
          });
        } else {
          // Update today's entry with the current balance
          const index = newHistory.findIndex(
            entry => entry.accountId === account.id && 
                    new Date(entry.date).setHours(0, 0, 0, 0) === todayTimestamp
          );
          
          if (index !== -1) {
            newHistory[index] = {
              ...newHistory[index],
              balance: account.currentBalance
            };
          }
        }
      });
      
      return newHistory;
    });
  };

  // Category CRUD operations
  const addCategory = (categoryData: Omit<Category, 'id' | 'isDefault'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: `category-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      isDefault: false
    };
    
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  };

  const deleteCategory = (categoryId: string): boolean => {
    // Check if there are transactions using this category
    const hasTransactions = transactions.some(tx => tx.categoryId === categoryId);
    
    if (hasTransactions) {
      return false; // Can't delete category with transactions
    }
    
    // Check if it's a default category
    const isDefault = categories.find(
      c => c.id === categoryId
    )?.isDefault;
    
    if (isDefault) {
      return false; // Can't delete default categories
    }
    
    setCategories(prev => prev.filter(category => category.id !== categoryId));
    
    return true;
  };

  const archiveCategory = (categoryId: string) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === categoryId ? { ...category, isArchived: true } : category
      )
    );
  };

  // Data management
  const exportData = (): string => {
    const data = {
      accounts,
      transactions,
      categories,
      balanceHistory
    };
    
    return JSON.stringify(data);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      // Validate the data structure
      if (!data.accounts || !Array.isArray(data.accounts) ||
          !data.transactions || !Array.isArray(data.transactions) ||
          !data.categories || !Array.isArray(data.categories)) {
        return false;
      }
      
      setAccounts(data.accounts);
      setTransactions(data.transactions);
      setCategories(data.categories);
      
      if (data.balanceHistory && Array.isArray(data.balanceHistory)) {
        setBalanceHistory(data.balanceHistory);
      } else {
        // If no balance history, create it based on accounts
        const newHistory: BalanceHistory[] = data.accounts.map((account: Account) => ({
          accountId: account.id,
          date: Date.now(),
          balance: account.currentBalance
        }));
        
        setBalanceHistory(newHistory);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  const resetData = () => {
    setAccounts([]);
    setTransactions([]);
    setCategories([...DEFAULT_INCOME_CATEGORIES, ...DEFAULT_EXPENSE_CATEGORIES]);
    setBalanceHistory([]);
    
    storageService.setItem(STORAGE_KEYS.ACCOUNTS, []);
    storageService.setItem(STORAGE_KEYS.TRANSACTIONS, []);
    storageService.setItem(STORAGE_KEYS.CATEGORIES, [...DEFAULT_INCOME_CATEGORIES, ...DEFAULT_EXPENSE_CATEGORIES]);
    storageService.setItem(STORAGE_KEYS.BALANCE_HISTORY, []);
  };

  return (
    <DataContext.Provider
      value={{
        accounts,
        transactions,
        categories,
        balanceHistory,
        
        addAccount,
        updateAccount,
        deleteAccount,
        archiveAccount,
        
        addTransaction,
        updateTransaction,
        deleteTransaction,
        
        addCategory,
        updateCategory,
        deleteCategory,
        archiveCategory,
        
        exportData,
        importData,
        resetData,
        
        isLoading
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  
  return context;
};