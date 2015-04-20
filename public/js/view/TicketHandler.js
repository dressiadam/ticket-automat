/**
 * @module views/Pager
 */
app.View.TicketHandler = Backbone.View.extend({
	summaryPageClass: 'summary_page',
	activeClass: 'active',
	initialize: function() {
		this._touchWrapper = $('.ticket_box');
		this._totalPriceText = $('.total_price_wrapper h3');
		this._oneTicketRow = $( '.one_ticket_type_row');

		app.events.on('NEXT-PROCESS-PAGE-LOADED', this.onNextProcessPageLoaded, this);
	},

	events : {
		'click .ticket_box' : 'onTicketClick',
		'click .add_ticket' : 'onAddTicketClick',
		'click .remove_ticket' : 'onRemoveTicketClick'
	},

	/**
	 * Handles click event
	 */
	onTicketClick : function(ev) {
		ev.preventDefault();
		this.checkTicketStatus(ev);
	},

	/**
	 * Handles click event
	 */
	onNextProcessPageLoaded : function(ev) {
		if (ev.hasClass(this.summaryPageClass)) {
			this.addSelectedTickets();
		};
	},

	/**
	 *
	 */
	addSelectedTickets: function () {
		var selectedTickets = this.model.getSelectedTickets();
		this._oneTicketRow.removeClass('active');
		this._oneTicketRow.each(function(index) {
			if(_.indexOf(selectedTickets, $( this ).attr('data-ticket-type')) !== -1) {
				$(this).addClass('active');
			}
		});
		app.events.trigger('SELECTED-TICKETS-TYPE-COUNT', selectedTickets.length);
	},

	/**
	 *
	 */
	checkTicketStatus: function (ev) {
		var currentTarget = $(ev.currentTarget),
			ticketType = currentTarget.attr('data-ticket-type');
		if(!currentTarget.hasClass('selected')) {
			this.addTicketToCart(ticketType);
			currentTarget.addClass('selected');
		}
		else {
			this.removeTicketToCart(ticketType);
			currentTarget.removeClass('selected');
		}
	},

	/**
	 *
	 */
	_refreshTotalPrice: function() {
		this._totalPriceText.html(this.model.getTotalPrice() + ' ' +'HUF');
	},

	/**
	 *
	 */
	_checkCartIsEmpty: function() {
		if(this.model.getTotalPrice() === 0) {
			app.events.trigger('SHOPPING-CART-IS-EMPTY');
		}
	},
	/**
	 *
	 */
	addTicketToCart: function(ticketType) {
		this.model.addTicketToCart(ticketType);
		this._refreshTotalPrice();
		app.events.trigger('SHOPPING-CART-IS-NOT-EMPTY');
	},

	/**
	 *
	 */
	removeTicketToCart: function(ticketType) {
		this.model.removeTicketToCart(ticketType);
		this._refreshTotalPrice();
		this._checkCartIsEmpty();
	},
	/**
	 * Handles click event
	 */
	onAddTicketClick : function(ev) {
		ev.preventDefault();
		var ticketType = $(ev.currentTarget).parents('.one_ticket_type_row')[0].getAttribute('data-ticket-type');

		this.addTicketToCart(ticketType);
	},

	/**
	 * Handles click event
	 */
	onRemoveTicketClick : function(ev) {
		ev.preventDefault();
			var ticketType = $(ev.currentTarget).parents('.one_ticket_type_row')[0].getAttribute('data-ticket-type');
			this.removeTicketToCart(ticketType);
	}
});