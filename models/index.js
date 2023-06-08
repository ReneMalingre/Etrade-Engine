// import models
const Product = require('./Product')
const Category = require('./Category')
const Tag = require('./Tag')
const ProductTag = require('./ProductTag')

// Association Methods: these methods are used to create associations between models
// and appropriately update foreign keys and appropriately cascade on delete events etc

// Products belongsTo Category one to many relationship
// on delete defaults to set null
Product.belongsTo(Category, {
  foreignKey: 'category_id'
})

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id'
})

// many to many relationship between Product and Tag
// Products belongToMany Tags (through ProductTag)
// https://sequelize.org/docs/v6/core-concepts/assocs/
// ProductTag holds the foreign keys from Tag and Product
// to allow for the many to many relationship
// if a product or a tag is deleted, the ProductTag entry is deleted
Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id',
  unique: false
})
// can define an alias for the results eg as: 'product_tags'

// Tags belongToMany Products (through ProductTag)
// Like above, ProductTag holds the foreign keys from Tag and Product
// to allow for the many to many relationship
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id',
  unique: false
})

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag
}
