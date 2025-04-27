# Personal Finance Monitoring Web App

A modern, secure web application for tracking personal finances, built with React, TypeScript, and TailwindCSS.

## Features

- 🔒 Secure local data storage
- 💰 Multi-account management (Bank, Cash, Credit)
- 📊 Interactive financial dashboards
- 💸 Income and expense tracking
- 🏷️ Category management
- 📱 Responsive design
- 🌓 Dark/Light theme support

## Tech Stack

- React 18
- TypeScript
- TailwindCSS
- Vite
- Recharts for data visualization
- Lucide React for icons

## Project Structure

```
src/
├── components/
│   ├── accounts/      # Account management components
│   ├── auth/          # Authentication components
│   ├── dashboard/     # Dashboard and analytics
│   ├── layout/        # Layout components
│   ├── transactions/  # Transaction management
│   └── ui/           # Reusable UI components
├── context/
│   ├── AuthContext.tsx    # Authentication state
│   ├── DataContext.tsx    # Application data
│   └── ThemeContext.tsx   # Theme management
├── types/
│   └── index.ts      # TypeScript definitions
└── utils/
    ├── dataCalculations.ts  # Financial calculations
    ├── dateUtils.ts         # Date handling
    ├── formatters.ts        # Value formatting
    ├── security.ts          # Security utilities
    └── storage.ts           # Local storage management
```

## Data Models

### Account
```typescript
{
  id: string;
  name: string;
  type: 'bank' | 'cash' | 'credit';
  initialBalance: number;
  currentBalance: number;
  isArchived: boolean;
  createdAt: number;
  updatedAt: number;
}
```

### Transaction
```typescript
{
  id: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  categoryId: string;
  accountId: string;
  date: number;
  notes?: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}
```

### Category
```typescript
{
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  isDefault: boolean;
  isArchived: boolean;
}
```

## Security Features

- Password hashing using SHA-256
- Session management with inactivity timeout
- Local storage encryption for sensitive data
- No external data transmission

## Local Storage Keys

```typescript
export const STORAGE_KEYS = {
  USER_CREDENTIALS: 'financeApp.credentials',
  USER_PREFERENCES: 'financeApp.preferences',
  ACCOUNTS: 'financeApp.accounts',
  CATEGORIES: 'financeApp.categories',
  TRANSACTIONS: 'financeApp.transactions',
  BALANCE_HISTORY: 'financeApp.balanceHistory'
};
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Default Categories

### Income Categories
- Salary
- Freelance
- Investments
- Other Income

### Expense Categories
- Housing
- Food & Groceries
- Transportation
- Utilities
- Entertainment
- Health & Medical
- Other Expenses

## Features in Detail

### Authentication
- Local user account creation
- Password-based authentication
- Security question for password reset
- Session timeout after 30 minutes of inactivity

### Account Management
- Create multiple accounts
- Track account balances
- Archive unused accounts
- Transfer between accounts

### Transaction Management
- Record income and expenses
- Categorize transactions
- Add tags and notes
- View transaction history

### Dashboard Analytics
- Monthly income/expense trends
- Category-wise expense distribution
- Account balance overview
- Budget utilization tracking

### Data Management
- Export data as JSON
- Import data from backup
- Reset all data
- Storage usage monitoring

## Contributing

This project is maintained by [Andi Susanto](https://github.com/andisusanto1999). Feel free to submit issues and enhancement requests.

## Support

If you find this project helpful, consider supporting it through:
- [Ko-fi](https://ko-fi.com/L3L71E2QDX)
- [Saweria](https://saweria.co/andisusanto1999)

## License

MIT License - feel free to use this code for your own projects.