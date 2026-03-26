module.exports = function (gwConfig) {
	let buildConfiguration = function (imageFilePath, driveLetter) {
		let params = [
			'write',
			'--format',
			gwConfig.formatString,
		];

		if (driveLetter) {
			params.push('--drive');
			params.push(driveLetter);
		}
		params.push(imageFilePath);

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