<?php

/**
 * @file
 * Preprocess theme_page.
 */

function fett_preprocess_user_profile(&$vars){
  $vars['classes_array'][] = drupal_html_class($vars['elements']['#view_mode']);
  $vars['theme_hook_suggestions'][] = 'user_profile__' . $vars['elements']['#view_mode'];
  $vars['user_url'] = url('user/' . $vars['elements']['#account']->uid);
}
