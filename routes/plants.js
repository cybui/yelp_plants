const express = require("express");
const router = express.Router();
const Plant = require("../models/plant");
const Comment = require("../models/comment");
const isLoggedIn = require('../utils/isLoggedIn');
const checkPlantOwner = require('../utils/checkPlantOwner');

// Index
router.get("/", async (req, res) => {
	console.log(req.user);
	try{
		const plants = await Plant.find().exec();
		res.render("plants", {plants});	
	}
	catch(err){
		console.log(err);
		res.send("you broke it... /index ");
}
	
})

// Alphebetical Order
router.get("/alphabetical", async (req, res) =>{
	try{
		const plants = await Plant.find().sort('commonName').exec();
		res.render("plants", {plants});
	}
	catch(err){
		console.log(err);
	}
})

// Ascending votes
router.get("/descending", async(req, res) =>{
	try{
		const plants = await Plant.aggregate([
			{
     			$addFields: {
					upvotes_count: {$size: { "$ifNull": [ "$upvotes", [] ] } } ,
					downvotes_count: {$size: { "$ifNull": [ "$downvotes", [] ] } },
					score: {$subtract: [ "$upvotes_count", "$downvotes_count" ]}
				}
     		},
    		{   
        	$sort: {"upvotes_count" :-1} }
		]).exec();
		
		res.render("plants", {plants})
	}
	catch(err){
		console.log(err);
	}
})
// Descending votes
router.get("/ascending", async(req, res) =>{
	try{
		const plants = await Plant.aggregate([
			{
     			$addFields: {
					upvotes_count: {$size: { "$ifNull": [ "$upvotes", [] ] } } ,
					downvotes_count: {$size: { "$ifNull": [ "$downvotes", [] ] } },
					score: {$subtract: [ "$upvotes_count", "$downvotes_count" ]}
				}
     		},
    		{   
        	$sort: {"upvotes_count" :1} }
		]).exec();
		
		res.render("plants", {plants})
	}
	catch(err){
		console.log(err);
	}
})

// Create
router.post("/", isLoggedIn, async (req, res) => {
	console.log(req.body);
	const type = req.body.type.toLowerCase();
	const newPlant = {
		commonName: req.body.commonName,
		scientificName: req.body.scientificName,
		family: req.body.family,
		description: req.body.description,
		edible: !!req.body.edible,
		type,
		image: req.body.image,
		owner: {
			id: req.user._id,
			username: req.user.username,
		},
		upvotes: [],
		downvotes: []
	}
	try{
		const plant = await Plant.create(newPlant);
		req.flash("success", "Plant created!");
		res.redirect("/plants/" + plant._id );
	}
	catch(err){
		req.flash("error", "Error creating plant");
		res.redirect("/plants");
	}
})

// New
router.get("/new", isLoggedIn, (req, res) => {
	res.render("plants_new");
})

// Search 
router.get("/search", async (req, res)=>{
	try{
		const plants = await Plant.find({
			$text: {
				$search: req.query.term
			}
		});
		res.render("plants", {plants})
	}
	catch(err){
		console.log(err);
		res.send("broken search");
}
})

// Genre 
router.get("/type/:type", async (req, res) => {
	// Check if given genre is valid
	const validTypes = ["herb", "shrub", "tree", "creeper", "climber"];
	if( validTypes.includes(req.params.type.toLowerCase()) ){
	   	// If yes, continue
		const plants = await Plant.find({type: req.params.type}).exec();
		res.render("plants", {plants});
	   }
	else{
		// If no, send error
		res.send("Please enter valid genre")
	}
	
})

router.get("/type/:type/alphabetical", async (req, res) => {
	// Check if given genre is valid
	const validTypes = ["herb", "shrub", "tree", "creeper", "climber"];
	if( validTypes.includes(req.params.type.toLowerCase()) ){
	   	// If yes, continue
		const plants = await Plant.find({type: req.params.type}).sort('commonName').exec();
		res.render("plants", {plants});
	   }
	else{
		// If no, send error
		res.send("Please enter valid genre")
	}
	
})

