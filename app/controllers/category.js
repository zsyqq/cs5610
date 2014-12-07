var mongoose = require('mongoose')
var Category = mongoose.model('Category')

// admin new page
exports.new = function(req, res) {
  res.render('category_admin', {
    title: 'category upload',
    category: {}
  })
}

// admin post movie
exports.save = function(req, res) {
  var _category = req.body.category
  var category = new Category(_category)

  category.save(function(err, category) {
    if (err) {
      console.log(err)
    }

    res.redirect('/admin/category/list')
  })
}

// catelist page
exports.list = function(req, res) {
  Category.fetch(function(err, catetories) {
    if (err) {
      console.log(err)
    }

    res.render('categorylist', {
      title: 'category list',
      catetories: catetories
    })
  })
}

exports.del = function(req, res) {
  var id = req.query.id

  if (id) {
    Category.findById(id, function(err,cat){
      if (cat.movies.length <= 0){
        Category.remove({_id: id}, function(err, cat) {
          if (err) {
            console.log(err)
            res.json({success: 0})
          }
          else {
            res.json({success: 1})
      }
    })
      }
    })
    
  }
}