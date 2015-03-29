app.Page.index = Backbone.View.extend({

	el: 'body',

	initialize: function() {
		$('#jscheck').html('Javascript is running fine <i class="fa fa-check"></i>');
	}
});
