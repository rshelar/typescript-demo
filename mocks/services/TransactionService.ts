import { UserService } from './UserService';
import { Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class TransactionService {
    private transactions = new Map<string, Transaction>();
    private userTransactions = new Map<string, Transaction[]>();
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    createTransaction(txn: Omit<Transaction, 'transactionId'>): Transaction {
        console.log('TransactionService.createTransaction called with', txn)
        const { userId, amount, type, recipientId } = txn;
        if (!userId || !amount || !type || !recipientId) {
            throw new Error('Missing required fields');
        }
        this.userService.getUserById(userId);      // will throw if not found
        this.userService.getUserById(recipientId); // will throw if not found
        const transaction: Transaction = { transactionId: uuidv4(), userId, amount, type, recipientId };
        this.transactions.set(transaction.transactionId!, transaction);
        if (!this.userTransactions.has(userId)) {
            this.userTransactions.set(userId, []);
        }
        this.userTransactions.get(userId)!.push(transaction);
        return transaction;
    }

    getTransactionById(transactionId: string): Transaction | undefined {
        if (!this.transactions.has(transactionId)) {
            throw new Error('Transaction not found');
        }
        return this.transactions.get(transactionId);
    }

    getTransactionsByUserId(userId: string): Transaction[] {
        this.userService.getUserById(userId);      // will throw if not found
        return this.userTransactions.get(userId) ?? [];
    }

    getAllTransactions(): Transaction[] {
        return Array.from(this.transactions.values());
    }

    reset(): void {
        this.transactions.clear();
        this.userTransactions.clear();
    }
}