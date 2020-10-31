const Plant = require('../models/plant')
const checkPlantOwner = async (req, res, next) => {
	if(req.isAuthenticated()){ // check is the user is logged in 
		// Get plant from DB
		const plant = await Plant.findById(req.params.id).exec();
		
		// if logged in, check if they own the entry
		if(plant.owner.id.equals(req.user._id)){ 
			next();
		}
		else { // if not, redirect back to show page
			req.flash("error", "You don't have permission to do that.");
			res.redirect("back");
		}
	}
	else { // if not logged in, redirect to /login
		req.flash("error", "You must be logged in to do that.");
		res.redirect("/login");
	}
}

module.exports = checkPlantOwner;