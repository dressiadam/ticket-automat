/**
 * @module models/TicketHandlerModel
 */
app.Model.TicketHandlerModel = Backbone.Model.extend({
	_currentTotalPrice : 0,
	defaults           : {
		'shoppingCart' : {},
		'ticketTypes'  : {
			'24h_bp'       : '1650',
			'5_30_bp'      : '4550',
			'24h_bp_group' : '3300',
			'7day'         : '4950'
		}
	},

	/**
	 * Adds one ticket to the cart
	 * @public
	 * @return void
	 */
	addTicketToCart : function(ticketType) {
		var ticketCount = this.attributes.shoppingCart[ticketType],
			newCount = ticketCount ? parseInt(ticketCount) + 1 : 1;
		this.attributes.shoppingCart[ticketType] = newCount;
	},

	/**
	 * Removes one ticket to the cart
	 * @public
	 * @return void
	 */
	removeTicketFromCart : function(ticketType) {
		var ticketCount = this.attributes.shoppingCart[ticketType],
			newCount = ticketCount ? parseInt(ticketCount) - 1 : 0;
		newCount !== 0 ?
			this.attributes.shoppingCart[ticketType] = newCount :
			delete this.attributes.shoppingCart[ticketType];
	},

	/**
	 * Gets the total price of tickets
	 * @public
	 * @return {Number} _currentTotalPrice
	 */
	getTotalPrice : function() {
		var _currentTotalPrice = 0;
		_.map(this.attributes.shoppingCart, function(num, key) {
			_currentTotalPrice = _currentTotalPrice + (num * parseInt(this.attributes.ticketTypes[key]));
		}, this);
		return _currentTotalPrice;
	},

	/**
	 * Gets the keys of the selected tickets
	 * @public
	 * @return {String} selectedTickets    the keys of the selected tickets
	 */
	getSelectedTickets : function() {
		return _.keys(this.attributes.shoppingCart);
	},

	/**
	 * Resets the shopping car's content
	 * @public
	 * @return void
	 */
	resetShoppingCart : function() {
		this.attributes.shoppingCart = {};
	}
});