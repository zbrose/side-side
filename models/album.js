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
      // models.album.hasMany(models.comment)
      // models.album.belongsTo(models.user)
      models.album.belongsToMany(models.category,{through:'albums_categories'})
      models.user.belongsToMany(models.album,{through: 'users_albums'})
    }
  }
  album.init({
    title: DataTypes.STRING,
    artist: DataTypes.STRING,
    img_url: DataTypes.TEXT,
    artist_id: DataTypes.INTEGER,
    album_id: DataTypes.INTEGER,
    // userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'album',
  });
  return album;
};

// add img url
