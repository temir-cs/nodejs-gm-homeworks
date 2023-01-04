import type { Express } from 'express';
import userValidator from './userValidator';
import express from 'express';
const { v4: uuidv4 } = require('uuid');

type User = {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
};

const app: Express = express();
const port = 3000;
const users: User[] = [];
const findUser = (id: string) => users.find((user) => user.id === id);

// Create new user
app.post('/users', userValidator(), (req, res) => {
    const user: User = req.body;
    user.id = uuidv4();
    user.isDeleted = false;

    users.push(user);
    res.status(201).send(user);
});

// Get autosuggest users
app.get('/users', (req, res) => {
    const { loginSubstring = '', limit = 5 } = req.query;

    const autoSuggestList: User[] = users
        .filter((user) => !user.isDeleted && user.login.includes(String(loginSubstring)))
        .sort((a, b) => a.login.localeCompare(b.login))
        .slice(0, +limit);

    res.send(autoSuggestList);
});

// Get user by ID
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const user = findUser(id);

    if (!user) res.status(404).send('User with the given ID is not found');
    res.send(user);
});

// Update user
app.put('/users/:id', userValidator(), (req, res) => {
    const id = req.params.id;
    const { login, password, age } = req.body;
    const user = findUser(id);

    if (!user) {
        res.status(404).send('User not found');
    } else {
        user.login = login;
        user.password = password;
        user.age = age;
        res.status(200).send(user);
    }
});

// Delete user
app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    const user = findUser(id);

    if (!user || user.isDeleted) {
        res.status(404).send('User not found');
    } else {
        user.isDeleted = true;
        res.status(200).send('User has been deleted');
    }
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
