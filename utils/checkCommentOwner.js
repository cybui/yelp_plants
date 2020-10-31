const Comment = require('../models/comment');

const checkCommentOwner = async (req, res, next) => {
	if(req.isAuthenticated()){ // check is the user is logged in 
		// Get plant from DB
		const comment = await Comment.findById(req.params.commentId).exec();
		
		// if logged in, check if they own the comment
		if(comment.user.id.equals(req.user._id)){ 
			next();
		}
		else { // if not, redirect back to show page
			req.flash("error", "You don't have permisson to do that.");
			res.redirect("back");
		}
	}
	else { // if not logged in, redirect to /login
		req.flash("error", "You must be logged in to do that.");
		res.redirect("/login");
	}
}

module.exports = checkCommentOwner;