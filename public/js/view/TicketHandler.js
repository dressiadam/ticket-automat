/**
 * @module views/Pager
 */
app.View.TicketHandler = Backbone.View.extend({
	summaryPageClass : 'summary_page',
	selectPageClass : 'select_page',
	activeClass      : 'active',
	initialize       : function() {
		this._touchWrapper = $('.ticket_box');
		this._totalPriceText = $('.total_price_wrapper h3');
		this._oneTicketRow = $('.one_ticket_type_row');
		this._ticketBoxes = $('.ticket_box');
		this._ticketsCounters = $('.counter_display');

		app.events.on('NEXT-PROCESS-PAGE-LOADED', this.onNextProcessPageLoaded, this);
		app.events.on('PREV-PROCESS-PAGE-LOADED', this.onPrevProcessPageLoaded, this);
	},

	events : {
		'click .ticket_box'    : 'onTicketClick',
		'click .add_ticket'    : 'onAddTicketClick',
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
	 * Handles click event
	 */
	onPrevProcessPageLoaded : function(ev) {
		if (ev.hasClass(this.selectPageClass)) {
			this.resetShoppingCart();
		};
	},

	resetShoppingCart : function() {
		this._ticketBoxes.removeClass('selected');
		this._ticketsCounters.html('1');
		this.model.resetShoppingCart();
		this._refreshTotalPrice();
	},

	/**
	 *
	 */
	addSelectedTickets : function() {
		var selectedTickets = this.model.getSelectedTickets();
		this._oneTicketRow.removeClass('active');
		this._oneTicketRow.each(function(index) {
			if (_.indexOf(selectedTickets, $(this).attr('data-ticket-type')) !== -1) {
				$(this).addClass('active');
			}
		});
		app.events.trigger('SELECTED-TICKETS-TYPE-COUNT', selectedTickets.length);
	},

	/**
	 *
	 */
	checkTicketStatus : function(ev) {
		var currentTarget = $(ev.currentTarget),
			ticketType = currentTarget.attr('data-ticket-type');
		if (!currentTarget.hasClass('selected')) {
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
	_refreshTotalPrice : function() {
		this._totalPriceText.html(this.model.getTotalPrice() + ' ' + 'HUF');
	},

	/**
	 *
	 */
	_checkCartIsEmpty : function() {
		if (this.model.getTotalPrice() === 0) {
			app.events.trigger('SHOPPING-CART-IS-EMPTY');
		}
	},
	/**
	 *
	 */
	addTicketToCart   : function(ticketType) {
		this.model.addTicketToCart(ticketType);
		this._refreshTotalPrice();
		app.events.trigger('SHOPPING-CART-IS-NOT-EMPTY');
	},

	/**
	 *
	 */
	removeTicketToCart : function(ticketType) {
		this.model.removeTicketToCart(ticketType);
		this._refreshTotalPrice();
		this._checkCartIsEmpty();
	},
	/**
	 * Handles click event
	 */
	onAddTicketClick   : function(ev) {
		ev.preventDefault();
		var ticketRowEl = $(ev.currentTarget).parents('.one_ticket_type_row')[0],
			ticketType = ticketRowEl.getAttribute('data-ticket-type'),
			currentTicketRowEl = $('.one_ticket_type_row[data-ticket-type=' + ticketType + ']'),
			counterEl = currentTicketRowEl.find('.counter_display'),
			ticketTypePriceEl = currentTicketRowEl.find('.ticket_type_total_price');

		this.addTicketToCart(ticketType);
		this.refreshTicketCounter(ticketType, counterEl);
		this.refreshTicketPrice(ticketType,ticketTypePriceEl);
	},

	refreshTicketCounter : function(ticketType, counterEl) {
		console.info('CART: ', this.model.attributes.shoppingCart)
		counterEl.html(this.model.attributes.shoppingCart[ticketType] || '0');
	},

	refreshTicketPrice : function(ticketType, ticketTypePriceEl) {
		var typePrice = parseInt(this.model.attributes.ticketTypes[ticketType]),
			ticketCount = parseInt(this.model.attributes.shoppingCart[ticketType]),
		price = typePrice * ticketCount ? typePrice * ticketCount : 0;
		ticketTypePriceEl.html(price + ' HUF');
	},

	/**
	 * Handles click event
	 */
	onRemoveTicketClick : function(ev) {
		ev.preventDefault();
		var ticketRowEl = $(ev.currentTarget).parents('.one_ticket_type_row')[0],
			ticketType = ticketRowEl.getAttribute('data-ticket-type'),
			currentTicketRowEl = $('.one_ticket_type_row[data-ticket-type=' + ticketType + ']'),
			counterEl = currentTicketRowEl.find('.counter_display'),
			ticketTypePriceEl = currentTicketRowEl.find('.ticket_type_total_price');

		this.removeTicketToCart(ticketType);
		this.refreshTicketCounter(ticketType, counterEl);
		this.refreshTicketPrice(ticketType,ticketTypePriceEl);
	}
});