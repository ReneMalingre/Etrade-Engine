// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize')
// import our database connection from config.js
const sequelize = require('../config/connection')

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

// set up fields and rules for Product model
Product.init(
  {
    // define columns
    // id
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },

    // define product_name column
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // define price column
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true
      }
    },

    // define stock column
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: {
        isNumeric: true
      }
    },

    // define category_id column
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'category',
        key: 'id'
      }
    }
  },

  {
    hooks: {
      // left in for reference/future use (hooks don't do anything here)
      // beforeCreate lifecycle "hook" functionality
      beforeCreate: async (newProductData) => {
        return newProductData
      },
      // beforeUpdate lifecycle "hook" functionality
      beforeUpdate: async (updatedProductData) => {
        return updatedProductData
      }
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product'
  }
)

module.exports = Product
