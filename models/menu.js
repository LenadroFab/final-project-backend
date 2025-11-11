'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {
      Menu.hasMany(models.OrderItem, { foreignKey: 'menu_id' });
    }
  }
  Menu.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Menu',
    tableName: 'menus'
  });
  return Menu;
};
