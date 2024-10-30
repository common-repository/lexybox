<!-- wrap -->
<div class="wrap">

  <!-- lbopt -->
  <div class="lbopt">

    <!-- lbopt__head -->
    <div class="lbopt__head">

      <!-- lbopt__head__content -->
      <div class="lbopt__head__content">

        <!-- lbopt__head__logo -->
        <a href="https://lexybox.leximo.cz/" target="_blank" class="lbopt__head__logo">
          <img src="<?php echo LEXYBOX_URL; ?>assets/img/logo.svg" alt="<?php _e('LexyBox', 'lexybox'); ?>" width="36" height="56">
        </a>

        <!-- lbopt__head__title -->
        <h2 class="lbopt__head__title">
          <?php _e('WordPress LexyBox', 'lexybox'); ?>
        </h2>

        <!-- lbopt__head__excerpt -->
        <p class="lbopt__head__excerpt">
          <?php _e('Neat WordPress Lightbox plugin for your images, videos and more.', 'lexybox'); ?>
        </p>

      </div>

      <!-- lbopt__head__buttons -->
      <div class="lbopt__head__actions">

        <!-- button -->
        <a href="https://lexybox.leximo.cz/" target="_blank" class="button">
          <?php _e('Standalone LexyBox v1.1.6', 'lexybox'); ?>
        </a>

        <!-- button -->
        <a href="https://www.buymeacoffee.com/lexter" target="_blank" class="button button-primary">
          <?php _e('Buy me a coffee if you want', 'lexybox'); ?>
        </a>

      </div>

    </div>

    <!-- lbopt__content -->
    <form method="post" class="lbopt__content">

      <!-- lbopt__field -->
      <div class="lbopt__field">

        <!-- lbopt__field__label -->
        <label for="lexybox-selector" class="lbopt__field__label">
          <?php _e('Selectors', 'lexybox'); ?>
        </label><br>

        <!-- INPUT -->
        <textarea name="lexybox[selector]" id="lexybox-selector" cols="69" rows="3"><?php echo esc_textarea(lexybox_get_option('selector')); ?></textarea>

        <!-- lbopt__field__excerpt -->
        <span class="lbopt__field__excerpt">
          <?php _e('You can separate the selectors with a comma.', 'lexybox'); ?> <a href="#" id="lexybox-selector--all"><?php _e('All images, videos, youtube and vimeo links...', 'lexybox'); ?></a>
        </span>

      </div>

      <!-- lbopt__field -->
      <div class="lbopt__field">

        <!-- lbopt__field__label -->
        <label for="lexybox-theme" class="lbopt__field__label">
          <?php _e('Theme', 'lexybox'); ?>
        </label><br>

        <!-- INPUT -->
        <select name="lexybox[theme]" id="lexybox-theme">

          <?php foreach(LEXYBOX_SETTINGS['theme'] as $key=>$value): ?>

            <!-- OPTION -->
            <option <?php echo $key == lexybox_get_option('theme') ? 'selected' : null; ?> value="<?php echo esc_attr($key); ?>">
              <?php echo esc_html($value); ?>
            </option>

          <?php endforeach; ?>

        </select>

        <!-- lbopt__field__excerpt -->
        <span class="lbopt__field__excerpt">
          <?php _e("Don't worry, all are great. Barebone theme are just absolutely necessary styles to make LexyBox work, so you can style LexyBox yourself without problem.", 'lexybox'); ?>
        </span>

        <!-- lbopt__field__preview -->
        <a href="<?php echo LEXYBOX_URL; ?>assets/img/themes/dark.jpg" target="_blank" class="lbopt__field__preview">
          <?php _e('Dark theme', 'lexybox'); ?>
        </a>

        <!-- lbopt__field__preview -->
        <a href="<?php echo LEXYBOX_URL; ?>assets/img/themes/light.jpg" target="_blank" class="lbopt__field__preview">
          <?php _e('Light theme', 'lexybox'); ?>
        </a>

        <!-- lbopt__field__preview -->
        <a href="<?php echo LEXYBOX_URL; ?>assets/img/themes/classic.jpg" target="_blank" class="lbopt__field__preview">
          <?php _e('Classic theme', 'lexybox'); ?>
        </a>

      </div>

      <!-- lbopt__field -->
      <div class="lbopt__field">

        <!-- lbopt__field__label -->
        <label for="lexybox-effect" class="lbopt__field__label">
          <?php _e('Effect', 'lexybox'); ?>
        </label><br>

        <!-- INPUT -->
        <select name="lexybox[effect]" id="lexybox-effect">

          <?php foreach(LEXYBOX_SETTINGS['effect'] as $key=>$value): ?>
            
            <!-- OPTION -->
            <option <?php echo $key == lexybox_get_option('effect') ? 'selected' : null; ?> value="<?php echo esc_attr($key); ?>">
              <?php echo esc_html($value); ?>
            </option>
          
          <?php endforeach; ?>

        </select>

        <!-- lbopt__field__excerpt -->
        <span class="lbopt__field__excerpt">
          <?php _e('Choose transition effect.', 'lexybox'); ?>
        </span>

      </div>

      <!-- lbopt__field -->
      <div class="lbopt__field">

        <!-- lbopt__field__label -->
        <label for="lexybox-swipe" class="lbopt__field__label">
          <?php _e('Swipe', 'lexybox'); ?>
        </label><br>

        <!-- INPUT -->
        <input type="number" name="lexybox[swipe]" id="lexybox-swipe" value="<?php echo esc_attr(lexybox_get_option('swipe')); ?>" min="<?php echo esc_attr(LEXYBOX_SETTINGS['swipe']['min']); ?>" max="<?php echo esc_attr(LEXYBOX_SETTINGS['swipe']['max']); ?>" style="padding-right:0;">

        <!-- lbopt__field__excerpt -->
        <span class="lbopt__field__excerpt">
          <?php _e('Swipe gestures threshold, set to 0 to disable it.', 'lexybox'); ?>
        </span>

      </div>

      <!-- lbopt__field -->
      <div class="lbopt__field">

        <!-- lbopt__field__label -->
        <label for="lexybox-swipe" class="lbopt__field__label">
          <?php _e('Autoplay', 'lexybox'); ?>
        </label><br>

        <!-- INPUT -->
        <input type="number" name="lexybox[autoplay]" id="lexybox-autoplay" value="<?php echo esc_attr(lexybox_get_option('autoplay')); ?>" min="<?php echo esc_attr(LEXYBOX_SETTINGS['autoplay']['min']); ?>" max="<?php echo esc_attr(LEXYBOX_SETTINGS['autoplay']['max']); ?>" style="padding-right:0;">

        <!-- lbopt__field__excerpt -->
        <span class="lbopt__field__excerpt">
          <?php _e('To switch off, select 0.', 'lexybox'); ?>
        </span>

      </div>

      <!-- lbopt__field -->
      <div class="lbopt__field lbopt__field--contain-checkbox">

        <!-- INPUT -->
        <input type="checkbox" name="lexybox[loop]" id="lexybox-loop" <?php echo lexybox_get_option('loop') ? 'checked' : null; ?> value="<?php echo esc_attr(LEXYBOX_SETTINGS['loop']); ?>">

        <!-- lbopt__field__label -->
        <label for="lexybox-loop" class="lbopt__field__label">
          <?php _e('Loop', 'lexybox'); ?>
        </label><br>

        <!-- lbopt__field__excerpt -->
        <span class="lbopt__field__excerpt">
          <?php _e('Rewind LexyBox on start or end.', 'lexybox'); ?>
        </span>

      </div>

      <!-- lbopt__field -->
      <div class="lbopt__field lbopt__field--contain-checkbox">

        <!-- INPUT -->
        <input type="checkbox" name="lexybox[single]" id="lexybox-single" <?php echo lexybox_get_option('single') ? 'checked' : null; ?> value="<?php echo esc_attr(LEXYBOX_SETTINGS['single']); ?>">

        <!-- lbopt__field__label -->
        <label for="lexybox-single" class="lbopt__field__label">
          <?php _e('Single', 'lexybox'); ?>
        </label><br>

        <!-- lbopt__field__excerpt -->
        <span class="lbopt__field__excerpt">
          <?php _e('Forces single mode.', 'lexybox'); ?>
        </span>

      </div>

      <!-- lbopt__field -->
      <div class="lbopt__field lbopt__field--contain-checkbox">

        <!-- INPUT -->
        <input type="checkbox" name="lexybox[pager]" id="lexybox-pager" <?php echo lexybox_get_option('pager') ? 'checked' : null; ?> value="<?php echo esc_attr(LEXYBOX_SETTINGS['pager']); ?>">

        <!-- lbopt__field__label -->
        <label for="lexybox-pager" class="lbopt__field__label">
          <?php _e('Pager', 'lexybox'); ?>
        </label><br>

        <!-- lbopt__field__excerpt -->
        <span class="lbopt__field__excerpt">
          <?php _e('Enables pagination.', 'lexybox'); ?>
        </span>

      </div>

      <!-- lbopt__field -->
      <div class="lbopt__field lbopt__field--contain-checkbox">

        <!-- INPUT -->
        <input type="checkbox" name="lexybox[preload]" id="lexybox-preload" <?php echo lexybox_get_option('preload') ? 'checked' : null; ?> value="<?php echo esc_attr(LEXYBOX_SETTINGS['preload']); ?>">

        <!-- lbopt__field__label -->
        <label for="lexybox-preload" class="lbopt__field__label">
          <?php _e('Preload', 'lexybox'); ?>
        </label><br>

        <!-- lbopt__field__excerpt -->
        <span class="lbopt__field__excerpt">
          <?php _e('Preload all media or only active, previous and next media.', 'lexybox'); ?>
        </span>

      </div>

      <!-- button -->
      <button type="submit" class="button button-primary">
        <?php _e('Save options', 'lexybox'); ?>
      </button>

    </form>

  </div>

</div>