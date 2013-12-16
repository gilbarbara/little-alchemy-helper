Array.prototype.unique = function () {
	var vals, uniques, i, val;

	vals = this;
	uniques = [];
	for (i = vals.length; i--;) {
		val = vals[i];
		if ($.inArray(val, uniques) === -1) {
			uniques.unshift(val);
		}
	}
	return uniques;
};

/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {

  $.fn.unveil = function(threshold) {

    var $w = $(window),
        th = threshold || 0,
        retina = window.devicePixelRatio > 1,
        attrib = retina? "data-src-retina" : "data-src",
        images = this,
        loaded,
        inview,
        source;

    this.one("unveil", function() {
      source = this.getAttribute(attrib);
      source = source || this.getAttribute("data-src");
      if (source) this.setAttribute("src", source);
    });

    function unveil() {
      inview = images.filter(function() {
        var $e = $(this),
            wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();

        return eb >= wt - th && et <= wb + th;
      });

      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }

    $w.scroll(unveil);
    $w.resize(unveil);

    unveil();

    return this;

  };

})(jQuery);

/**
 * jQuery.fn.sortElements
 * --------------
 * @author James Padolsey (http://james.padolsey.com)
 * @version 0.11
 * @updated 18-MAR-2010
 * --------------
 * @param Function comparator:
 *   Exactly the same behaviour as [1,2,3].sort(comparator)
 *
 * @param Function getSortable
 *   A function that should return the element that is
 *   to be sorted. The comparator will run on the
 *   current collection, but you may want the actual
 *   resulting sort to occur on a parent or another
 *   associated element.
 *
 *   E.g. $('td').sortElements(comparator, function(){
 *      return this.parentNode;
 *   })
 *
 *   The <td>'s parent (<tr>) will be sorted instead
 *   of the <td> itself.
 */
jQuery.fn.sortElements = (function(){

	var sort = [].sort;

	return function(comparator, getSortable) {

		getSortable = getSortable || function(){return this;};

		var placements = this.map(function(){

			var sortElement = getSortable.call(this),
				parentNode = sortElement.parentNode,

			// Since the element itself will change position, we have
			// to have some way of storing it's original position in
			// the DOM. The easiest way is to have a 'flag' node:
				nextSibling = parentNode.insertBefore(
					document.createTextNode(''),
					sortElement.nextSibling
				);

			return function() {

				if (parentNode === this) {
					throw new Error(
						"You can't sort elements if any one is a descendant of another."
					);
				}

				// Insert before flag:
				parentNode.insertBefore(this, nextSibling);
				// Remove flag:
				parentNode.removeChild(nextSibling);

			};

		});

		return sort.call(this, comparator).each(function(i){
			placements[i].call(getSortable.call(this));
		});

	};

})();

/*
 * Data Selector 1.1
 * April 27, 2010
 * Corey Hart http://www.codenothing.com
 */
