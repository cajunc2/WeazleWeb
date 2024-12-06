module.exports = (req, res, next) => {
	const filename = global.appDir + '/disks/read/' + req.query.requestId + '-' + req.query.filename;

	var options = {
		headers: {
			'Content-Disposition': 'attachment; filename="' + req.query.filename + '"'
		}
	};

	res.sendFile(filename, options, function (err) {
		if (err) {
			res.sendStatus(204);
		}
	});
};
