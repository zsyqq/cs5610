var mongoose = require('mongoose')
var Movie = mongoose.model('Movie')
var Category = mongoose.model('Category')
var User = mongoose.model('User')

// index page
exports.index = function(req, res) {
  Category
    .find({})
    .populate({
      path: 'movies',
      select: 'title poster summary pv meta.updateAt',
      options: { limit: 10 }
    })
    .exec(function(err, categories) {
      if (err) {
        console.log(err)
      }
      Movie.find().sort({'meta.updateAt':-1})
      .exec(function(err,movies){
        if (err){console.log(err);}

        Movie.find().sort({pv:-1}).exec(function(err,pvmovies){
          User.find().sort({pv:-1}).exec(function(err,users){
            console.log(users);
            res.render('demo', {
            title: 'Web Development Learning',
            categories: categories, 
            movies:movies, 
            pvmvs : pvmovies, 
            pvusers : users,
      })

          })
      

        })
      
      })

      
    })
}

// search page
exports.search = function(req, res) {
  console.log('start search...');
  var catId = req.query.cat
  var q = req.query.q
  var page = parseInt(req.query.p, 10) || 0
  var count = 2
  var index = page * count

  if (catId) {
    Category
      .find({_id: catId})
      .populate({
        path: 'movies',
        select: 'title poster'
      })
      .exec(function(err, categories) {
        if (err) {
          console.log(err)
        }
        var category = categories[0] || {}
        var movies = category.movies || []
        var results = movies.slice(index, index + count)
        console.log('result page!!');

        res.render('results', {
          title: 'Search Result',
          keyword: category.name,
          currentPage: (page + 1),
          query: 'cat=' + catId,
          totalPage: Math.ceil(movies.length / count),
          movies: results
        })
      })
  }
  else {
    Movie
      .find({title: new RegExp(q + '.*', 'i')})
      .exec(function(err, movies) {
        if (err) {
          console.log(err)
        }
        var results = movies.slice(index, index + count)
        console.log(results)

        res.render('results', {
          title: 'Search Resutl',
          keyword: q,
          currentPage: (page + 1),
          query: 'q=' + q,
          totalPage: Math.ceil(movies.length / count),
          movies: results
        })
      })
  }
}