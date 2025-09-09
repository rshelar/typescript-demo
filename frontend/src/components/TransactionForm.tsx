import { useState } from 'react';

export function TransactionForm({ users }: { users: any[] }) {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('transfer');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: sender,
        recipientId: recipient,
        amount: Number(amount),
        type,
      }),
    });
    const txn = await res.json();
    console.log('Transaction created:', txn);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Transaction</h3>
      <select value={sender} onChange={(e) => setSender(e.target.value)}>
        <option value="">Sender</option>
        {users.map((u) => (
          <option key={u.userId} value={u.userId}>{u.name}</option>
        ))}
      </select>
      <select value={recipient} onChange={(e) => setRecipient(e.target.value)}>
        <option value="">Recipient</option>
        {users.map((u) => (
          <option key={u.userId} value={u.userId}>{u.name}</option>
        ))}
      </select>
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button type="submit">Send</button>
    </form>
  );
}