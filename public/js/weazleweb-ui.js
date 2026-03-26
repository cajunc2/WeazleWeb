const modes = [
	{ value: "read", display: "Read", execute: submitReadRequest },
	{ value: "write", display: "Write", execute: submitWriteRequest }
];

let formats = [];

// { value: 'ibm.360', display: 'IBM 360K<br />DS/DD', size: 368640 },
// { value: 'apple2.appledos.140', display: 'AppleDOS 140K<br />SS/DD', size: 143360 },
// { value: 'kaypro.ssdd', display: 'Kaypro II 190K<br />SS/DD', size: 0 },
// { value: 'LDOS_SSDD.40T', display: 'TRSDOS 180K<br />SS/DD', size: 0 }

let ui = {};

const defaultFilename = "disk.img";

let params = {
	mode: 0,
	getMode: function () {
		return modes[this.mode];
	},
	drive: 0,
	getDrive: function () {
		return config.drives[this.drive];
	},
	format: 0,
	getFormat: function () {
		if (this.mode === 0) {
			return config.readers[this.format];
		}
		return config.writers[this.format];
	},
	filename: "",
	getFilename: function () {
		if (this.filename && this.filename.length > 0) {
			return this.filename;
		}
		return defaultFilename;
	},
	nextMode: function () {
		this.mode++;
		if (this.mode >= modes.length) {
			this.mode = 0;
		}
		this.format = 0;
	},
	writeMode: function () {
		this.mode = 1;
		this.format = 0;
	},
	nextDrive: function () {
		this.drive++;
		if (this.drive >= config.drives.length) {
			this.drive = 0;
		}
	},
	nextFormat: function () {
		this.format++;
		formats = this.mode === 0 ? config.readers : config.writers;
		if (this.format >= formats.length) {
			this.format = 0;
		}
	}
};

let refreshUI = function () {
	ui.modeSelectButton.innerHTML = params.getMode().display;
	ui.commandModeOutput.innerText = params.getMode().value;
	ui.executeButtonLabel.innerText = "Read";
	ui.executeButtonSubLabel.style.display = "none";
	if (params.getMode().value === "read") {
		document.documentElement.classList.remove("write-mode");
		ui.fileSizeWarning.style.visibility = "hidden";
		ui.readFilenameInput.style.display = "";
		ui.fileSelectButton.style.display = "none";
		if (params.filename.trim() === "") {
			ui.commandFileOutput.innerText = defaultFilename;
		} else {
			ui.commandFileOutput.innerText = params.filename;
		}
	} else {
		document.documentElement.classList.add("write-mode");
		ui.readFilenameInput.style.display = "none";
		ui.fileSelectButton.style.display = "";
		ui.executeButtonLabel.innerText = "Write";
		ui.executeButtonSubLabel.style.display = "";
		if (ui.writeFileInput.files[0] == null) {
			ui.commandFileOutput.innerText = "";
			ui.fileSizeWarning.style.visibility = "hidden";
		} else {
			let newValue = ui.writeFileInput.files[0].name;
			ui.commandFileOutput.innerText = newValue;
			console.log("ui.writeFileInput.files[0].size:", ui.writeFileInput.files[0].size);
			console.log("params.getFormat().size:", params.getFormat().size);
			if (ui.writeFileInput.files[0].size !== params.getFormat().size) {
				ui.fileSizeWarning.style.visibility = "visible";
			} else {
				ui.fileSizeWarning.style.visibility = "hidden";
			}
		}
	}

	ui.driveLetter.innerText = params.getDrive().name;
	ui.driveDescription.innerText = `${params.getDrive().size} ${params.getDrive().sides}/${params.getDrive().density}`;
	ui.commandDriveOutput.innerText = params.getDrive().name;

	ui.formatSelectButton.innerHTML = params.getFormat().name;
	ui.commandFormatOutput.innerText = params.getFormat().formatString;
};

let validateInputs = function () {};

function streamOutput(newData) {
	ui.processOutput.textContent += newData;
	ui.processOutput.scrollTop = ui.processOutput.scrollHeight;
}

function initUI() {
	ui = {
		modeSelectButton: document.getElementById("modeSelectButton"),
		commandModeOutput: document.getElementById("commandModeOutput"),
		readFilenameInput: document.getElementById("readFilenameInput"),
		fileSelectButton: document.getElementById("fileSelectButton"),
		commandFileOutput: document.getElementById("commandFileOutput"),
		writeFileInput: document.getElementById("writeFileInput"),
		driveSelectButton: document.getElementById("driveSelectButton"),
		driveLetter: document.getElementById("driveLetter"),
		driveDescription: document.getElementById("driveDescription"),
		commandDriveOutput: document.getElementById("commandDriveOutput"),
		formatSelectButton: document.getElementById("formatSelectButton"),
		commandFormatOutput: document.getElementById("commandFormatOutput"),
		executeButton: document.getElementById("executeButton"),
		processOutput: document.getElementById("processOutput"),
		processOutputPanel: document.getElementById("processOutputPanel"),
		fileSizeWarning: document.getElementById("fileSizeWarning"),
		executeButtonLabel: document.getElementById("executeButtonLabel"),
		executeButtonSubLabel: document.getElementById("executeButtonSubLabel")
	};

	formats = config.readers;

	ui.modeSelectButton.addEventListener("click", () => {
		params.nextMode();
		refreshUI();
	});

	ui.driveSelectButton.addEventListener("click", () => {
		params.nextDrive();
		refreshUI();
	});

	ui.formatSelectButton.addEventListener("click", () => {
		params.nextFormat();
		refreshUI();
	});

	ui.fileSelectButton.addEventListener("click", () => {
		ui.writeFileInput.click();
	});

	ui.readFilenameInput.placeholder = defaultFilename;
	ui.readFilenameInput.addEventListener("input", () => {
		params.filename = ui.readFilenameInput.value;
		refreshUI();
	});

	ui.writeFileInput.addEventListener("change", () => {
		refreshUI();
	});

	ui.commandFileOutput.addEventListener("click", (ev) => {
		ev.preventDefault();
		if (params.getMode().value === "write") {
			ui.writeFileInput.click();
		}
	});

	let executeTimer = null;

	ui.executeButton.addEventListener("click", () => {
		if (params.getMode().value === "write") {
			return;
		}
		ui.executeButton.disabled = true;
		ui.processOutput.innerHTML = "";
		validateInputs();
		ui.processOutputPanel.style.visibility = "visible";
		params.getMode().execute(params, streamOutput, () => {
			ui.executeButton.disabled = false;
		});
	});

	ui.executeButton.addEventListener("mousedown", () => {
		if (params.getMode().value === "read") {
			return;
		}
		executeTimer = setTimeout(() => {
			ui.executeButton.disabled = true;
			ui.processOutput.innerHTML = "";
			validateInputs();
			ui.processOutputPanel.style.visibility = "visible";
			params.getMode().execute(params, streamOutput, () => {
				ui.executeButton.disabled = false;
			});
		}, 1000);
	});

	ui.executeButton.addEventListener("mouseout", () => {
		clearTimeout(executeTimer);
	});

	ui.executeButton.addEventListener("mouseup", () => {
		clearTimeout(executeTimer);
	});

	document.documentElement.addEventListener("drop", (ev) => {
		ev.preventDefault();
		ui.writeFileInput.files = ev.dataTransfer.files;
		params.writeMode();
		refreshUI();
	});

	document.documentElement.addEventListener("dragover", (ev) => {
		ev.preventDefault();
	});

	refreshUI();
}
