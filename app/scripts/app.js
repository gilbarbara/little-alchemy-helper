/**
 * Little Alchemy Helper App
 * @module app
 *
 * http://littlealchemy.com/resources/images.113.json
 * http://littlealchemy.com/offline/resources/base.113.json
 * http://littlealchemy.com/offline/resources/en/names.113.json
 *
 */

var App = {
	dataSrc: {},
	ready: $.Deferred(),
	elements: {},
	base: {},
	names: {},
	images: {},
	completedCount: 4,
	lahCookie: null,
	$library: null,
	$item: null,
	release: 114,
	bookmarkletVersion: '0.4',

	getQueryOption: function (name) {
		name = name.replace(/[\[]/, "\\\\[").replace(/[\]]/, "\\\\]");
		var regex   = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, " "));
	},

	cleanHeader: function () {
		this.$library.find('h3').html(this.completedCount ? 'Remaining Elements' : '&nbsp;');
		this.$item.hide().filter(':not(.completed)').show();
	},

	cleanQueries: function (skip) {
		skip = skip ? skip : [];
		if ($.inArray('completed', skip) === -1) {
			$("#showCompleted").removeClass('btn-primary').addClass('btn-default').find('span').html('show');
		}
		if ($.inArray('filter', skip) === -1) {
			$("#filter").trigger('clear');
		}
		if ($.inArray('search', skip) === -1) {
			$("#search").trigger('clear');
		}
	},

	filterMake: function (str) {
		if (str) {
			this.cleanQueries(['filter']);
			this.$item.filter(':not(.completed)').show();
			this.$item.filter(':data(composition[!*]=' + str + ')').hide().end();
			this.$library
				.find('h3').html("Things you can make with: " + str).end()
				.find('.clearQuery').show();
		}
		else {
			this.cleanHeader();
		}
	},

	filterSearch: function (str) {
		if (str) {
			this.cleanQueries(['search']);
			this.$item.hide();
			this.$item.find("h5:contains('" + str.toLowerCase() + "')").parent().show();
			if (this.$item.filter(':visible').size()) {
				this.$library
					.find('h3').html("Elements found with: " + str).end()
					.find('.clearQuery').show();
			}
			else {
				this.$library.find('h3').html("Nothing found");
			}
		}
		else {
			this.cleanHeader();
		}
	},


	buildMake: function (obj, str) {
		var n, items = [];
		_.each(obj, function (d, i) {
			if (d.composition.indexOf(str) > -1) {
				items.push(i);
			}
		});
		return items.join(', ');
	},

	render: function () {
		var html    = [],
			options = {};

		if (_.size(this.elements)) {
			_.each(this.elements, function (d, i) {
				options.lahSaved = $.inArray(+i, this.lahCookie.getAll()) > -1;
				options.parents = [];
				_.map(d.parents, function (p) {
					options.parents.push(
						_.map(p, function (p2) {
							return App.names[p2];
						}).join(' + ')
					);
				});
				options.children = _.map(d.children, function (d) {
					return App.names[d];
				});

				html.push('<li id="' + i + '" title="' + d.name + '" class="item thumbnail' + (!d.children.length ? ' finalElement' : '') + (options.lahSaved || d.prime ? ' completed' : '') + '" data-composition="' + (d.parents ? options.parents.join(';') : '') + '" data-make="' + options.children.join(', ') + '">');
				html.push('<div class="buttons">');
				html.push('<a href="#" class="info"><i class="fa fa-eye"></i></a>');
				html.push('<a href="#" title="mark as completed" class="adder"></a>');
				html.push('<a href="#" title="things you can make with..." class="filter' + (d.children.length ? '' : ' disabled') + '">' + (d.children.length ? '<i class="fa fa-external-link-square"></i>' : '') + '</a>');
				html.push('</div>');
				html.push('<div class="image">');
				html.push('<img src="data:image/png;base64,' + d.image + '"/>');
				html.push('</div>');
				html.push('<h5>' + d.name + '</h5>');
				if (options.children.length) {
					html.push('<span class="count">' + options.children.length + '</span>');
				}
				html.push('</li>');
			}.bind(this));
		}
		else {
			html.push('<li class="warning">Something went wrong. Please try again.</li>');
		}

		this.$library.find('ul').append(html.join(''));
		this.$item = this.$library.find('.item');
		this.$item.filter(':gt(3)').sortElements(function (a, b) {
			return $(a).prop('title') > $(b).prop('title') ? 1 : -1;
		});
		this.$item.tooltip();

		this.$library.find('h3').html(this.completedCount ? 'Remaining Elements' : '&nbsp;');
		$("#completedCount").find('span').html(App.completedCount);

		$("header h3").html(this.base.length + ' elements');
	}
};



