'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.album.belongsTo(models.user)
      models.album.hasMany(models.comment)
      models.album.belongsToMany(models.category,{through:'albums_categories'})
    }
  }
  album.init({
    title: DataTypes.STRING,
    artist: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'album',
  });
  return album;
};