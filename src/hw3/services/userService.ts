import User from '../models/userModel';
import sequelize from '../data-access/dbConfig';
import { logError } from '../utils/utils';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { IUser } from '../interfaces/IUser';

const UserModel = User(sequelize);

export default class UserService {
    // Create
    public static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { login, password, age } = req.body;
        const id = uuidv4();

        try {
            const user = UserModel.create({ id, login, password, age });
            res.status(201).send(user);
        } catch (error) {
            return next(error);
        }
    }

    // Read
    public static async getAllUsers(_req: Request, res: Response, next: NextFunction) {
        try {
            const userList = await UserModel.findAll();
            res.send(userList);
        } catch (error) {
            next(error);
            logError(error);
        }
    }

    public static async getUsersList(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { loginSubstring = '', limit = 10 } = req.query;
        try {
            const list = await UserModel.findAll({
                where: {
                    login: {
                        [Op.like]: `%${(loginSubstring as string).toLowerCase()}%`,
                    },
                },
                order: ['login'],
                limit: +limit,
            });

            res.send(list);
        } catch (error) {
            return next(error);
        }
    }

    public static async getUserById(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        try {
            const user = await UserModel.findByPk(id);
            if (!user) {
                res.status(404).send('User with the given ID is not found');
            } else {
                res.send(user);
            }
        } catch (error) {
            next(error);
            logError(error);
        }
    }

    // Update
    public static async updateUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;
        const { login, password, age } = req.body;

        try {
            const user = await UserModel.findByPk(id);

            if (!user) {
                res.status(404).send('User with the given ID is not found');
            } else {
                const userObj = user as unknown as IUser;
                userObj.login = login;
                userObj.password = password;
                userObj.age = age;
                await user.save();
            }
        } catch (error) {
            next(error);
            logError(error);
        }
    }

    // Delete
    public static async deleteUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;

        try {
            const [affectedRows] = await UserModel.update(
                {
                    isDeleted: true,
                },
                {
                    where: {
                        id,
                        isDeleted: false,
                    },
                }
            );

            if (!affectedRows) {
                res.status(404).send('User with the given ID is not found');
            } else {
                res.status(204).send('User has been deleted');
            }
        } catch (error) {
            next(error);
            logError(error);
        }
    }
}