// Import Sequelize
const Sequelize = require('sequelize');
const {
    models
} = require('../index');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model {}

    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: `No value was found for title.`
                },
                notEmpty: {
                    msg: `No value was found for title.`
                }
            }
        },

        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: `No value was found for description.`
                },
                notEmpty: {
                    msg: `No value was found for description.`
                }
            }
        },

        estimatedTime: {
            type: Sequelize.STRING,
            allowNull: true
        },

        materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: true,
        },

        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            validate: {
                notNull: {

                    description: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        validate: {
                            notNull: {
                                msg: `No value was found for date created.`
                            },
                            notEmpty: {
                                msg: `No value was found for date created.`
                            }
                        }
                    },
                    msg: `No value was found for date created.`
                },
                notEmpty: {
                    msg: `No value was found for date created.`
                }
            }
        },

        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            validate: {
                notNull: {
                    msg: `No value was found for date updated.`
                },
                notEmpty: {
                    msg: `No value was found for date updated.`
                }
            }
        },

    }, {
        sequelize
    });
    Course.associate = (models) => {
        Course.hasOne(models.User, {
            as: "user",
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    }
    return Course;
}