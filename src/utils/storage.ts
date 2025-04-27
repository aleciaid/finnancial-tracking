import { STORAGE_KEYS } from '../types';

/**
 * LocalStorage utility for managing data persistence
 */
class StorageService {
  /**
   * Check if localStorage is available
   */
  private isAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.error('LocalStorage is not available:', e);
      return false;
    }
  }

  /**
   * Get item from localStorage with error handling
   */
  getItem<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable()) return defaultValue;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error retrieving ${key} from localStorage:`, e);
      return defaultValue;
    }
  }

  /**
   * Set item in localStorage with error handling
   */
  setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false;

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error storing ${key} in localStorage:`, e);
      
      // Check if we're hitting storage limits
      if (e instanceof DOMException && 
          (e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError')) {
        console.error('Storage quota exceeded');
        // TODO: Implement data cleanup or compression strategies
      }
      
      return false;
    }
  }

  /**
   * Remove item from localStorage with error handling
   */
  removeItem(key: string): boolean {
    if (!this.isAvailable()) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`Error removing ${key} from localStorage:`, e);
      return false;
    }
  }

  /**
   * Get total localStorage usage in bytes
   */
  getStorageUsage(): number {
    if (!this.isAvailable()) return 0;

    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        total += key.length + value.length;
      }
    }
    
    return total;
  }

  /**
   * Clear all app data from localStorage
   */
  clearAllData(): boolean {
    if (!this.isAvailable()) return false;

    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (e) {
      console.error('Error clearing all data from localStorage:', e);
      return false;
    }
  }

  /**
   * Export all app data as JSON
   */
  exportData(): string {
    const data: Record<string, any> = {};
    
    Object.values(STORAGE_KEYS).forEach(key => {
      data[key] = this.getItem(key, null);
    });
    
    return JSON.stringify(data);
  }

  /**
   * Import app data from JSON
   */
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      Object.entries(data).forEach(([key, value]) => {
        if (Object.values(STORAGE_KEYS).includes(key)) {
          this.setItem(key, value);
        }
      });
      
      return true;
    } catch (e) {
      console.error('Error importing data:', e);
      return false;
    }
  }
}

export const storageService = new StorageService();