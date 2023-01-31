import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../data-access/dbConfig';
import Group from './groupModel';
import User from './userModel';

const userModel = User(sequelize);
const groupModel = Group(sequelize);

export default (sequelize: Sequelize) => {
    const UserGroup = sequelize.define(
        'user_group',
        {
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            groupId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
        },
        {
            timestamps: false,
        }
    );

    userModel.belongsToMany(groupModel, {
        through: 'user_group',
        foreignKey: 'userId',
    });

    groupModel.belongsToMany(userModel, {
        through: 'user_group',
        foreignKey: 'groupId',
    });

    return UserGroup;
};
