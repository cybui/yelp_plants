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
		console.log(newComment);
		res.redirect(`/plants/${req.body.plantId}`);
	}
	catch(err){
		console.log(err)
		res.send("broke again POST comments")	
	}
})

// Edit Comment - show the edit form 
router.get("/:commentId/edit", checkCommentOwner, async (req, res) =>{
	try{
		const plant = await Plant.findById(req.params.id).exec();
		const comment = await Comment.findById(req.params.commentId).exec();
		console.log("plant: ", plant);
		console.log("comment: ", comment);
		res.render("comments_edit", {plant, comment});
	}
	catch(err){
		console.log(err);
		res.send("Broke comment edit GET")
	}
});

// Update Comment - actually update the DB
router.put("/:commentId",  checkCommentOwner, async (req,res)=>{
	try{
		const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new:true});
		console.log(comment);
		res.redirect(`/plants/${req.params.id}`)
	}
	catch(err){
		console.log(err);
		res.send("Broke comment PUT");
	}
})

// Delete Comment
router.delete("/:commentId", checkCommentOwner, async (req, res)=>{
	try{
		const comment = await Comment.findByIdAndDelete(req.params.commentId);
		console.log(comment);
		res.redirect(`/plants/${req.params.id}`)
	}
	catch(err){
		console.log(err);
		res.send("Broke comment DELETE")
	}
})


module.exports = router;