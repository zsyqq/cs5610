var mongoose = require('mongoose')
var FavmvSchema = require('../schemas/favmv')
var Favmv = mongoose.model('Favmv', FavmvSchema)

module.exports = Favmv
