/**
 * @module views/Pager
 */
app.View.Pager = Backbone.View.extend({
	activeClass: 'active',

	initialize: function() {
		this._touchWrapper = $('.touch_wrapper');
		this._purchaseProcessWrapper = $('.purchase_process');
		this._selectPage = $('.select_page');
		this._summaryPage = $('.summary_page');
		this._payingPage = $('.paying_page');
	},

	events : {
		'click .touch_wrapper' : 'onTouchWrapperClick'
	},

	/**
	 * Handles click event
	 */
	onTouchWrapperClick : function() {
		console.info('click');
		this.hideTouchWrapper();
		this.showPurchaseProcess();
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
	}
});