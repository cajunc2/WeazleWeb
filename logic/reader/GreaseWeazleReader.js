module.exports = function (gwConfig) {
	let buildConfiguration = function (configParams) {
		let params = [
			'read',
			'--format',
			gwConfig.formatString,
		];

		if (configParams.driveLetter) {
			params.push('--drive');
			params.push(configParams.driveLetter);
		}
		params.push('"' + configParams.filename.replace(/"/g, '\\"') + '"');

		return {
			exec: '~/.local/bin/gw',
			params: params
		};
	};

	return {
		name: gwConfig.name,
		description: gwConfig.description,
		formatString: gwConfig.formatString,
		fileExtension: gwConfig.fileExtension,
		fileSize: gwConfig.fileSize,
		configure: buildConfiguration
	};
}