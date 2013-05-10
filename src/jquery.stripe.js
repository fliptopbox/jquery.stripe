/*global window, document, console, $, jQuery, undefined */

/**

	jQuery Stripe .stripe( [options] )
	@version  : 1.0.1
	@author   : Bruce Thomas
	@requires : jQuery Core 1.7+
	@github   : https://github.com/fliptopbox/jquery.stripe/


*/
(function ( $, window, document, undefined ) {
	// Create the defaults once
	var pluginName = 'stripe',
		defaults = {
			"ms": 750,
			"delay": (10 * 1000),
			"automatic": false,
			"min-width": 10,
			"buttons": null
		};

	// The actual plugin constructor
	function Stripe ( element, options ) {
		var that = this;

		this.element = element;
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;

		this.container = $(this.element).addClass('stripe');
		this.ul = this.container.find('ul:first');
		this.$li = this.ul.find('li');
		this.imageTotal = this.$li.length;
		this.ms = this.getOption('ms');
		this.loaded = 0;
		this.timeout = null;
		this.defaultDelay = this.getOption('delay');
		this.swipeDelay = this.defaultDelay;
		this.automatic = this.getOption('automatic');
		this.images = (function () {
			// preload all the images.
			var tmp = [];
			$(that.$li).each(function (i, obj) {
				var me = $(this),
					img = me.find('img'),
					src = img.attr('src'),
					alt = img.attr('alt') || '';
				tmp.push({'src': src, 'alt': alt});
			});
			return tmp;
		}());
		this.minStripeWidth = this.getOption('min-width');
		this.totalWidth = this.container.width();
		this.maxImageWidth = this.totalWidth - (this.imageTotal * this.minStripeWidth);
		this.minHeight = null;
		this.current = null;

		this.init();
	}

	/**
		Loops through the stripe gallery
	*/
	Stripe.prototype.auto = function () {
		var that = this;

		if (!this.automatic) {
			console.log('automatic', this.automatic);
			return;
		}

		this.timeout = this.timeout || setTimeout(function () {
			that.timeout = null;
			that.getImage();
			that.auto();
		}, this.swipeDelay - 250);
	};

	/**
		Retrieves value from option object
		@param key {String} required - the key of the key / value pair
	*/
	Stripe.prototype.getOption = function (key) {
		return this.options[key];
	};

	/**
		Creates a random number from a predefined range
		@param max {Int} required - the maximum number in random range
		@param min {Int} optional - the minimum number in random range
	*/
	Stripe.prototype.random = function(max, min) {
		min = min || 1;
		return Math.floor((Math.random() * max) + min);
	};

	/**
		Displays the next image in the stripe show
		@param img {Object} image to display on load
		@param $me {Object} current containing li
		@param $lis {Object} all other lis
	*/
	Stripe.prototype.onload = function (img, $me, $lis) {
		var that = this,
			myWidth = img.width,
			maxWidth = myWidth >= this.maxImageWidth ? this.maxImageWidth : myWidth,
			diff = this.totalWidth - maxWidth,
			mean = diff / (this.imageTotal - 1),
			altText = img.alt,
			alt = $('<div />')
				.addClass('stripe-description')
				.css({'display': 'none'})
				.html('<em>' + altText.split(' - ').join('</em><em>') + '</em>');

		$('.stripe-description').remove();

		$lis.animate({'width': mean}, this.ms, 'swing');

		$me.animate({'width': maxWidth}, this.ms, 'swing', function () {
			$me.append(alt);
			setTimeout(function() {
				alt.fadeIn(that.ms);
			}, 0);
		});
	};

	/**
		Opens the slideshow to the image specified
		@param i {Int} required - the index of the image to show
	*/
	Stripe.prototype.getImage = function(i) {
		i = typeof i === 'number' ? i : this.random(this.imageTotal);
		i = i > this.imageTotal - 1 ? 0 : i;
		i = i < 0 ? this.imageTotal - 1 : i;

		if(this.current === i) {
			return this.getImage();
		}

		this.current = i;
		var $me = this.$li.eq(i),
			$lis = $me.siblings('li'),
			$img = $me.find('img'),
			src = $img.attr('src');

		$img.height(this.images[i].height).width(this.images[i].width);
		this.onload(this.images[i], $me, $lis);
		return this.current;
	};

	/**
		Stops the automatic slideshow
	*/
	Stripe.prototype.enter = function () {
		clearTimeout(this.timeout);
		this.timeout = null;
	};

	/**
		Keeps the automatic slide show going
	*/
	Stripe.prototype.exit = function () {
		this.auto();
	};

	/**
		Gets the next image in the list
	*/
	Stripe.prototype.next = function () {
		return this.getImage(this.current + 1);
	};

	/**
		Gets the previous image in the list
	*/
	Stripe.prototype.previous = function () {
		return this.getImage(this.current - 1);
	};

	/**
		Creates the navigation controls
	*/
	Stripe.prototype.insertNavigationCtrl = function () {
		if(!this.getOption('buttons')) { return; }

		var ctrl = $('<div />').addClass('stripe-control'),
			button = '<a href="#" class="button"></a>',
			buttonNext = $(button).addClass('next').append('<span>next</span>'),
			buttonPrev = $(button).addClass('previous').append('<span>prev</span>'),
			that = this;

		ctrl.append(buttonPrev).append(buttonNext);
		this.container.append(ctrl);
		ctrl.on('click', '.button', function (e) {
			e.preventDefault();
			var me = $(this),
				isnext = me.hasClass('next');
			return isnext ? that.next() : that.previous();
			// return that[nav]();
		});
		ctrl.on('mouseenter', function(){
			that.enter.apply(that);
		}).on('mouseleave', function (){
			that.exit.apply(that);
		});
	};

	/**
		Rescales all the images so that they fit inside the
		container
	*/
	Stripe.prototype.conformHeights = function () {
		var that = this,
			ratio,
			newWidth;

		this.$li.height(this.minHeight);

		$(this.images).each(function (i, image){
			//
			// image.height = this.minHeight;
			ratio = image.width / image.height;
			newWidth = that.minHeight * ratio;
			that.images[i].width = newWidth;
			that.images[i].height = that.minHeight;
		});

		this.getImage(this.random(this.imageTotal));
		this.auto();
	};


	/**
		Sets up the gallery
	*/
	Stripe.prototype.init = function () {
		var that = this;

		this.$li.width( this.totalWidth / this.imageTotal ); // ... while pre-loading

		$(this.images).each(function(i, obj) {
			var img = new Image();
			img.onload = function () {
				$.extend(that.images[i], {
					'width': img.width,
					'height': img.height
				});

				that.minHeight = Math.min(that.minHeight || img.height, img.height);

				if ((that.loaded += 1) >= that.imageTotal) {
					that.insertNavigationCtrl();
					that.conformHeights();
					return;
				}
			};
			img.src = obj.src;
		});

		this.$li.on('click', function () {
			var index = $(this).index();
			return index !== that.current ? that.getImage(index) : that.current;
		});

		this.container.on('mouseenter', function (){
			that.enter.apply(that);
		}).on('mouseleave', function(){
			that.exit.apply(that);
		});
	};

	// Create the plugin
	$.fn[pluginName] = function ( options ) {
		options = options && options.constructor === Object ? options : {};

		return this.each(function (n) {
			$.data(this, 'plugin_' + pluginName, new Stripe(this, options));
		});
	};
}( jQuery, window, document ));










