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


// Vote
router.post("/vote", isLoggedIn, (req,res) =>{
	res.json({
		message: "Voted!"
	})
})

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