import type { Express } from 'express';
import express from 'express';
import sequelize from './data-access/dbConfig';
import routes from './api/routers/userRouter';

const app: Express = express();
const port = 3000;

const startAppServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    app.use('/', routes);
    app.listen(port, () => {
        console.log(`App server is running on http://localhost:${port}`);
    });
};

startAppServer();