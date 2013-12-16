/**
 * Little Alchemy Helper App
 * @module app
 */

var base,
	names,
	completedCount,
	lahCookie,
	$library,
	$item,
	candyPack = [270,271,272,273,274,275,276,277,278,279,280,291,292,293,294,295,296,297,298,299,320,321,322,323,324,325,326,327,328,329];

function getQueryOption(name) {
	name = name.replace(/[\[]/, "\\\\[").replace(/[\]]/, "\\\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function cleanHeader() {
	$library.find('h3').html(completedCount ? 'Remaining Elements' : '&nbsp;');
	$item.hide().filter(':not(.completed)').show();
}

function cleanQueries(skip) {
	skip = skip ? skip : [];
	if ($.inArray('completed', skip) === -1) {
		$("#showCompleted").removeClass('btn-purple').addClass('btn-light').find('span').html('show');
	}
	if ($.inArray('filter', skip) === -1) {
		$("#filter").trigger('clear');
	}
	if ($.inArray('search', skip) === -1) {
		$("#search").trigger('clear');
	}
}

function filterMake(str) {
	if (str) {
		cleanQueries(['filter']);
		$item.show();
		$item.filter(':data(composition[!*]='+str+')').hide().end();
		$library
			.find('h3').html("Things you can make with: "+str).end()
			.find('.clearQuery').show();
	}
	else {
		cleanHeader();
	}
}

function filterSearch(str) {
	if (str) {
		cleanQueries(['search']);
		$item.hide();
		$item.find("h5:contains('"+str.toLowerCase()+"')").parent().show();
		if ($item.filter(':visible').size()) {
			$library
				.find('h3').html("Elements found with: "+str).end()
				.find('.clearQuery').show();
		}
		else {
			$library.find('h3').html("Nothing found");
		}
	}
	else {
		cleanHeader();
	}
}


function buildMake(obj, str) {
	var n, items = [];
	_.each(obj, function(d, i) {
		if (d.composition.indexOf(str) > -1) {
			items.push(i);
		}
	});
	return items.join(', ');
}

var CookieClass = function() {
	this.name = 'lah';
	this.cookie = $.cookie(this.name);
	this.imported = false;

	this.set = function(name) {
		if (!$.cookie(this.name)) {
			$.cookie(this.name, name);
		}

		var savedArray = $.cookie(this.name).split('|');
		savedArray.push(name);
		savedArray = savedArray.unique();
		$.cookie(this.name, savedArray.unique().join('|'));

		completedCount = savedArray.length;
		update();
	};
	this.getAll = function() {
		if (!$.cookie(this.name) && !getQueryOption('import')) {
			return [];
		}
		if(getQueryOption('import') && !this.imported) {
			$.cookie(this.name, getQueryOption('import').split(',').join('|'));
			this.imported = true;
		}

		var savedArray = $.cookie(this.name).split('|');

		if (isNaN(parseInt(savedArray[0], 10))) {
			/*! update old cookie format */
			var newArray = [], itemId;
			_.each(savedArray, function(d) {
				itemId = names.indexOf(d);
				newArray.push(itemId);
			});
			if (savedArray.length === newArray.length) {
				$.cookie(this.name, newArray.join('|'));
				savedArray = newArray;
			}
		}

		savedArray = $.map(savedArray, function(n) { return parseInt(n, 10); });
		completedCount = savedArray.length;
		update();
		return savedArray;
	};
	this.remove = function(name) {
		if (!$.cookie(this.name)) {
			return false;
		}

		var savedArray = $.cookie(this.name).split('|');
		if ($.inArray(name, savedArray) > -1) {
			savedArray.splice($.inArray(name, savedArray), 1);
		}
		savedArray = savedArray.unique();
		$.cookie(this.name, savedArray.join('|'));

		completedCount = savedArray.length;
		update();
	};
	this.reset = function() {
		$.removeCookie(this.name);
		this.cookie = undefined;
		completedCount = 0;
		update();
	};
	var update = function() {
		var filtered = $library.find('h3').html().indexOf('with') > -1;
		if (completedCount) {
			$('#completedOptions').show();
			if(!filtered) {
				$library.find('h3').html('Remaining Elements');
			}
		}
		else {
			$('#completedOptions').hide();
			if(!filtered) {
				$library.find('h3').html('&nbsp;');
			}
		}
		$("#completedCount").find('span').html(completedCount);
	};
};

$(function(){
	$library = $('#library');
	lahCookie = new CookieClass();
	$.getJSON('assets/data/base.json', function (data) {
		base = data.base;
		$.getJSON('assets/data/names.json', function (name) {

			names = name.lang;

			if (base && names) {
				var i,ii,jj,
					insert = '',
					lahSaved,
					parents = [],
					children = [],
					origin = [];

				_.each(base, function(d, i) {

					console.log(d,i);
					children = [];
					if(i < 4) {
						parents.push([]);
					}

					_.each(base, function(d2,i2) {
						origin = [];
						_.each(d2, function(d3,i3) {
							if (d2[i3][0] === i || d2[i3][1] === i) {
								
							}
						});
					});
				});

				for (i=0;i<base.length;i++) {
					/*! construct working method */
					children = [];
					if(i < 4) {
						parents.push([]);
					}
					for (ii = 4; ii < base.length; ii++) {
						origin = [];
						for (jj = 0; jj < base[ii].length; jj++){
							if (base[ii][jj][0] === i || base[ii][jj][1] === i) {
								children.push(names[ii]);
							}
							origin.push(names[base[ii][jj][0]]+" + "+names[base[ii][jj][1]]);
						}
						if(i >= 4) {
							parents.push(origin);
						}
					}

					/*! filter out unwanted options and add to the library */
					if($.inArray(i, candyPack) === -1) {
						console.log(children.length );
						lahSaved = $.inArray(i,lahCookie.getAll()) > -1;
						insert += '<li id="'+i+'" title="'+names[i]+'" class="item thumbnail'+(!children.length ? ' finalElement' : '')+(lahSaved ? ' completed' : '')+'" data-composition="'+parents[i].join(';')+'" data-make="'+children.join(', ')+'">\n';
						insert += '\t<div class="buttons"><a href="#" class="info"><i class="fa fa-eye"></i></a><a href="#" title="mark as completed" class="adder"></a><a href="#" title="things you can make with..." class="filter'+(children.length ? '' : ' disabled')+'">'+(children.length ? '<i class="fa fa-external-link-square"></i>' : '')+'</a></div>\n';
						insert += '\t<div class="image"><img src="assets/images/blank_icon.png" data-src="http://littlealchemy.com/img/base/'+(i+1)+'.png"/></div>\n';
						insert += '\t<h5>'+names[i]+'</h5>\n';
						insert += '</li>\n';
					}
				}
				$library.find('ul').append(insert);
				$item = $library.find('.item');
				$item.filter(':gt(3)').sortElements(function(a, b){
					return $(a).prop('title') > $(b).prop('title') ? 1 : -1;
				});
				$item.tooltip();
				$item.find('img').unveil();

				$library.find('h3').html(completedCount ? 'Remaining Elements' : '&nbsp;');

				$("header h3").html(base.length +' elements');
			}
			else {
				$library.find('ul').append('<li class="warning">Something went wrong. Please try again.</li>');
			}
		});
	});



/*	$.getJSON('assets/items.json', function(data) {
		var insert = '',
			lahSaved,
			make,
			n;

		for (n in data) {
			if (data.hasOwnProperty(n)) {
				lahSaved = $.inArray(n,lahCookie.getAll()) > -1;
				make = buildMake(data, n);
				insert += '<div class="item thumbnail'+(data[n].type ? ' '+data[n].type : '')+(lahSaved ? ' completed' : '')+'" data-composition="'+data[n].composition+'" data-make="'+make+'">\n';
				insert += '\t<div class="buttons"><a href="#" class="info"><i class="icon-eye-open"></i></a><a href="#" title="mark as completed" class="adder"></a><a href="#" title="things you can make with..." class="filter'+(make.length ? '' : ' disabled')+'">'+(make.length ? '<i class="icon-external-link-sign"></i>' : '')+'</a></div>\n';
				insert += '\t<div class="image"><img src="'+data[n].image+'"/></div>\n';
				insert += '\t<h5>'+n+'</h5>\n';
				insert += '</div>\n';
			}
		}
		$library.append(insert);
		$item = $library.find('.item');

		$item.tooltip();
		$library.find('h3').html(completedCount ? 'Remaining Elements' : '&nbsp;');

		$("header h3").html(base.length +' elements');
	});*/

	if (getQueryOption('type') === 'iframe') {

		if(!getQueryOption('version')) {
			$('#reloader').find('span').html('You are using an old version of the bookmarklet. Please remove it from your bookmarks bar and drag again<h5>'+$('blockquote').find('h5').html()+'</h5>');
		} else {
			setTimeout(function() {
				if($('#reloader').is(':visible')) {
					$('#reloader').fadeOut();
				}
			}, 7500);
		}
		$('#reloader').show();
		$('header.jumbotron h4').hide();
		$('#showCheats').prop('checked', true).change();
	}

	$(document)
		.on('click', '.item:not(.completed) .adder', function(e) {
			e.preventDefault();
			var $this = $(this);
			lahCookie.set($this.parents('.item').prop('id'));
			$this.parents('.item').addClass('completed').hide();
		})
		.on('click', '.item.completed .adder', function(e) {
			e.preventDefault();
			var $this = $(this);
			lahCookie.remove($this.parents('.item').prop('id'));
			$this.parents('.item').removeClass('completed');
		})
		.on('click', '.item .filter', function(e) {
			e.preventDefault();
			var $this = $(this),
				string = $this.parents('.item').find('h5').html();
			$("#filter").val(string).change(); //.trigger($.Event( 'keydown', { which: 13, keyCode: 13 } ));
			filterMake(string);
		});

	$library.find('.clearQuery').on('click', function(e) {
		e.preventDefault();
		cleanHeader();
		cleanQueries();
		$(this).hide();
	});

	$('#helpBtn').on('click', function() {
		$('#help').slideToggle();
	});

	$("#filter")
		.on('keydown', function(e) {
			if (e.keyCode === 13 || e.which === 13) {
				filterMake($(this).val());
				$(this).focus();
			}
		})
		.clearSearch({ callback: filterMake });

	$("#search")
		.on('keydown', function(e) {
			if (e.keyCode === 13 || e.which === 13) {
				filterSearch($(this).val());
				$(this).focus();
			}
		})
		.clearSearch({ callback: filterSearch });

	$('#showCompleted').on('click', function() {
		var $this = $(this);
		$library.find('.clearQuery').hide();
		if ($this.hasClass('btn-light')) {
			cleanQueries(['completed']);
			$this.find('span').html('hide');
			$item.show();
			$library.find('h3').html('All Elements');

		}
		else {
			$this.find('span').html('show');
			$library.find('h3').html('Remaining Elements');
			$item.filter('.completed').hide();
		}
		$this.toggleClass('btn-light').toggleClass('btn-purple');
	});

	$('#resetCompleted').on('click', function() {
		var $this = $(this);
		if ($this.hasClass('btn-light')) {
			$this.toggleClass('btn-light').toggleClass('btn-danger');
			$this.find('span').html('Are you sure?');

			setTimeout(function() {
				if (!$this.hasClass('btn-light')) {
					$this.toggleClass('btn-light').toggleClass('btn-danger').find('span').html('reset completed');
				}
			}, 3000);
		}
		else if($this.hasClass('btn-danger')) {
			$this.toggleClass('btn-light').toggleClass('btn-danger').find('span').html('reset completed');
			$item.removeClass('completed').show();
			lahCookie.reset();
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

	$(document).on('click', '.alert .close', function() {
		$(this).parent().fadeOut();
	});

	$.dataSelector('!*', function(data, value){
		return data.indexOf(value.toLowerCase()) === -1;
	});
});


/*javascript:(function(){if(location.href.indexOf('http://littlealchemy.com')>-1){lahImport=[];$('.libbox').each(function(i, el) { lahImport.push($(el).prop('class').match(/el(\d+)/)[1]) });lahUrl='http://littlealchemyhelper.com/index.html?type=iframe&version=0.3'+(lahImport.length?'&import='+lahImport.join(','):'');if(!$('#laHelper').size()){$('<iframe/>').prop({id:'laHelper',src:lahUrl}).css({position:'absolute',top:50,left:50,width:425,height:$(window).height()-100}).appendTo('body');}else{$('#laHelper').remove();}}})();*/
