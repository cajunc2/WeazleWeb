var express = require('express');
var router = express.Router();
const { spawn } = require('child_process');

const uploadDir = __dirname + '/../uploads/';
const multer = require('multer');


var timestamp = function () {
	let pad2 = function (n) { return n < 10 ? '0' + n : n }

	var date = new Date();
	return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		cb(null, timestamp() + '-' + file.originalname);
	}
});

const upload = multer({ storage: storage });

router.post('/file', upload.single('diskimage'), function (req, res, next) {
		console.dir(req.body);
		console.dir(req.file.filename);
		console.dir(req.body.format);
		// const child = spawn('gw', ['write', uploadDir + req.file.filename, '--format', req.body.format]);
		const child = spawn('hexdump', ['-C',  uploadDir + req.file.filename]);
		child.stdout.setEncoding('utf8');
		child.stderr.pipe(res);
		child.stdout.pipe(res);
});

module.exports = router;
