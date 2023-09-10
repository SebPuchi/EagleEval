const getReviews = require('fetchReviews.js') 
const express = require('express');
const app = express();

// handling CORS
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin",
			"http://localhost:4200");
	res.header("Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// route for handling requests from the Angular client
app.get('/api/message', (req, res) => {
	res.json({ message:
			'Hello from the Express server!' });
});

// route to fetching review data from api for a certain query
app.put('/api/fetch/reviews', (req, res) => {
	var query = req.query
	fetch_response = getReviews(query)

	res.send(fetch_response)
})

app.listen(3000, () => {
	console.log('Server listening on port 3000');
});
