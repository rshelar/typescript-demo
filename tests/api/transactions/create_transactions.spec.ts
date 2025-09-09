// tests/create_transaction.spec.ts
import { test, expect } from '@playwright/test';
import { generateTransaction } from '../helpers/dataFactory';
import { TransactionService } from '../path/to/TransactionService';

test('should create a transaction successfully', async ({ request }) => {
  const payload = generateTransaction();
  const response = await request.post('http://localhost:3000/api/transactions', {
    data: payload,
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body).toMatchObject({
    userId: payload.userId,
    amount: payload.amount,
    type: payload.type,
    recipientId: payload.recipientId,
  });
  expect(body.transactionId).toBeDefined();
});