var scrollTo = null;
var lastScrollPos = 0;

var state = 0;  // 0 : waiting
				// 1 : opening item
				// 2 : item opened
				// 3 : closing item

var $pf = $('#pf-items').isotope({
	itemSelector: '.item-container',
	layoutMode: 'masonry'
});
$('#pf-controls .pf-switch').change(pf_filter);

$pf.isotope( 'on', 'layoutComplete', onLayoutComplete);

$( '#pf-items .item-container' ).on( "click", ".item", function(){
	if ($('.item-container.opening').length === 0) {
		if ($('.item-container.opened').length === 0) { // no item opened
			lastScrollPos = $(document).scrollTop();
			openItem($(this));
		}
		else { // an item is opened
			if ($(this).parent().hasClass('opened')) { // clicked item is opened item
				closeOpenedItems();
				$('#pf-items').isotope();
				scrollToPos(lastScrollPos);
			}
			else { // clicked item is another item 
				closeOpenedItems();
				openItem($(this).closest('.item'));
			}
		}
	}
});


function openItem(item) {
	item.parent().addClass('opening');
	item.fadeOut(200, function(){
		$(this).parent().addClass('opened');
		$('#pf-items').isotope();
		$(this).fadeIn(400).find('img').resizeToParent();
	})
}

function closeOpenedItems() {
	$('.item-container.opened').removeClass('opened').each(function(){
		$(this).find('.panel-container').animate({right: '-40%'}, 200);
		$(this).find('img').resizeToParent();
	});
	openedItem = null;
}

function onLayoutComplete( isoInstance, laidOutItems ) {
	if ($('.item-container.opened.opening').length != 0) {
		scrollToItem($('.item-container.opened.opening').first());
	}
}

function scrollToItem(item) {
	$("html, body").bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(){
		item.removeClass('opening');
    	$('html, body').stop();
    });
	$('html, body').animate({
        scrollTop: item.children('.item').offset().top - 78
    }, 400, function(){
    	$("html, body").unbind("scroll mousedown DOMMouseScroll mousewheel keyup");
    	item.find('.panel-container').animate({right: 0}, 400, function(){
    		item.removeClass('opening');
    	});
    });
}

function scrollToPos(offset) {
	$("html, body").bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(){
       $('html, body').stop();
    });
	$('html, body').animate({
        scrollTop: offset
    }, 600, function(){
    	$("html, body").unbind("scroll mousedown DOMMouseScroll mousewheel keyup");
    });
}

imagesLoaded( '.img-container', function() {
	$('.img-container img').resizeToParent();
});

function pf_filter(){
	closeOpenedItems();
	var c_job 	 = $('#job-switch')[0].checked 	  ? '.itemContexte-job'    : null,
		c_school = $('#school-switch')[0].checked ? '.itemContexte-school' : null,
		c_perso  = $('#perso-switch')[0].checked  ? '.itemContexte-perso'  : null;

	var t_web 	= $('#web-switch')[0].checked ? '.itemType-web' : null,
		t_2d 	= $('#2d-switch')[0].checked  ? '.itemType-2d'  : null,
		t_3d 	= $('#3d-switch')[0].checked  ? '.itemType-3d'  : null;

	var c_values = new Array(c_job, c_school, c_perso).filter(function(n){return n;}),
		t_values = new Array(t_web, t_2d, t_3d).filter(function(n){return n;});

	var contexte_filter = c_values.join(','),
		type_filter 	= t_values.join(',');
	$pf.isotope({ 
		filter: function() {
			return $(this).is(contexte_filter) && $(this).is(type_filter);
		}
	});

}

