app.Page.index = Backbone.View.extend({

	el: 'body',

	initialize: function() {
		var pager = new app.View.Pager({
			el: $('body')
		}),
		ticketHandlerModel = new app.Model.TicketHandlerModel({}),
		ticketHandler = new app.View.TicketHandler({
			el: $('body'),
			model: ticketHandlerModel
		});
	}
});