(function( $, undefined ){

	// Globals
	var name, value, condition, original, eqIndex, cache = {}, special = {},
		rSpecial = /\[(.*?)\]$/,
		BasicConditions = {
			'$': true,
			'!': true,
			'^': true,
			'*': true,
			'<': true,
			'>': true,
			'~': true
		};

	function parseQuery( query ) {
		original = query;

		if ( cache[ original ] ) {
			name = cache[ original ].name;
			value = cache[ original ].value;
			condition = cache[ original ].condition;
			eqIndex = cache[ original ].eqIndex;
			return true;
		}

		// Find the first instance of equal sign for name=val operations
		eqIndex = query.indexOf( '=' );
		if ( eqIndex > -1 ) {
			name = query.substr( 0, eqIndex );
			value = query.substr( eqIndex + 1 ) || null;
		} else {
			name = query;
			value = null;
		}

		// Store condition (not required) for comparison
		condition = name.charAt( name.length - 1 );

		if ( BasicConditions[ condition ] === true ) {
			name = name.substr( 0, name.length - 1 );
		}
		else if ( condition === ']' ) {
			condition = rSpecial.exec( name )[ 1 ];
			name = name.replace( rSpecial, '' );
		}

		// If >=, <=, or !! is passed, add to condition
		if ( value && ( condition === '<' || condition === '>' ) && value.charAt(0) === '=' ) {
			value = value.substr( 1 );
			condition = condition + '=';
		}
		// If regex condition passed, store regex into the value var
		else if ( condition === '~' ) {
			value = new RegExp(
				value.substr( 1, value.lastIndexOf('/') - 1 ), 
				value.split('/').pop()
			);
		}
		else if ( value && value.substr( 0, 2 ) === '==' ) {
			condition = '===';
			value = value.substr( 2 );
		}

		// Expand name to allow for multiple levels
		name = name.split('.');

		// Cache Results
		cache[ original ] = {
			name: name,
			value: value,
			condition: condition,
			eqIndex: eqIndex
		};
	}

	$.expr[':'].data = function( elem, index, params, group ) {
		if ( elem === undefined || ! params[3] || params[3] == '' ) {
			return false;
		}
		else if ( original !== params[3] ) {
			parseQuery( params[3] );
		}

		// Grab bottom most level data
		for ( var i = -1, l = name.length, data; ++i < l; ) {
			if ( ( data = data === undefined ? $(elem).data(name[i] ) : data[ name[i] ] ) === undefined || data === null ) {
				return false;
			}
		}

		// No comparison passed, just looking for existence (which was found at this point)
		if ( eqIndex === -1 ) {
			return true;
		}

		switch ( condition ) {
			// Not equal to
			case '!': return data.toString() !== value;
			// Starts with
			case '^': return data.toString().indexOf( value ) === 0;
			// Ends with
			case '$': return data.toString().substr( data.length - value.length ) === value;
			// Contains
			case '*': return data.toString().indexOf( value ) !== -1;
			// Greater Than (or equal to)
			case '>': return data > value;
			case '>=': return data >= value;
			// Less Than (or equal to)
			case '<': return data < value;
			case '<=': return data <= value;
			// Boolean Check
			case '===': return data === ( value === 'false' ? false : true );
			// Regex Matching
			case '~': return value.test( data.toString() );
			// Defaults to either special user defined function, or simple '=' comparison
			default: return special[ condition ] ?
				special[ condition ].call( elem, data, value, index, params, group ) : ( data && data.toString() === value );
		}
	};

	// Give developers ability to attach their own special data comparison function
	$.dataSelector = function( o, fn ) {
		if ( $.isFunction( fn ) ) {
			special[ o ] = fn;
		} else {
			$.extend( special, o || {} );
		}
	};

})( jQuery );


/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function raw(s) {
		return s;
	}

	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}

	function converted(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}
		try {
			return config.json ? JSON.parse(s) : s;
		} catch(er) {}
	}

	var config = $.cookie = function (key, value, options) {

		// write
		if (value !== undefined) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? JSON.stringify(value) : String(value);

			return (document.cookie = [
				encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// read
		var decode = config.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		var result = key ? undefined : {};
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = decode(parts.join('='));

			if (key && key === name) {
				result = converted(cookie);
				break;
			}

			if (!key) {
				result[name] = converted(cookie);
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== undefined) {
			$.cookie(key, '', $.extend(options, { expires: -1 }));
			return true;
		}
		return false;
	};

}));

