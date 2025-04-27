// Core types for the application

export type UserCredentials = {
  username: string;
  passwordHash: string;
  securityAnswer?: string;
  lastActive: number;
};

export type AppTheme = 'light' | 'dark';

export type UserPreferences = {
  theme: AppTheme;
  currency: string;
  currencySymbol: string;
  usePinProtection: boolean;
  pin?: string;
  dashboardLayout: DashboardLayout;
};

export type DashboardLayout = {
  showBalanceTrend: boolean;
  showExpenseDistribution: boolean;
  showIncomeBreakdown: boolean;
  showBudgetUtilization: boolean;
};

export type Account = {
  id: string;
  name: string;
  type: 'bank' | 'cash' | 'savings' | 'credit' | 'investment' | 'other';
  initialBalance: number;
  currentBalance: number;
  icon?: string;
  color?: string;
  isArchived: boolean;
  createdAt: number;
  updatedAt: number;
};

export type Category = {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
  isDefault: boolean;
  isArchived: boolean;
};

export type Transaction = {
  id: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  categoryId: string;
  accountId: string;
  toAccountId?: string; // For transfers
  date: number;
  notes?: string;
  tags: string[];
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  createdAt: number;
  updatedAt: number;
};

export type RecurrencePattern = {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // Every X days/weeks/months/years
  endDate?: number; // Optional end date for recurrence
};

export type Period = {
  startDate: number;
  endDate: number;
  label?: string;
};

export type BalanceHistory = {
  accountId: string;
  date: number;
  balance: number;
};

export type AppState = {
  isAuthenticated: boolean;
  user: UserCredentials | null;
  preferences: UserPreferences;
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  balanceHistory: BalanceHistory[];
};

export type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[] | string;
    borderColor?: string[] | string;
    borderWidth?: number;
  }[];
};

// Storage keys
export const STORAGE_KEYS = {
  APP_STATE: 'financeApp.state',
  USER_CREDENTIALS: 'financeApp.credentials',
  USER_PREFERENCES: 'financeApp.preferences',
  ACCOUNTS: 'financeApp.accounts',
  CATEGORIES: 'financeApp.categories',
  TRANSACTIONS: 'financeApp.transactions',
  BALANCE_HISTORY: 'financeApp.balanceHistory',
};