var lastScrollPos = 0;

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
	item.parent().addClass('opening').addClass('opened');
	item.find('img').resizeToParent();
	$('#pf-items').isotope();	
}

function closeOpenedItems() {
	$('.item-container.opened').removeClass('opened').each(function(){
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
    	item.removeClass('opening');
    });
}

function scrollToPos(offset) {
	console.log('hello')
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
	var job 	= $('#job-switch')[0].checked 	 ? '.itemType-job' 	  : null,
		school 	= $('#school-switch')[0].checked ? '.itemType-school' : null,
		perso 	= $('#perso-switch')[0].checked  ? '.itemType-perso'  : null;

	var values = new Array(job, school, perso).filter(function(n){return n;});
	if(values.length === 1) {
		//$('#job-switch').bootstrapSwitch('state');
	}
	var type_filter = values.join(',');
	if (type_filter == "") {
		console.log('null');
		
	}
	$pf.isotope({ filter: type_filter });

}

