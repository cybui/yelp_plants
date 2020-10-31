const express = require('express');
const router = express.Router({mergeParams:true});
const Comment = require('../models/comment');
const Plant = require('../models/plant');
const isLoggedIn = require('../utils/isLoggedIn');
const checkCommentOwner = require('../utils/checkCommentOwner');

// New Comment - Show Form 
router.get("/new", isLoggedIn, (req, res)=> {
	res.render("comments_new",{ plantId: req.params.id});
})

// Create Comment - Update DB
router.post("/", isLoggedIn, async (req, res)=> {
	try{
		// Create comment
		const newComment = Comment.create({
		user: {
			id: req.user._id,
			username: req.user.username,
		},
		text: req.body.text,
		plantId: req.body.plantId
		}) 
		req.flash("success", "Comment created");
		res.redirect(`/plants/${req.body.plantId}`);
	}
	catch(err){
		console.log(err)
		req.flash("error", "Error creating comment");
		res.redirect("/plants")
	}
})

// Edit Comment - show the edit form 
router.get("/:commentId/edit", checkCommentOwner, async (req, res) =>{
	try{
		const plant = await Plant.findById(req.params.id).exec();
		const comment = await Comment.findById(req.params.commentId).exec();
		res.render("comments_edit", {plant, comment});
	}
	catch(err){
		console.log(err);
		
	}
});

// Update Comment - actually update the DB
router.put("/:commentId",  checkCommentOwner, async (req,res)=>{
	try{
		const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new:true});
		req.flash("success", "Plant edited");
		res.redirect(`/plants/${req.params.id}`)
	}
	catch(err){
		console.log(err);
		req.flash("error", "Error editing comment");
		res.redirect("/plants")
	}
})

// Delete Comment
router.delete("/:commentId", checkCommentOwner, async (req, res)=>{
	try{
		const comment = await Comment.findByIdAndDelete(req.params.commentId);
		req.flash("success", "Comment deleted");
		res.redirect(`/plants/${req.params.id}`)
	}
	catch(err){
		console.log(err);
		req.flash("error", "Error deleting comment");
		res.redirect("/plants");
	}
})


module.exports = router;