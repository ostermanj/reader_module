/*
 *  1. define app
 */
var app=angular.module('CGDPubsApp', [ // identifies app and its dependencies
	'ngAnimate',
	'ngTouch',
	'ngRoute',
	'ngSanitize',

]);

/*
 *  2. configure app
 */

app.config(
  function($routeProvider, $locationProvider) {
      
    $routeProvider.
        when('/:nodeID', { // main use. base path is /reader. string after word is passed as nodeID
        				   // reader.module makes sure server-side that only valid node IDs are passed
        				   // to the client. ie. nodes that are publications with Reader App enabled
        templateUrl: window.readerApp.readerPath + '/reader.html',
        controller: 'MainController',
        reloadOnSearch: false
      });
    $locationProvider.html5Mode(true);  // no hashbang needed in url
 
  });

/*
 * 3. Some custom directives
 *
 */

app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    };
});

app.directive('menuButtonReady', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.menuButtonReady);
                });
            }
        }
    };
});

/*
 *  4. Main controller
 */

app.controller('MainController',['$scope', '$routeParams', '$location', '$sce', function($scope,$routeParams,$location,$sce) {
	// routeParams are strings. isNaN coerces so that string 0, 1, 2, etc evaluate to false (ie is a number)
    
    function initialLoad() {
	    $scope.firstLoad = true;
	    initializeShareThis();
	    $routeParams.page = $routeParams.page === 'showAllChapters' ? $routeParams.page : $routeParams.page && !isNaN($routeParams.page) && $routeParams.page >= 0 ? parseInt($routeParams.page) : 0; 
	    $scope.chIndex = $routeParams.page; 
	    $scope.year = window.readerApp.readerDate.match(/\d{4}/)[0];
	    $scope.nodeID = window.readerApp.readerNid;
	    $scope.chapterImages  = window.readerApp.readerChapterImages;
	    $scope.captions = window.readerApp.readerCaptions;
	    $scope.fullTitle = window.readerApp.readerFullTitle;
	    $scope.title = window.readerApp.readerTitle;
	    $scope.subtitle = window.readerApp.readerSubTitle;
	    $scope.type = window.readerApp.readerType;
	    var dateArray = window.readerApp.readerDate.replace(' ','-').split('-');
	    $scope.date = dateArray[1].replace(/^0/,'') + '/' + dateArray[2].replace(/^0/,'') + '/' + dateArray[0];
	    $scope.authorsStr = window.readerApp.readerAuthorsStr;
	    $scope.authors = $sce.trustAsHtml(window.readerApp.readerAuthors);
	    $scope.funding = window.readerApp.readerFunding;
	    $scope.showPDF = window.readerApp.readerShowPDF;
	    $scope.optionalLinks = processOptionalLinks(window.readerApp.readerOptionalLinks);
	    $scope.authorThumbnails = window.readerApp.readerAuthorThumbnails;
	    $scope.citation = window.readerApp.readerCustomCitation !== '' ? window.readerApp.readerCustomCitation : $scope.authorsStr + '. <cite>' + $scope.fullTitle + '.</cite> Washington: Center for Global Development, ' + $scope.year + '.';
	    $scope.printSummary = $sce.trustAsHtml(window.readerApp.readerSummary);
	    $scope.chapters = window.readerApp.readerChapters;
	    $scope.chapterTitles = $scope.chapters.map(function(each,i){ // below sets up dummy DOM element to hold chapter innerHTML
	    															 // so that chapter titles can be removed (and put in chapterTitles obj)
	    															 // showAllChapters option puts chapterImages into the chapter HTML
	  		var div = document.createElement('div');
	  		div.innerHTML = each;
	  		var heading = div.querySelector('h2') !== null ? div.querySelector('h2').innerText : null;
	  		if ( $routeParams.page !== 'showAllChapters' ) {
		  		$(div).find('h2').eq(0).remove();
		  		$scope.chapters[i] = $(div).html();
	  		} else if ( $scope.chapterImages[i] ) {
	  			if ( $scope.captions[i] &&  $scope.captions[i] !== 'none' ) {
	  				var chapterCaption = $('<p>', {'id': 'chapter-caption'});
	  				chapterCaption.text($scope.captions[i]);
	  				$(div).find('h2').after(chapterCaption);
	  			}
	  			var chapterImage = $('<img>', {'src': $scope.chapterImages[i].url, 'class': 'chapter-image-print'});
	  			$(div).find('h2').after(chapterImage);
	  			$scope.chapters[i] = $(div).html();
	  		}
	  		return heading !== null ? heading : 'NO <H2> FOUND ' + i;
	  	});
	  	$scope.loadPage(true); // true indicating this is the first load		
	    $scope.setTopSocials(); 
	    $scope.processRelatedContent();
	    $scope.processOthers(['readerTopics','readerImpacts', 'readerInitiatives', 'readerWorkingGroups']);
	    
	    function processOptionalLinks(links){
	    	if ( links ) {
		    	var imagePattern = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.svg$|\.tiff$/;
		    	var dataPattern = /\.xls$|\.xlsx$|\.csv$|\.tsv$|\.stata$/;
		    	var zipPattern = /\.zip$|\.rar$|\.tar$|\.gz$/;
		    	var pdfPattern = /\.pdf$/;
		    	links.forEach(function(each){
		    		if ( each.url.search(imagePattern) !== -1 ) {
		    			each.type = 'image';
		    		}
		    		else if ( each.url.search(dataPattern) !== -1 ) {
		    			each.type = 'data';
		    		}
		    		else if ( each.url.search(zipPattern) !== -1 ) {
		    			each.type = 'zip';
		    		} 
		    		else if ( each.url.search(pdfPattern) !== -1 ) {
		    			each.type = 'pdf';
		    		} else {
		    			each.type = '';
		    		}
		    	});
		    	return links;
	    	} else {
	    		return null;
	    	}
	    }

	    function initializeShareThis(){
	    	var shareThis = window.ShareThis,
	    		twitterSharer = window.ShareThisViaTwitter,
	    		facebookSharer = window.ShareThisViaFacebook,
	    		linkedInSharer = window.ShareThisViaLinkedIn,
	    		emailSharer = window.ShareThisViaEmail;

	    	var selectionShare = shareThis({
			    selector: "#main-container",
			    sharers: [ twitterSharer, facebookSharer, linkedInSharer, emailSharer ]
			});
	    	// method to disable shareThis highlihgting on touch devices likely to have native highlightin
	    	if (!window.matchMedia || !window.matchMedia("(pointer: coarse)").matches) { 
				selectionShare.init();
			}
	    }
    }

    $scope.toggleCitation = function(){ 
    	$scope.citationToggle = !$scope.citationToggle ? 1 : 1 - $scope.citationToggle;
    };

    function recursive(e){
		this.removeEventListener('click', recursive);
		$scope.toggleMenu(e);
		$scope.$digest();
	}

    $scope.toggleMenu = function(e){ 
    	e.stopPropagation();
    	if ( $scope.menuToggle === undefined ) {
    		document.getElementById('reader-menu').addEventListener('click', function(e){
			  e.stopPropagation();
			});
    	}
    	$scope.menuToggle = !$scope.menuToggle ? 1 : 1 - $scope.menuToggle;
    	if ( $scope.menuToggle === 1 ) {
    		document.getElementById('page').addEventListener('click', recursive);
    		setTimeout(function(){
    			document.getElementById('content-menu-content-button').focus();
    		});
    	} else {
    		document.getElementById('page').removeEventListener('click', recursive);
    	}
    };

	$scope.setTopSocials = function(){ 
		$scope.tweetIntent = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent($('#pub-title').text()) + '&url=' + encodeURIComponent($location.absUrl()) + '&via=cgdev';
		$scope.facebookSharer = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent($location.absUrl());
		$scope.linkedInSharer = 'https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent($location.absUrl()) + '&title=' + encodeURIComponent($('#pub-title').text()) + '&source=Center%20for%20Global%20Development';
		var topTweet = $('#share-top .tweet');
		topTweet[0].onclick = function(){window.open($scope.tweetIntent, 'newwindow', 'width=550, height=420'); return false;};
		var topFacebook = $('#share-top .facebook');
		topFacebook[0].onclick = function(){window.open($scope.facebookSharer, 'newwindow', 'width=550, height=420'); return false;};
		var topLinkedIn = $('#share-top .linked-in');
		topLinkedIn[0].onclick = function(){window.open($scope.linkedInSharer, 'newwindow', 'width=550, height=420'); return false;};
	};

	$scope.processRelatedContent = function(){
		var relatedOrder = ['document','blog_post','event','multimedia'];
		$scope.PDFUrl = window.readerApp.readerPDF;
		$scope.fullTitle = window.readerApp.readerFullTitle;
		$scope.canonical = window.readerApp.readerCanonical;
		var processedRelated = [];
		relatedOrder.forEach(function(type){
			var typeCollection = window.readerApp.readerRelated.filter(function(related){
				related.subtype = related.subtype.replace('Charts and Graphics','Chart/Graphic');
				related.subtype = related.subtype.replace(/s$/,'');
				related.created = related.created.replace(/^0/,'').replace(/\/0/g,'/');
				return related.type === type;
			});
			sortByObjProperty.call(typeCollection, 'subtype');
			processedRelated = processedRelated.concat(typeCollection);
		});

		if ( Object.keys(processedRelated).length > 0 ){ // if processedRelated obj is not empty
			$scope.processedRelated = processedRelated; // add it to the scope.
		}

	};

	$scope.processOthers = function(types){
		types.forEach(function(type){
			if ( window.readerApp[type].length > 0 ) {
				var sortField = window.readerApp[type].name ? 'name' : 'type';
				sortByObjProperty.call(window.readerApp[type], sortField);
				$scope[type] = window.readerApp[type];
			}
		});
	};

	function sortByObjProperty(property) {
		this.sort(function(a,b){
			return ( a[property] > b[property] ) ? 1 : (( b[property] > a[property] ) ? -1 : 0 );
		});
	}
	
	$scope.navigate = function(a,evt){ // a = 'next' || 'previous' || chapterIndex
		var b;
		if(!isNaN(a)){ // if a is a number
		    if (a !== parseInt($scope.chIndex)){ // and does not equal current chapter
			    dataLayer.push({'event': 'jump-' + a}); // send GA event
			    $scope.chIndex = a;
			    $scope.loadPage();
			    if ( document.querySelector('body').className.indexOf('responsive-layout-mobile') !== -1 ) {
			    	$scope.menuToggle = 0;
			    }
			}
			return; // if it does equal the current chapter
		}
		
		if (!evt){ // ie is a swipe. swipeNext and swipePrevious pass only one arg; no evt
		    if ((a === 'next' && parseInt($scope.chIndex) >= parseInt($scope.chapters.length - 1)) || (a === 'previous' && parseInt($scope.chIndex) <= 0)) {
			    return; 
		    }
			b = (a === 'next') ?  'swipeNext' : 'swipePrevious';
			dataLayer.push({'event': b});
		} else {
			
			dataLayer.push({'event': evt.target.id});
		}
				
		if (a === 'next'){
			$scope.chIndex++;
		} else {
			if (b === 'swipePrevious') {
			    $scope.chIndex--;
				$scope.loadPage();
				return; // do not do the scroll thing if user action is a swipe
			}
			if ($( window ).scrollTop() > $( window ).height() && evt.target.id !== 'previous'){
				
				$('body, html').animate({scrollTop:0},200); // on nonswipe previous, if window is substantially scrolled,
															// scroll to top instead of navigating
				return;
			}
			$scope.chIndex--;
		}
		$scope.loadPage();
	}; // end $scope.navigate()

	var scrollPosition;
		
	$scope.loadPage = function(firstLoad) {
			if (!firstLoad) { $scope.firstLoad = false; }
			if ($scope.chIndex < 0 || $scope.chIndex > $scope.chapters.length - 1 ){
				$scope.chIndex = 0;
			}		    
		    $location.search('page', $scope.chIndex).replace(); 
		    
		    if ($scope.chIndex === 'showAllChapters') {
		    	$scope.currentChapterHTML = $sce.trustAsHtml( 
		    		$scope.chapters.reduce(function(acc,cur){
			    		return acc += cur;
			    	},'')
		    	);
		    } else {
			    $scope.currentChapterHTML = $sce.trustAsHtml($scope.chapters[$scope.chIndex]);
			}
		    
		 
			    var checkPhaseInt = setInterval(function(){  // sets interval to call processChapter only after Angular has exited
			    											 // digest phase. ie, after the currentChapter has switched.
			    	if ($scope.$$phase !== '$digest') {
			    		clearInterval(checkPhaseInt);
			    		setTimeout(function(){ // timeOut helps iphone do the scroll
			    			var offset;
				    		if (!firstLoad && $scope.chIndex === 0) { 
				    			offset = $('body').hasClass('responsive-layout-mobile') ? 0 : 40;
								$('html, body').animate({
							        scrollTop: $(".subpage-top-section").offset().top - offset
							    }, 500);
							} else if (!firstLoad) {
								offset = $('body').hasClass('responsive-layout-mobile') ? 10 : 60;
								$('html, body').animate({
							        scrollTop: $(".subpage-bottom-section").offset().top - offset
							    }, 500);
							}
				    		$scope.processChapter();
				    	},200);
			    	}
			    },10);		    	
			

    	
	}; 

	$scope.processChapter = function(){
		processFootnotes();
		processPullquoteTweets();
		processSpanTweets();
		processDataTables();
		processZoomableImages();
		processEmptyParagraphs();

		function processEmptyParagraphs(){
			var empties = $('#current-chapter p').filter(function(){
			  return !$( this ).html() || $( this ).html() === '&nbsp;';
			});
			empties.remove();
		}

		function processFootnotes(){
			var fnrefs = $('a').filter(function(){
				if ($(this).attr('href')) {
					return $(this).attr('href').match(/^#_ftn\d/);
				}
			});
			$(fnrefs).text(function(i,t){return t.replace(/[^\d]/g,'');})
				.addClass('fn-ref')
				.click(function(e){
					e.preventDefault();
					var fnID = $( this ).attr('href').replace('#_','');
					if (!$( this ).hasClass('open')){
						dataLayer.push({'event':'footnoteOpen'});
						
						var fn;
						if ($('p[id="'+fnID+'"]').html()){
						  fn = $('p[id="'+fnID+'"]');
						} else {
						  fn = $('div[id="'+fnID+'"] p');
						}
						var fnHTML  = $( fn ).html().replace(/^\r?\n?\s*\[?<a.*?>[^<]*<\/a>\]?\.?/,'');
						var linkBack = $('<a>', {href: '#_' + fnID}).text('Go to notes');
						linkBack.click(function(e){
							e.preventDefault();
							var elem = $('#' + fnID);
							$('#footnotes-' + $scope.chIndex + '-0').removeClass('hide');
							$('.fn-button').removeClass('collapsed');
							elem.find('a')[0].focus();
							$('html, body').animate({
							    scrollTop: $(elem).offset().top - 55
							}, 200);
						});
						var $fnP = $('<p>', {id: fnID + '-popup',class:'footnote-popup'});
						$fnP.html(fnHTML + ' ').append(linkBack);
						$( this ).after($fnP);
						var $xOut = $('<span>', {id: fnID + '-x-out'}).text('(x)');
						$( this ).append($xOut);
						setTimeout(function(){
							$fnP.addClass('active');
						});
						setTimeout(function(){
							$fnP.addClass('activated');
						},400);
					}
					else {
						$('#'+fnID+'-popup').removeClass('active');
						setTimeout(function(){
							$('#'+fnID+'-popup, #'+fnID+'-x-out').remove();
						},500);
						dataLayer.push({'event':'footnoteClose'});
										
					}	
					$( this ).toggleClass('open');
				}			
			);
			
			$('.footnotes').each(function( i ){
				var btn = $('<button>', {class:'fn-button collapsed stripped-button', 'aria-expanded':'false'});
				$( btn ).click(function(){
					var $f = $('#footnotes-' + $scope.chIndex + '-' + i);
					var g = $f.hasClass('hide') ? 'showFootnotes' : 'hideFootnotes';
					$( this ).toggleClass('collapsed');
					dataLayer.push({'event':g});
					$f.toggleClass('hide');
					
					
				});
				$( this ).attr('id', 'footnotes-' + $scope.chIndex + '-' + i).addClass('hide').before(btn);
			});
			footnoteAnchors();
			function footnoteAnchors(){
				$('div.footnotes > div a:first-child')
					.click(function(e){
						e.preventDefault();
						var elem = $('a[name=' + e.target.href.split('#')[1]);
						$('html, body').animate({
						    scrollTop: $(elem).offset().top - 80
						}, 200);
						elem[0].focus();
				});
		    }
		    if ( $scope.chIndex === 'showAllChapters' ){
		    	$('div.footnotes').removeClass('hide');

		    }				
		} // end processFootnotes()

		function processDataTables() {
			setTimeout(function(){
				$('.datatable').each(function(){
				    $( this ).DataTable({responsive:true});
			    });
			}, 500);
		}

		function processZoomableImages(){
			$('img.zoomable').each(function( i ){
				$( this ).attr('id','image-' + $scope.chIndex + '-' + i);			
			});
			$('img.zoomable').click(function(){
				dataLayer.push({'event':'imageZoom','label':$( this ).attr('src')}); 
				scrollPosition = $( this ).offset();
				$scope.imageSource = $( this ).attr('src');
				$('meta[name="viewport"]').attr('content','width=device-width, initial-scale=1, maximum-scale=4, user-scalable=yes');
				$scope.$apply();
				$('#main-container, #top-menu-container, #footer').toggleClass('hide');
			});
		}

		function processPullquoteTweets(){
			$('.pullquote-tweet').each(function(){
				var url = encodeURIComponent($location.absUrl());
				var text = encodeURIComponent($( this ).text());
				var encoded = 'http://twitter.com/intent/tweet?original_referer=' + url + '&text=' + text + '&url=' + url + '&via=cgdev';
				var tweetThisLink = $('<a>', {'href':encoded,'title':'Tweet this','onclick':'window.open("' + encoded + '", "newwindow", "width=550, height=420"); return false;'}).text('Tweet this');
				var tweetImage = $('<div>', {'class': 'tweet-blue'});
				$( tweetThisLink ).prepend(tweetImage);
				$( this ).append($('<br>')).append(tweetThisLink);
			});
		}

		function processSpanTweets(){
			$('.span-tweet').each(function(){
				var url = encodeURIComponent($location.absUrl());
				var text =  $( this ).text();
				var encoded = 'http://twitter.com/intent/tweet?original_referer=' + url + '&text=' + encodeURIComponent(text) + '&url=' + url + '&via=cgdev';
				var tweetThisLink = $('<a>', {'href':encoded,'title':'Tweet this','onclick':'window.open("' + encoded + '", "newwindow", "width=550, height=420"); return false;'}).text(text).addClass('rendered-tweet');
				var tweetImage = $('<div>', {'class':'tweet-blue'});
				//$( tweetThisLink ).before(tweetImage);
				$( this ).html(tweetThisLink).prepend(tweetImage);
			});
		}


	};
	

	$scope.noSwipe = function($event){
        $event.stopPropagation();
    };
	
	
	initialLoad();
 
	$scope.$on('ngRepeatFinished', function() {
      var container = document.getElementById('reader-menu-contents-list');
      var containerMonitor = scrollMonitor.createContainer(container);
      var childElement = document.getElementById('reader-menu-contents-wrapper');
      var elementWatcher = containerMonitor.create(childElement, {bottom:-10});
      if ( childElement.offsetHeight > container.offsetHeight + 10 ) {
      	document.getElementById('overflow-arrow').classList.add('overflow');
      }
      elementWatcher.stateChange(function() {
          if (this.isBelowViewport) {
            document.getElementById('overflow-arrow').classList.add('overflow');
          } else {
          	document.getElementById('overflow-arrow').classList.remove('overflow');
          }
      });

	});

	$scope.setMenuButtonWatcher = function(){
		var element = document.querySelector('.subpage-bottom-section');
		var menuButtonWatcher = scrollMonitor.create(element, {top:-300,bottom:-10});
		menuButtonWatcher.stateChange(function() {
          if (this.isAboveViewport) {
          	document.getElementById('menu-button').classList.add('bring-in');
          	if ( this.isBelowViewport ){
          		document.getElementById('menu-button').classList.remove('at-bottom');
          	} else {
          		document.getElementById('menu-button').classList.add('at-bottom');
          	}
          } else {
	          document.getElementById('menu-button').classList.remove('bring-in');	
          }
      });

	};

	$scope.setNavButtonWatcher = function(){
		var element = document.querySelector('#reader-content-outer');
		var navButtonWatcher = scrollMonitor.create( element );
	      navButtonWatcher.stateChange(function() {
	          if (this.isAboveViewport) {
	            document.querySelector('.nav-button-right').classList.add('fixed');
	            document.querySelector('.nav-button-left').classList.add('fixed');
	          } else {
	            document.querySelector('.nav-button-right').classList.remove('fixed');
	            document.querySelector('.nav-button-left').classList.remove('fixed');
	          }
	      });

	};
    
	
}]);
