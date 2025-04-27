import React, { useState } from 'react';
import { Plus, X, DollarSign, CreditCard, ReceiptText } from 'lucide-react';
import AccountForm from '../accounts/AccountForm';
import TransactionForm from '../transactions/TransactionForm';

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  const handleAddIncome = () => {
    setShowIncomeForm(true);
    setIsOpen(false);
  };
  
  const handleAddExpense = () => {
    setShowExpenseForm(true);
    setIsOpen(false);
  };
  
  const handleAddAccount = () => {
    setShowAccountForm(true);
    setIsOpen(false);
  };
  
  return (
    <>
    <div className="fixed bottom-6 right-6 z-40 flex flex-col-reverse items-end space-y-3 space-y-reverse">
      {/* Sub buttons - displayed when FAB is open */}
      {isOpen && (
        <>
          {/* Add Income */}
          <div className="mb-3 flex items-center">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg py-1 px-3 mr-3 
                            text-gray-800 dark:text-gray-200 text-sm font-medium">
              Add Income
            </div>
            <button
              onClick={handleAddIncome}
              className="w-12 h-12 rounded-full bg-green-500 text-white shadow-lg 
                         flex items-center justify-center hover:bg-green-600 transition-colors"
              aria-label="Add Income"
            >
              <DollarSign size={20} />
            </button>
          </div>
          
          {/* Add Expense */}
          <div className="mb-3 flex items-center">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg py-1 px-3 mr-3 
                            text-gray-800 dark:text-gray-200 text-sm font-medium">
              Add Expense
            </div>
            <button
              onClick={handleAddExpense}
              className="w-12 h-12 rounded-full bg-red-500 text-white shadow-lg 
                         flex items-center justify-center hover:bg-red-600 transition-colors"
              aria-label="Add Expense"
            >
              <ReceiptText size={20} />
            </button>
          </div>
          
          {/* Add Account */}
          <div className="mb-3 flex items-center">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg py-1 px-3 mr-3 
                            text-gray-800 dark:text-gray-200 text-sm font-medium">
              Add Account
            </div>
            <button
              onClick={handleAddAccount}
              className="w-12 h-12 rounded-full bg-blue-500 text-white shadow-lg 
                         flex items-center justify-center hover:bg-blue-600 transition-colors"
              aria-label="Add Account"
            >
              <CreditCard size={20} />
            </button>
          </div>
        </>
      )}
      
      {/* Main FAB button */}
      <button
        onClick={toggleOpen}
        className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg 
                 flex items-center justify-center hover:bg-blue-700 transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
    
    {/* Forms */}
    {showAccountForm && (
      <AccountForm onClose={() => setShowAccountForm(false)} />
    )}
    
    {showIncomeForm && (
      <TransactionForm 
        type="income"
        onClose={() => setShowIncomeForm(false)} 
      />
    )}
    
    {showExpenseForm && (
      <TransactionForm 
        type="expense"
        onClose={() => setShowExpenseForm(false)} 
      />
    )}
    </>
  );
};

export default FloatingActionButton;