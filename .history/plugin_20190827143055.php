<?php
/**
 * Plugin Name: Origami Blocks
 * Plugin URI: https://github.com/syfxlin/origami-blocks
 * Description: Gutenberg blocks for Origami theme
 * Author: Otstar Lin
 * Author URI: https://ixk.me
 * Version: 1.0.1
 * License: GPL3.0
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
