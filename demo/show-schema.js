// show the table schema, foreign keys, and indexes in the command line
// for a MySQL database
const mysql = require('mysql2')
require('dotenv').config()
const chalk = require('chalk')

// Create a connection to the MySQL database
let connection = null
function createConnectionToDB () {
  connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
}

// Connect to the database
function connectToDB () {
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err)
      return false
    }
    return true
  }
  )
}

function showTableSchema () {
  // Query the table information
  const query = `
    SELECT
      TABLE_NAME,
      COLUMN_NAME,
      COLUMN_TYPE,
      IS_NULLABLE,
      COLUMN_DEFAULT
    FROM
      INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = '${process.env.DB_NAME}'
  `

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving table information:', err)
      return
    }

    // Format the query results as a table
    const tableData = results.map((row) => ({
      'Table Name': row.TABLE_NAME,
      'Column Name': row.COLUMN_NAME,
      'Column Type': row.COLUMN_TYPE,
      Nullable: row.IS_NULLABLE,
      'Default Value': row.COLUMN_DEFAULT
    }))

    // Display the table schema in the command line
    console.log(chalk.yellow('Table Schema:'))
    console.table(tableData)
  })
}

function showForeignKeys () {
  // Query the foreign key information
  const query = `
    SELECT
      KCU.TABLE_NAME,
      KCU.COLUMN_NAME,
      KCU.CONSTRAINT_NAME,
      KCU.REFERENCED_TABLE_NAME,
      KCU.REFERENCED_COLUMN_NAME,
      RC.UPDATE_RULE,
      RC.DELETE_RULE
    FROM
      INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KCU
      INNER JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS AS RC
        ON KCU.CONSTRAINT_NAME = RC.CONSTRAINT_NAME
          AND KCU.CONSTRAINT_SCHEMA = RC.CONSTRAINT_SCHEMA
    WHERE
      KCU.REFERENCED_TABLE_SCHEMA =  '${process.env.DB_NAME}'
  `

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving foreign key information:', err)
      return
    }

    // Format the query results as a table
    const tableData = results.map((row) => ({
      'Table Name': row.TABLE_NAME,
      'Column Name': row.COLUMN_NAME,
      'Constraint Name': row.CONSTRAINT_NAME,
      'Referenced Table': row.REFERENCED_TABLE_NAME,
      'Referenced Column': row.REFERENCED_COLUMN_NAME,
      'Update Rule': row.UPDATE_RULE,
      'Delete Rule': row.DELETE_RULE
    }))

    // Display the foreign keys in the command line
    console.log(chalk.yellow('Foreign Keys:'))
    console.table(tableData)
  })
}

// Query the index information for all tables
function showIndexes () {
  const query = `
  SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' 
  AND COLUMN_KEY = 'PRI' ORDER BY table_name;
  `

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving foreign key information:', err)
      return
    }

    // Format the query results as a table
    const tableData = results.map((row) => ({
      'Table Name': row.TABLE_NAME,
      'Column Name': row.COLUMN_NAME,
      'Data Type': row.DATA_TYPE
    }))

    // Display the foreign keys in the command line
    console.log(chalk.yellow('Primary Key Columns by Table:'))
    console.table(tableData)
  })
}

function closeConnection () {
  // Close the database connection
  connection.end()
}

function showSchema () {
  createConnectionToDB()
  connectToDB()
  showTableSchema()
  showIndexes()
  showForeignKeys()
  closeConnection()
}

showSchema()
