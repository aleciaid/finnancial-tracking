import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import AccountCard from './AccountCard';
import AccountForm from './AccountForm';
import { Plus } from 'lucide-react';
import FloatingActionButton from '../ui/FloatingActionButton';

const AccountsView: React.FC = () => {
  const { accounts, deleteAccount, archiveAccount } = useData();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  
  // Separate active and archived accounts
  const activeAccounts = accounts.filter(account => !account.isArchived);
  const archivedAccounts = accounts.filter(account => account.isArchived);
  
  const handleEdit = (id: string) => {
    const accountToEdit = accounts.find(acc => acc.id === id);
    if (accountToEdit) {
      setEditAccount(accountToEdit);
    }
  };
  
  const handleDelete = (id: string) => {
    setShowDeleteConfirm(id);
    setDeleteError(null);
  };
  
  const handleArchive = (id: string) => {
    setShowArchiveConfirm(id);
  };
  
  const confirmDelete = () => {
    if (showDeleteConfirm) {
      const success = deleteAccount(showDeleteConfirm);
      
      if (!success) {
        setDeleteError('Cannot delete an account with transactions. Archive it instead.');
      } else {
        setShowDeleteConfirm(null);
      }
    }
  };
  
  const confirmArchive = () => {
    if (showArchiveConfirm) {
      archiveAccount(showArchiveConfirm);
      setShowArchiveConfirm(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Accounts</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your bank, cash, and credit accounts
          </p>
        </div>
      </div>
      
      {/* Active Accounts */}
      {activeAccounts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            You don't have any accounts yet.
          </p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm 
                    text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus size={16} className="mr-2" />
            Add Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {activeAccounts.map(account => (
            <AccountCard
              key={account.id}
              account={account}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onArchive={handleArchive}
            />
          ))}
        </div>
      )}
      
      {/* Archived Accounts */}
      {archivedAccounts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Archived Accounts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {archivedAccounts.map(account => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onArchive={handleArchive}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Delete Account
            </h3>
            
            {deleteError ? (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md">
                {deleteError}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this account? This action cannot be undone.
              </p>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(null);
                  setDeleteError(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                          bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 
                          dark:hover:bg-gray-600 focus:outline-none"
              >
                Cancel
              </button>
              
              {!deleteError && (
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 
                            rounded-md hover:bg-red-700 focus:outline-none"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Archive confirmation dialog */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Archive Account
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to archive this account? It will be moved to the archived section and no longer shown in active accounts.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowArchiveConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                          bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 
                          dark:hover:bg-gray-600 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={confirmArchive}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                          rounded-md hover:bg-blue-700 focus:outline-none"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Floating Action Button */}
      <FloatingActionButton />
      
      {/* Add Account Form */}
      {showAddForm && (
        <AccountForm onClose={() => setShowAddForm(false)} />
      )}
      
      {/* Edit Account Form */}
      {editAccount && (
        <AccountForm 
          account={editAccount}
          onClose={() => setEditAccount(null)}
        />
      )}
    </div>
  );
};

export default AccountsView;