// Vote
router.post("/vote", isLoggedIn, async (req,res) =>{
	console.log("Request body:", req.body);
	
	// {
	// plantId: “abc124”,
	// voteType: "up" or "down"
	// }
	
	const plant = await Plant.findById(req.body.plantId);
	const alreadyUpvoted = plant.upvotes.indexOf(req.user.username); // Will be -1 if not found 
	const alreadyDownvoted = plant.downvotes.indexOf(req.user.username); // Will be -1 if not found 			
	
	let response = {};
	// Voting logic 
	if(alreadyUpvoted === -1 && alreadyDownvoted === -1) { // Has not voted
		if(req.body.voteType === "up"){ // Upvoting 
			plant.upvotes.push(req.user.username);
			plant.save();
			response = {message:"upvoted tallied" , code: 1} 
		} else if (req.body.voteType === "down") { // Downvoting
			plant.downvotes.push(req.user.username);
			plant.save();
			response = {message:"downvoted tallied" , code: -1} 
		} else { // Error
			response = {message:"Error 1" , code: "err"} 
		}
	} else if (alreadyUpvoted >= 0) { // Already upvoted
		if (req.body.voteType === "up") {
			plant.upvotes.splice(alreadyUpvoted, 1);
			plant.save();
			response = {message:"upvote removed" , code: 0} 
		} else if (req.body.voteType === "down"){
			plant.upvotes.splice(alreadyUpvoted, 1);
			plant.downvotes.push(req.user.username)
			plant.save();
			response = {message:"Changed to downvote" , code: -1};
		} else { // Error
			response = {message:"Error 2" , code: "err"};
		}

	} else if (alreadyDownvoted >= 0) { // Already downvoted
		if (req.body.voteType === "up") {
			plant.downvotes.splice(alreadyDownvoted, 1);
			plant.upvotes.push(req.user.username)
			plant.save()
			response = {message:"Changed to upvote" , code: 1}; 

		} else if (req.body.voteType === "down"){
			plant.downvotes.splice(alreadyDownvoted, 1);
			plant.save();
			response = {message:"Downvote removed" , code: 0}; 

		} else { // Error
			response = {message:"Error 3" , code: "err"} 

		}
	} else { // Error
		response = {message:"Error 4" , code: "err"} 
	}
	
	// Update score immediately prior to sending
	response.score = plant.upvotes.length - plant.downvotes.length;
	res.json(response);

});

// Show
router.get("/:id", async (req, res) => {
	try{
		const plant = await Plant.findById(req.params.id).exec();
		const comments = await Comment.find({plantId: req.params.id});
		res.render("plants_show", {plant, comments});
	} 
	catch (err) {
		console.log(err);
		res.send("you broke it... /plants/:id");
	}
})
		   
// Edit
router.get("/:id/edit", checkPlantOwner, async (req, res)=>{
		const plant = await Plant.findById(req.params.id).exec();
		res.render("plant_edit",{plant});
});


// Update
router.put("/:id", checkPlantOwner, async (req,res)=>{
	const type = req.body.type.toLowerCase();
	const plant = {
		commonName: req.body.commonName,
		scientificName: req.body.scientificName,
		family: req.body.family,
		description: req.body.description,
		edible: !!req.body.edible,
		type,
		image: req.body.image
	}
	
	try{
		const updatedPlant = await Plant.findByIdAndUpdate(req.params.id, plant, {new:true}).exec();
		req.flash("success", "Plant updated");
		res.redirect(`/plants/${req.params.id}`)
	}
	catch(err){
		console.log(err);
		req.flash("error", "Error updating plant");
		res.redirect("/plants");
	}
})

// Delete
router.delete("/:id", checkPlantOwner, async (req, res)=>{
	try{
		const deletedPlant = await Plant.findByIdAndDelete(req.params.id).exec();
		req.flash("success", "Plant deleted");
		res.redirect("/plants");
	}
	catch(err){
		console.log(err)
		req.flash("error", "Error deleting plant");
		res.redirect("back")
	}
})


module.exports = router;