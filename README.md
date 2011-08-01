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

To attach the color selector to an element, call the `colormebad` function on the element's selector and pass the CSS color property to change. For example, the following call would open the color selector tool to modify the background color property of an element with ID `all4love`:

    $('#all4love').colormebad({css:'background-color'});

A CSS property must be passed to the function.