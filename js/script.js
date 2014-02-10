var scrollTo = null;
var lastScrollPos = 0;



var $pf = $('#pf-items').isotope({
	// options
	itemSelector: '.item-container',
	layoutMode: 'masonry'
});


$('#pf-items .item').click(function(){
	if ($(this).parent().hasClass('opened')) {
			$('.item-container.opened').removeClass('opened').each(function(){
				$(this).find('img').resizeToParent();
			});
			$('#pf-items').isotope();
	}
	else {
		lastScrollPos = $(document).scrollTop();
		$('.item-container.opened').removeClass('opened').each(function(){
			$(this).find('img').resizeToParent();
		});
		$(this).fadeOut(200, function(){
			$(this).fadeIn().parent().addClass('opened');
			$(this).find('img').resizeToParent();
			$('#pf-items').isotope();
		})
		scrollTo = $(this);
	}
})

$pf.isotope( 'on', 'layoutComplete', scrollToOpened );

imagesLoaded( '.img-container', function() {
	$('.img-container img').resizeToParent();
});

function scrollToOpened( isoInstance, laidOutItems ) {
	if (scrollTo !== null) {
		$('html, body').animate({
	        scrollTop: scrollTo.offset().top - 78
	    }, 500);
	    scrollTo.fadeIn();
	    scrollTo = null;
	}
	else if (lastScrollPos !== 0) {
		$('html, body').animate({
	        scrollTop: lastScrollPos
	    }, 500);
	    lastScrollPos = 0;
	}
}