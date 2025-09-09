import { useState, useEffect } from 'react';

export function TransactionList({ selectedUserId }: { selectedUserId: string }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (selectedUserId) {
      fetch(`http://localhost:3000/api/users/${selectedUserId}/transactions`)
        .then((res) => res.json())
        .then((data) => setTransactions(data));
    }
  }, [selectedUserId]);

  return (
    <div>
      <h3>Transactions for User</h3>
      <ul>
        {transactions.map((txn: any) => (
          <li key={txn.transactionId}>
            Sent ${txn.amount} to {txn.recipientId}
          </li>
        ))}
      </ul>
    </div>
  );
}