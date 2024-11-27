function gitit(url) {
}

function sendImageWrite() {
	const formData = new FormData(document.forms[0]);

	const fields = Array.from(document.forms[0].elements);
	fields.forEach((field) => {
		field.setAttribute('disabled', 'disabled');
	});
	document.getElementById('processOutput').textContent = '';
	
	fetch('/gw/file', {
		method: 'POST',
		body: formData
	}).then(function (response) {
		let reader = response.body.getReader();
		let decoder = new TextDecoder();
		return readData();
		function readData() {
			return reader.read().then(function ({ value, done }) {
				let newData = decoder.decode(value, { stream: !done });
				console.log(newData);
				document.getElementById('processOutput').textContent += newData;
				document.getElementById('processOutput').scrollTop = document.getElementById('processOutput').scrollHeight;
				if (done) {
					document.forms[0].reset();
					fields.forEach((field) => {
						field.removeAttribute('disabled');
					});
					return;
				}
				return readData();
			});
		}
	});
}
