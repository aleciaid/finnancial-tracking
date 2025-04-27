import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { Account } from '../../types';
import { BanknoteIcon, CreditCard, Edit, Trash2, Archive, Wallet } from 'lucide-react';

interface AccountCardProps {
  account: Account;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onEdit,
  onDelete,
  onArchive
}) => {
  // Get appropriate icon based on account type
  const getAccountIcon = () => {
    switch (account.type) {
      case 'bank':
        return <BanknoteIcon size={20} />;
      case 'cash':
        return <Wallet size={20} />;
      case 'credit':
        return <CreditCard size={20} />;
      default:
        return <BanknoteIcon size={20} />;
    }
  };
  
  // Determine appropriate color based on balance
  const getBalanceColor = () => {
    if (account.currentBalance > 0) {
      return 'text-green-600 dark:text-green-400';
    } else if (account.currentBalance < 0) {
      return 'text-red-600 dark:text-red-400';
    }
    return 'text-gray-600 dark:text-gray-400';
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 
                   hover:shadow-md transition-shadow ${
                     account.isArchived ? 'opacity-70' : ''
                   }`}>
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
            {getAccountIcon()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
              {account.name}
              {account.isArchived && (
                <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 
                               px-2 py-0.5 rounded-full">
                  Archived
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {account.type}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`font-semibold text-lg ${getBalanceColor()}`}>
            {formatCurrency(account.currentBalance)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Initial: {formatCurrency(account.initialBalance)}
          </div>
        </div>
      </div>
      
      {!account.isArchived && (
        <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-end space-x-2">
          <button
            onClick={() => onEdit(account.id)}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                    rounded focus:outline-none"
            aria-label="Edit account"
          >
            <Edit size={16} />
          </button>
          
          <button
            onClick={() => onArchive(account.id)}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                    rounded focus:outline-none"
            aria-label="Archive account"
          >
            <Archive size={16} />
          </button>
          
          <button
            onClick={() => onDelete(account.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400
                    rounded focus:outline-none"
            aria-label="Delete account"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountCard;