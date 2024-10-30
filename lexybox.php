<?php
/**
 * Plugin Name: LexyBox
 * Version: 1.0.6
 * Plugin URI: https://lexybox.leximo.cz/
 * Description: Neat WordPress Lightbox plugin for your images, videos and more.
 * Author: Lex Lexter
 * Author URI: http://www.leximo.cz/
 * Requires at least: 5.0
 * Tested up to: 6.1.1
 * Text Domain: lexybox
 * Domain Path: /languages/
 */

// Is WordPress there?
if(!defined('ABSPATH')) {
	exit;
}

/*
  ***********
  * CONSTANTS
  ***********
*/

// Set URL, DIR
define('LEXYBOX_URL', plugin_dir_url(__FILE__));
define('LEXYBOX_DIR', __DIR__);

// Settings
define('LEXYBOX_SETTINGS', [
  'effect' => [
    'horizontal' => __('Horizontal slide', 'lexybox'),
    'vertical' => __('Vertical slide', 'lexybox'),
    'fade' => __('Fade', 'lexybox')
  ],
  'theme' => [
    'dark' => __('Dark', 'lexybox'),
    'light' => __('Light', 'lexybox'),
    'classic' => __('Classic', 'lexybox'),
    'barebone' => __('Barebone', 'lexybox')
  ],
  'swipe' => [
    'min' => 0,
    'max' => 500
  ],
  'autoplay' => [
    'min' => 0,
    'max' => 20000
  ],
  'loop' => 1,
  'single' => 1,
  'pager' => 1,
  'preload' => 1
]);

// Default options
define('LEXYBOX_OPTIONS', [
  'selector' => '.lexybox',
  'effect' => 'horizontal', 
  'theme' => 'dark', 
  'swipe' => 100,
  'autoplay' => 5000,
  'loop' => false,
  'single' => false,
  'pager' => true,
  'preload' => false
]);

/*
  ***********
  * FUNCTIONS
  ***********
*/

/**
 * Get all LexyBox options
 * @return array
 */

function lexybox_get_options() {

  // Set result
  static $result = [];

  // Return
  if(!empty($result))
    return $result;

  // Get all options
  $options = get_option('lexybox');

  // Loop through default options
  foreach(LEXYBOX_OPTIONS as $key=>$value)
    $result[$key] = isset($options[$key]) ? (is_string($value) && empty($options[$key]) ? $value : $options[$key]) : $value;

  // Return
  return $result;

}

/**
 * Get LexyBox option
 * @param string $key
 * @return mixed
 */

function lexybox_get_option($key) {

  // Get all options
  $options = lexybox_get_options();

  // Return specific option
  return isset($options[$key]) ? $options[$key] : null;

}

/*
  *********
  * ACTIONS
  *********
*/

// ADMIN_MENU action
add_action('admin_menu', function() {

  // Create options page
  add_submenu_page('options-general.php', __('LexyBox Options', 'lexybox'), __('LexyBox', 'lexybox'), 'administrator', 'lexybox', function() {

    // Include template
    require_once(LEXYBOX_DIR . '/options.php');

  });

});

// ADMIN_ENQUEUE_SCRIPTS action
add_action('admin_enqueue_scripts', function() {

  // Enqueue style
  wp_enqueue_style('lexybox_admin', LEXYBOX_URL . '/assets/css/admin.css', [], '1.0.1');
  
  // Enqueue script
  wp_enqueue_script('lexybox_admin', LEXYBOX_URL . '/assets/js/admin.js', [], '1.0.2', true);

});

// WP_ENQUEUE_SCRIPTS action
add_action('wp_enqueue_scripts', function() {

  // Check selector
  if($selector = lexybox_get_option('selector')) {

    // Script
    wp_enqueue_script('lexybox', LEXYBOX_URL . 'lexybox/js/lexybox.min.js', [], '1.1.5', true);

    // Style
    wp_enqueue_style('lexybox', LEXYBOX_URL . 'lexybox/css/lexybox.min.css', [], '1.1.5', 'all');

    // Get all options and remove selector
    $options = lexybox_get_options(); unset($options['selector']);

    // Inline script
    wp_add_inline_script('lexybox', "var lexybox = new LexyBox('" . str_replace('&quot;', '"', esc_js($selector)) . "', " . str_replace('&quot;', '"', json_encode(array_map('esc_js', $options))) . ");");

  }

});

/*
  ****************
  * SAVING OPTIONS
  ****************
*/

// Catch form send
if(isset($_POST['lexybox']) && is_array($_POST['lexybox'])) {

  // Run some basic filters, just trimed strings and no HTML
  $values = array_map('sanitize_text_field', array_map('strval', $_POST['lexybox']));

  // Fix texts
  foreach(['selector'] as $key)
    $values[$key] = isset($values[$key]) ? $values[$key] : LEXYBOX_OPTIONS[$key];

  // Fix numbers
  foreach(['swipe', 'autoplay'] as $key)
    $values[$key] = isset($values[$key]) && $values[$key] >= LEXYBOX_SETTINGS[$key]['min'] && $values[$key] <= LEXYBOX_SETTINGS[$key]['max'] ? intval($values[$key]) : LEXYBOX_OPTIONS[$key];

  // Fix selects
  foreach(['theme', 'effect'] as $key)
    $values[$key] = isset($values[$key]) && array_key_exists($values[$key], LEXYBOX_SETTINGS[$key]) ? $values[$key] : LEXYBOX_OPTIONS[$key];
  
  // Fix checkboxes
  foreach(['loop', 'single', 'pager', 'preload'] as $key)
    $values[$key] = isset($values[$key]) && $values[$key] == 1 ? true : false;

  // Loop through values
  foreach($values as $key=>$value) {

    // Remove unwanted keys
    if(!array_key_exists($key, LEXYBOX_OPTIONS))
      unset($values[$key]);

  }

  // Update option
  $update = update_option('lexybox', $values);

  // ADMIN_NOTICES action
  add_action('admin_notices', function() use($update) {

    // Echo WordPress notice
    echo '<div class="notice notice-' . ($update ? 'success' : 'error') . '">
      <p>' . ($update ? __("The settings have been successfully saved.", 'lexbox') : __("Settings could not be saved, you probably haven't changed them.", 'lexbox')) . '</p>
    </div>';

  });

}