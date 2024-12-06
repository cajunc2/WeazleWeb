var express = require('express');
var router = express.Router();
const { spawn } = require('child_process');

const uploadDir = __dirname + '/../uploads/';

var timestamp = function () {
	let pad2 = function (n) { return n < 10 ? '0' + n : n }

	var date = new Date();
	return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
}

router.post('/', function (req, res, next) {
	console.dir(req);
});

module.exports = router;
