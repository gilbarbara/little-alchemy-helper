(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    }
    else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    }
    else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.tooltip = function () {
        var $tooltip = $('.tooltip');
        return this.each(function () {
            var $this = $(this);

            function fillTooltip (e, $el) {
                var $info = $(e.currentTarget),
                    offset = $info.offset();
                if (!$info.find('.fa').hasClass('fa-eye-slash')) {
                    $tooltip
                        .find('.image').css('backgroundImage', 'url(' + $el.find('img').prop('src') + ')').end()
                        .find('h4').text($el.find('h5').text()).end()
                        .find('.made').html($el.data('composition').replace(/\+/g, ' + ').replace(/;/g, '<br/>')).end()
                        .find('h5').css('display', ($el.data('make').length ? 'block' : 'none')).end()
                        .find('.make').html($el.data('make')).end()
                        .css({
                            top: offset.top + 25,
                            left: offset.left + 200 > $(window).width() ? offset.left - 200 : offset.left + 25
                        })
                        .show();
                }
            }

            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
                $this.find('.info').on('click', function (e) {
                    e.preventDefault();
                    if (!$tooltip.is(':visible') || $tooltip.find('h4').text() !== $this.find('h5').text()) {
                        fillTooltip(e, $this);
                    }
                    else {
                        $tooltip.hide();
                    }
                });
            }
            else {
                $this.find('.info')
                    .on('mouseenter', function (e) {
                        fillTooltip(e, $this);
                    })
                    .on('mouseleave', function () {
                        $tooltip.hide();
                    })
                    .on('click', function (e) {
                        e.preventDefault();
                    });
            }
        });
    };
}));
