<?php

/**
 * @file
 * Default simple view template to display a list of rows.
 *
 * @ingroup views_templates
 */
?>
<?php if (!empty($title)): ?>
  <h3><?php print $title; ?></h3>
  <div class="group">
<?php endif; ?>
<?php foreach ($rows as $id => $row): ?>
  <?php if($wrap_content): ?><div<?php if ($classes_array[$id]) { print ' class="' . $classes_array[$id] .'"';  } ?>><?php endif; ?>
    <?php print $row; ?>
  <?php if($wrap_content): ?></div><?php endif; ?>
<?php endforeach; ?>
<?php if (!empty($title)): ?>
  </div>
<?php endif; ?>
