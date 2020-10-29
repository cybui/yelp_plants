const Plant = require('../models/plant');
const Comment = require('../models/comment');

const plant_seeds = [
	{
	commonName: "Rosemary",
	scientificName: "Salvia rosmarinus",
	family: "Lamiaceae",
	description: "Rosemary is an aromatic evergreen shrub with leaves similar to hemlock needles. It is native to the Mediterranean and Asia, but is reasonably hardy in cool climates. It can withstand droughts, surviving a severe lack of water for lengthy periods.In some parts of the world, it is considered a potentially invasive species. The seeds are often difficult to start, with a low germination rate and relatively slow growth, but the plant can live as long as 30 years.",
	edible: true,
	type: "herb",
	image: "https://blog.fnp.ae/wp-content/uploads/2018/05/Rosemary.jpg"
	},
	{
	commonName: "Jade plant",
	scientificName: "Crassula ovata",
	family: "Crassulaceae",
	description: "The jade plant is an evergreen with thick branches. It has thick, shiny, smooth leaves that grow in opposing pairs along the branches. Leaves are a rich jade green, although some may appear to be more of a yellow-green. Some varieties may develop a red tinge on the edges of leaves when exposed to high levels of sunlight. New stem growth is the same colour and texture as the leaves, becoming woody and brown with age.",
	edible: false,
	type: "shrub",
	image: "https://www.almanac.com/sites/default/files/styles/opengraph/public/image_nodes/jade-planting-growing.jpg?itok=7MlyYu97"
	},
	{
	commonName: "Pineapple",
	scientificName: "Ananas comosus",
	family: "Bromeliaceae",
	description: "The pineapple is a herbaceous perennial, which grows to 1.0 to 1.5 m (3.3 to 4.9 ft) tall, although sometimes it can be taller. In appearance, the plant has a short, stocky stem with tough, waxy leaves. When creating its fruit, it usually produces up to 200 flowers, although some large-fruited cultivars can exceed this. Once it flowers, the individual fruits of the flowers join together to create a multiple fruit. After the first fruit is produced, side shoots (called 'suckers' by commercial growers) are produced in the leaf axils of the main stem. These may be removed for propagation, or left to produce additional fruits on the original plant.",
	edible: true,
	type: "shrub",
	image: "https://cdn.shopify.com/s/files/1/1938/3931/files/Ananas_AdobeStock_112457544_square.png?v=1551294093"
	}
]

const seed = async () =>{
	// Delete all current plants & comments
	await Plant.deleteMany();
	console.log("DELETED ALL THE PLANTS")
	// Create 3 new plants
	await Comment.deleteMany();
	console.log("DELETED ALL COMMENTS")
	
	// Create comment for each plant
	// for(const plant_seed of plant_seeds){
	// 	let plant = await Plant.create(plant_seed);
	// 	console.log("New plant: ",plant.commonName);
	// 	await Comment.create({
	// 		text: "My favorite plant!",
	// 		user: "plantlover101",
	// 		plantId: plant._id
	// 	});
	// 	console.log("New comment created!");
	// }
}

module.exports = seed;