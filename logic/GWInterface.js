const { spawn } = require('child_process');
const AppleDOS140 = require("./gwConfig/AppleDOS140");
const IBM360 = require("./gwConfig/IBM360");
const GreaseWeazleReader = require("./reader/GreaseWeazleReader");
const GreaseWeazleWriter = require("./writer/GreaseWeazleWriter");
const TRS80Writer = require("./writer/TRS80Writer");

let write = function(params) {
	let writer = writers[params.readerWriterIndex];
	let config = writer.configure(params);
	exec(config, params.pipe);
};

let read = function(params) {
	let reader = readers[params.readerWriterIndex];
	let config = reader.configure(params);
	exec(config, params.pipe);
};

let exec = function (config, outputStream) {
	const child = spawn(config.exec, config.params, { shell: true });
	child.stdout.setEncoding('utf8');
	child.stderr.setEncoding('utf8');
	child.stdout.pipe(outputStream);
	child.stderr.pipe(outputStream);
};

const readers = [
	GreaseWeazleReader(IBM360),
	GreaseWeazleReader(AppleDOS140),
];

let getReaders = function () {
	return readers;
};

const writers = [
	GreaseWeazleWriter(IBM360),
	GreaseWeazleWriter(AppleDOS140),
	TRS80Writer
];

let getWriters = function () {
	return writers;
};

const drives = [
	{name: 'A', size: '5.25"', density: 'DD', sides: 'DS' },
	// {name: 'B', size: '3.5"', density: 'HD', sides: 'DS' },
];

let getDrives = function () {
	return drives;
};

module.exports = {
	getDrives: getDrives,
	getReaders: getReaders,
	getWriters: getWriters,
	read: read,
	write: write
};