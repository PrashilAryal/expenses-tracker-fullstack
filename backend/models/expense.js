"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "user_email" });
    }
  }
  Expense.init(
    {
      title: DataTypes.STRING,
      user_email: DataTypes.STRING,
      note: DataTypes.STRING,
      category_name: DataTypes.STRING,
      type: DataTypes.STRING,
      amount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Expense",
    }
  );
  return Expense;
};
