app.Page.index = Backbone.View.extend({

	el: 'body',

	initialize: function() {
		console.info('sdfsdf');
		var pager = new app.View.Pager({
			el: $('body')
		});
	}
});
