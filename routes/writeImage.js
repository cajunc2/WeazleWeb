const GWInterface = require('../logic/GWInterface');
const uploadDir = global.appDir + '/disks/write/';

module.exports = (req, res) => {
	console.dir(req);

	readerWriterParams = {
		readerWriterIndex: req.query.type,
		filename: uploadDir + req.file.filename,
		driveLetter: req.query.drive,
		pipe: res
	};
	GWInterface.write(readerWriterParams)
};
