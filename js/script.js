/*
	THREE.JS
*/
var scrolledFirstPage = false;
var camera, scene, renderer, composer;
var object, light;
var glitched = false, autoGlitchTimeout;
var dirX = 1, dirY = 1, movX, movY, speedMult = 7;

var baseCamFOV = 90,
	baseMovX   = 0.0005,
	baseMovY   = -0.001;
init();
animate();

function init() {

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	$('body').prepend( renderer.domElement );

	//

	camera = new THREE.PerspectiveCamera( baseCamFOV, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 400;

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x222222, 1, 1200 );

	object = new THREE.Object3D();
	scene.add( object );

	var words = [
				'web',
				'designer',
				'HTML5',
				'CSS3',
				'javascript',
				'jquery',
				'webGL',
				'design',
				'photoshop',
				'dev',
				'github',
				'3D',
				'website',
				'symfony',
				'PHP',
				'SQL',
				'ajax',
				'browser',
				'illustrator',
				'js',
				'android',
				'iOS',
				'mobile',
				'responsive',
				'UX',
				'front-end',
				'back-end',
				'webapp',
				'plugin',
				'API',
				'social',
				'networks'
			];

	var nbWords = words.length;
	for ( var i = 0; i < nbWords; i ++ ) {
		var text3d = new THREE.TextGeometry( words[i], {
			size: 80,
			height: 10,
			curveSegments: 4,
			font: "helvetiker"
		});

		text3d.computeBoundingBox();
		var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );

		var textMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, overdraw: true } );
		text = new THREE.Mesh( text3d, textMaterial );

		text.position.set(Math.random() - 0.5 , Math.random() - 0.5, Math.random() - 0.5 ).normalize();
		text.position.multiplyScalar( Math.random() * 700 );
		text.rotation.set( toRadians(randInt(-30,30)), toRadians(randInt(-30,30)), toRadians(randInt(-30,30)) );
		text.scale.x = text.scale.y = text.scale.z = Math.random() * 1.3;
		object.add( text );
	}

	var geometry = new THREE.SphereGeometry( 1, 4, 4 );
	var material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random(), shading: THREE.FlatShading } );

	for ( var i = 0; i < 100; i ++ ) {
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize();
		mesh.position.multiplyScalar( Math.random() * 400 );
		mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 60;
		object.add( mesh );
	}

	scene.add( new THREE.AmbientLight( 0x222222 ) );

	light = new THREE.DirectionalLight( 0xffffff);
	light.position.set( 1, 1, 1 );
	scene.add( light );

	startAutoGlitch(50,250,5000);

	window.addEventListener( 'resize', onWindowResize, false );

}

function startGlitch() {
	if (!glitched) {
		var movX, movY;

		randInt(0,1) == 0 ? movX = -1 : movX = 1;
		randInt(0,1) == 0 ? movY = -1 : movY = 1;
		
		dirX = baseMovX * movX;
		dirY = baseMovY * movY; 

		speedMult = randInt(10,60);

		glitched = true;
		var kaleido = 0;
		if (randInt(0,4) == 0) kaleido = randInt(3,5);
		setShaders(randInt(1,4), Math.random()/30, kaleido, toRadians(randInt(0,360)), randInt(0,8), randInt(0,30), randInt(0,10));
	}
}

function stopGlitch() {
	if (glitched) {
		glitched = false;
		setShaders(4, Math.random()/400, 0, 0, 0, 0, 0);
		dirX = baseMovX;
		dirY = baseMovY; 
	}
}

function startAutoGlitch(minTime, maxTime, loopTime) {
	var duration = randInt(minTime,maxTime)
	if (!glitched) {
		startGlitch();
		setTimeout(function(){
			stopGlitch();
		},duration);
	}

	if(loopTime > 0) {
		var nextTime = randInt(0,2) == 0 ? duration + 25 : randInt(duration, loopTime);
		autoGlitchTimeout = setTimeout(function(){
			startAutoGlitch(minTime,maxTime,loopTime);
		}, nextTime);
	}
}

function stopAutoGlitch() {
	clearTimeout(autoGlitchTimeout);
}

function setShaders(dotScreenValue, rgbShiftValue, kaleidoSides, kaleidoAngle, badTVdisto, badTVdisto2, badTVspeed) {
	

	composer = new THREE.EffectComposer( renderer );
	composer.addPass( new THREE.RenderPass( scene, camera ) );

	var effect = new THREE.ShaderPass( THREE.DotScreenShader );
	effect.uniforms[ 'scale' ].value = dotScreenValue;
	composer.addPass( effect );

	var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
	effect.uniforms[ 'amount' ].value = rgbShiftValue;//0.0015
	composer.addPass( effect );

	if (kaleidoSides >= 1) {
		var effect = new THREE.ShaderPass( THREE.KaleidoShader );
		effect.uniforms[ 'sides' ].value = kaleidoSides;
		effect.uniforms[ 'angle' ].value = kaleidoAngle;
		composer.addPass( effect );
		badTVdisto  *= 0.3;
		badTVdisto2 *= 0.3;
		badTVspeed  *= 0.3;
	}
	else if (randInt(0,8) == 0) {
		rgbShiftValue *= 4;
		badTVdisto    *= 5;
		badTVdisto2   *= 4;
		badTVspeed    *= 6;
		if (randInt(0,1) == 0) {
			object.rotation.x = toRadians(randInt(0,360));
			object.rotation.y = toRadians(randInt(0,360));
			rgbShiftValue *= 2;
			badTVdisto    *= 2;
			badTVdisto2   *= 2;
			console.log('extreme glitch');
		}
	}

	var effect = new THREE.ShaderPass( THREE.BadTVShader );
	effect.uniforms[ 'distortion' ].value = badTVdisto;
	effect.uniforms[ 'distortion2' ].value = badTVdisto2;
	effect.uniforms[ 'speed' ].value = badTVspeed;
	effect.uniforms[ 'rollSpeed' ].value = badTVspeed;
	effect.renderToScreen = true;
	composer.addPass( effect );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {

	requestAnimationFrame( animate );
	var time = Date.now();
	

	object.rotation.x += dirX;
	object.rotation.y += dirY;

	if (glitched) {
		object.rotation.x += speedMult * dirX;
		object.rotation.y += speedMult * dirY;
	}

	composer.render();
}

function randInt(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function toRadians(deg) {
	return deg * (Math.PI/180);
}



$(window).bind('mouseup keyup', function() {
	stopGlitch();
})
.bind('mousedown keydown', function() {
	startGlitch();
});
$('body').bind('mouseleave', function() {
	stopGlitch();
});


//SCROLL
$(window).scroll(function(){

    if($('#global-container').offset().top - $(window).scrollTop() > 0) {
    	if (scrolledFirstPage) {
    		console.log('first page shown')
    		scrolledFirstPage = false;
    		// camera.fov = baseCamFOV;
    		// camera.updateProjectionMatrix();
    		startAutoGlitch(50,250,5000);
    	}
    	
    }
    else {
    	if (!scrolledFirstPage) {
    		console.log('first page scrolled')
    		scrolledFirstPage = true;
    		// camera.fov = 40;
    		// camera.updateProjectionMatrix();
    		stopAutoGlitch();
    	}
    }
});


/*
	PAGE
*/
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
		$(this).fadeIn(400);
	})
}

function closeOpenedItems() {
	$('.item-container.opened').removeClass('opened').each(function(){
		$(this).find('.panel-container').animate({right: '-40%'}, 200);
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

