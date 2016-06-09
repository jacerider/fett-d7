<?php

/**
 * @file
 * Generate settings for the megamenu.
 */
function fett_settings_megamenu_form(&$form, $theme_name) {

  $form['megamenu'] = array(
    '#type' => 'checkbox',
    '#title' => t('Enable Mega Menu'),
    '#attributes' => array(
      'class' => array('enable-extension'),
    ),
    '#default_value' => fett_get_setting('megamenu'),
    '#description' => t('The main menu will be converted into mega-menu/dropdown ready markup.'),
    '#element_validate' => array('fett_settings_validate_cleanup_children'),
  );

  $form['megamenu_depth'] = array(
    '#type' => 'select',
    '#title' => t('Meny depth'),
    '#options' => drupal_map_assoc(array(2,3)),
    '#default_value' => fett_get_setting('megamenu_depth', $theme_name, 3),
    '#description' => t('The depth of the menu tree.'),
  );

  $form['megamenu_js_hover'] = array(
    '#type' => 'checkbox',
    '#title' => t('Enable JavaScript hover classes.'),
    '#default_value' => fett_get_setting('megamenu_js_hover'),
    '#description' => t('When a link with child items is hovered over, a class will be assigned along with an animate class that will allow for CSS animations.'),
  );

  if(module_exists('fawesome')){
    $form['megamenu_icon'] = array(
      '#type' => 'checkbox',
      '#title' => t('Use icons for full menu'),
      '#default_value' => fett_get_setting('megamenu_icon'),
      '#description' => t('Font Awesome icons will be added to links in the full menu.'),
    );
    $form['megamenu_icon_oc'] = array(
      '#type' => 'checkbox',
      '#title' => t('Use icons for off-canvas menu'),
      '#default_value' => fett_get_setting('megamenu_icon_oc'),
      '#description' => t('Font Awesome icons will be added to links in the off-canvas menu'),
    );
  }

}
