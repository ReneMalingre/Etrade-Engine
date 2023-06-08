const { Model, DataTypes } = require('sequelize')

const sequelize = require('../config/connection.js')

class Category extends Model {}

Category.init(
  {
    // define columns
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // define category_name column
    category_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    hooks: {
      // left in for reference/future use (hooks don't do anything here)
      // beforeCreate lifecycle "hook" functionality
      beforeCreate: async (newCategoryData) => {
        return newCategoryData
      },
      // beforeUpdate lifecycle "hook" functionality
      beforeUpdate: async (updatedCategoryData) => {
        return updatedCategoryData
      }
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category'
  }
)

module.exports = Category
