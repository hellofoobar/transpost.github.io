(function($) {

	skel.breakpoints({
		xxlarge: '(max-width: 1920px)',
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 1000px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)',
	});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$header = $('#header'),
			$all = $body.add($header);

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 500);
			});	
			
		// Mobile navigation bar
			$('#overlay').click(function(){
				if($('#overlay').hasClass('menu-spin')){
					$('#overlay').removeClass('menu-spin');
					$('#header nav').removeClass('show-nav');
					$('#header nav').css({'z-index': '-2'});

				}else{
					$('#overlay').addClass('menu-spin');
					$('#header nav').css({'display': 'block'});
					$('#header nav').addClass('show-nav');
				}
			});

		// Display navigation after resize window
			$window.resize(function(){
				if($window.width() > 736){
					$('#header nav').css({'display': 'block'});
				} else {
					$('#header nav').css({'display': 'none'});

				}
			});

		// Load website
			$window.on('load', function(){
			
			// Get current geolocation information
				var lat = 49.250946,   //default: BCIT, Burnaby, BC
				lng = -123.002575;
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(location){
						lat = location.coords.latitude;
				 		lng = location.coords.longitude;
					});
				} else {
					//alert("no");
					toastr.warning("Get Geolocation infomation failed.");
				}
				
			// Sunrise/sunset time is powered by [SunCalc](https://github.com/mourner/suncalc)
			// Get current time and set greeting message
				var time = new Date();

				// Show current time
				setInterval(function(){
					var curr_time = new Date();
					$('#showtime').text(
									//('0' + curr_time.getHours()).slice(-2)
									//+ ' : ' 
									//+ ('0' + curr_time.getMinutes()).slice(-2)
									//+ ' : '
									//+ ('0' + curr_time.getSeconds()).slice(-2)
									curr_time.toLocaleTimeString()
									);
					}
					, 1000);

				// Set greeting message 
				var sunTimes   = SunCalc.getTimes(time, lat, lng);
					// sunrise = sunTimes.sunrise.getHours(),
					sunset  = sunTimes.sunset.getHours(),
					noon    = 12;
					midnight= 0;
					curr    = time.getHours();

				if(curr > midnight && curr < noon){
					$('#greeting').html("Good Morning!");
				} else if(curr >= noon && curr < sunset) {
					$('#greeting').html("Good Afternoon!");
				} else {
					$('#greeting').html("Good Evening!");
				}

			// Use CORS Anywhere to set the CORS headers
				$.ajaxPrefilter( function (options) {
					if (options.crossDomain && jQuery.support.cors) {
						var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
						options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
					}
				});

			// Get today's bing wallpaper as background image
				var base = 'https://www.bing.com',
				    json_url = '/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US';
				
				$.getJSON(base + json_url, function(json){
					var img_url = base + json.images[0].url;
					$('#intro').css({
						"background-image": "url(" + img_url + ")",
						"background-repeat": "no-repeat",
						"background-size": "cover"
					});
				});

			// Dynamic text using typed.js
				$("#text-dynamic").typed({
					strings: ["a BCITer.", "a Coder.", "a Learner.", "a Hiker.", "Alex."],
					typeSpeed: 80,
					startDelay: 1000,
					backspeed: 2000,
					showCursor: false,
				});
				$('#copyright').html('&copy; ' + time.getFullYear());
			});

		// Touch mode.
			skel.on('change', function() {

				if (skel.vars.mobile || skel.breakpoint('small').active)
					$body.addClass('is-touch');
				else
					$body.removeClass('is-touch');

			});

		// Fix: IE flexbox fix.
			if (skel.vars.IEVersion <= 11
			&&	skel.vars.IEVersion >= 10) {

				var $main = $('.main.fullscreen'),
					IEResizeTimeout;

				$window.on('resize.ie-flexbox-fix', function() {
					clearTimeout(IEResizeTimeout);
					IEResizeTimeout = setTimeout(function() {
						var wh = $window.height();
						$main.each(function() {
							var $this = $(this);
							$this.css('height', '');
							if ($this.height() <= wh)
								$this.css('height', (wh - 50) + 'px');
						});
					});
				})
				.triggerHandler('resize.ie-flexbox-fix');
			}

		// Prioritize "important" elements on small.
			skel.on('+small -small', function() {
				$.prioritize(
					'.important\\28 small\\29',
					skel.breakpoint('small').active
				);
			});

		// Gallery.
			$window.on('load', function() {

				var $gallery = $('.gallery');

				$gallery.poptrox({
					baseZIndex: 10001,
					useBodyOverflow: false,
					usePopupEasyClose: true,
					usePopupForceClose: true,
					overlayColor: '#1f2328',
					overlayOpacity: 0.65,
					usePopupDefaultStyling: false,
					usePopupCaption: true,
					popupLoaderText: '',
					windowMargin: 50,
					usePopupNav: true
				});

				// Hack: Adjust margins when 'small' activates.
					skel
						.on('-small', function() {
							$gallery.each(function() {
								$(this)[0]._poptrox.windowMargin = 50;
							});
						})
						.on('+small', function() {
							$gallery.each(function() {
								$(this)[0]._poptrox.windowMargin = 5;
							});
						});

			});

		// Section transitions.
			if (skel.canUse('transition')) {

				var on = function() {

					// Galleries.
						$('.gallery')
							.scrollex({
								top:		'30vh',
								bottom:		'30vh',
								delay:		50,
								initialize:	function() { $(this).addClass('inactive'); },
								terminate:	function() { $(this).removeClass('inactive'); },
								enter:		function() { $(this).removeClass('inactive'); },
								leave:		function() { $(this).addClass('inactive'); }
							});

					// Generic sections.
						$('.main.style1')
							.scrollex({
								mode:		'middle',
								delay:		100,
								initialize:	function() { $(this).addClass('inactive'); },
								terminate:	function() { $(this).removeClass('inactive'); },
								enter:		function() { $(this).removeClass('inactive'); },
								leave:		function() { $(this).addClass('inactive'); }
							});

						$('.main.style2')
							.scrollex({
								mode:		'middle',
								delay:		100,
								initialize:	function() { $(this).addClass('inactive'); },
								terminate:	function() { $(this).removeClass('inactive'); },
								enter:		function() { $(this).removeClass('inactive'); },
								leave:		function() { $(this).addClass('inactive'); }
							});

					// Contact.
						$('#contact')
							.scrollex({
								top:		'50%',
								delay:		50,
								initialize:	function() { $(this).addClass('inactive'); },
								terminate:	function() { $(this).removeClass('inactive'); },
								enter:		function() { $(this).removeClass('inactive'); },
								leave:		function() { $(this).addClass('inactive'); }
							});
				};

				var off = function() {

					// Galleries.
						$('.gallery')
							.unscrollex();

					// Generic sections.
						$('.main.style1')
							.unscrollex();

						$('.main.style2')
							.unscrollex();

					// Contact.
						$('#contact')
							.unscrollex();
				};

				skel.on('change', function() {

					if (skel.breakpoint('small').active)
						(off)();
					else
						(on)();
				});

			}

		// Events.
			var resizeTimeout, resizeScrollTimeout;

			$window
				.resize(function() {

					// Disable animations/transitions.
					$body.addClass('is-resizing');
					window.clearTimeout(resizeTimeout);
					resizeTimeout = window.setTimeout(function() {

						// Update scrolly links.
							$('a[href^="#"]').scrolly({
								speed: 1500,
								offset: $header.outerHeight() - 1
							});

						// Re-enable animations/transitions.
							window.setTimeout(function() {
								$body.removeClass('is-resizing');
								$window.trigger('scroll');
							}, 0);

					}, 100);

				})
				.load(function() {
					$window.trigger('resize');
				});
	});
})(jQuery);