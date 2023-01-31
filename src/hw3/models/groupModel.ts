import { DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
    const Group = sequelize.define(
        'groups',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                unique: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            permssions: {
                type: DataTypes.ARRAY(DataTypes.TEXT),
                allowNull: false,
            },
        },
        {
            timestamps: false,
        }
    );
    return Group;
};
