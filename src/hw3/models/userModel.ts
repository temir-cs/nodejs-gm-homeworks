import { DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
    const User = sequelize.define(
        'users',
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
                unique: true,
            },
            login: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            age: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            isDeleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            timestamps: false,
        }
    );
    return User;
};
