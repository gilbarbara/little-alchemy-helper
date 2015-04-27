/**
 * Helper functions
 * @module plugins
 */

(function($) {
	$.fn.tooltip = function () {
		var $tooltip = $("#tooltip");
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
					if(!$('#tooltip').is(':visible') || $tooltip.find('h4').text() !== $this.find('h5').text()) {
						fillTooltip(e, $this);
					}
					else {
						$('#tooltip').hide();
					}
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
			linkClass : 'fa fa-times-circle'
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
				if (settings.focusAfterClear && arguments[0].type === 'click') {
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
/* jshint ignore:start */
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
/* jshint ignore:end */
$(function () {
	$('.switch')['bootstrapSwitch']();
});
