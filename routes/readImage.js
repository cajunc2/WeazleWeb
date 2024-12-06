const { spawn } = require('child_process');

module.exports = (req, res) => {
	const dir = global.appDir + '/disks/read/';
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

	const child = spawn('gw', params, {shell: true});
	child.stdout.setEncoding('utf8');
	child.stderr.setEncoding('utf8');
	child.stdout.pipe(res);
	child.stderr.pipe(res);
};
