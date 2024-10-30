/**
 * Admin scripts
 * @author Lex Lexter <hi@leximo.cz>
 * @version 1.0.2
 * @update 29.10.2022
 * @website https://leximo.cz/
 */

// #lexybox-selector--all
var selector = document.getElementById('lexybox-selector--all');

// Check selector
if(selector) {

  // Click
  selector.addEventListener('click', function(event) {

    // Prevent default
    event.preventDefault();

    // Set selector value
    document.getElementById('lexybox-selector').value = 'a[href$="jpg"], a[href$="jpeg"], a[href$="png"], a[href$="webp"], a[href$="svg"], a[href$="gif"], a[href$="mp4"], a[href$="ogg"], a[href$="webm"], a[href*="youtube.com"], a[href*="youtu.be"], a[href*="vimeo.com"]';

  });

}