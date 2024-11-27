<script>

function sendImageWrite() {
	const fields = Array.from(document.forms[0].elements);
	fields.forEach((field) => {
		field.setAttribute('disabled', 'disabled');
	});
	document.getElementById('processOutput').textContent = '';

	const formData = new FormData(document.forms[0]);
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

</script>

<html>

<head>
	<title>WeazleWeb</title>
	<link rel="stylesheet" href="/css/style.css">
</head>

<body>
	<h1>WeazleWeb Svelte!</h1>
	<form action="/gw/file" method="POST" enctype="multipart/form-data">
		<input type="file" name="diskimage" id="diskImageInput" />
		<fieldset>
			<legend>Disk Format</legend>
			<div><label><input type="radio" name="format" value="ibm.360" checked /> IBM 5.25" DS/DD 360K</label></div>
			<div><label><input type="radio" name="format" value="ibm.1200" /> IBM 5.25" DS/HD 1.2M</label></div>
			<div><label><input type="radio" name="format" value="ibm.720" /> IBM 3.5" DS/DD 720K</label></div>
			<div><label><input type="radio" name="format" value="ibm.1440" /> IBM 3.5" DS/HD 1.44M</label></div>
		</fieldset>
		<br />
		<button onclick="sendImageWrite(); return false;">Write Disk Image</button>
	</form>
	<output id="processOutput" style="font-family: monospace; white-space: pre;"></output>

</body>

</html>