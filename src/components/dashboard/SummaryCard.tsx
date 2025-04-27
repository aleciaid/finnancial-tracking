import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: string;
  textColor?: string;
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  trend,
  bgColor = 'bg-white dark:bg-gray-800',
  textColor = 'text-gray-900 dark:text-white',
  className = '',
}) => {
  return (
    <div 
      className={`${bgColor} rounded-lg shadow-sm p-5 flex flex-col ${className} 
                transition-transform duration-200 hover:shadow-md hover:-translate-y-1`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className={`text-2xl font-semibold ${textColor} mt-1`}>{value}</p>
        </div>
        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          <span 
            className={`text-sm font-medium ${
              trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs. last month</span>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;