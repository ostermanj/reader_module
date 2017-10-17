<?php 
/**
 * @file
 * Alpha's theme implementation to display a single Drupal page.
 * 
 *  <?php if (isset($page['content'])) : ?>
    <!-- page[content] --><?php print render($page['content']); ?>
  <?php endif; ?>  */
?>

<div<?php print $attributes; ?>>
  <?php if (isset($page['header'])) : ?>
    <!-- page[header] --><?php print render($page['header']); ?>
  <?php endif; ?>
  <?php if ($reader_image) : ?>
    <div id="reader-hero-wrapper-lower" style="background: url(<?php print $reader_image; ?>) 50% 0 no-repeat;background-size: cover;">
    <div id="logo-link-wrapper">
      <a id="logo-link" href="/"></a>
      </div>
    
      <p id ="image-credit"><?php print $reader_image_title ?></p>
    
       
    </div>
    <?php endif; ?>
   <div id="reader-content-outer">
    <div id="reader-content">
      <div ng-view></div>
    </div>  
  </div>
  <?php if (isset($page['footer'])) : ?>
    <!-- page[footer] --><?php print render($page['footer']); ?>
  <?php endif; ?>
</div>