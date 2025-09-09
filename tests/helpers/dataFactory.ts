import { User, Transaction } from './types';

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

export function generateUser(): Omit<User, 'userId'> {
    // Return request payload for creating a new user.
    const name = generateRandomString(10)
    return {
        name: `${name}${Math.floor(Math.random() * 1000)}`,
        email: `${name}@gmail.com`,
        accountType: Math.random() < 0.5 ? 'basic' : 'premium',
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
        amount,
        type,
        recipientId,
    };
}