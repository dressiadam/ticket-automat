/**
 * @module views/Pager
 */
app.View.TicketHandler = Backbone.View.extend({

	summaryPageClass       : 'summary_page',
	selectPageClass        : 'select_page',
	payingPageClass        : 'paying_page',
	ticketBoxClass         : 'ticket_box',
	totalPriceWrapperClass : 'total_price_wrapper',
	oneTicketTypeRowClass  : 'one_ticket_type_row',
	counterDisplayClass    : 'counter_display',
	payingButtonClass      : 'paying_button',
	payingInProgressClass  : 'paying_inprogress',
	activeClass            : 'active',
	selectedClass          : 'selected',

	initialize : function() {
		this._totalPriceText = $('.' + this.totalPriceWrapperClass + ' var');
		this._endPriceText = $('.' + this.payingPageClass + ' var');
		this._oneTicketRow = $('.' + this.oneTicketTypeRowClass);
		this._ticketBoxes = $('.' + this.ticketBoxClass);
		this._ticketsCounters = $('.' + this.counterDisplayClass);
		this._payingButton = $('.' + this.payingButtonClass);
		this._payingInProgressLoader = $('.' + this.payingInProgressClass);

		app.events.on('NEXT-PROCESS-PAGE-LOADED', this.onNextProcessPageLoaded, this);
		app.events.on('PREV-PROCESS-PAGE-LOADED', this.onPrevProcessPageLoaded, this);
	},

	events : {
		'click .ticket_box'    : 'onTicketClick',
		'click .add_ticket'    : 'onAddTicketClick',
		'click .remove_ticket' : 'onRemoveTicketClick',
		'click .paying_button' : 'onPayingButtonClick'
	},

	/**
	 * Handles click event
	 */
	onTicketClick : function(ev) {
		ev.preventDefault();
		this.checkTicketStatus(ev);
	},

	onPayingButtonClick : function(ev) {
		ev.preventDefault();
		this._payingButton.hide();
		this._payingInProgressLoader.addClass(this.activeClass);
	},

	/**
	 * Handles click event
	 */
	onNextProcessPageLoaded : function(ev) {
		if (ev.hasClass(this.summaryPageClass)) {
			this.addSelectedTickets();
		}
		this.setCurrentVisiblePriceProperty(ev);
	},

	/**
	 * Handles click event
	 */
	onPrevProcessPageLoaded : function(ev) {
		if (ev.hasClass(this.selectPageClass)) {
			this.resetShoppingCart();
		}
		this.setCurrentVisiblePriceProperty(ev);
	},

	setCurrentVisiblePriceProperty : function(ev) {
		this._totalPriceText.removeClass();
		if (ev.hasClass(this.summaryPageClass)) {
			this._totalPriceText.addClass(this.summaryPageClass);
		}
		if (ev.hasClass(this.payingPageClass)) {
			this._totalPriceText.addClass(this.payingPageClass);
		}
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
		var self = this,
			selectedTickets = this.model.getSelectedTickets();
		this._oneTicketRow.removeClass(this.activeClass);
		this._oneTicketRow.each(function(index) {
			if (_.indexOf(selectedTickets, $(this).attr('data-ticket-type')) !== -1) {
				$(this).addClass(self.activeClass);
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
		var newValue = this.model.getTotalPrice() + ' ' + 'HUF';
		this._totalPriceText.html(newValue);
		this._endPriceText.html(newValue);
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
		this.refreshTicketPrice(ticketType, ticketTypePriceEl);
	},

	refreshTicketCounter : function(ticketType, counterEl) {
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
		this.refreshTicketPrice(ticketType, ticketTypePriceEl);
	}
});