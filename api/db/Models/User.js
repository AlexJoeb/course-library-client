module.exports = (sequelize, DataTypes) => {
    const User = db.define('User', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName:{
            type: Sequelize.String,
            allowNull: false,
        },
        lastName:{
            type: Sequelize.String,
            allowNull: false,
        },
        emailAddress:{
            type: Sequelize.String,
            allowNull: false,
            unique:{
                args: true,
                msg: `This e-mail is already in use.`,
            }
        },
        password:{
            type: Sequelize.String,
            allowNull: false,
        },
    }, {});
    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: {
                fieldName: `userId`,
                allowNull: false,
            }
        })
    }
    return User;
};