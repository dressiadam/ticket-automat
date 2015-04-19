/**
* @module models/TicketHandlerModel
*/
app.Model.TicketHandlerModel = Backbone.Model.extend({
	defaults: {
		'shoppingCart' :  {},
		'ticketTypes' :  {
			'24h_bp':  '1650',
			'5_30_bp':     '4550',
			'24h_bp_group':    '3300',
			'7day':    '4950'
		}
	},
	_currentTotalPrice: 0,

	/**
	 *
	 */
	addTicketToCart: function(ticketType) {
		var ticketCount = this.defaults.shoppingCart[ticketType],
		newCount = ticketCount ? parseInt(ticketCount) + 1 : 1;
		this.defaults.shoppingCart[ticketType] = newCount;
	},

	/**
	 *
	 */
	removeTicketToCart: function(ticketType) {
		var ticketCount = this.defaults.shoppingCart[ticketType],
		newCount = ticketCount ? parseInt(ticketCount) - 1 : 0;
		newCount !==0 ?
			this.defaults.shoppingCart[ticketType] = newCount :
			delete this.defaults.shoppingCart[ticketType];
	},
	/**
	 *
	 */
	getTotalPrice: function() {
		var _currentTotalPrice = 0;
		_.map(this.defaults.shoppingCart, function(num, key){
			_currentTotalPrice = _currentTotalPrice + (num * parseInt(this.defaults.ticketTypes[key]));
		},this);
		return _currentTotalPrice;
	},

	/**
	 *
	 */
	getSelectedTickets: function() {
		return _.keys(this.defaults.shoppingCart);
	}
});