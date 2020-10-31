//=======================
// SELECT ELEMENTS
//=======================
const upvoteBtn = document.getElementById("upvoteBtn");
const downvoteBtn = document.getElementById("downvoteBtn");


//=======================
// ADD EVENT LISTENERS
//=======================
upvoteBtn.addEventListner("click", async function() {
	// Build fetch options
	const options = {
		method: POST,
		headers: {
    		'Content-Type': 'application/json'
  		},
		body: JSON.stringify({vote: "up"})
	}
	// Send fetch request
	await fetch("/plants/vote", options)
	.then(data => {
		return data.json
	})
	.then(res => {
		console.log(res)
	})
	.catch(err =>{
		console.log(err)
	})
})