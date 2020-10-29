const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	text: String,
	plantId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Plant"
	},
	 
});
 
module.exports = mongoose.model("comment", commentSchema);