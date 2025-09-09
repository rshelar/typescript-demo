import { useState } from 'react';

export function UserForm({ onUserCreated }: { onUserCreated: (user: any) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState('basic');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, accountType }),
    });
    const user = await res.json();
    onUserCreated(user);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create User</h3>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
        <option value="basic">Basic</option>
        <option value="premium">Premium</option>
      </select>
      <button type="submit">Create</button>
    </form>
  );
}