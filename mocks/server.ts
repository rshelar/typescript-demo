// mocks/server.ts

import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from './services/UserService';

export const app = express();
const port = 3000;

// In-memory DB
export const userService = new UserService();
export const transactions: any[] = [];

app.use(bodyParser.json());

app.post('/api/users', (req, res) => {
    const { name, email, accountType } = req.body;
    try {
        const user = userService.createUser(name, email, accountType);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/users/:userId', (req, res) => {
    try {
        const user = userService.getUserById(req.params.userId);
        return res.status(200).json(user);
    } catch (err: any) {
        return res.status(404).json({ error: err.message });
    }
});

app.post('/api/transactions', (req, res) => {
    const { userId, recipientId, amount, type } = req.body;
    // 1. Validate required fields
    if (!userId || !recipientId || !amount || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 2. Validate sender ≠ receiver
    if (userId === recipientId) {
      return res.status(400).json({ error: 'Sender and recipient cannot be the same user' });
    }

    // 3. Validate positive amount
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than zero' });
    }

    const transaction = {
        transactionId: uuidv4(),
        userId,
        recipientId,
        amount,
        type,
      };

    transactions.push(transaction);
    res.status(200).json(transaction);
});

app.get('/api/users/:userId/transactions', (req, res) => {
  const txns = transactions.filter((t) => t.userId === req.params.userId);
  res.status(200).json(txns);
});

app.listen(port, () => {
  console.log(`Mock API server listening at http://localhost:${port}`);
});