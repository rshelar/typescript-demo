// mocks/server.ts

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from './services/UserService';
import { TransactionService } from './services/TransactionService';

export const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'ui')));

const port = 3000;

// In-memory DB
export const userService = new UserService();
export const transactionService = new TransactionService(userService);
export const transactions: any[] = [];

// Serve static HTML file at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'ui', 'user_crud.html'));
});

app.post('/api/users', (req, res) => {
    console.log('POST /api/users body:', req.body);
    const { name, email, accountType } = req.body;
    try {
        const user = userService.createUser({name, email, accountType});
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

app.get('/api/users', (req, res) => {
    try {
        const users = userService.getAllUsers();
        return res.status(200).json(users);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/transactions', (req, res) => {
    try {
        const txn = transactionService.createTransaction(req.body);
        res.status(200).json(txn);
    } catch (err: any) {
        console.error('!!! Error in createTransaction:', err.message);
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/users/:userId/transactions', (req, res) => {
    try {
        const txns = transactionService.getTransactionsByUserId(req.params.userId);
        res.status(200).json(txns);
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
});

app.listen(port, () => {
  console.log(`Mock API server listening at http://localhost:${port}`);
});