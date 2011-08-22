ColorMeBad
==========

An image-free color selector for jQuery.
----------------------------------------

### Installation

ColorMeBad requires jQuery.

1. [Download the files](https://github.com/jasonvolpe/ColorMeBad/zipball/master).
2. Place the `colormebad` directory in your web server's path.
3. Put a reference to `colormebad.js` in the `<HEAD>` tag of your HTML document. It might look like this:

        <script type="text/javascript" src="js/colormebad/colormebad.js"></script>

### Usage

To attach the color selector to an element, call the `colormebad` function on the element's selector while passing some handlers for event callbacks. The following example binds a ColorMeBad color selector to an #all4love element:

    $('#all4love').colormebad({
        show: function() {
            // do this when selector opens
            
            // sets initial selector color to background color of #all4love element
            $(this).colormebad('setColor', $(this).css('background-color'));
        },
        change: function() {
            // do this when color selector cursor is moved (this is called a lot)
            
            // changes the background-color of the #all4love element as the
            // color seletor cursor is moved
            $(this).css('background-color', $(this).colormebad('getColor'));
        },
        close: function() {
            // do this on selector close
        }