(function($) {
	$.fn.tooltip = function () {
		$tooltip = $("#tooltip");
		return this.each(function() {
			var $this = $(this);
			function fillTooltip(e, $el) {
				$tooltip
					.find('.image').css('backgroundImage', 'url('+$el.find('img').prop('src')+')').end()
					.find('h4').text($el.find('h5').text()).end()
					.find('.made').html($("#showCheats").is(":checked") ? $el.data('composition').replace(/\+/g, " + ").replace(/;/g,"<br/>") : '').end()
					.find('h5').css('display',($el.data('make').length ? 'block' : 'none')).end()
					.find('.make').html($el.data('make')).end()
					.css({ top: e.pageY + 10, left: e.pageX + 200 > $(window).width() ? e.pageX - 200 : e.pageX + 10 })
					.show();
			}

			if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
				$this.find('.info').on("click", function(e) {
					e.preventDefault();
					if(!$('#tooltip').is(':visible') || $tooltip.find('h4').text() != $this.find('h5').text()) fillTooltip(e, $this);
					else $('#tooltip').hide();
				});
			}
			else {
				$this.find('.info')
					.on("mouseenter", function(e) {
						fillTooltip(e, $this);
					})
					.on("mouseleave", function(e) {
						$tooltip.hide();
					})
					.on('click', function(e) {
						e.preventDefault();
					});
			}
		});
	};

	$.fn.clearSearch = function(options) {
		var settings = $.extend({
			focusAfterClear : true,
			linkClass : 'icon-remove-sign'
		}, options);
		return this.each(function() {
			var $this = $(this), btn;

			if (!$this.parent().hasClass("clear_input")) {
				$this.wrap('<div class="clear_input">' + $this.html() + '</div>');
				$this.after('<a class="' + settings.linkClass + '"></a>');
			}
			btn = $this.next();

			function clearField() {
				$this.val('').change();
				triggerBtn();
				if (settings.focusAfterClear && arguments[0].type == 'click') {
					$this.focus();
				}
				if (typeof (settings.callback) === "function") {
					settings.callback();
				}
			}

			function triggerBtn() {
				if (hasText()) {
					btn.show();
				} else {
					btn.hide();
				}
				update();
			}

			function hasText() {
				return $this.val().replace(/^\s+|\s+$/g, '').length > 0;
			}

			function update() {
				var width = $this.outerWidth(), height = $this.outerHeight();
				btn.css({
					top : Math.round(height / 2 - btn.height() / 2),
					right: 8
				});
			}

			btn.on('click', clearField);
			$this
				.on('keyup keydown change', triggerBtn)
				.on('clear', clearField);

			triggerBtn();
		});
	};
})(jQuery);

/* ============================================================
 * bootstrapSwitch v1.3 by Larentis Mattia @spiritualGuru
 * http://www.larentis.eu/switch/
 * ============================================================
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 * ============================================================ */

