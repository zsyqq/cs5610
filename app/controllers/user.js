var mongoose = require('mongoose')
var User = mongoose.model('User')
var Follow = mongoose.model('Follow')
var Movie = mongoose.model('Movie')
var Favmv = mongoose.model('Favmv')
var _ = require('underscore')
var fs = require('fs')
var path = require('path')



// photo save
exports.savePhoto= function(req, res, next) {
  var posterData = req.files.uploadPoster
  var filePath = posterData.path
  var originalFilename = posterData.originalFilename

  if (originalFilename) {
    fs.readFile(filePath, function(err, data) {
      var timestamp = Date.now()
      var type = posterData.type.split('/')[1]
      var poster = timestamp + '.' + type
      var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)

      fs.writeFile(newPath, data, function(err) {
        req.poster = poster
        next()
      })
    })
  }
  else {
    next()
  }
}



// info save 
exports.infosave = function(req,res){
  var uid = req.body.uid
  var uinterest = req.body.uinterest
  var uintro = req.body.uintro

  
  User.findById(uid,function(err,user){
    user.interest = uinterest
    user.intro = uintro
    if (req.poster) {
      user.poster = req.poster
      
    }
    user.save(function(err,user){
      if (err) console.log(err);
      res.redirect('/user/'+user._id)
    })

  })

  }
  


// signup
exports.showSignup = function(req, res) {
  res.render('signup', {
    title: 'Sign Up'
  })
}

exports.showSignin = function(req, res) {
  res.render('signin', {
    title: 'Login'
  })
}



exports.signup = function(req, res) {
  var _user = req.body.user

  User.findOne({name: _user.name},  function(err, user) {
    if (err) {
      console.log(err)
    }

    if (user) {
      return res.redirect('/signin')
    }
    else {
      user = new User(_user)
      user.save(function(err, user) {
        if (err) {
          console.log(err)
        }

        res.redirect('/')
      })
    }
  })
}

// signin
exports.signin = function(req, res) {
  var _user = req.body.user
  var name = _user.name
  var password = _user.password

  User.findOne({name: name}, function(err, user) {
    if (err) {
      console.log(err)
    }

    if (!user) {
      return res.redirect('/signup')
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log(err)
      }

      if (isMatch) {
        req.session.user = user

        return res.redirect('/')
      }
      else {
        console.log('passowrd is incorrect!')
        return res.redirect('/signin')
      }
    })
  })
}

// logout
exports.logout =  function(req, res) {
  delete req.session.user
  //delete app.locals.user

  res.redirect('/')
}

// userlist page
exports.list = function(req, res) {
  User.fetch(function(err, users) {
    if (err) {
      console.log(err)
    }

    res.render('userlist', {
      title: 'User List',
      users: users
    })
  })
}

// profile page
exports.showInfo = function(req,res) {
  var id = req.params.id 
  User.update({_id : id},{$inc:{pv:1}}, function(err){
    if (err) {
      console.log(err)
    }
  })

  User
  .findOne({_id : id})
  .exec(function(err,to){

    Follow
    .find({person:id})
    .populate('follows','name _id poster')
    .populate('befollows','name _id poster')
    .exec(function(err,follow){
      var follow  = follow[0] || {}
      var follows = follow.follows || []
      var befollows = follow.befollows || []
      // console.log('follows is %s',follows._id);
      if (err) {console.log(err);}
      Favmv
      .findOne({person:id})
      .populate('movies','title poster category')
      .exec(function(err,favmv){
        var favmv = favmv || {}
        var movies = favmv.movies || []
        Follow.findOne({person:id})
        .exec(function(err,f){
          var f = f || []
          console.log(f);
          var fs = f.befollows || []
          res.render('profile1',{
            title: 'profile', 
            to : to, 
            follows : follows, 
            befollows : befollows, 
            movies : movies, 
            f:fs
      })
        })


   
      })


    })
  })
}


// midware for user
exports.signinRequired = function(req, res, next) {
  var user = req.session.user

  if (!user) {
    return res.redirect('/signin')
  }

  next()
}


exports.adminRequired = function(req, res, next) {
  var user = req.session.user

  if (user.role <= 10) {
    return res.redirect('/signin')
  }

  next()
}

exports.adminRequired = function(req, res, next) {
  var user = req.session.user
  console.log(user);
  if (user.role <= 10) {
    return res.redirect('/signin')
  }

  next()
}
