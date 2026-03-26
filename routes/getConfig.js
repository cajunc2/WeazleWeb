const GWInterface = require('../logic/GWInterface');
const uploadDir = global.appDir + '/disks/write/';

module.exports = (req, res) => {
	res.send({
		drives: GWInterface.getDrives(),
		writers: GWInterface.getWriters(),
		readers: GWInterface.getReaders()
	});
};