(function($) {
	"use strict";

	$.fn['bootstrapSwitch'] = function (method) {
		var methods = {
			init: function () {
				return this.each(function () {
						var $element = $(this)
							, $div
							, $switchLeft
							, $switchRight
							, $label
							, myClasses = ""
							, classes = $element.attr('class')
							, color
							, moving
							, onLabel = "ON"
							, offLabel = "OFF"
							, icon = false;

						$.each(['switch-mini', 'switch-small', 'switch-large'], function (i, el) {
							if (classes.indexOf(el) >= 0)
								myClasses = el;
						});

						$element.addClass('has-switch');

						if ($element.data('on') !== undefined)
							color = "switch-" + $element.data('on');

						if ($element.data('on-label') !== undefined)
							onLabel = $element.data('on-label');

						if ($element.data('off-label') !== undefined)
							offLabel = $element.data('off-label');

						if ($element.data('icon') !== undefined)
							icon = $element.data('icon');

						$switchLeft = $('<span>')
							.addClass("switch-left")
							.addClass(myClasses)
							.addClass(color)
							.html(onLabel);

						color = '';
						if ($element.data('off') !== undefined)
							color = "switch-" + $element.data('off');

						$switchRight = $('<span>')
							.addClass("switch-right")
							.addClass(myClasses)
							.addClass(color)
							.html(offLabel);

						$label = $('<label>')
							.html("&nbsp;")
							.addClass(myClasses)
							.attr('for', $element.find('input').attr('id'));

						if (icon) {
							$label.html('<i class="' + icon + '"></i>');
						}

						$div = $element.find(':checkbox').wrap($('<div>')).parent().data('animated', false);

						if ($element.data('animated') !== false)
							$div.addClass('switch-animate').data('animated', true);

						$div
							.append($switchLeft)
							.append($label)
							.append($switchRight);

						$element.find('>div').addClass(
							$element.find('input').is(':checked') ? 'switch-on' : 'switch-off'
						);

						if ($element.find('input').is(':disabled'))
							$(this).addClass('deactivate');

						var changeStatus = function ($this) {
							$this.siblings('label').trigger('mousedown').trigger('mouseup').trigger('click');
						};

						$element.on('keydown', function (e) {
							if (e.keyCode === 32) {
								e.stopImmediatePropagation();
								e.preventDefault();
								changeStatus($(e.target).find('span:first'));
							}
						});

						$switchLeft.on('click', function (e) {
							changeStatus($(this));
						});

						$switchRight.on('click', function (e) {
							changeStatus($(this));
						});

						$element.find('input').on('change', function (e) {
							var $this = $(this)
								, $element = $this.parent()
								, thisState = $this.is(':checked')
								, state = $element.is('.switch-off');

							e.preventDefault();

							$element.css('left', '');

							if (state === thisState) {

								if (thisState)
									$element.removeClass('switch-off').addClass('switch-on');
								else $element.removeClass('switch-on').addClass('switch-off');

								if ($element.data('animated') !== false)
									$element.addClass("switch-animate");

								$element.parent().trigger('switch-change', {'el': $this, 'value': thisState})
							}
						});

						$element.find('label').on('mousedown touchstart', function (e) {
							var $this = $(this);
							moving = false;

							e.preventDefault();
							e.stopImmediatePropagation();

							$this.closest('div').removeClass('switch-animate');

							if ($this.closest('.has-switch').is('.deactivate'))
								$this.unbind('click');
							else {
								$this.on('mousemove touchmove', function (e) {
									var $element = $(this).closest('.switch')
										, relativeX = (e.pageX || e.originalEvent.targetTouches[0].pageX) - $element.offset().left
										, percent = (relativeX / $element.width()) * 100
										, left = 25
										, right = 75;

									moving = true;

									if (percent < left)
										percent = left;
									else if (percent > right)
										percent = right;

									$element.find('>div').css('left', (percent - right) + "%")
								});

								$this.on('click touchend', function (e) {
									var $this = $(this)
										, $target = $(e.target)
										, $myCheckBox = $target.siblings('input');

									e.stopImmediatePropagation();
									e.preventDefault();

									$this.unbind('mouseleave');

									if (moving)
										$myCheckBox.prop('checked', !(parseInt($this.parent().css('left')) < -25));
									else $myCheckBox.prop("checked", !$myCheckBox.is(":checked"));

									moving = false;
									$myCheckBox.trigger('change');
								});

								$this.on('mouseleave', function (e) {
									var $this = $(this)
										, $myCheckBox = $this.siblings('input');

									e.preventDefault();
									e.stopImmediatePropagation();

									$this.unbind('mouseleave');
									$this.trigger('mouseup');

									$myCheckBox.prop('checked', !(parseInt($this.parent().css('left')) < -25)).trigger('change');
								});

								$this.on('mouseup', function (e) {
									e.stopImmediatePropagation();
									e.preventDefault();

									$(this).unbind('mousemove');
								});
							}
						});
					}
				);
			},
			toggleActivation: function () {
				$(this).toggleClass('deactivate');
			},
			isActive: function () {
				return !$(this).hasClass('deactivate');
			},
			setActive: function (active) {
				if (active)
					$(this).removeClass('deactivate');
				else $(this).addClass('deactivate');
			},
			toggleState: function (skipOnChange) {
				var $input = $(this).find('input:checkbox');
				$input.prop('checked', !$input.is(':checked')).trigger('change', skipOnChange);
			},
			setState: function (value, skipOnChange) {
				$(this).find('input:checkbox').prop('checked', value).trigger('change', skipOnChange);
			},
			status: function () {
				return $(this).find('input:checkbox').is(':checked');
			},
			destroy: function () {
				var $div = $(this).find('div')
					, $checkbox;

				$div.find(':not(input:checkbox)').remove();

				$checkbox = $div.children();
				$checkbox.unwrap().unwrap();

				$checkbox.unbind('change');

				return $checkbox;
			}
		};

		if (methods[method])
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		else if (typeof method === 'object' || !method)
			return methods.init.apply(this, arguments);
		else
			$.error('Method ' + method + ' does not exist!');
	};
})(jQuery);

$(function () {
	$('.switch')['bootstrapSwitch']();
});
