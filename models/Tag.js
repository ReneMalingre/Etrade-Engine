const { Model, DataTypes } = require('sequelize')

const sequelize = require('../config/connection.js')

class Tag extends Model {}

Tag.init(
  {
    // define columns
    // id
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    // define tag_name column
    tag_name: {
      type: DataTypes.STRING
    }
  },
  {
    hooks: {
      // left in for reference/future use (hooks don't do anything here)
      // beforeCreate lifecycle "hook" functionality
      beforeCreate: async (newTagData) => {
        return newTagData
      },
      // beforeUpdate lifecycle "hook" functionality
      beforeUpdate: async (updatedTagData) => {
        return updatedTagData
      }
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'tag'
  }
)

module.exports = Tag
