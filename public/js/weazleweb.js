let config = {};

fetch('/api/getConfig')
    .then(function(response) { return response.json(); })
    .then(function(json) {
	config = json;
	initUI();
});
    