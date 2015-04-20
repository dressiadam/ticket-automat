/**
 * @module views/Pager
 */
app.View.Pager = Backbone.View.extend({
	activeClass: 'active',
	isLastProcessPage: 'is_last_process_page',
	isFirstProcessPage: 'is_first_process_page',
	maximumTicketCountWithoutScrollBar: 2,
	events : {
		'click .touch_wrapper' : 'onTouchWrapperClick',
		'click .back_button'   : 'onBackButtonClick',
		'click .next_button'   : 'onNextButtonClick'
	},

	/**
	 *
	 */
	initialize: function() {
		this._touchWrapper = $('.touch_wrapper');
		this._purchaseProcessWrapper = $('.purchase_process');
		this._nextButton = $('.next_button');
		this._backButton = $('.back_button');
		this._processPages = $('.process_page');
		this._arrowBoxes = $('.arrow_box');
		this._totalPriceWrapper = $('.total_price_wrapper');
		this._summaryPage = $('.summary_page');

		app.events.on('SHOPPING-CART-IS-NOT-EMPTY', this.onShoppingCartIsNotEmpty, this);
		app.events.on('SHOPPING-CART-IS-EMPTY', this.onShoppingCartIsEmpty, this);
		app.events.on('SELECTED-TICKETS-TYPE-COUNT', this.onSelectedTicketsTypeCount, this);
	},

	/**
	 * Handles click event
	 */
	onTouchWrapperClick : function() {
		this.hideTouchWrapper();
		this.showPurchaseProcess();
	},

	/**
	 * Handles click event
	 */
	onBackButtonClick : function(ev) {
		ev.preventDefault();
		if(this._backButton.hasClass(this.activeClass)) {
			this._setPrevPage();
		}
	},

	/**
	 * Handles click event
	 */
	onNextButtonClick : function(ev) {
		ev.preventDefault();
		if(this._nextButton.hasClass(this.activeClass)) {
			this._setNextPage();
		}
	},

	/**
	 *
	 */
	_setNextPage: function() {
		var activePage = $('.process_page.active'),
			nextActivePage = activePage.next('.process_page'),
			nextActiveArrowBox = $('.arrow_box.active').next('.arrow_box');
		if (nextActivePage.length !== 0) {
			this._processPages.removeClass(this.activeClass);
			nextActivePage.addClass(this.activeClass);

			this._arrowBoxes.removeClass(this.activeClass);
			nextActiveArrowBox.addClass(this.activeClass);
			this._enabledBackButton();
			this._totalPriceWrapper.addClass('bigger_font_size');
			app.events.trigger('NEXT-PROCESS-PAGE-LOADED', nextActivePage);
		}
		if(nextActivePage.hasClass(this.isLastProcessPage)) {
			this._disabledNextButton();
		}
	},

	/**
	 *
	 */
	_setPrevPage: function() {
		var activePage = $('.process_page.active'),
			prevActivePage = activePage.prev('.process_page'),
			prevActiveArrowBox = $('.arrow_box.active').prev('.arrow_box');
		if (prevActivePage.length !== 0) {
			this._processPages.removeClass(this.activeClass);
			prevActivePage.addClass(this.activeClass);

			this._arrowBoxes.removeClass(this.activeClass);
			prevActiveArrowBox.addClass(this.activeClass);
			app.events.trigger('PREV-PROCESS-PAGE-LOADED', prevActivePage);
		}
		if(activePage.hasClass(this.isLastProcessPage)) {
			this._enabledNextButton();
		}
		if(prevActivePage.hasClass(this.isFirstProcessPage)) {
			this._disabledBackButton();
			this._disabledNextButton();
			this._totalPriceWrapper.removeClass('bigger_font_size');
		}
	},

	/**
	 * Show Purchase Process Wrapper
	 */
	showPurchaseProcess : function() {
		this._purchaseProcessWrapper.addClass(this.activeClass);
	},

	/**
	 * Handles click event
	 */
	hideTouchWrapper : function() {
		this._touchWrapper.removeClass(this.activeClass);
	},
	/**
	 * Handles click event
	 */
	showTouchWrapper : function() {
		this._touchWrapper.addClass(this.activeClass);
	},

	/**
	 *
	 */
	_enabledNextButton : function() {
		this._nextButton.addClass(this.activeClass);
	},

	/**
	 *
	 */
	_disabledNextButton : function() {
		this._nextButton.removeClass(this.activeClass);
	},

	/**
	 *
	 */
	_enabledBackButton : function() {
		this._backButton.addClass(this.activeClass);
	},

	/**
	 *
	 */
	_disabledBackButton : function() {
		this._backButton.removeClass(this.activeClass);
	},

	/**
	 *
	 */
	onShoppingCartIsNotEmpty : function() {
		this._enabledNextButton();
	},

	/**
	 *
	 */
	onShoppingCartIsEmpty : function() {
		this._disabledNextButton();
	},

	/**
	 *
	 */
	onSelectedTicketsTypeCount : function(ticketTypeCount) {
		if(ticketTypeCount > this.maximumTicketCountWithoutScrollBar) {
			this._summaryPage.addClass('many_tickets');
		}
		else {
			this._summaryPage.removeClass('many_tickets');
		}
	}
});