<?php

/**
 * @file
 * Preprocess theme_views_view.
 */

function fett_preprocess_views_view(&$vars){
  $view = $vars['view'];

  $vars['classes_array'] = array_filter($vars['classes_array'], function($class) {
    return $class == 'contextual-links-region';
  });
  $vars['classes_array'][] = 'view';
  if(!empty($vars['css_class'])){
    $vars['classes_array'][] = $vars['css_class'];
  }
  else{
    $vars['classes_array'][] = drupal_html_class($view->name);
    $vars['classes_array'][] = drupal_html_class($view->current_display);
  }
  if(!empty($view->use_ajax)){
    $vars['classes_array'][] = drupal_html_class('view-dom-id-' . $view->dom_id);
  }

  $vars['wrap_content'] = FALSE;

  // Views load more support
  if(module_exists('views_load_more')){
    $vars['wrap_content'] = is_a($view->query->pager, 'views_plugin_pager_load_more');
  }

  // Only show .view-content div wrapper around views when there are other
  // elements around it.
  if(!$vars['wrap_content']){
    $wrap_check = array('header', 'exposed', 'attachment_before', 'attachment_after', 'footer');
    foreach($wrap_check as $check){
      if(!empty($vars[$check])){
        $vars['wrap_content'] = TRUE;
        break;
      }
    }
  }
}
