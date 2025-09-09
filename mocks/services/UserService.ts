import { User, AccountType } from '../types';
import { v4 as uuidv4 } from 'uuid';

function isValidAccountType(value: string): value is AccountType {
  return Object.values(AccountType).includes(value as AccountType);
}

export class UserService {
  private users = new Map<string, User>();
  private emails = new Set<string>();

  createUser(user: { name: string; email: string; accountType: string }): User {
    console.log('UserService.createUser called with:', user);
    const { name, email, accountType } = user;
    if (!name || !email || !accountType) {
      throw new Error('Missing required fields');
    }
    if (!isValidAccountType(accountType)) {
      throw new Error('Invalid account type');
    }
    if (this.emails.has(email)) {
      throw new Error('Email already exists');
    }

    const userObj: User = {
      userId: uuidv4(),
      name,
      email,
      accountType,
    };

    this.users.set(userObj.userId!, userObj);
    this.emails.add(email);
    console.log('Created user:', user)
    return userObj;
  }

  getUserById(userId: string): User | undefined {
    if (!this.users.has(userId)) {
      throw new Error('User not found');
    }
    return this.users.get(userId);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  updateUser(userId: string, updates: Partial<Omit<User, 'userId'>>): User {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (updates.email && updates.email !== user.email) {
      if (this.emails.has(updates.email)) {
        throw new Error('Email already exists');
      }
      this.emails.delete(user.email);
      this.emails.add(updates.email);
    }

    Object.assign(user, updates);
    this.users.set(userId, user);
    return user;
  }

  deleteUser(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) {
      return false;
    }

    this.emails.delete(user.email);
    this.users.delete(userId);
    return true;
  }

  reset(): void {
    this.users.clear();
    this.emails.clear();
  }
}