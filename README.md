# jQuery Plugin .stripe( options ) [Demo](http://fliptopbox.com/demo/stripe/)
    @version  : 1.0
    @author   : Bruce Thomas
    @requires : jQuery Core 1.7+
    @github   : https://github.com/fliptopbox/jquery.stripe/

## Purpose:

A jQuery plug-in to create a cool striped gallery object.

## Usage example:
    $('.gallery').stripe(); // (default)
    $('.gallery').stripe({ 'automatic': true, 'buttons': true, 'delay': 5000, 'min-width': 20 });


## Options
	ms {Number}: The length of the transition animations
	delay {Number}: The length of the delay between each transition
	automatic {Boolean}: Whether or not the stripe gallery plays automatically
	min-width {Number}:  The minimum width of the images
	buttons {Boolean}: Whether or not to render the mark up for the controls

## Things to note

* The height of the gallery is determined by the height of the smallest image.
* Images are proportionately down scaled to fit, and preserve image quality.
* You can use a combination of portrait and landscape images.
* Navigation buttons, and auto animate settings are available (see OPTIONS above!)
* The auto-animation timer is paused if you hover over the gallery or the navigation buttons, and reactivated onMouseout.
* There is a calculated maximum image width to ensure an image doesn't consume the entire width of the gallery, this width depends on the number of images, and the 'min-width' option.