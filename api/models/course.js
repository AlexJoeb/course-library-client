// * The only thing is file is for is the Course Scheme; therefore we can just use module exports to ship off the Schema without assigning it to a variable.
// * API Reference for Models: https://sequelize.org/master/class/lib/model.js~Model.html
// * API Reference for DataTypes: https://sequelize.org/master/variable/index.html#static-variable-DataTypes
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
      },
      title: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      description: {
          type: {
              type: DataTypes.TEXT,
              allowNull: false,
          },
      },
      estimatedTime: {
          type: DataTypes.STRING,
          allowNull: true,
      },
      materialsNeeded: {
          type: DataTypes.STRING,
          allowNull: true,
      },
  }, {});

  // * Associate One User to Course with .belongsTo().
  Course.associate = (models) => {
      // * API Reference for BelongsTo: https://sequelize.org/master/class/lib/model.js~Model.html#static-method-belongsTo
      Course.belongsTo(models.User, {
          // * This area is for options.

          // * The foreign key adds/checks for another column specified by 'fieldName' to the Course model.
          // * "The name of the foreign key in the join table (representing the source model) or an object representing the type 
          // * definition for the foreign column (see Sequelize.define for syntax). When using an object, you can add a name 
          // * property to set the name of the column. Defaults to the name of source + primary key of source".
          // *    - API Reference for BelongsTo: https://sequelize.org/master/class/lib/model.js~Model.html#static-method-belongsTo
          foreignKey: {
              fieldName: `userId`, // * The foreignKey's name is `userid`.
              allowNull: false, // * Don't allow a null value for this field.
          }
      });
  }

  // * Return Course model.
  return Course;
}