import { User, Transaction } from './types';

export function generateUser(): Omit<User, 'userId'> {
    const names = ['John', 'William', 'Mary', 'Jennifer', 'Bob', 'Henry'];
    const user_index = Math.floor(Math.random() * names.length);
    const name = names[user_index]
    // Return request payload for creating a new user.
    return {
        name: `${name}${Math.floor(Math.random() * 1000)}`,
        email: `${name}@gmail.com`,
        accountType: (user_index % 2 == 0) ? 'basic' : 'premium',
    };
}

export function buildTransaction(
    userId: string,
    recipientId: string,
    amount: number,
    type: 'transfer' | 'deposit' | 'withdrawal'
): Omit<Transaction, 'transactionId'> {
    return {
        userId,
        recipientId,
        amount,
        type,
    };
}