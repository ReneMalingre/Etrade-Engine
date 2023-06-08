const express = require('express')
const routes = require('./routes')
const chalk = require('chalk')
// import sequelize connection
const sequelize = require('./config/connection')

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(routes)

// sync sequelize models to the database
sequelize.sync({ force: false })

// Turn on the server
app.listen(PORT, () => {
  console.log(chalk.yellowBright(`App listening on port ${PORT}!`))
})
