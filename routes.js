module.exports = function(app) {

	// Pages
	app.get('/', require('./views/index').init);
};