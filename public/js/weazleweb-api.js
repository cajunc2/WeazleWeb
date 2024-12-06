let requestId = null;

function submitReadRequest() {
	requestId = generateUUID();

	let queryParams = new URLSearchParams({
		requestId: requestId,
		drive: params.getDrive().value,
		format: params.getFormat().value,
		filename: params.getFilename()
	});

	fetch('/api/readImage?' + queryParams.toString(), {
		method: 'POST'
	}).then(streamProcessOutput(response, downloadReadImage));
}

function downloadReadImage() {
	fetch('/api/downloadImage?requestId=' + requestId);
}

function submitWriteRequest() {

}

function streamProcessOutput(response, whenDone) {
	return () => {
		let reader = response.body.getReader();
		let decoder = new TextDecoder();
		return readData();
		function readData() {
			return reader.read().then(function ({ value, done }) {
				let newData = decoder.decode(value, { stream: !done });
				ui.processOutput.textContent += newData;
				ui.processOutput.scrollTop = ui.processOutput.scrollHeight;
				if (done) {
					if (whenDone) {
						whenDone();
					}
					return;
				}
				return readData();
			});
		}
	};
}


// https://stackoverflow.com/a/8809472
function generateUUID() { // Public Domain/MIT
	var d = new Date().getTime();//Timestamp
	var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16;//random number between 0 and 16
		if (d > 0) {//Use timestamp until depleted
			r = (d + r) % 16 | 0;
			d = Math.floor(d / 16);
		} else {//Use microseconds since page-load if supported
			r = (d2 + r) % 16 | 0;
			d2 = Math.floor(d2 / 16);
		}
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
}