$(function () {
	App.$library = $('#library');
	App.lahCookie = new Cookies();


	if (App.getQueryOption('type') === 'iframe') {
		if (!App.getQueryOption('version') || App.getQueryOption('version') !== App.bookmarkletVersion) {
			$('#reloader').find('span').html('You are using an old version of the bookmarklet. Please remove it from your bookmarks bar and drag again<h5>' + $('blockquote').find('h5').html() + '</h5>');
		}
		else {
			setTimeout(function () {
				if ($('#reloader').is(':visible')) {
					$('#reloader').fadeOut();
				}
			}, 7500);
		}
		$('#reloader').show();
		$('header.jumbotron h4').hide();
		$('#showCheats').prop('checked', true).change();
	}

	$(document)
		.on('click', '.item:not(.completed) .adder', function (e) {
			e.preventDefault();
			var $this = $(this);
			App.lahCookie.set($this.parents('.item').prop('id'));
			$this.parents('.item').addClass('completed');
			if (!$('#showCompleted').hasClass('btn-primary')) {
				$this.parents('.item').hide();
			}
		})
		.on('click', '.item.completed .adder', function (e) {
			e.preventDefault();
			var $this = $(this);
			App.lahCookie.remove($this.parents('.item').prop('id'));
			$this.parents('.item').removeClass('completed');
		})
		.on('click', '.item .filter', function (e) {
			e.preventDefault();
			var $this  = $(this),
				string = $this.parents('.item').find('h5').html();
			$("#filter").val(string).change(); //.trigger($.Event( 'keydown', { which: 13, keyCode: 13 } ));
			App.filterMake(string);
		})
		.on('click', 'blockquote .close', function (e) {
			e.preventDefault();
			var $this = $(this);
			$this.parent()[0].className = '';
			$this.parent().slideUp();
		});


	App.$library.find('.clearQuery').on('click', function (e) {
		e.preventDefault();
		App.cleanHeader();
		App.cleanQueries();
		$(this).hide();
	});

	$('#helpBtn').on('click', function () {
		$('#help').slideToggle();
	});

	$("#filter")
		.on('keydown', function (e) {
			if (e.keyCode === 13 || e.which === 13) {
				App.filterMake($(this).val());
				$(this).focus();
			}
		})
		.clearSearch({ callback: App.filterMake.bind(App) });

	$("#search")
		.on('keydown', function (e) {
			if (e.keyCode === 13 || e.which === 13) {
				App.filterSearch($(this).val());
				$(this).focus();
			}
		})
		.clearSearch({ callback: App.filterSearch.bind(App) });

	$('#showCompleted').on('click', function () {
		var $this = $(this);
		App.$library.find('.clearQuery').hide();
		if ($this.hasClass('btn-default')) {
			App.cleanQueries(['completed']);
			$this.find('span').html('hide');
			App.$item.show();
			App.$library.find('h3').html('All Elements');

		}
		else {
			$this.find('span').html('show');
			App.$library.find('h3').html('Remaining Elements');
			App.$item.filter('.completed').hide();
		}
		$this.toggleClass('btn-default').toggleClass('btn-primary');
	});

	$('#resetCompleted').on('click', function () {
		var $this = $(this);
		if ($this.hasClass('btn-default')) {
			$this.toggleClass('btn-default').toggleClass('btn-danger');
			$this.find('span').html('Are you sure?');

			setTimeout(function () {
				if (!$this.hasClass('btn-default')) {
					$this.toggleClass('btn-default').toggleClass('btn-danger').find('span').html('reset completed');
				}
			}, 3000);
		}
		else if ($this.hasClass('btn-danger')) {
			$this.toggleClass('btn-default').toggleClass('btn-danger').find('span').html('reset completed');
			App.$item.removeClass('completed').show();
			App.lahCookie.reset();
		}
	});

	$("#hideFinal").on('click', function () {
		$('.clearable').trigger('clear');
		if ($("#hideFinal:checked").length) {
			$("div.finalElement").hide();
		}
		else {
			$("div.finalElement").show();
		}
	});

	$(document).on('click', '.alert .close', function () {
		$(this).parent().fadeOut();
	});

	$.dataSelector('!*', function (data, value) {
		return data.indexOf(value.toLowerCase()) === -1;
	});
});

/*
 javascript:(function(){if(location.href.indexOf('http://littlealchemy.com')>-1){lahUrl='http://littlealchemyhelper.com/index.html?type=iframe&version=0.4&import='+game.progress.sort(function(a,b){return a-b;}).join(',');if(!$('#laHelper').size()){$('<iframe/>').prop({id:'laHelper',src:lahUrl}).css({position:'absolute',top:50,left:50,width:425,height:$(window).height()-100}).appendTo('body');}else{$('#laHelper').remove();}}})();

 javascript:(function(){if(location.href.indexOf('http://littlealchemy.com')>-1){lahUrl='http://code.gilbarbara.com:88/little_alchemy/index.html?type=iframe&version=0.4&import='+game.progress.sort(function(a,b){return a-b;}).join(',');if(!$('#laHelper').size()){$('<iframe/>').prop({id:'laHelper',src:lahUrl}).css({position:'absolute',top:50,left:50,width:425,height:$(window).height()-100}).appendTo('body');}else{$('#laHelper').remove();}}})();
 */
