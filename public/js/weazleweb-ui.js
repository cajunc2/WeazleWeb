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
	processOutput : document.getElementById('processOutput')
};

const defaultFilename = 'disk.img';

let params = {
	mode: 0,
	getMode: function() {
		return modes[this.mode];
	},
	drive: 0,
	getDrive: function() {
		return drives[this.drive];
	},
	format: 0,
	getFormat: function() {
		return formats[this.format];
	},
	filename: '',
	getFilename: function() {
		if(this.filename && this.filename.length > 0) {
			return this.filename;
		}
		return defaultFilename;
	},
	nextMode: function () {
		this.mode++;
		if (this.mode >= modes.length) { this.mode = 0; }
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
		ui.readFilenameInput.style.display = '';
		ui.fileSelectButton.style.display = 'none';
		if (params.filename.trim() === '') {
			ui.commandFileOutput.innerText = defaultFilename;
		} else {
			ui.commandFileOutput.innerText = params.filename;
		}
	} else {
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

let validateInputs = function() {

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

ui.executeButton.addEventListener('click', () => {
	validateInputs();
	params.getMode().execute();
});

refreshUI();