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
			res.redirect("back");
		}
	}
	else { // if not logged in, redirect to /login
		res.redirect("/login");
	}
}

module.exports = checkCommentOwner;