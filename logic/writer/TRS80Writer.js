let buildConfiguration = function(imageFilePath, driveLetter) {
	let params = [
		'-k',
		'2',
	];

	if(driveLetter) {
		params.push('-d');
		params.push(driveLetter);
	}
	params.push(imageFilePath);

	return {
		exec: '~/tools/gw2dmk/dmk2gw',
		params: params
	};
};

module.exports = {
	name: "TRS-80 DMK",
	description: "TRS-80 DMK Image",
	fileExtension: "DMK",
	fileSize: 255296,
	configure: buildConfiguration
}