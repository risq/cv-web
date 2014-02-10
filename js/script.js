var scrollTo = null;

var $pf = $('#pf-items').isotope({
	// options
	itemSelector: '.item-container',
	layoutMode: 'masonry',
});


$('#pf-items .item').click(function(){
	$('.item-container.opened').removeClass('opened');
	$(this).parent().addClass('opened');
	$('#pf-items').isotope();
	scrollTo = $(this);
})

$pf.isotope( 'on', 'layoutComplete', scrollToOpened );

function scrollToOpened( isoInstance, laidOutItems ) {
	if (scrollTo !== null) {
		$('html, body').animate({
	        scrollTop: scrollTo.offset().top - 120
	    }, 300);
	    scrollTo = null;
	}	
}