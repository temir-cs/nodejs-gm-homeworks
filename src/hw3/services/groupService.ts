import Group from '../models/groupModel';
import sequelize from '../data-access/dbConfig';
import { logError } from '../utils/utils';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { IGroup } from '../interfaces/IGroup';
import User from '../models/userModel';
import UserGroup from '../models/userGroupModel';
import { IUser } from '../interfaces/IUser';

const GroupModel = Group(sequelize);
const UserModel = User(sequelize);
const UserGroupModel = UserGroup(sequelize);

export default class UserService {
    // Create
    public static async createGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { name, permissions } = req.body;
        const id = uuidv4();

        try {
            const user = GroupModel.create({ id, name, permissions });
            res.status(201).send(user);
        } catch (error) {
            return next(error);
        }
    }

    // Read
    public static async getGroupsList(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const groups = await GroupModel.findAll();

            res.send(groups);
        } catch (error) {
            return next(error);
        }
    }

    public static async getGroupById(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        try {
            const group = await GroupModel.findByPk(id);
            if (!group) {
                res.status(404).send('Group with the given ID is not found');
            } else {
                res.send(group);
            }
        } catch (error) {
            next(error);
            logError(error);
        }
    }

    // Update
    public static async updateGroupById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;
        const { name, permissions } = req.body;

        try {
            const group = await GroupModel.findByPk(id);

            if (!group) {
                res.status(404).send('Group with the given ID is not found');
            } else {
                const userObj = group as unknown as IGroup;
                userObj.name = name;
                userObj.permissions = permissions;
                await group.save();
            }
        } catch (error) {
            next(error);
            logError(error);
        }
    }

    public static async addUsersToGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { groupId, userIds } = req.body;
        const transaction = await sequelize.transaction();

        try {
            const group = await GroupModel.findByPk(groupId);

            if (!group) {
                res.status(404).send('Group with the given ID is not found');
            } else {
                const users = await UserModel.findAll({
                    where: {
                        id: userIds,
                        isDeleted: false,
                    },
                    transaction,
                });
                for (const user of users) {
                    await UserGroupModel.create(
                        {
                            userId: (user as unknown as IUser).id,
                            groupId: (group as unknown as IGroup).id,
                        },
                        { transaction: transaction }
                    );
                }
                await transaction.commit();
            }
        } catch (error) {
            next(error);
            logError(error);
        }
    }

    // Delete
    public static async deleteGroupById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const transaction = await sequelize.transaction();

        const id = req.params.id;

        try {
            const deleted = await GroupModel.destroy({
                where: {
                    id,
                },
                transaction,
            });

            if (!deleted) {
                res.status(404).send('User with the given ID is not found');
            } else {
                res.status(204).send('User has been deleted');
            }
            await transaction.commit();
        } catch (error) {
            next(error);
            logError(error);
        }
    }
}