<?php print $doctype; ?>
<!--[if lt IE 7]> <html class="no-js ie6 lte7 lte8 lte9" lang="<?php print $language->language; ?>" dir="<?php print $language->dir; ?>"> <![endif]-->
<!--[if IE 7]> <html class="no-js ie7 lte7 lte8 lte9" lang="<?php print $language->language; ?>" dir="<?php print $language->dir; ?>"> <![endif]-->
<!--[if IE 8]> <html class="no-js ie8 lte8 lte9" lang="<?php print $language->language; ?>" dir="<?php print $language->dir; ?>"> <![endif]-->
<!--[if IE 9]> <html class="no-js ie9 lte9" lang="<?php print $language->language; ?>" dir="<?php print $language->dir; ?>"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html ng-app="CGDPubsApp" class="no-js" lang="<?php print $language->language; ?>" dir="<?php print $language->dir; ?>"<?php print $rdf->version . $rdf->namespaces; ?>> <!--<![endif]-->
<head<?php print $rdf->profile; ?>>
<base href="/reader/" />
<!-- PRINT HEAD -->
  <?php print $head; ?>
  <title><?php print $reader_title; ?></title>
  <meta name="description" content="<?php print $description; ?>">
  <meta property="fb:app_id" content="445215188878009">
  <meta property="og:site_name" content="Center For Global Development">
  <meta property="og:type" content="article">
  <meta property="og:url" content="<?php print $baseURL . base_path() . drupal_get_path_alias(); ?>"> 
  <meta property="og:title" content="<?php print $reader_title; ?>">
  <meta property="og:description" content="<?php print $description; ?>">
  <meta property="og:image" content="<?php print $og_image; ?>">
  <meta name="twitter:card" content="<?php print $twitter_card; ?>">
  <meta name="twitter:site" content="@cdgev">
  <meta name="twitter:creator" content="<?php print $twitter_creator; ?>">
  <meta name="twitter:site:id" content="1259487">
  <meta name="twitter:url" content="<?php print $baseURL . base_path() . drupal_get_path_alias(); ?>">
  <meta name="twitter:title" content="<?php print $reader_title; ?>">
  <meta name="twitter:description" content="<?php print $description; ?>">
  <meta name="twitter:image" content="<?php print $twitter_image; ?>">
  <link rel="shortcut icon" href="/sites/default/files/cgd-favicon.png" type="image/png" />
  <link rel="shortlink" href="<?php print $baseURL . base_path() . 'node/' . $reader_nid;?>" />
  <link rel="canonical" href="<?php print $baseURL . base_path() . drupal_get_path_alias();?>">
  <link href="//fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic|BenchNine:700" rel="stylesheet" type="text/css">
  <!-- PRINT STYLES -->
  <?php print $styles; ?>
  <!-- END PRINT STYLES -->
  <!-- UPDATE before deployment -->
  <link rel="stylesheet" href="<?php print $reader_path ?>/css/share-this.css" />
  <link rel="stylesheet" href="<?php print $reader_path ?>/css/reader.min.css" />
  <link href="https://plus.google.com/103088068689493599225" rel="publisher" />
  <!-- PRINT SCRIPTS -->
  <?php print $scripts; ?>
  <!-- END PRINT SCRIPTS -->
  <script type="text/javascript">$ = jQuery;</script>
  <script type="text/javascript" src="//fast.fonts.net/jsapi/1cd8f7ed-4deb-4c13-9513-bfb15dc81095.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-touch.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular-animate.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-route.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-sanitize.min.js"></script>
  <script src="<?php print $reader_path ?>/js/share-this.min.js"></script>
  <script src="<?php print $reader_path ?>/js/reader.min.js"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    window.readerApp = {
      readerPath: '<?php print $reader_path ?>', 
      readerFullTitle: <?php print $reader_full_title ?>,
      readerTitle: <?php print $reader_title_esc ?>, 
      readerSubTitle: <?php print $reader_subtitle ?>,
      readerRelated: <?php print $reader_relate ?>,
      readerTopics: <?php print $reader_topic ?>,
      readerImpacts: <?php print $reader_impacts ?>,
      readerInitiatives: <?php print $reader_initiatives ?>,
      readerWorkingGroups: <?php print $reader_working_groups ?>,
      readerPDF: '<?php print $PDFUrl ?>',
      readerDate: '<?php print $reader_date ?>',
      readerAuthors: <?php print $reader_authors ?>,
      readerAuthorsStr: <?php print $reader_authors_text ?>,
      readerCanonical: '<?php print $canonicalURL ?>',
      readerChapterImages: <?php print $reader_chapter_images ?>,
      readerType: '<?php print $reader_type ?>',
      readerFunding: <?php print $reader_funding ?>, 
      readerShowPDF: <?php print $show_pdf_link ?>,
      readerOptionalLinks: <?php print $optional_links ?>,
      readerAuthorThumbnails: <?php print $reader_author_thumbnails ?>,
      readerSummary: <?php print $reader_summary ?>,
      readerNid: '<?php print $reader_nid ?>',
      readerCustomCitation: <?php print $reader_custom_citation ?>,
      readerChapters: <?php print $reader_chapters ?>,
      readerCaptions: <?php print $reader_captions ?>
    };
    
    
   
    
      
  </script>
  
    
</head>
<body<?php print $attributes;?>>
    
<!-- Google Tag Manager -->
<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-KLMBSZ"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KLMBSZ');</script>
<!-- End Google Tag Manager -->

<div id="fb-root"></div>
<script type="text/javascript">
  window.fbAsyncInit = function() {
    //Initialize the Facebook JavaScript SDK
  
 FB.init({
      appId : '445215188878009', //App ID from the app dashboard
      channelUrl : '//www.cgdev.org/sites/default/files/archive/layout/channel.html', //Channel file for x-domain communication
      status : true, //Check Facebook Login status
      xfbml : true //Look for social plugins on the page
    });

    //Facebook Likes 
    FB.Event.subscribe('edge.create', function(href, widget) {
        var currentPage = jQuery(document).attr('title');
        var path = window.location.pathname;
        href = href.replace(/\?.*$/,'');
        dataLayer.push({'event': 'socialEvent', 'eventCategory': 'Facebook', 'eventAction': 'Like', 'eventHREF': href, 'eventPath': path, 'eventPage': currentPage});
    });

    //Facebook Unlikes
    FB.Event.subscribe('edge.remove', function(href, widget) {
        var currentPage = jQuery(document).attr('title');
        var path = window.location.pathname;
        href = href.replace(/\?.*$/,'');
        dataLayer.push({'event': 'socialEvent', 'eventCategory': 'Facebook', 'eventAction': 'Unlike', 'eventHREF': href, 'eventPath': path, 'eventPage': currentPage});
    });
 };

  //Load the SDK asynchronously
  (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_GB/all.js";
  fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
</script>

<div id="body-wrapper" class="node-type-document">
  <div id="skip-link">
    <a href="#main-content" class="element-invisible element-focusable"><?php print t('Skip to main content'); ?></a>
  </div>  
  <!-- page top -->
   
  <!-- page -->
  <?php print $page; ?>
  <!-- page bottom -->
  <?php print $page_bottom; ?>
  </div>
  <script src="<?php print $reader_path ?>/js/scrollMonitor.min.js"></script>

</body>
</html>