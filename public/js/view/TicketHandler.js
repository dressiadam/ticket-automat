/**
 * @module views/Pager
 */
app.View.TicketHandler = Backbone.View.extend({
	summaryPageClass: 'summary_page',
	activeClass: 'active',
	initialize: function() {
		this._touchWrapper = $('.ticket_box');
		this._totalPriceText = $('.total_price_wrapper h3');
		this._oneTicketRow = $( ".one_ticket_type_row");

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
	onAddTicketClick : function(ev) {
		ev.preventDefault();
		console.info(ev.target);
		var ticketType = $('.add_ticket').parents('.one_ticket_type_row');
		// TODO itt folyt. kov
		this.addTicketToCart(ticketType);
	},

	/**
	 * Handles click event
	 */
	onRemoveTicketClick : function(ev) {
		ev.preventDefault();
		console.info(ev);
		var ticketType = $('.add_ticket').parents('.one_ticket_type_row');
		// TODO itt folyt. kov
		this.removeTicketToCart(ticketType);
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
		var currentTarget = $(ev.currentTarget);
		if(!currentTarget.hasClass('selected')) {
			this.addTicketToCart(currentTarget);
			currentTarget.addClass('selected');
		}
		else {
			this.removeTicketToCart(currentTarget);
			currentTarget.removeClass('selected');
		}
	},

	/**
	 *
	 */
	addTicketToCart: function(currentTarget) {
		var ticketType = currentTarget.attr('data-ticket-type');
		this.model.addTicketToCart(ticketType);
		this._refreshTotalPrice();
		app.events.trigger('SHOPPING-CART-IS-NOT-EMPTY');
	},

	/**
	 *
	 */
	removeTicketToCart: function(currentTarget) {
		var ticketType = currentTarget.attr('data-ticket-type');
		this.model.removeTicketToCart(ticketType);
		this._refreshTotalPrice();
		this._checkCartIsEmpty();
	},

	/**
	 *
	 */
	_refreshTotalPrice: function() {
		this._totalPriceText.html(this.model.getTotalPrice() + 'HUF');
	},

	/**
	 *
	 */
	_checkCartIsEmpty: function() {
		if(this.model.getTotalPrice() === 0) {
			app.events.trigger('SHOPPING-CART-IS-EMPTY');
		}
	}
});