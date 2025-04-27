/**
 * Utility functions for formatting values
 */

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: USD)
 * @param locale - The locale to use (default: en-US)
 * @returns The formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'IDR',
  locale: string = 'id-ID'
): string => {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  // Remove decimal points for IDR
  return formatted.replace(/\,00$/, '');
};

/**
 * Format a date to a readable string
 * @param timestamp - The timestamp to format
 * @param format - The format to use (default: 'medium')
 * @param locale - The locale to use (default: 'en-US')
 * @returns The formatted date string
 */
export const formatDate = (
  timestamp: number,
  format: 'short' | 'medium' | 'long' = 'medium',
  locale: string = 'en-US'
): string => {
  const date = new Date(timestamp);
  
  const options: Intl.DateTimeFormatOptions = 
    format === 'short' ? { month: 'numeric', day: 'numeric', year: '2-digit' } :
    format === 'medium' ? { month: 'short', day: 'numeric', year: 'numeric' } :
    { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  
  return new Intl.DateTimeFormat(locale, options).format(date);
};

/**
 * Format a percentage value
 * @param value - The value to format as percentage
 * @param decimals - The number of decimal places (default: 1)
 * @returns The formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format a file size in bytes to a human-readable string
 * @param bytes - The size in bytes
 * @returns The formatted size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Truncate a string to a maximum length
 * @param str - The string to truncate
 * @param maxLength - The maximum length
 * @param ellipsis - The ellipsis to add (default: '...')
 * @returns The truncated string
 */
export const truncateString = (
  str: string,
  maxLength: number,
  ellipsis: string = '...'
): string => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - ellipsis.length)}${ellipsis}`;
};