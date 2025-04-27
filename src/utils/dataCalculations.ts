import { Transaction, Category, Account, Period } from '../types';
import { isWithinPeriod } from './dateUtils';

/**
 * Calculate the total income for a given period
 * @param transactions - Array of transactions
 * @param period - Period to calculate for
 * @returns Total income
 */
export const calculateTotalIncome = (
  transactions: Transaction[],
  period: Period
): number => {
  return transactions
    .filter(tx => tx.type === 'income' && isWithinPeriod(tx.date, period))
    .reduce((sum, tx) => sum + tx.amount, 0);
};

/**
 * Calculate the total expenses for a given period
 * @param transactions - Array of transactions
 * @param period - Period to calculate for
 * @returns Total expenses
 */
export const calculateTotalExpenses = (
  transactions: Transaction[],
  period: Period
): number => {
  return transactions
    .filter(tx => tx.type === 'expense' && isWithinPeriod(tx.date, period))
    .reduce((sum, tx) => sum + tx.amount, 0);
};

/**
 * Calculate the net balance for a given period
 * @param transactions - Array of transactions
 * @param period - Period to calculate for
 * @returns Net balance (income - expenses)
 */
export const calculateNetBalance = (
  transactions: Transaction[],
  period: Period
): number => {
  const income = calculateTotalIncome(transactions, period);
  const expenses = calculateTotalExpenses(transactions, period);
  return income - expenses;
};

/**
 * Calculate expense distribution by category
 * @param transactions - Array of transactions
 * @param categories - Array of categories
 * @param period - Period to calculate for
 * @returns Array of category totals
 */
export const calculateExpensesByCategory = (
  transactions: Transaction[],
  categories: Category[],
  period: Period
): { category: Category; amount: number; percentage: number }[] => {
  const expenseTransactions = transactions.filter(
    tx => tx.type === 'expense' && isWithinPeriod(tx.date, period)
  );
  
  const totalExpenses = expenseTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  
  const categoryMap = new Map<string, number>();
  
  // Initialize all categories with zero
  categories
    .filter(cat => cat.type === 'expense' && !cat.isArchived)
    .forEach(cat => {
      categoryMap.set(cat.id, 0);
    });
  
  // Sum transactions by category
  expenseTransactions.forEach(tx => {
    const currentAmount = categoryMap.get(tx.categoryId) || 0;
    categoryMap.set(tx.categoryId, currentAmount + tx.amount);
  });
  
  // Convert map to array with category objects
  const result = Array.from(categoryMap.entries())
    .map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      if (!category) return null;
      
      const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
      
      return {
        category,
        amount,
        percentage
      };
    })
    .filter((item): item is { category: Category; amount: number; percentage: number } => 
      item !== null && item.amount > 0
    )
    .sort((a, b) => b.amount - a.amount);
  
  return result;
};

/**
 * Calculate income distribution by category
 * @param transactions - Array of transactions
 * @param categories - Array of categories
 * @param period - Period to calculate for
 * @returns Array of category totals
 */
export const calculateIncomeByCategory = (
  transactions: Transaction[],
  categories: Category[],
  period: Period
): { category: Category; amount: number; percentage: number }[] => {
  const incomeTransactions = transactions.filter(
    tx => tx.type === 'income' && isWithinPeriod(tx.date, period)
  );
  
  const totalIncome = incomeTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  
  const categoryMap = new Map<string, number>();
  
  // Initialize all categories with zero
  categories
    .filter(cat => cat.type === 'income' && !cat.isArchived)
    .forEach(cat => {
      categoryMap.set(cat.id, 0);
    });
  
  // Sum transactions by category
  incomeTransactions.forEach(tx => {
    const currentAmount = categoryMap.get(tx.categoryId) || 0;
    categoryMap.set(tx.categoryId, currentAmount + tx.amount);
  });
  
  // Convert map to array with category objects
  const result = Array.from(categoryMap.entries())
    .map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      if (!category) return null;
      
      const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
      
      return {
        category,
        amount,
        percentage
      };
    })
    .filter((item): item is { category: Category; amount: number; percentage: number } => 
      item !== null && item.amount > 0
    )
    .sort((a, b) => b.amount - a.amount);
  
  return result;
};

/**
 * Calculate total balance across all accounts
 * @param accounts - Array of accounts
 * @returns Total balance
 */
export const calculateTotalBalance = (accounts: Account[]): number => {
  return accounts
    .filter(account => !account.isArchived)
    .reduce((sum, account) => sum + account.currentBalance, 0);
};

/**
 * Calculate budget utilization percentage
 * @param expenses - Total expenses
 * @param budgetAmount - Budget amount
 * @returns Percentage of budget utilized
 */
export const calculateBudgetUtilization = (
  expenses: number,
  budgetAmount: number
): number => {
  if (budgetAmount <= 0) return 0;
  return Math.min((expenses / budgetAmount) * 100, 100);
};

/**
 * Generate monthly balance trend data
 * @param transactions - Array of transactions
 * @param periods - Array of periods to include
 * @returns Object with labels and datasets for chart
 */
export const generateMonthlyBalanceTrend = (
  transactions: Transaction[],
  periods: Period[]
) => {
  const labels = periods.map(period => period.label || '');
  
  const incomeData = periods.map(period => 
    calculateTotalIncome(transactions, period)
  );
  
  const expenseData = periods.map(period => 
    calculateTotalExpenses(transactions, period)
  );
  
  const balanceData = periods.map(period => 
    calculateNetBalance(transactions, period)
  );
  
  return {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(16, 185, 129, 0.5)', // Green
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      },
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: 'rgba(239, 68, 68, 0.5)', // Red
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      },
      {
        label: 'Net Balance',
        data: balanceData,
        backgroundColor: 'rgba(59, 130, 246, 0.5)', // Blue
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      }
    ]
  };
};