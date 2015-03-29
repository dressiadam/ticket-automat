exports = module.exports = function(app, mongoose) {

	require('./schema/Users')(app, mongoose);

};
