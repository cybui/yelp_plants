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
		}
	}
	try{
		const plant = await Plant.create(newPlant);
		console.log(plant);
		res.redirect("/plants/" + plant._id );
	}
	catch(err){
		console.log(err);
		res.send("you broke it... /plants POST");
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
		console.log(updatedPlant);
		res.redirect(`/plants/${req.params.id}`)
	}
	catch(err){
		console.log(err)
		res.send("you broke it... /plants/:id UPDATE");
	}
})

// Delete
router.delete("/:id", checkPlantOwner, async (req, res)=>{
	try{
		const deletedPlant = await Plant.findByIdAndDelete(req.params.id).exec();
		console.log("delted: ",deletedPlant);
		res.redirect("/plants");
	}
	catch(err){
		console.log(err)
		res.send("you broke it... /plants/:id DELETE");
	}
})


module.exports = router;