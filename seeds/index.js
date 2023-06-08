const seedCategories = require('./category-seeds')
const seedProducts = require('./product-seeds')
const seedTags = require('./tag-seeds')
const seedProductTags = require('./product-tag-seeds')

const sequelize = require('../config/connection')
const chalk = require('chalk')

console.log(chalk.blueBright('Seeding the ecommerce_db database...\n'))

const seedAll = async () => {
  await sequelize.sync({ force: true })
  console.log(chalk.greenBright('\n----- DATABASE SYNCED -----\n'))

  await seedCategories()
  console.log(chalk.yellow('\n----- CATEGORIES SEEDED -----\n'))

  await seedProducts()
  console.log(chalk.yellow('\n----- PRODUCTS SEEDED -----\n'))

  await seedTags()
  console.log(chalk.yellow('\n----- TAGS SEEDED -----\n'))

  await seedProductTags()
  console.log(chalk.yellow('\n----- PRODUCT TAGS SEEDED -----\n'))

  process.exit(0)
}

seedAll()
