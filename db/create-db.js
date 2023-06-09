// This module is an alternative to using the MySQL command line interface 
// to create/recreate the database
// creates database ecommerce_db via "npm run create-db"

// database engine
const mysql = require('mysql2')
// environment variables
require('dotenv').config()
// chalk for colorful console.log
const chalk = require('chalk')

console.log(chalk.blue('Creating the ecommerce_db database...\n'))

// Create a connection to the MySQL engine
let connection = null
async function createECommerceDB () {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  })

  // Connect to the MySQL engine and create the database
  if (connection) {
    console.log('Connected to MySQL engine, ready to create the database.')
    createDBs()
  } else {
    console.log('Error connecting to the database')
  }
}

function createDBs () {
  connection.connect(function (err) {
    if (err) {
      console.error('Error connecting to the database:', err)
      return
    }

    let sql = 'DROP DATABASE IF EXISTS ecommerce_db;'
    connection.query(sql, function (err, result) {
      if (err) {
        console.error('Error creating the database:', err)
      } else {
        console.log(chalk.yellowBright('ecommerce_db Database dropped'))
      }
    })

    sql = 'CREATE DATABASE ecommerce_db;'
    connection.query(sql, function (err, result) {
      if (err) {
        console.error('Error creating the database:', err)
      } else {
        console.log(chalk.yellowBright('ecommerce_db Database created'))
      }
    })
    // end the connection
    connection.end()
  })
}

createECommerceDB()
