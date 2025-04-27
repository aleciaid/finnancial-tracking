import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { storageService } from '../../utils/storage';
import { formatFileSize } from '../../utils/formatters';
import { 
  Download, Upload, AlertTriangle, Trash2, Save, FileJson, Heart
} from 'lucide-react';

const SettingsView: React.FC = () => {
  const { exportData, importData, resetData } = useData();
  
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  
  // Get storage usage
  const storageUsage = storageService.getStorageUsage();
  const storageLimit = 10 * 1024 * 1024; // 5MB (LocalStorage limit)
  const usagePercentage = (storageUsage / storageLimit) * 100;
  
  const handleExportData = () => {
    const jsonData = exportData();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
      setImportError(null);
      setImportSuccess(false);
    }
  };
  
  const handleImportData = () => {
    if (!importFile) {
      setImportError('Please select a file to import');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const success = importData(jsonData);
        
        if (success) {
          setImportSuccess(true);
          setImportError(null);
          setImportFile(null);
          
          // Reset file input
          const fileInput = document.getElementById('file-import') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        } else {
          setImportError('Invalid data format. Please check your file and try again.');
        }
      } catch (error) {
        setImportError('Error importing data. Please check your file and try again.');
        console.error('Import error:', error);
      }
    };
    
    reader.onerror = () => {
      setImportError('Error reading file. Please try again.');
    };
    
    reader.readAsText(importFile);
  };
  
  const handleResetData = () => {
    resetData();
    setShowResetConfirm(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Customize your experience and manage app data
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
            Update Log
          </h2>
          
          <div className="space-y-3">
            <div className="border-l-2 border-blue-500 pl-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Version 1.2.0 (March 2024)</h3>
              <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Added Ko-fi and Saweria support widget</li>
                <li>• Improved registration flow</li>
                <li>• Enhanced security features</li>
                <li>• UI/UX improvements</li>
              </ul>
            </div>
            <div className="border-l-2 border-green-500 pl-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Version 1.1.0 (Current)</h3>
              <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Improved transaction management</li>
                <li>• Enhanced data visualization</li>
                <li>• Better mobile responsiveness</li>
                <li>• Performance optimizations</li>
                <li>• Bug fixes and improvements</li>
              </ul>
            </div>
            <div className="border-l-2 border-blue-500 pl-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Version 1.0.0 (February 2024)</h3>
              <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Initial release</li>
                <li>• Basic income and expense tracking</li>
                <li>• Multiple account support</li>
                <li>• Category management</li>
                <li>• Dark mode support</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Data management section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Data Management
          </h2>
          
          <div className="space-y-6">
            {/* Storage usage */}
            <div>
              <div className="flex justify-between mb-1">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Storage Usage</h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatFileSize(storageUsage)} / {formatFileSize(storageLimit)}
                </span>
              </div>
              
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    usagePercentage > 90 ? 'bg-red-500' : 
                    usagePercentage > 70 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} 
                  style={{ width: `${usagePercentage}%` }}
                ></div>
              </div>
              
              {usagePercentage > 90 && (
                <div className="mt-2 flex items-start text-sm text-red-600 dark:text-red-400">
                  <AlertTriangle size={16} className="mr-1 flex-shrink-0 mt-0.5" />
                  <p>Storage nearly full. Consider exporting and clearing some data.</p>
                </div>
              )}
            </div>
            
            {/* Export data */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="flex items-start">
                <Download size={20} className="mr-3 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Export Data</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Download all your financial data as a JSON file for backup
                  </p>
                  <button
                    onClick={handleExportData}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 
                              rounded-md hover:bg-blue-700 focus:outline-none 
                              inline-flex items-center"
                  >
                    <Save size={16} className="mr-1.5" />
                    Export Data
                  </button>
                </div>
              </div>
            </div>
            
            {/* Import data */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="flex items-start">
                <Upload size={20} className="mr-3 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Import Data</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Restore your data from a previously exported JSON file
                  </p>
                  
                  {importSuccess && (
                    <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 
                                  text-green-700 dark:text-green-300 text-sm rounded">
                      Data imported successfully!
                    </div>
                  )}
                  
                  {importError && (
                    <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 
                                  text-red-700 dark:text-red-300 text-sm rounded">
                      {importError}
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                    <div className="flex-1">
                      <label 
                        htmlFor="file-import" 
                        className="block w-full px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 
                                  border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer 
                                  bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <div className="flex items-center">
                          <FileJson size={16} className="mr-1.5" />
                          <span className="truncate">
                            {importFile ? importFile.name : 'Choose file...'}
                          </span>
                        </div>
                        <input 
                          id="file-import"
                          type="file" 
                          accept=".json"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    <button
                      onClick={handleImportData}
                      disabled={!importFile}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 
                                rounded-md hover:bg-blue-700 focus:outline-none 
                                disabled:bg-gray-400 disabled:cursor-not-allowed
                                inline-flex items-center justify-center"
                    >
                      <Upload size={16} className="mr-1.5" />
                      Import
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Reset data */}
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-start">
                <Trash2 size={20} className="mr-3 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-red-700 dark:text-red-300">Reset Data</h3>
                  <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                    Delete all your financial data. This action cannot be undone.
                  </p>
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 
                              rounded-md hover:bg-red-700 focus:outline-none
                              inline-flex items-center"
                  >
                    <Trash2 size={16} className="mr-1.5" />
                    Reset All Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reset confirmation dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">
              Reset All Data
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Are you absolutely sure you want to reset all data? This will:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600 dark:text-gray-300 text-sm space-y-1">
              <li>Delete all your transactions</li>
              <li>Delete all your accounts</li>
              <li>Reset all custom categories</li>
              <li>Delete all balance history</li>
            </ul>
            <p className="text-red-600 dark:text-red-400 font-medium mb-6">
              This action CANNOT be undone!
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                          bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 
                          dark:hover:bg-gray-600 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 
                          rounded-md hover:bg-red-700 focus:outline-none"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;