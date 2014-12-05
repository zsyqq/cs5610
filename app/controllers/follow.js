var mongoose = require('mongoose')
var Follow = mongoose.model('Follow')
var User = mongoose.model('User')

exports.unlike=function(req,res){
	var userid = req.params.id
	var fid = req.query.id
	console.log(fid);
	console.log(userid);
	if (userid) {
		Follow.update({person:userid},{$pull:{follows:fid}},function(err,m,raw){
			if (err) {console.log(err);}
			Follow.update({person:fid},{$pull:{befollows:userid}},function(err){
				if (err) {console.log(err);}
				res.json({success: 1})
			})
			
			
		})
	}
}




// like
exports.like = function(req, res) {
	var _follow
	var userid = req.params.id
	var fid = req.query.id



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
									res.json({success: 1})

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
							res.json({success: 1})
						}

					})

					
				})
			}
			else {
				res.json({success: 1})
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
									res.json({success: 1})

								})

							}res.json({success: 1})
						}
						else {
							var befollow = new Follow({person: fid})
							befollow.befollows.push(userid)
							befollow.save(function(err,befollow){
								if (err){console.log(err);}
							})
							console.log(befollow);
							res.json({success: 1})
						}

					})
				res.json({success: 1})
			})

		}
		})
}


