var mongoose = require('mongoose')
var Movie = mongoose.model('Movie')
var User = mongoose.model('User')
var Favmv = mongoose.model('Favmv')

// unlike
exports.unlike=function(req,res){
	var userid = req.body.uid
	var mid = req.body.mid
	if (userid) {
		Favmv.update({person:userid},{$pull:{movies:mid}},function(err,m,raw){
			if (err) {console.log(err);}
			Movie.update({_id:mid},{$pull:{belike:userid}},function(err){
				if (err) {console.log(err);}
				res.redirect('/movie/'+mid)
			})
			
			
		})
	}
}







// like
exports.favmv = function(req, res) {
	var userid = req.body.uid
	var mid = req.body.mid
	var _favmv
	console.log(userid);


	Favmv.findOne({person: userid},function(err,favmv){

		if (favmv){
			console.log('existed favmv is %s',favmv._id);
			if (favmv.movies.indexOf(mid)<0){
				favmv.movies.push(mid)
				favmv.save(function(err,favmv){
					if (err) {console.log(err);}
					Movie.findById(mid, function(err,mv){
						if (err){console.log(err);}
						if (mv.belike.indexOf(userid)<0){
							mv.belike.push(userid)
							mv.save(function(err,mv){
								if (err) {console.log(err);}
								res.redirect('/movie/'+mid)
							})
						}
						else{res.redirect('/movie/'+mid)}
					})
				})
			}else{res.redirect('/movie/'+mid)}


		}
		else{
			console.log('new favmv');
			var favmv = new Favmv({
				person : userid,
			})
			console.log('new favmv is %s',favmv);
			favmv.movies.push(mid)
			favmv.save(function(err,favmv){
				if (err){console.log(err+'new favmv save');}
				Movie.findById(mid, function(err,movie){
					if (movie.belike.indexOf(userid)<0){
						if (err) {console.log(err);}
						movie.belike.push(userid)
						movie.save(function(err,movie){
							if(err){console.log(err+'movie save');}
							res.redirect('/movie/'+mid)

						})
					}else{res.redirect('/movie/'+mid)}
				})
				
			})

		}
	
})
}

