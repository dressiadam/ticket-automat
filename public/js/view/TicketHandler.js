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
	ticketTypeDataAttr     : 'data-ticket-type',
	ticketTypeTotalClass   : 'ticket_type_total_price',

	events : {
		'click .ticket_box'    : 'onTicketClick',
		'click .add_ticket'    : 'onAddTicketClick',
		'click .remove_ticket' : 'onRemoveTicketClick',
		'click .paying_button' : 'onPayingButtonClick'
	},

	/**
	 * Init
	 */
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

	/**
	 * Handles click event on a ticket
	 * @public
	 * @return void
	 */
	onTicketClick : function(ev) {
		ev.preventDefault();
		if(this.isSelectPageSelected()) {
			this.checkTicketStatus(ev);
		}
	},

	/**
	 * Gets true if the current activa page is select page
	 * @public
	 * @return {Boolean}
	 */
	isSelectPageSelected : function() {
		return $('.process_page.active').hasClass('select_page');
	},

	/**
	 * Handles the click event on paying button
	 * @public
	 * @return void
	 */
	onPayingButtonClick : function(ev) {
		ev.preventDefault();
		this._payingButton.hide();
		this._payingInProgressLoader.addClass(this.activeClass);
	},

	/**
	 * Handles when the next page is loaded
	 * @public
	 * @return void
	 */
	onNextProcessPageLoaded : function(ev) {
		if (ev.hasClass(this.summaryPageClass)) {
			this.addSelectedTickets();
		}
		this.setCurrentVisiblePriceProperty(ev);
	},

	/**
	 * Handles when the previous page is loaded
	 * @public
	 * @return void
	 */
	onPrevProcessPageLoaded : function(ev) {
		if (ev.hasClass(this.selectPageClass)) {
			this.resetShoppingCart();
		}
		this.setCurrentVisiblePriceProperty(ev);
	},

	/**
	 * Sets the different designs of the price holder
	 * @public
	 * @return void
	 */
	setCurrentVisiblePriceProperty : function(ev) {
		this._totalPriceText.removeClass();
		if (ev.hasClass(this.summaryPageClass)) {
			this._totalPriceText.addClass(this.summaryPageClass);
		}
		if (ev.hasClass(this.payingPageClass)) {
			this._totalPriceText.addClass(this.payingPageClass);
		}
	},

	/**
	 * Reset shopping cart
	 * @public
	 * @return void
	 */
	resetShoppingCart : function() {
		this._ticketBoxes.removeClass(this.selectedClass);
		this._ticketsCounters.html('1');
		this.model.resetShoppingCart();
		this._refreshTotalPrice();
	},

	/**
	 * Add selected ticket to summary page(in this case 'show' instead of 'add')
	 * @public
	 * @return void
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
	 * Checks the statuses of tickets
	 * @public
	 * @return void
	 */
	checkTicketStatus : function(ev) {
		var currentTarget = $(ev.currentTarget),
			ticketType = currentTarget.attr('data-ticket-type');
		if (!currentTarget.hasClass(this.selectedClass)) {
			this.addTicketToCart(ticketType);
			currentTarget.addClass(this.selectedClass);
		}
		else {
			this.removeTicketFromCart(ticketType);
			currentTarget.removeClass(this.selectedClass);
		}
	},

	/**
	 * Refresh total price
	 * @public
	 * @return void
	 */
	_refreshTotalPrice : function() {
		var newValue = this.model.getTotalPrice() + ' ' + 'HUF';
		this._totalPriceText.html(newValue);
		this._endPriceText.html(newValue);
	},

	/**
	 * Checks the content of cart (empty or not empty)
	 * @public
	 * @return void
	 */
	_checkCartIsEmpty : function() {
		if (this.model.getTotalPrice() === 0) {
			app.events.trigger('SHOPPING-CART-IS-EMPTY');
		}
	},

	/**
	 * Add ticket ot the cart
	 * @public
	 * @return void
	 */
	addTicketToCart : function(ticketType) {
		this.model.addTicketToCart(ticketType);
		this._refreshTotalPrice();
		app.events.trigger('SHOPPING-CART-IS-NOT-EMPTY');
	},

	/**
	 * Remove ticket from the cart
	 * @public
	 * @return void
	 */
	removeTicketFromCart : function(ticketType) {
		this.model.removeTicketFromCart(ticketType);
		this._refreshTotalPrice();
		this._checkCartIsEmpty();
	},

	/**
	 * Refresh the ticket counter
	 * @public
	 * @return void
	 */
	refreshTicketCounter : function(ticketType, counterEl) {
		counterEl.html(this.model.attributes.shoppingCart[ticketType] || '0');
	},

	/**
	 * Refresh ticket price
	 * @public
	 * @return void
	 */
	refreshTicketPrice : function(ticketType, ticketTypePriceEl) {
		var typePrice = parseInt(this.model.attributes.ticketTypes[ticketType]),
			ticketCount = parseInt(this.model.attributes.shoppingCart[ticketType]),
			price = typePrice * ticketCount ? typePrice * ticketCount : 0;
		ticketTypePriceEl.html(price + ' HUF');
	},

	/**
	 * Handles click on add ticket button
	 * @public
	 * @return void
	 */
	onAddTicketClick : function(ev) {
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

	/**
	 * Handles click on remove ticket button
	 * @public
	 * @return void
	 */
	onRemoveTicketClick : function(ev) {
		ev.preventDefault();
		var ticketRowEl = $(ev.currentTarget).parents('.one_ticket_type_row')[0],
			ticketType = ticketRowEl.getAttribute('data-ticket-type'),
			currentTicketRowEl = $('.one_ticket_type_row[data-ticket-type=' + ticketType + ']'),
			counterEl = currentTicketRowEl.find('.counter_display'),
			ticketTypePriceEl = currentTicketRowEl.find('.ticket_type_total_price');

		this.removeTicketFromCart(ticketType);
		this.refreshTicketCounter(ticketType, counterEl);
		this.refreshTicketPrice(ticketType, ticketTypePriceEl);
	}
});