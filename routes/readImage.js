const GWInterface = require('../logic/GWInterface');

module.exports = (req, res) => {
	const dir = global.appDir + '/disks/read/';

	readerWriterParams = {
		readerWriterIndex: req.query.type,
		filename: dir + req.query.requestId + '-' + req.query.filename,
		driveLetter: req.query.drive,
		pipe: res
	};

	GWInterface.read(readerWriterParams);
};
