import React, { useState, useEffect } from 'react';
import { BanknoteIcon, CreditCard, Wallet, TrendingDown, TrendingUp } from 'lucide-react';
import SummaryCard from './SummaryCard';
import ChartContainer from './ChartContainer';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/formatters';
import { calculateTotalIncome, calculateTotalExpenses, calculateBudgetUtilization, 
         calculateExpensesByCategory } from '../../utils/dataCalculations';
import { getCurrentMonth, getPreviousMonth, getLastMonths } from '../../utils/dateUtils';
import { useTheme } from '../../context/ThemeContext';
import TransactionList from '../transactions/TransactionList';
import FloatingActionButton from '../ui/FloatingActionButton';

const DashboardLayout: React.FC = () => {
  const { accounts, transactions, categories } = useData();
  const { theme } = useTheme();
  
  // Get available years from transactions
  const availableYears = [...new Set(transactions.map(tx => 
    new Date(tx.date).getFullYear()
  ))].sort((a, b) => b - a);
  
  if (availableYears.length === 0) {
    availableYears.push(new Date().getFullYear());
  }
  
  const [selectedYear, setSelectedYear] = useState(availableYears[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  // Create custom period based on selected month and year
  const selectedPeriod = {
    startDate: new Date(selectedYear, selectedMonth, 1).getTime(),
    endDate: new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59, 999).getTime(),
    label: new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })
  };
  
  // Previous period for trend calculation
  const previousPeriod = selectedMonth === 0 
    ? {
        startDate: new Date(selectedYear - 1, 11, 1).getTime(),
        endDate: new Date(selectedYear - 1, 11 + 1, 0, 23, 59, 59, 999).getTime()
      }
    : {
        startDate: new Date(selectedYear, selectedMonth - 1, 1).getTime(),
        endDate: new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999).getTime()
      };
  
  const currentMonthIncome = calculateTotalIncome(transactions, selectedPeriod);
  const previousMonthIncome = calculateTotalIncome(transactions, previousPeriod);
  
  const currentMonthExpenses = calculateTotalExpenses(transactions, selectedPeriod);
  const previousMonthExpenses = calculateTotalExpenses(transactions, previousPeriod);
  
  // Prepare chart data
  const balanceTrendData = getLastMonths(6).map(period => ({
    name: period.label?.split(' ')[0] || '',
    income: calculateTotalIncome(transactions, period),
    expense: calculateTotalExpenses(transactions, period),
    balance: calculateTotalIncome(transactions, period) - calculateTotalExpenses(transactions, period)
  })).reverse();

  const expenseDistributionData = calculateExpensesByCategory(
    transactions,
    categories, 
    selectedPeriod
  ).map(item => ({
    name: item.category.name,
    value: item.amount
  }));

  // Calculate trends (percentage change from previous month)
  const incomeTrend = previousMonthIncome === 0 
    ? { value: 0, isPositive: true } 
    : { 
        value: Math.round(((currentMonthIncome - previousMonthIncome) / previousMonthIncome) * 100), 
        isPositive: currentMonthIncome >= previousMonthIncome 
      };
  
  const expensesTrend = previousMonthExpenses === 0 
    ? { value: 0, isPositive: false } 
    : { 
        value: Math.round(((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100), 
        isPositive: currentMonthExpenses <= previousMonthExpenses 
      };
  
  // Calculate total balances
  const totalBankBalance = accounts
    .filter(account => account.type === 'bank' && !account.isArchived)
    .reduce((sum, account) => sum + account.currentBalance, 0);
  
  const totalCashBalance = accounts
    .filter(account => account.type === 'cash' && !account.isArchived)
    .reduce((sum, account) => sum + account.currentBalance, 0);
    
  // Calculate total available balance across all accounts
  const totalAvailableBalance = accounts
    .filter(account => !account.isArchived)
    .reduce((sum, account) => sum + account.currentBalance, 0);
  
  // Calculate spending limits based on total available balance
  const spendingLimits = {
    conservative: totalAvailableBalance * 0.3,
    balanced: totalAvailableBalance * 0.5,
    maximum: totalAvailableBalance * 0.7
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">
              {selectedPeriod.label} Overview
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md 
                        text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md 
                        text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <button
              onClick={() => {
                const now = new Date();
                setSelectedMonth(now.getMonth());
                setSelectedYear(now.getFullYear());
              }}
              className="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 
                        hover:text-blue-800 dark:hover:text-blue-300"
            >
              Reset to Current
            </button>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <SummaryCard
          title="Monthly Income"
          value={formatCurrency(currentMonthIncome)}
          icon={<TrendingUp size={20} />}
          trend={incomeTrend}
        />
        
        <SummaryCard
          title="Monthly Expenses"
          value={formatCurrency(currentMonthExpenses)}
          icon={<TrendingDown size={20} />}
          trend={expensesTrend}
        />
        
        <SummaryCard
          title="Bank Balance"
          value={formatCurrency(totalBankBalance)}
          icon={<BanknoteIcon size={20} />}
        />
        
        <SummaryCard
          title="Cash Balance"
          value={formatCurrency(totalCashBalance)}
          icon={<Wallet size={20} />}
        />
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartContainer 
          title="Monthly Balance Trend" 
          type="line"
          data={balanceTrendData}
        />
        
        <ChartContainer 
          title="Expense Distribution" 
          type="pie"
          data={expenseDistributionData}
        />
      </div>
      
      {/* Budget Utilization */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          Spending Limit Suggestions
        </h3>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Based on your total available balance, here are suggested spending limits:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-green-700 dark:text-green-300 font-medium">Conservative</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {formatCurrency(spendingLimits.conservative)}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-1">30% of available balance</div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-blue-700 dark:text-blue-300 font-medium">Balanced</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {formatCurrency(spendingLimits.balanced)}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">50% of available balance</div>
            </div>
            
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-yellow-700 dark:text-yellow-300 font-medium">Maximum</div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                {formatCurrency(spendingLimits.maximum)}
              </div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">70% of available balance</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Income & Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Income</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search income..."
                className="w-48 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 
                          rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
                          dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <TransactionList
            limit={5}
            showViewAll={true}
            period={selectedPeriod}
            filterByType="income"
            readOnly={true}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Expenses</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search expenses..."
                className="w-48 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 
                          rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
                          dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <TransactionList
            limit={5}
            showViewAll={true}
            period={selectedPeriod}
            filterByType="expense"
            readOnly={true}
          />
        </div>
      </div>
      
      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};

export default DashboardLayout;