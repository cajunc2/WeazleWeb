const readImage = require('./readImage');
const downloadImage = require('./downloadImage');
const writeImage = require('./writeImage');
const multer = require('multer');
const getConfig = require('./getConfig');

const uploadDir = global.appDir + '/disks/write/';
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		cb(null, req.query.requestId + '-' + file.originalname);
	}
});
const upload = multer({ storage: storage });

module.exports = (express) => {
	// Create express Router
	var router = express.Router();

	// add routes
	router.post('/readImage', readImage);
	router.get('/downloadImage', downloadImage);
	router.post('/writeImage', upload.single('diskimage'), writeImage);
	router.get('/getConfig', getConfig);

	return router;
}
