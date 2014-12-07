var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var MovieSchema = new Schema({
  // doctor: String,
  title: String,
  summary: String,
  flash: String,
  poster: String,
  year: String,
  pv: {
    type: Number,
    default: 0
  },
  belike : [{type: ObjectId, ref:'User'}],
  viewrate: Number, 
  favrate : Number, 
  likerate: Number, 
  dislrate: Number,
  category: {
    type: ObjectId,
    ref: 'Category', 
  },

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

// var ObjectId = mongoose.Schema.Types.ObjectId
MovieSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
})

MovieSchema.statics = {
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

module.exports = MovieSchema