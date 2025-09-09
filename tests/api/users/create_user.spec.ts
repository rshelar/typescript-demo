import { test, expect } from '@playwright/test';
import { generateUser } from '../helpers/dataFactory';
import { UserService } from '../path/to/UserService';

test('should create a user successfully', async ({ request }) => {
    const payload = generateUser();
    const response = await request.post('http://localhost:3000/api/users', {
        data: payload,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
        name: payload.name,
        email: payload.email,
        accountType: payload.accountType,
    });
    expect(body.userId).toBeDefined();
});

test('should get a valid user', async ({ request }) => {
    const payload = generateUser();
    let response = await request.post('http://localhost:3000/api/users', {
        data: payload,
    });
    expect(response.status()).toBe(201);
    let body = await response.json();
    const user_id = body.userId

    response = await request.get('http://localhost:3000/api/users', {
        data: { userId: `${user_id}` },
    });
    expect(response.status()).toBe(200);
    body = await response.json();
    expect(body).toMatchObject({
        userId: user_id,
        name: payload.name,
        email: payload.email,
        accountType: payload.accountType,
    });
});

test('should create multiple users', () => {
    const userService = new UserService();
    const num_of_users = 10
    for (let i = 0; i < num_of_users; i++) {
        userService.createUser(generateUser());
    }
    expect(userService.getAllUsers().length).toBe(num_of_users)
});

test('should not get a non existent user', () => {
    const userService = new UserService();
    expect(() => userService.getUserById("1231231")).toThrow('User not found');
});

test('should not create a user with missing name', () => {
    const userService = new UserService();
    expect(() => userService.createUser({ email: "foo@gmail.com", accountType: "basic" }))
    .toThrow('Missing required fields');
});

test('should not create a user with missing email', () => {
    const userService = new UserService();
    expect(() => userService.createUser({ name: "John Smith", accountType: "premium" }))
    .toThrow('Missing required fields');
});

test('should not create a user with missing accountType', () => {
    const userService = new UserService();
    expect(() => userService.createUser({ name: "John Smith", email: "foo@gmail.com" }))
    .toThrow('Missing required fields');
});

test('should not create a user with invalid accountType', () => {
    const userService = new UserService();
    expect(() => userService.createUser({ name: "John Smith", email: "foo@gmail.com", accountType: "foobar" }))
    .toThrow('Missing required fields');
});

test('should not create a user with duplicate email', async ({ request }) => {
    const userService = new UserService();
    const user_email = "john@gmail.com"
    userService.createUser({ name: "John Smith", email: user_email, accountType: "basic" })
    expect(() => userService.createUser({ name: "Blake Jefferson", email: user_email, accountType: "premium" }))
        .toThrow('Email already exists');
});
