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
			res.redirect("back");
		}
	}
	else { // if not logged in, redirect to /login
		res.redirect("/login");
	}
}

module.exports = checkPlantOwner;