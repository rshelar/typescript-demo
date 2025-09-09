// tests/helpers/types.ts
export enum AccountType {
    Basic = 'basic',
    Premium = 'premium'
}

export enum TransactionType {
    Basic = 'transfer',
    Deposit = 'deposit',
    Withdrawal = 'withdrawal'
}

export interface User {
    userId?: string;              // optional for request
    name: string;
    email: string;
    accountType: AccountType;
}

export interface Transaction {
    transactionId?: string;       // optional for request
    userId: string;  // Sender
    amount: number;
    type: TransactionType;
    recipientId: string;  // Recipient
}