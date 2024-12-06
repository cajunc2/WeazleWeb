var readImage = require('./readImage');
var downloadImage = require('./downloadImage');

module.exports = (express) => {
	// Create express Router
	var router = express.Router();

	// add routes
	router.post('/readImage', readImage);
	router.get('/downloadImage', downloadImage);

	return router;
}
