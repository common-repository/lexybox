/**
 * LexyBox
 * @author Lex Lexter <hi@leximo.cz>
 * @version 1.1.5
 * @update 24.11.2022
 * @website https://lexybox.leximo.cz/
 */

var LexyBox = (function () {

  /**
   * Constructor
   * @param string selector
   * @param object options
   */
    
  // Constructor
  function LexyBox(selector, options) {

    /** @var string */
    this.selector = selector;

    /** @var object */
    this.options = Object.assign({

      // Options
      effect: 'horizontal',  // [horizontal, vertical, fade]
      theme: 'dark',  // [dark, light, classic]
      swipe: 100,
      loop: false,
      single: false,
      pager: true,
      preload: false,
      autoplay: 5000,

      // Texts
      label_close: 'Close',
      label_prev: 'Previous',
      label_next: 'Next',
      label_pager: 'Pagination',
      label_autoplay: 'Play/Pause',

      // Callbacks
      before_open: null,
      after_open: null,
      before_move: null,
      after_move: null,
      before_close: null,
      after_close: null

    }, options);

    /** @var array */
    this.media = [];

    /** @var int */
    this.active = 0;

    /** @var int */
    this.total = 0;

    /** @var bool */
    this.single = false;

    /** @var object */
    this.objects = {};

    /** @var object */
    this.touch = {startX: 0, endX: 0, startY: 0, endY: 0};

    /** @var null */
    this.autoplay = null;

    /** @var object */
    this.services = {

      // Image
      image: {

        // HTML template
        html: '<img alt="%alt" src="%src" class="lexybox-image">',

        // Finder function
        finder: function(url, link) {

          // Return
          return url.match(/\.(jpeg|jpg|gif|png|svg|webp)$/) != null

        },

        // Parser function
        parser: function(url, link) {

          // Return
          return {src: url, alt: link.hasAttribute('title') ? link.getAttribute('title') : 'Image'};
        
        },

        // Thumbnail function
        thumb: function(url, link, params) {
          return url;
        }

      },

      // Video
      video: {

        // HTML template
        html: '<video src="%src" width="400" height="300" class="lexybox-video" controls %poster>Your browser does not support the video tag.</video>',

        // Finder function
        finder: function(url, link) {

          // Return
          return url.match(/\.(mp4|ogg|webm)$/) != null

        },

        // Parser function
        parser: function(url, link) {

          // Set poster
          var poster = link.hasAttribute('data-lexybox-poster') ? link.getAttribute('data-lexybox-poster') : null;

          // Return
          return {src: url, poster: (poster ? 'poster="' + poster + '"' : '')};
        
        },

        // Thumbnail function
        thumb: function(url, link, params) {
          return link.hasAttribute('data-lexybox-poster') ? link.getAttribute('data-lexybox-poster') : '';
        }

      },

      // Youtube
      youtube: {

        // HTML template
        html: '<iframe src="%src" class="lexybox-iframe" allowfullscreen>Your browser does not support the iframe tag.</iframe>',

        // Finder function
        finder: function(url, link) {

          // Return
          return url.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/) != null

        },
        
        // Parser function
        parser: function(url, link) {

          // Run regex
          var match = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);

          // Retun code
          return match && match[2].length == 11 ? {src: 'https://www.youtube.com/embed/' + match[2], code: match[2]} : null;
        
        },

        // Thumbnail function
        thumb: function(url, link, params) {
          return 'https://img.youtube.com/vi/' + params.code + '/sddefault.jpg';
        }

      },

      // Vimeo
      vimeo: {

        // HTML template
        html: '<iframe src="%src" class="lexybox-iframe">Your browser does not support the iframe tag.</iframe>',

        // Finder function
        finder: function(url, link) {

          // Return
          return url.match(/^(http\:\/\/|https\:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/) != null

        },

        // Parser function
        parser: function(url, link) {

          // Run regex
          var match = url.match(/^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/);

          // Retun code
          return match ? {src: 'https://player.vimeo.com/video/' + match[5]} : null;

        },

        // Thumbnail function
        thumb: function(url, link, params) {
          return '';
        }
      
      }

    };

    /** @var string */
    this.markup = {
      base: [
        '<div class="lexybox ' + (in_array(this.options.effect, ['horizontal', 'vertical', 'fade']) ? ' lexybox--effect' : '') + (this.options.effect ? ' lexybox--effect-' + this.options.effect : '') + (in_array(this.options.theme, ['dark', 'light', 'classic']) ? ' lexybox--theme' : '') + (this.options.theme ? ' lexybox--theme-' + this.options.theme : '') + '">' +
          '<div class="lexybox-window">' +
            '<div class="lexybox-content">' +
              '<div class="lexybox-track">' +
                '%items' +
              '</div>' +
            '</div>' +
            '<span class="lexybox-title"></span>' +
            '<div class="lexybox-count">' +
              '<span class="lexybox-count__current"></span>' +
              '<span class="lexybox-count__sep"></span>' +
              '<span class="lexybox-count__total"></span>' +
            '</div>' +
            '<a href="#" class="lexybox-control lexybox-control--close">' + this.options.label_close + '</a>' +
            (!this.options.single ? '<a href="#" class="lexybox-control lexybox-control--prev">' + this.options.label_prev + '</a>' : '') +
            (!this.options.single ? '<a href="#" class="lexybox-control lexybox-control--next">' + this.options.label_next + '</a>' : '') +
            (!this.options.single ? '<a href="#" class="lexybox-control lexybox-control--grid">' + this.options.label_pager + '</a>' : '') +
            (!this.options.single && this.options.autoplay > 0 ? '<a href="#" class="lexybox-control lexybox-control--play">' + this.options.label_autoplay + '</a>' : '') +
            '<div class="lexybox-pager">' +
              '%pages' +
            '</div>' +
          '</div>' +
        '<div>'
      ].join(''),
      
      // Item
      item: [
        '<div class="lexybox-item">' +
          '%item' +
        '</div>'
      ].join(''),

      // Page
      page: [
        '<a href="#" class="lexybox-page" data-index="%index" %thumb>' +
          '<span class="lexybox-page__num">' +
            '%page' +
          '</span>' +
          '<span class="lexybox-page__title">' +
            '%title' +
          '</span>' +
        '</a>'
      ].join(''),
    
    };

    // Add services from global variable
    add_services(this, (window.lexybox_services === undefined ? {} : window.lexybox_services));

    // Register events
    handle_events(this, false);

  }

  /**
   * Handle events
   * @param object self
   * @param bool opened
   */

   function handle_events(self, opened) {

    // Opened
    if(opened) {

      // Loop through links
      for(var i = 0; i < self.objects.pages.length; i++) {

        // Add click event
        self.objects.pages[i].addEventListener('click', function(event) {

          // Prevent default
          event.preventDefault();

          // Go to
          go_to(self, event.currentTarget.getAttribute('data-index'));
     
        });

      }

      // Close
      self.objects.close.addEventListener('click', function(event) {

        // Prevent default
        event.preventDefault();

        // Close
        close(self);

      });

      // Check grid
      if(self.objects.grid) {

        // Grid
        self.objects.grid.addEventListener('click', function(event) {

          // Prevent default
          event.preventDefault();

          // Toggle class
          toggle_pager(self);

          // Load pager
          if(!self.options.preload)
            load_pager(self);

        });

      }

      // Check autoplay
      if(self.objects.play && self.options.autoplay) {

        // Play
        self.objects.play.addEventListener('click', function(event) {

          // Prevent default
          event.preventDefault();

          // Toogle autoplay
          toggle_autoplay(self);

        });

      }

      // Check prev
      if(self.objects.prev) {

        // Prev
        self.objects.prev.addEventListener('click', function(event) {

          // Prevent default
          event.preventDefault();

          // Go to prev
          go_to_prev(self);

        });

      }

      // Check next
      if(self.objects.next) {

        // Next
        self.objects.next.addEventListener('click', function(event) {

          // Prevent default
          event.preventDefault();

          // Go to next
          go_to_next(self);

        });

      }

      // On keydown
      window.onkeydown = function(event) {

        // Escape
        if(event.key == 'Escape') {
          
          // Close
          close(self);

        }

        // ArrowLeft, ArrowUp
        if(event.key == 'ArrowLeft' || event.key == 'ArrowUp') {
          
          // Go to prev
          go_to_prev(self);
          
        }

        // ArrowRight, ArrowDown
        else if(event.key == 'ArrowRight' || event.key == 'ArrowDown') {
          
          // Go to next
          go_to_next(self);

        }
      
      };

      // Check swipe threshold
      if(self.options.swipe > 0) {

        // Touchstart
        self.objects.content.addEventListener('touchstart', function(event) {

          // Set start
          self.touch.startX = event.changedTouches[0].screenX;
          self.touch.startY = event.changedTouches[0].screenY;
        
        });

        // Touchend
        self.objects.content.addEventListener('touchend', function(event) {

          // Set end
          self.touch.endX = event.changedTouches[0].screenX;
          self.touch.endY = event.changedTouches[0].screenY;

          // Get direction
          var dir = check_touch_direction(self);

          // Prev
          if(dir == 'left' || dir == (self.effect == 'vertical' ? 'down' : 'up')) {
            
            // Go to next
            go_to_next(self);

          }

          // Next
          else if(dir == 'right' || dir == (self.effect == 'vertical' ? 'up' : 'down')) {
            
            // Go to prev
            go_to_prev(self);

          }

        });

      }

    }

    // Get all links
    var links = document.querySelectorAll(self.selector);

    // Loop through links
    for(var i = 0; i < links.length; i++) {

      // Add click event
      links[i].addEventListener('click', function(event) {

        // Prevent default
        event.preventDefault();

        // Close opened lightbox
        if(is_open(self))
          close(self);

        // Open
        open(self, collect_media(self, links, event.currentTarget.getAttribute('href'), event.currentTarget.getAttribute('rel')));

      });

    }

  }

  /**
   * Toggle class
   * @param string object
   * @param string name
   * @param bool add
   */

  function toggle_class(object, name, add) {

    // Add
    if(add || (add == undefined && !object.classList.contains(name)))
      object.classList.add(name);

    // Remove
    else if(!add  || (add == undefined && object.classList.contains(name)))
      object.classList.remove(name);


  }

  /**
   * In array
   * @param mixed needle
   * @array haystack
   * @return bool
   */

  function in_array(needle, haystack) {

    // Get arraylength
    var length = haystack.length;

    // Loop
    for(var i = 0; i < length; i++) {

      // Check value and return
      if(haystack[i] == needle) return true;
    
    }

    // Return
    return false;
  
  }

  /**
   * Toggle autoplay
   * @param object self
   * @param bool stop
   */

  function toggle_autoplay(self, stop = false) {

    // Playing or force stop
    if(self.autoplay || stop) {

      // Stop autoplay
      stop_autoplay(self);

    }

    // Not playing
    else {

      // Remove playing class
      self.objects.wrap.classList.add('lexybox--playing');

      // Set interval
      self.autoplay = setInterval(function() {

        // Go to next
        go_to_next(self, false);

        // End of the line
        if(self.active + 1 == self.total) {

          // CLear interval
          clearInterval(self.autoplay); self.autoplay = null;
          
          // Remove playing class
          self.objects.wrap.classList.remove('lexybox--playing');

        }

      }, self.options.autoplay);

    }

  }

  /**
   * Stop autoplay
   * @param object self
   */

  function stop_autoplay(self) {

    // CLear interval
    clearInterval(self.autoplay); self.autoplay = null;

    // Remove playing class
    self.objects.wrap.classList.remove('lexybox--playing');

  }

  /**
   * Stop videos
   * @param object self
   * @param int skip
   * @return bool
   */

  function stop_videos(self, skip) {

    // Set iframe, video, src
    var iframe, video, src;

    // Loop through items
    self.objects.items.forEach(function(value, index) {

      // Skip current index
      if(index !== skip) {

        // Get iframe
        iframe = value.querySelector('iframe');

        // Get video
        video = value.querySelector('video');

        // Check iframe
        if(iframe) {

          // Get src
          src = iframe.getAttribute('src');

          // Remove src
          iframe.removeAttribute('src');

          // Add src back
          iframe.src = src;

        }

        // Check video
        if(video) {

          // Stop video
          video.pause();

        }

      }

    });

  }

  /**
   * Toggle pager
   * @param object self
   */

   function toggle_pager(self) {

    // Remove pager class
    toggle_class(self.objects.wrap, 'lexybox--pager');

    // Stop autoplay
    stop_autoplay(self);

  }

  /**
   * Set active item
   * @param object self
   * @param int active
   */

  function set_active_item(self, active) {

    // Loop through items
    self.objects.items.forEach(function(value, index) {

      // Activate
      if(index == active) {
        value.classList.add('lexybox-item--active');
        
        // Preload
        if(!self.options.preload)
          load_item(self, index);
      
        }

      // Deactivate
      else {
        value.classList.remove('lexybox-item--active');
      }

      // Add class to prev
      if(index == (active - 1)) {
        value.classList.add('lexybox-item--prev');
        
        // Preload
        if(!self.options.preload)
          load_item(self, index);
      
        }
      
      // Remove class from prev
      else {
        value.classList.remove('lexybox-item--prev');
      }

      // Add class to next
      if(index == (active + 1)) {
        value.classList.add('lexybox-item--next');

        // Preload
        if(!self.options.preload)
          load_item(self, index);
     
        } 

      // Remove class from next
      else {
        value.classList.remove('lexybox-item--next');
      }

    });

    // Loop through media items
    self.media.forEach(function(value, index) {

      // Set active
      self.media[index].active = index == active;

    });

    // Set active pager
    if(self.options.pager) {

      // Loop through items
      self.objects.pages.forEach(function(value, index) {

        // Toggle active class
        toggle_class(value, 'lexybox-page--active', index == active);

      });

    }

    // Set active
    self.active = active;

  }

  /**
   * Load item
   * @param object self
   * @param int index
   */

   function load_item(self, index) {

    // Get inner
    var inner = self.objects.items[index].innerHTML;

    // Needs to be appended
    if(inner == '%item')
      self.objects.items[index].innerHTML = self.media[index].html;

  }

  /**
   * Load pager
   * @param object self
   */

  function load_pager(self) {

    // Loop through pages
    self.objects.pages.forEach(function(value, index) {

      // Is already loaded and have thumbnail?
      if(!self.objects.pages[index].hasAttribute('style') && self.media[index].thumb) {

        // Add background image
        self.objects.pages[index].style.backgroundImage = 'url(' + self.media[index].thumb + ')';

      }

    });

  }

  /**
   * Collect media
   * @param object self
   * @param NodeList links
   * @param string active
   * @param string rel
   * @return array
   */

  function collect_media(self, links, active, rel) {

    // Set result
    var result = [];

    // Loop through links
    links.forEach(function(link) {

      // Check rel attribute
      if(rel && link.getAttribute('rel') !== rel)
        return;

      // Parse media from link
      if(parse = parse_media_from_link(self, link, active)) {

        // Add link to stack
        result.push(parse);

      }

    });

    // Return
    return result;

  }

  /**
   * Parse media from link
   * @param object self
   * @param string link
   * @param int index
   * @param string active
   */

  function parse_media_from_link(self, link, active) {

    // Set result, url
    var result = {}, url = link.getAttribute('href');

    // Loop through services
    Object.keys(self.services).forEach(function(key) {

      // Run finder
      if(self.services[key].finder(url, link)) {

        // Run parser
        if(params = self.services[key].parser(url, link)) {

          // Copy html template
          var html = self.services[key].html;

          // Loop through params
          Object.keys(params).forEach(function(k) {

            // Replace
            html = html.replace('%' + k, params[k]);

          });

          // Add HTML
          result.html = html;

          // Add url
          result.url = url;

          // HTML
          result.title = link.hasAttribute('title') ? link.getAttribute('title') : null;

          // HTML
          result.active = url == active;

          // Service
          result.service = key;

          // Add thumb
          result.thumb = link.hasAttribute('data-lexybox-thumbnail') ? link.getAttribute('data-lexybox-thumbnail') : (self.services[key].thumb !== undefined ? self.services[key].thumb(url, link, params) : '');

        }

      }

    });

    // Return
    return result.html !== undefined ? result : null;

  }

  /**
   * Set media
   * @param object self
   * @param array media
   */

   function set_media(self, media) {

    // Empty media
    self.media = [];

    // Loop through media
    Object.keys(media).forEach(key => {

      // No HTML
      if(media[key].html == undefined)
        return;

      // Set active key
      if(media[key].active)
        self.active = key;

      // Add media
      self.media.push(media[key]);

    });

    // Set total
    self.total = self.media.length;

    // One item or forced single mode
    if(self.total == 1 || self.options.single) {

      // Set single
      self.single = true;

      // Set media
      self.media = [self.media[self.active]];
      
      // Set active
      self.active = 0;
    
    }

  }

  /**
   * Clear media
   * @param object self
   */

  function clear_media(self) {

    // Empty media
    self.media = [];

  }

  /**
   * Open
   * @param object self
   * @param array media
   */

   function open(self, media) {

    // Set media
    set_media(self, media);

    // Before open
    if(typeof self.options.before_open === 'function')
      self.options.before_open(self.media);

    // Empty media
    if(self.media.length == 0) {

      // Throw message
      console.log('empty media stack');

      // Stop script
      return false;

    }

    // Create HTML markup
    create_html_markup(self);

    // Go to
    go_to(self, self.active, null);
    
    // After open
    if(typeof self.options.after_open === 'function')
      self.options.after_open(self.media, self.active, self.objects);

  }

  /**
   * Is open
   * @param object self
   * @return bool
   */

   function is_open(self) {
    return self.objects.wrap !== undefined;
  }

  /**
   * Close
   * @param object self
   */

  function close(self) {

    // Before close
    if(typeof self.options.before_close === 'function')
      self.options.before_close(self.media, self.objects);

    // Stop autoplay
    stop_autoplay(self);

    // Clear media
    clear_media(self);

    // Clear HTML markup
    clear_html_markup(self);

    // Clear temporaray objects
    clear_temp_objects(self);

    // Reset active
    self.active = 0;

    // Reset single
    self.single = false;

    // After close
    if(typeof self.options.after_close === 'function')
      self.options.after_close();

  }

  /**
   * Move to
   * @param object self
   * @param int index
   * @param string direction
   */

  function move_to(self, index, direction) {

    // Before move
    if(typeof self.options.before_move === 'function')
      self.options.before_move(direction, self.media, self.active, self.objects);

    // Horizontal effect
    if(self.options.effect == 'horizontal') {

      // Move content
      self.objects.track.style.transform = '-webkit-translateX(-' + index * 100 + '%)';
      self.objects.track.style.transform = '-ms-translateX(-' + index * 100 + '%)';
      self.objects.track.style.transform = 'translateX(-' + index * 100 + '%)';

    }

    // Vertical effect
    else if(self.options.effect == 'vertical') {

      // Move content
      self.objects.track.style.transform = '-webkit-translateY(-' + index * 100 + '%)';
      self.objects.track.style.transform = '-ms-translateY(-' + index * 100 + '%)';
      self.objects.track.style.transform = 'translateY(-' + index * 100 + '%)';

    }

    // Set active item
    set_active_item(self, index);

    // After move
    if(typeof self.options.after_move === 'function')
      self.options.after_move(direction, self.media, self.active, self.objects);

  }

  /**
   * Go to
   * @param object self
   * @param int index
   * @param string direction
   * @param bool autoplay
   */

  function go_to(self, index, direction, autoplay = true) {

    // Index must be integer
    index = parseInt(index);
    
    // Change title
    if(index in self.media)
      self.objects.title.innerText = self.media[index].title;

    // Single mode, stop it
    if(self.single) {

      // Set first item active
      set_active_item(self, 0);

      // Return
      return;

    }

    // Add loading class
    self.objects.wrap.classList.add('lexybox--loading');

    // Check loop
    if(self.options.loop && self.media.length  > 1) {

      // Go to end
      if(index < 0)
        index = self.media.length - 1;

      // Go to start
      if(index == self.media.length)
        index = 0;

    }

    // Index does not exists
    if(!(index in self.media)) {

      // Shake the butt
      shake_the_butt(self);

      // Stop method
      return;

    }

    // Set current number
    self.objects.current.innerText = index + 1;

    // Move to
    move_to(self, index, direction);

    // Check loop
    if(!self.options.loop) {

      // Disable prev
      toggle_class(self.objects.prev, 'lexybox-control--disabled', index == 0);

      // Disable next
      toggle_class(self.objects.next, 'lexybox-control--disabled', (index + 1) == self.total);

    }

    // Stop videos
    stop_videos(self, index);

    // Stop autoplay
    if(autoplay) {
      stop_autoplay(self);
    }

    // Set timeout
    setTimeout(function() {
      
      // Remove loading class
      if(self.objects.wrap)
        self.objects.wrap.classList.remove('lexybox--loading');

    }, 1000);

  }

  /**
   * Go to prev
   * @param object self
   */

  function go_to_prev(self) {
    go_to(self, self.active - 1, 'prev');
  }

  /**
   * Go to next
   * @param object self
   * @param bool stop_autoplay
   */

  function go_to_next(self, stop_autoplay) {
    go_to(self, self.active + 1, 'next', stop_autoplay);
  }

  /**
   * Create HTML markup
   * @param object self
   * @param array media
   */

   function create_html_markup(self) {

    // Copy markup, set items
    var markup = self.markup, items = '', pages = '';

    // Loop through media items
    self.media.forEach(function(media, index) {

      // Add item to items
      items += self.options.preload ? markup.item.replace('%item', media.html) : markup.item;

      // Construct pager
      if(self.options.pager && !self.single)
        pages += markup.page.replace('%index', index).replace('%page', index + 1).replace('%title', media.title ? media.title : '').replace('%thumb', (self.options.preload && media.thumb ? 'style="background-image:url(' + media.thumb + ');"' : ''));

    });

    // Create temporary wrapper
    const temp = document.createElement('div');

    // Add items to markup
    temp.innerHTML = markup.base.replace('%items', items).replace('%pages', pages);

    // Append markup to body
    document.body.appendChild(temp.firstChild);

    // Set temporary objects
    set_temp_objects(self);

    // Total count
    self.objects.total.innerText = self.total;

    // Set single mode
    toggle_class(self.objects.wrap, 'lexybox--mode-single', self.single);

    // Add HTMl class
    document.body.classList.add('lexybox-body');

    // Remove objects in single mode
    if(self.single) {
      self.objects.prev ? self.objects.prev.remove() : null;
      self.objects.next ? self.objects.next.remove() : null;
      self.objects.grid ? self.objects.grid.remove() : null;
      self.objects.count ? self.objects.count.remove() : null;
      self.objects.pager ? self.objects.pager.remove() : null;
      self.objects.play ? self.objects.play.remove() : null;
    }

    // Remove pager
    if(!self.options.pager) {
      self.objects.grid.remove();
      self.objects.pager.remove();
    }

    // Set timeout
    setTimeout(function() {

      // Reveal
      self.objects.wrap.classList.add('lexybox--visible');

    }, 1);

    // Handle events
    handle_events(self, true);

  }

  /**
   * Clear HTML markup
   * @param object self
   */

  function clear_html_markup(self) {

    // Remove wrapper
    self.objects.wrap.remove();

    // Remove HTMl class
    document.body.classList.remove('lexybox-body');

  }

  /**
   * Set temporary objects
   * @param object self
   */

  function set_temp_objects(self) {

    // Set objects
    self.objects = {
      wrap: document.querySelector('.lexybox'),
      title: document.querySelector('.lexybox-title'),
      count: document.querySelector('.lexybox-count'),
      current: document.querySelector('.lexybox-count__current'),
      total: document.querySelector('.lexybox-count__total'),
      prev: document.querySelector('.lexybox-control--prev'),
      next: document.querySelector('.lexybox-control--next'),
      close: document.querySelector('.lexybox-control--close'),
      grid: document.querySelector('.lexybox-control--grid'),
      play: document.querySelector('.lexybox-control--play'),
      content: document.querySelector('.lexybox-content'),
      track: document.querySelector('.lexybox-track'),
      items: document.querySelectorAll('.lexybox-item'),
      pager: document.querySelector('.lexybox-pager'),
      pages: document.querySelectorAll('.lexybox-page')
    };

  }

  /**
   * Clear temporary objects
   * @param object self
   */

  function clear_temp_objects(self) {

    // Empty objects
    self.objects = {};

  }

  /**
   * Shake the butt
   * @param object self
   */

  function shake_the_butt(self) {

    // Add shaking class
    self.objects.wrap.classList.add('lexybox--shake');

    // Run timeout
    setTimeout(function() {

      // Remove shaking class
      self.objects.wrap.classList.remove('lexybox--shake');
    
    }, 1000);

  }

  /**
   * Check touch direction
   * @param object self
   * @return string
   */

  function check_touch_direction(self) {

    // Left
    if ((self.touch.endX + self.options.swipe) < self.touch.startX)
      return 'left';

    // Right
    if (self.touch.endX > (self.touch.startX + self.options.swipe))
      return 'right';

    // Up
    if ((self.touch.endY + self.options.swipe) < self.touch.startY)
      return 'up';

    // Down
    if (self.touch.endY > (self.touch.startY + self.options.swipe))
      return 'down';

    // Tap
    return 'tap';

  }

  /**
   * Add service
   * @param object self
   * @param string key
   * @param object service
   */

  function add_service(self, key, service) {
    self.services[key] = service;
  }

  /**
   * Add services
   * @param object self
   * @param string key
   * @param object service
   */

  function add_services(self, services) {
    Object.assign(self.services, services);
  }

  /**
   * Open
   * @param array stack
   */

  LexyBox.prototype.open = function(stack) {
    open(this, stack);
  }

  /**
   * Close
   */

   LexyBox.prototype.close = function() {
    close(this);
  }

  /**
   * Add service
   * @param string key
   * @param object service
   */

  LexyBox.prototype.add_service = function(key, service) {
    add_service(this, key, service);
  }

  // Return
  return LexyBox;

}());