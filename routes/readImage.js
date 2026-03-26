const { spawn } = require('child_process');
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

	let params = [
		'read',
		// '--diskdefs',
		// global.appDir + '/diskdefs.cfg',
		'--format',
		req.query.format,
		'--drive',
		req.query.drive,
		dir + req.query.requestId + '-' + req.query.filename
	];

	const child = spawn('~/.local/bin/gw', params, {shell: true});
	child.stdout.setEncoding('utf8');
	child.stderr.setEncoding('utf8');
	child.stdout.pipe(res);
	child.stderr.pipe(res);
};
