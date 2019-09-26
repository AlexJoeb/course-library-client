// * The only thing is file is for is the User Scheme; therefore we can just use module exports to ship off the Schema without assigning it to a variable.
// * API Reference for Models: https://sequelize.org/master/class/lib/model.js~Model.html
// * API Reference for DataTypes: https://sequelize.org/master/variable/index.html#static-variable-DataTypes
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
      },
      firstName: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      lastName:{
          type: DataTypes.STRING,
          allowNull: false,
      },
      emailAddress:{
          type: DataTypes.STRING,
          allowNull: false,
          unique:{
              args: true,
              msg: `This e-mail is already in use.`,
          }
      },
      password:{
          type: DataTypes.STRING,
          allowNull: false,
      },
  }, {});

  // * Allow association of User to many Course models with .hasMany().
  User.associate = (models) => {
      // * API Reference for BelongsTo: https://sequelize.org/master/class/lib/associations/has-many.js~HasMany.html
      User.hasMany(models.Course);
  }

  // * Return User model.
  return User;
};