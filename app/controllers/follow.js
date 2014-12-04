var mongoose = require('mongoose')
var Follow = mongoose.model('Follow')
var User = mongoose.model('User')

exports.unlike=function(req,res){
	var userid = req.body.uid
	var fid = req.body.fid
	if (userid) {
		Follow.update({person:userid},{$pull:{follows:fid}},function(err,m,raw){
			if (err) {console.log(err);}
			Follow.update({person:fid},{$pull:{befollows:userid}},function(err){
				if (err) {console.log(err);}
				res.redirect('/user/'+fid)
			})
			
			
		})
	}
}




// like
exports.like = function(req, res) {
	var _follow
	var userid = req.body.uid
	var fid = req.body.fid



	Follow.findOne({person: userid},function(err,follow){

		if (follow){
			if (follow.follows.indexOf(fid) < 0){
				
				follow.follows.push(fid) 
				follow.save(function(err,follow){
					if (err) {
						console.log(err);
					}
					Follow.findOne({person:fid},function(err,befollow){
						if (befollow){
							if(befollow.befollows.indexOf(userid) < 0) {
								if (err) {console.log(err)}
								befollow.befollows.push(userid)
								befollow.save(function(err,befollow){
									if (err) {console.log(err);}

								})

							}
						}
						else {
							var befollow = new Follow({person: fid})
							befollow.befollows.push(userid)
							befollow.save(function(err,befollow){
								if (err){console.log(err);}
							})
							console.log(befollow);
						}

					})

					res.redirect('/user/'+fid)
				})
			}
			else {
				res.redirect('/user/'+ fid)
			}
		}
		else {
			var follow = new Follow({
				person : userid, 

			})
			// follow.person = userid 
			follow.follows.push(fid)
			console.log(follow)
			follow.save(function(err,follow){
				if (err){
					console.log(err)
				}
				Follow.findOne({person:fid},function(err,befollow){
						if (befollow){
							if(befollow.befollows.indexOf(userid) < 0) {
								if (err) {console.log(err)}
								befollow.befollows.push(userid)
								befollow.save(function(err,befollow){
									if (err) {console.log(err);}

								})

							}
						}
						else {
							var befollow = new Follow({person: fid})
							befollow.befollows.push(userid)
							befollow.save(function(err,befollow){
								if (err){console.log(err);}
							})
							console.log(befollow);
						}

					})
				res.redirect('/user/'+fid)
			})

		}
		})
}


