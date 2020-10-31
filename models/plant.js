const mongoose = require('mongoose');
const plantSchema = new mongoose.Schema({
	commonName: String,
	scientificName: String,
	family: String,
	description: String,
	edible: Boolean,
	type: String,
	image: String,
	owner: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	upvotes: [String],
	downvotes: [String]
});

plantSchema.index({
	'$**': 'text'
});

module.exports = mongoose.model("plant", plantSchema);