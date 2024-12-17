const modes = [
	{ value: 'read', display: 'Read', execute: submitReadRequest },
	{ value: 'write', display: 'Write', execute: submitWriteRequest }
];

const drives = [
	{ value: 'A', display: 'Drive A' },
	{ value: 'B', display: 'Drive B' }
];

const formats = [
	{ value: 'ibm.360', display: 'IBM 360K<br />DS/DD' },
	{ value: 'kaypro.ssdd', display: 'Kaypro II 190K<br />SS/DD' },
	{ value: 'LDOS_SSDD.40T', display: 'TRSDOS 180K<br />SS/DD' }
];

const ui = {
	modeSelectButton: document.getElementById('modeSelectButton'),
	commandModeOutput: document.getElementById('commandModeOutput'),
	readFilenameInput: document.getElementById('readFilenameInput'),
	fileSelectButton: document.getElementById('fileSelectButton'),
	commandFileOutput: document.getElementById('commandFileOutput'),
	writeFileInput: document.getElementById('writeFileInput'),
	driveSelectButton: document.getElementById('driveSelectButton'),
	commandDriveOutput: document.getElementById('commandDriveOutput'),
	formatSelectButton: document.getElementById('formatSelectButton'),
	commandFormatOutput: document.getElementById('commandFormatOutput'),
	executeButton: document.getElementById('executeButton'),
	processOutput: document.getElementById('processOutput')
};

const defaultFilename = 'disk.img';

let params = {
	mode: 0,
	getMode: function () {
		return modes[this.mode];
	},
	drive: 0,
	getDrive: function () {
		return drives[this.drive];
	},
	format: 0,
	getFormat: function () {
		return formats[this.format];
	},
	filename: '',
	getFilename: function () {
		if (this.filename && this.filename.length > 0) {
			return this.filename;
		}
		return defaultFilename;
	},
	nextMode: function () {
		this.mode++;
		if (this.mode >= modes.length) { this.mode = 0; }
	},
	writeMode: function() {
		this.mode = 1;
	},
	nextDrive: function () {
		this.drive++;
		if (this.drive >= drives.length) { this.drive = 0; }
	},
	nextFormat: function () {
		this.format++;
		if (this.format >= formats.length) { this.format = 0; }
	}
};

let refreshUI = function () {
	ui.modeSelectButton.innerHTML = params.getMode().display;
	ui.commandModeOutput.innerText = params.getMode().value;
	if (params.getMode().value === 'read') {
		document.documentElement.classList.remove('warning');
		ui.readFilenameInput.style.display = '';
		ui.fileSelectButton.style.display = 'none';
		if (params.filename.trim() === '') {
			ui.commandFileOutput.innerText = defaultFilename;
		} else {
			ui.commandFileOutput.innerText = params.filename;
		}
	} else {
		document.documentElement.classList.add('warning');
		ui.readFilenameInput.style.display = 'none';
		ui.fileSelectButton.style.display = '';
		if (ui.writeFileInput.files[0] == null) {
			ui.commandFileOutput.innerText = '';
		} else {
			let newValue = ui.writeFileInput.files[0].name;
			ui.commandFileOutput.innerText = newValue;
		}
	}

	ui.driveSelectButton.innerHTML = params.getDrive().display;
	ui.commandDriveOutput.innerText = params.getDrive().value;

	ui.formatSelectButton.innerHTML = params.getFormat().display;
	ui.commandFormatOutput.innerText = params.getFormat().value;
};

let validateInputs = function () {

}

modeSelectButton.addEventListener('click', () => {
	params.nextMode();
	refreshUI();
});

ui.driveSelectButton.addEventListener('click', () => {
	params.nextDrive();
	refreshUI();
});

ui.formatSelectButton.addEventListener('click', () => {
	params.nextFormat();
	refreshUI();
});

ui.fileSelectButton.addEventListener('click', () => {
	ui.writeFileInput.click();
});

ui.readFilenameInput.placeholder = defaultFilename;
ui.readFilenameInput.addEventListener('input', () => {
	params.filename = ui.readFilenameInput.value;
	refreshUI();
});

ui.writeFileInput.addEventListener('change', () => {
	refreshUI();
});

function streamOutput(newData) {
	ui.processOutput.textContent += newData;
	ui.processOutput.scrollTop = ui.processOutput.scrollHeight;
}

let executeTimer = null;
ui.executeButton.addEventListener('mousedown', () => {
	executeTimer = setTimeout(() => {
		ui.executeButton.disabled = true;
		ui.processOutput.innerHTML = '';
		validateInputs();
		params.getMode().execute(params, streamOutput, () => {
			ui.executeButton.disabled = false;
		});
	}, params.getMode().value === 'read' ? 500 : 1000);
});

ui.executeButton.addEventListener('mouseout', () => {
	clearTimeout(executeTimer);
});

ui.executeButton.addEventListener('mouseup', () => {
	clearTimeout(executeTimer);
});

document.documentElement.addEventListener('drop', (ev) => {
	ev.preventDefault();
	writeFileInput.files = ev.dataTransfer.files;
	params.writeMode();
	refreshUI();
});

document.documentElement.addEventListener('dragover', (ev) => {
	ev.preventDefault();
});

refreshUI();