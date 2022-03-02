'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class albums_categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  albums_categories.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'albums_categories',
  });
  return albums_categories;
};