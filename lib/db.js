const util = require('./util')
const config = require('../config')

const knex = require('knex')({
  client: 'mysql',
  connection: config.db,
  debug: true,
 
})

module.exports = knex
