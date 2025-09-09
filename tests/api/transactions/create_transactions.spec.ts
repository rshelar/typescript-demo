// tests/create_transaction.spec.ts
import { test, expect } from '@playwright/test';
import { buildTransaction } from '../../helpers/dataFactory';
import { TransactionService } from '../../../mocks/services/TransactionService';
import { UserService } from '../../../mocks/services/UserService';

// Unit-style TransactionService tests
test('create a transaction', () => {
  const userService = new UserService();
  const transactionService = new TransactionService(userService);

  const user1 = userService.createUser({ name: 'User One', email: 'u1@example.com', accountType: 'basic' });
  const user2 = userService.createUser({ name: 'User Two', email: 'u2@example.com', accountType: 'basic' });
  transactionService.createTransaction({
    userId: user1.userId!,
    amount: 100,
    type: 'transfer',
    recipientId: user2.userId!,
  });
  expect(transactionService.getAllTransactions().length).toBe(1);
});

test('user1 sends $100 to user2 and user2 sends $50 to user1', () => {
  const userService = new UserService();
  const transactionService = new TransactionService(userService);

  const user1 = userService.createUser({ name: 'User One', email: 'u1@example.com', accountType: 'basic' });
  const user2 = userService.createUser({ name: 'User Two', email: 'u2@example.com', accountType: 'basic' });

  transactionService.createTransaction({
    userId: user1.userId!,
    amount: 100,
    type: 'transfer',
    recipientId: user2.userId!,
  });

  transactionService.createTransaction({
    userId: user2.userId!,
    amount: 50,
    type: 'transfer',
    recipientId: user1.userId!,
  });

  expect(transactionService.getAllTransactions().length).toBe(2);
});

test('user1 sends different amounts to user2, user3, user4', () => {
  const userService = new UserService();
  const transactionService = new TransactionService(userService);

  const user1 = userService.createUser({ name: 'User One', email: 'u1@example.com', accountType: 'basic' });
  const user2 = userService.createUser({ name: 'User Two', email: 'u2@example.com', accountType: 'basic' });
  const user3 = userService.createUser({ name: 'User Three', email: 'u3@example.com', accountType: 'basic' });
  const user4 = userService.createUser({ name: 'User Four', email: 'u4@example.com', accountType: 'basic' });

  transactionService.createTransaction({ userId: user1.userId!, amount: 10, type: 'transfer', recipientId: user2.userId!, });
  transactionService.createTransaction({ userId: user1.userId!, amount: 20, type: 'transfer', recipientId: user3.userId!, });
  transactionService.createTransaction({ userId: user1.userId!, amount: 30, type: 'transfer', recipientId: user4.userId!, });

  expect(transactionService.getAllTransactions().length).toBe(3);
});

test('user1 does two transactions with user2', () => {
  const userService = new UserService();
  const transactionService = new TransactionService(userService);

  const user1 = userService.createUser({ name: 'User One', email: 'u1@example.com', accountType: 'basic' });
  const user2 = userService.createUser({ name: 'User Two', email: 'u2@example.com', accountType: 'basic' });

  transactionService.createTransaction({ userId: user1.userId!, amount: 40, type: 'transfer', recipientId: user2.userId!, });
  transactionService.createTransaction({ userId: user1.userId!, amount: 60, type: 'transfer', recipientId: user2.userId! });

  const txns = transactionService.getTransactionsByUserId(user1.userId!);
  expect(txns.length).toBe(2);
  expect(txns[0].recipientId).toBe(user2.userId);
  expect(txns[1].recipientId).toBe(user2.userId);
});

test('should not create transaction with missing userId', () => {
  const userService = new UserService();
  const transactionService = new TransactionService(userService);
  const user = userService.createUser({ name: 'User', email: 'user@example.com', accountType: 'basic' });

  expect(() =>
    transactionService.createTransaction({
      // @ts-expect-error: intentionally missing userId
      amount: 100,
      type: 'transfer',
      recipientId: user.userId!,
    })
  ).toThrow('Missing required fields');
});

test('should not create transaction with missing recipientId', () => {
  const userService = new UserService();
  const transactionService = new TransactionService(userService);
  const user = userService.createUser({ name: 'User', email: 'user@example.com', accountType: 'basic' });

  expect(() =>
    transactionService.createTransaction({
      userId: user.userId!,
      amount: 100,
      type: 'transfer',
      // @ts-expect-error: intentionally missing recipientId
    })
  ).toThrow('Missing required fields');
});

test('should not create transaction with missing amount', () => {
  const userService = new UserService();
  const transactionService = new TransactionService(userService);
  const user1 = userService.createUser({ name: 'User1', email: 'u1@example.com', accountType: 'basic' });
  const user2 = userService.createUser({ name: 'User2', email: 'u2@example.com', accountType: 'basic' });

  expect(() =>
    transactionService.createTransaction({
      userId: user1.userId!,
      // @ts-expect-error: intentionally missing amount
      type: 'transfer',
      recipientId: user2.userId!,
    })
  ).toThrow('Missing required fields');
});

test('should not create transaction with missing type', () => {
  const userService = new UserService();
  const transactionService = new TransactionService(userService);
  const user1 = userService.createUser({ name: 'User1', email: 'u1@example.com', accountType: 'basic' });
  const user2 = userService.createUser({ name: 'User2', email: 'u2@example.com', accountType: 'basic' });

  expect(() =>
    transactionService.createTransaction({
      userId: user1.userId!,
      amount: 100,
      // @ts-expect-error: intentionally missing type
      recipientId: user2.userId!,
    })
  ).toThrow('Missing required fields');
});