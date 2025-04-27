/**
 * Date utility functions for the application
 */

import { Period } from '../types';

/**
 * Get the start and end of the current month
 * @returns Period object with startDate and endDate
 */
export const getCurrentMonth = (): Period => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
  
  return {
    startDate,
    endDate,
    label: now.toLocaleString('default', { month: 'long', year: 'numeric' })
  };
};

/**
 * Get the start and end of the previous month
 * @returns Period object with startDate and endDate
 */
export const getPreviousMonth = (): Period => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
  const endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999).getTime();
  
  const label = new Date(startDate).toLocaleString('default', { month: 'long', year: 'numeric' });
  
  return { startDate, endDate, label };
};

/**
 * Get the last N months including the current month
 * @param count - Number of months to return
 * @returns Array of Period objects
 */
export const getLastMonths = (count: number): Period[] => {
  const periods: Period[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const year = now.getFullYear();
    const month = now.getMonth() - i;
    
    // Adjust year if month goes negative
    const adjustedDate = new Date(year, month, 1);
    const startDate = adjustedDate.getTime();
    
    // Set end date to last day of month
    const endDate = new Date(
      adjustedDate.getFullYear(),
      adjustedDate.getMonth() + 1,
      0,
      23, 59, 59, 999
    ).getTime();
    
    const label = adjustedDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    periods.push({ startDate, endDate, label });
  }
  
  return periods;
};

/**
 * Get the date range for a specific month
 * @param month - Month index (0-11)
 * @param year - Year (e.g., 2025)
 * @returns Period object with startDate and endDate
 */
export const getMonthPeriod = (month: number, year: number): Period => {
  const startDate = new Date(year, month, 1).getTime();
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime();
  
  const label = new Date(startDate).toLocaleString('default', { month: 'long', year: 'numeric' });
  
  return { startDate, endDate, label };
};

/**
 * Check if a date is today
 * @param timestamp - The timestamp to check
 * @returns True if the date is today
 */
export const isToday = (timestamp: number): boolean => {
  const date = new Date(timestamp);
  const today = new Date();
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is within a period
 * @param timestamp - The timestamp to check
 * @param period - The period to check against
 * @returns True if the date is within the period
 */
export const isWithinPeriod = (timestamp: number, period: Period): boolean => {
  return timestamp >= period.startDate && timestamp <= period.endDate;
};

/**
 * Get an array of dates for the last N days
 * @param days - Number of days to return
 * @returns Array of timestamps
 */
export const getLastDays = (days: number): number[] => {
  const result: number[] = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    result.unshift(date.getTime());
  }
  
  return result;
};