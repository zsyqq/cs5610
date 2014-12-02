var mongoose = require('mongoose')
var FollowSchema = require('../schemas/follow')
var Follow = mongoose.model('Follow', FollowSchema)

module.exports = Follow