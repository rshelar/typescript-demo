// tests/helpers/types.ts

export interface User {
    userId?: string;              // optional for request
    name: string;
    email: string;
    accountType: 'basic' | 'premium';
}

export interface Transaction {
    transactionId?: string;       // optional for request
    userId: string;
    amount: number;
    type: 'transfer' | 'deposit' | 'withdrawal';
    recipientId: string;
}