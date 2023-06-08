const { Model, DataTypes } = require('sequelize')

const sequelize = require('../config/connection')

class ProductTag extends Model {}

ProductTag.init(
  {
    // define columns
    // id
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    // product id, references product model's id
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'product',
        key: 'id',
        unique: false
      }
    },
    // tag id, references tag model's id
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tag',
        key: 'id',
        unique: false
      }
    }
  },
  {
    hooks: {
      // left in for reference/future use (hooks don't do anything here)
      beforeCreate: async (newProductTagData) => {
        return newProductTagData
      },
      // beforeUpdate lifecycle "hook" functionality
      beforeUpdate: async (updatedProductTagData) => {
        return updatedProductTagData
      }
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag'
  }
)

module.exports = ProductTag
