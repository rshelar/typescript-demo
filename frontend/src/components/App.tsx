import { useState } from 'react';
import { UserForm } from './components/UserForm';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';

function App() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  return (
    <div>
      <h2>Flowcast Wallet UI</h2>
      <UserForm onUserCreated={(user) => setUsers((prev) => [...prev, user])} />
      <hr />
      <TransactionForm users={users} />
      <hr />
      <select onChange={(e) => setSelectedUserId(e.target.value)} defaultValue="">
        <option value="">Select user to view transactions</option>
        {users.map((u) => (
          <option key={u.userId} value={u.userId}>{u.name}</option>
        ))}
      </select>
      <TransactionList selectedUserId={selectedUserId} />
    </div>
  );
}

export default App;