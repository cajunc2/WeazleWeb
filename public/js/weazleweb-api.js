let requestId = null;

function submitReadRequest(params, onOutput, onComplete) {
	requestId = generateUUID();

	let downloadParams = new URLSearchParams({
		requestId: requestId,
		filename: params.getFilename()
	});

	let downloadReadImage = function (response) {
		fetch('/api/downloadImage?' + downloadParams.toString(), { method: 'HEAD' }).then((res) => {
			if (res.status !== 200) {
				if (onComplete) { onComplete(); }
				return;
			}
			var a = document.createElement('a');
			a.style.display = 'none';
			a.href = '/api/downloadImage?' + downloadParams.toString();
			document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
			a.click();
			a.remove();  //afterwards we remove the element again         

			if (onComplete) { onComplete(); }
		});
	}

	let readImageParams = new URLSearchParams({
		requestId: requestId,
		drive: params.getDrive().value,
		format: params.getFormat().value,
		filename: params.getFilename()
	});
	fetch('/api/readImage?' + readImageParams.toString(), {
		method: 'POST'
	}).then(streamProcessOutput(onOutput, downloadReadImage));
}

function submitWriteRequest(params, onOutput, onComplete) {
	requestId = generateUUID();

	let writeImageParams = new URLSearchParams({
		requestId: requestId,
		drive: params.getDrive().value,
		format: params.getFormat().value
	});

	const formData = new FormData();
	formData.append('diskimage', ui.writeFileInput.files[0]);
	fetch('/api/writeImage?' + writeImageParams.toString(), {
		method: 'POST',
		body: formData
	}).then(streamProcessOutput(onOutput, onComplete));
}

function streamProcessOutput(onOutput, onComplete) {
	return (response) => {
		let reader = response.body.getReader();
		let decoder = new TextDecoder();
		return readData();
		function readData() {
			return reader.read().then(function ({ value, done }) {
				let newData = decoder.decode(value, { stream: !done });
				onOutput(newData);
				if (done) {
					if (onComplete) {
						onComplete(response);
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
