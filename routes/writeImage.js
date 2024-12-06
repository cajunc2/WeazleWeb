const { spawn } = require('child_process');
const uploadDir = global.appDir + '/disks/write/';

module.exports = (req, res) => {
	console.dir(req.file);
	let params = [
		'write',
		// '--diskdefs',
		// global.appDir + '/diskdefs.cfg',
		'--format',
		req.query.format,
		'--drive',
		req.query.drive,
		uploadDir + req.file.filename
	];

	const child = spawn('~/.local/bin/gw', params, { shell: true });
	child.stdout.setEncoding('utf8');
	child.stderr.setEncoding('utf8');
	child.stdout.pipe(res);
	child.stderr.pipe(res);
};
