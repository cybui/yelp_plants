//=======================
// SELECT ELEMENTS
//=======================
const upvoteBtn = document.getElementById("upvoteBtn");
const downvoteBtn = document.getElementById("downvoteBtn");


//=======================
// HELPER FUNCTIONS
//=======================
const sendVote = async(voteType) => {
	// Build fetch options
	const options = {
		method: POST,
		headers: {
    		'Content-Type': 'application/json'
  		}
	}
	
	
	if(voteType === up) {
		options.body = JSON.stringify({vote: "up"})
	} else if (voteType === down){
		options.body = JSON.stringify({vote: "down"})
	}
	else {
		throw "voteType must be 'up' or 'down'"
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
}

//=======================
// ADD EVENT LISTENERS
//=======================
upvoteBtn.addEventListner("click", async function() {
	sendVote("up")
})

downvoteBtn.addEventListner("click", async function() {
	sendVote("down")
})