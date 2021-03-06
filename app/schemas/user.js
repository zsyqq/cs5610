var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var SALT_WORK_FACTOR = 10
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var UserSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  password: String,
  // 0: nomal user
  // 1: verified user
  // 2: professonal user
  // >10: admin
  // >50: super admin
  pv : Number,
  interest:String,
  role: {
    type: Number,
    default: 0
  },
  poster : {type:String,default:'icon-1.png'},
  intro:String,

  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

UserSchema.pre('save', function(next) {
  var user = this

  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }
  if (user.password.length<15){
     bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err)

      user.password = hash
      next()
    })
  })


  }
  else
  {
    next()
  }

 
})

UserSchema.methods = {
  comparePassword: function(_password, cb) {
    bcrypt.compare(_password, this.password, function(err, isMatch) {
      if (err) return cb(err)

      cb(null, isMatch)
    })
  }
}

UserSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = UserSchema