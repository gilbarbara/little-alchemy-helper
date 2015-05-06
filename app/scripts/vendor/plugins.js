/* eslint-disable */
(function ($) {
    $.fn.tooltip = function () {
        var $tooltip = $("#tooltip");
        return this.each(function () {
            var $this = $(this);

            function fillTooltip (e, $el) {
                $tooltip
                    .find('.image').css('backgroundImage', 'url(' + $el.find('img').prop('src') + ')').end()
                    .find('h4').text($el.find('h5').text()).end()
                    .find('.made').html($("#showCheats").is(":checked") ? $el.data('composition').replace(/\+/g, " + ").replace(/;/g, "<br/>") : '').end()
                    .find('h5').css('display', ($el.data('make').length ? 'block' : 'none')).end()
                    .find('.make').html($el.data('make')).end()
                    .css({ top: e.pageY + 10, left: e.pageX + 200 > $(window).width() ? e.pageX - 200 : e.pageX + 10 })
                    .show();
            }

            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
                $this.find('.info').on("click", function (e) {
                    e.preventDefault();
                    if (!$('#tooltip').is(':visible') || $tooltip.find('h4').text() !== $this.find('h5').text()) {
                        fillTooltip(e, $this);
                    }
                    else {
                        $('#tooltip').hide();
                    }
                });
            }
            else {
                $this.find('.info')
                    .on("mouseenter", function (e) {
                        fillTooltip(e, $this);
                    })
                    .on("mouseleave", function (e) {
                        $tooltip.hide();
                    })
                    .on('click', function (e) {
                        e.preventDefault();
                    });
            }
        });
    };

    $.fn.clearSearch = function (options) {
        var settings = $.extend({
            focusAfterClear: true,
            linkClass: 'fa fa-times-circle'
        }, options);
        return this.each(function () {
            var $this = $(this), btn;

            if (!$this.parent().hasClass("clear_input")) {
                $this.wrap('<div class="clear_input">' + $this.html() + '</div>');
                $this.after('<a class="' + settings.linkClass + '"></a>');
            }
            btn = $this.next();

            function clearField () {
                $this.val('').change();
                triggerBtn();
                if (settings.focusAfterClear && arguments[0].type === 'click') {
                    $this.focus();
                }
                if (typeof (settings.callback) === "function") {
                    settings.callback();
                }
            }

            function triggerBtn () {
                if (hasText()) {
                    btn.show();
                }
                else {
                    btn.hide();
                }
                update();
            }

            function hasText () {
                return $this.val().replace(/^\s+|\s+$/g, '').length > 0;
            }

            function update () {
                var width = $this.outerWidth(), height = $this.outerHeight();
                btn.css({
                    top: Math.round(height / 2 - btn.height() / 2),
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
