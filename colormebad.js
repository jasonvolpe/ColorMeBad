/*
  ColorMeBad
  
  A color selection tool with no images. Now as a jQuery plugin.
  
  Author:   jason.volpe@gmail.com
  Updated:  8/15/2011
*/


(function( $ ){
  
    // Color Selector Object/Settings
    var c = {
      name: '#ColorSelector',
      color: {
        hue: 0,
        sat: 1,
        val: 1
      },
      rgbText: 'rgb(0,0,0)',
      sv: { box: '#ColorSelector-SatVal',
            marker: '#ColorSelector-SatVal-Marker'
      },
      hue: { box: '#ColorSelector-Hue',
             marker: '#ColorSelector-Hue-Marker'
      },
      color: { current: '#ColorSelector-Color-New',
               old: '#ColorSelector-Color-Old'
      },
      select: { box: '#ColorSelector-Select',
                hover: '.ColorSelector-Select-Hover'
      },
      html: '<div id="ColorSelector"><div id="ColorSelector-SatVal"><div id="ColorSelector-SatVal-Marker"></div></div><div id="ColorSelector-Hue"><div id="ColorSelector-Hue-Marker"></div></div><div id="ColorSelector-Color-New"></div><div id="ColorSelector-Color-Old"></div><div id="ColorSelector-Select">Select</div></div></div>',
      cssFile: 'colormebad.css',
      cssGood: false
    };
    
    // object for global mouse events
    var clickObj = new Object();
    clickObj.mouseDown = false;
    
    // debugger object for setting test outputs
    var debugObj = {
      setValue : function(item, val) { $(item).text(String(val)); },
      setX : function(val) { this.setValue('#xpos', val) },
      setY : function(val) { this.setValue('#ypos', val) },
      setMouse : function(val) { this.setValue('#mouse', val) },
      setHue : function(val) { this.setValue('#hue', val) },
      setSat : function(val) { this.setValue('#sat', val) },
      setVal : function(val) { this.setValue('#val', val) },
      setHSV : function(h, s, v) { this.setHue(h); this.setSat(s); this.setVal(v);}
    };
    
    /*
        Summary:    Stops listening for mouse movement.
    */
    function mouseUp(e) {
        clickObj.mouseDown = false;
        $(window).unbind('mousemove');
    }
    
    /*
      Summary:    Updates global click state with position (left/top) of target element. The position is
                  used to calculate the placement of the selection markers.
                  Attaches a mouse move event to the window to move markers.
    */
    function mouseDown(e) {
      // update click state
      clickObj.mouseDown = true;
      clickObj.ele = e.currentTarget;
      clickObj.startX = e.clientX;
      clickObj.startY = e.clientY;
      
      switch ( e.target.id) {
        case String(c.sv.box).replace(/[#.]/g,''):
        case String(c.sv.marker).replace(/[#.]/g,''):
          clickObj.parentLeft = $(c.sv.box).offset().left;
          clickObj.parentTop = $(c.sv.box).offset().top;
          $(window).mousemove(mouseMove);
          break;
        case String(c.hue.box).replace(/[#.]/g,''):
        case String(c.hue.marker).replace(/[#.]/g,''):
          clickObj.parentLeft = $(c.hue.box).offset().left;
          clickObj.parentTop = $(c.hue.box).offset().top;
          $(window).mousemove(mouseMove);
          break;
        case String(c.name).replace(/[#.]/g,''):
          clickObj.parentLeft = e.offsetX;
          clickObj.parentTop = e.offsetY;
          $(window).mousemove(mouseMove);
          break;
        default:
          break;
      }  
      
      e.preventDefault();
      e.stopPropagation();
      return true;
    }
    
    /*
      Summary:    Tracks movement in each selection box and sends the cursor position to
                  the marker update functions.
    */
    function mouseMove(e) {
      if (clickObj.ele.id == String(c.sv.box).replace(/[#.]/g,'')) {
        // Saturation/Value box
        var satVal = moveSatValMarker(e.clientX - clickObj.parentLeft, e.clientY - clickObj.parentTop);
        c.color.sat = satVal.sat;
        c.color.val = satVal.val;
        debugObj.setHSV(c.color.hue, c.color.sat, c.color.val);
        refreshSelectorColors(c.color.hue, c.color.sat, c.color.val);
      
      } else if (clickObj.ele.id == String(c.hue.box).replace(/[#.]/g,'')) {
        // Hue box
        c.color.hue = moveHueMarker(e.clientY - clickObj.parentTop);
        debugObj.setHSV(c.color.hue, c.color.sat, c.color.val);
        refreshSelectorColors(c.color.hue, c.color.sat, c.color.val);
      } else if (clickObj.ele.id == String(c.name).replace(/[#.]/g,'')) {
        // Color Selector window
        $(c.name).css('left', e.clientX - clickObj.parentLeft);
        $(c.name).css('top', e.clientY - clickObj.parentTop);
      };
      e.preventDefault();
      e.stopPropagation();
      return true;
    }
    
    /*
      Summary:    Moves the saturation/value cursor's position to given coordinates.
      Parameters: Integers x and y as offset values from marker's parent.
      Returns:    Saturation and Value results based on position in container element. Sat, Val in [0,1].
     */
    function moveSatValMarker(x, y) {
        var left;
        var top;
        
        // offset cursor so it is in the center of the mouse pointer
        var xAdj = $(c.sv.marker).outerWidth(true) / 2;
        var yAdj = $(c.sv.marker).outerHeight(true) / 2;
        
        // enforce boundaries for marker movement
        // X boundaries
        if ( 0 <= x  && x < $(c.sv.box).width() ) {
            left = x - xAdj;    
        } else if ( x >= $(c.sv.box).width() ) {
            left = $(c.sv.box).width() - xAdj;
        } else if ( x < 0 ) {
            left = -xAdj;
        };
        
        // Y boundaries
        if ( 0 <= y  && y < $(c.sv.box).height() ) {
            top = y - yAdj;
        } else if ( y >= $(c.sv.box).height() ) {
            top = $(c.sv.box).height() - yAdj;
        } else if ( y < 0 ) {
            top = -yAdj;
        };
                
        // move the marker
        $(c.sv.marker).css({
          'left' : left + 'px',
          'top' : top + 'px'
        });
                
        // Remove adjustments to account for marker offset.
        return {sat: (left + xAdj) / $(c.sv.box).width(),
                val: 1 - (top + yAdj) / $(c.sv.box).height()};
    }
    
    /*
      Summary:    Moves the hue marker's position to given coordinates.
      Parameters: Integer y as offset values from marker's parent's top.
      Returns:    Floating point hue value from marker position, 
     */
    function moveHueMarker(y) {
        var top;
        
        // offset marker so its center is at the cursor point
        var yAdj = $(c.hue.marker).outerHeight() / 2;
        var yBorders = parseInt($(c.hue.marker).css('border-top-width'), 10) + parseInt($(c.hue.marker).css('border-bottom-width'),10);

        // enforce boundary for marker movement        
        if ( 0 <= y  && y < $(c.hue.box).height() ) {
            top = y - yAdj;    
        } else if ( y >= $(c.hue.box).height() ) {
            top = $(c.hue.box).height() - yAdj;
        } else if ( y < 0 ) {
            top = -yAdj;
        };
                
        // move the marker
        $(c.hue.marker).css('top', top + 'px');

        // Remove adjustments to account for marker offset.
        return Math.min(360 - 360.0 * (top + yAdj) / ($(c.hue.box).height()), 359.9999);
    }

    /*
      Summary:    Updates colored elements after converting HSV to RGB.
      Parameters: Hue, saturation, and value floats in [0,360), [0,1], [0,1].
      Returns:    Boolean at completion.
    */
    function refreshSelectorColors(hue, sat, val) {
        
        // refresh color output box
        var rgb = HSVtoRGB(hue, sat, val);
        var rgbText = 'rgb(' + String(rgb[0]) + ',' + String(rgb[1]) + ',' + String(rgb[2]) + ')';
        $(c.color.current).css('background-color', rgbText);
        
        // refresh saturation/value selection box background color
        var rgbHue = HSVtoRGB(hue, 1, 1);
        var rgbHueText = 'rgb(' + String(rgbHue[0]) + ',' + String(rgbHue[1]) + ',' + String(rgbHue[2]) + ')'
        
        // update color sampler
        $(c.sv.box).css('background-color', rgbHueText);
        
        // update bound object's background color
        methods.update(rgbText);

        return true;
    }

    /*
      Summary:    Sets markers and selector color to a given RGB.
      Parameters: R, G, B in [0, 255]
      Returns:    Returns a boolean at completion if input was within range.
    */
    function setSelectorColor(r, g, b) {
        var hsv = RGBtoHSV(r, g, b);
        
        // saturation / value marker
        var xAdj = Math.round(parseInt($(c.sv.marker).css('width'),10) / 2.0);
        var yAdj = Math.round(parseInt($(c.sv.marker).css('height'),10) / 2.0);

        $(c.sv.marker).css({
          'left': Math.round(hsv.sat * parseInt($(c.sv.box).css('width'),10)) - xAdj - 2 + 'px',
          'top': Math.round((1 - hsv.val) * parseInt($(c.sv.box).css('height'),10)) - yAdj - 2 + 'px'
        });

        // hue marker
        var xAdjHue = Math.round(parseInt($(c.hue.marker).css('height'),10) / 2);
        $(c.hue.marker).css('top', Math.round(((360 - hsv.hue) / 360.0) * parseInt($(c.hue.box).css('height'),10)) - yAdj + 'px');
        
        c.color.hue = hsv.hue;
        c.color.sat = hsv.sat;
        c.color.val = hsv.val;
                
        refreshSelectorColors(hsv.hue, hsv.sat, hsv.val);
        
        return true;
    }
    
    /*
      Summary:    Creates random values [0,255] for R,G,B to generate a new color
      Parameters:
      Returns:    An array of R,G,B values in [0,255]
    */
    function randomRGB() {
        return {r: Math.round(Math.random() * 255),
                g: Math.round(Math.random() * 255),
                b: Math.round(Math.random() * 255)}
    }

    /*
      Summary:    Calculates RGB from HSV
      Parameters: Hue: [0, 360), Saturation: [0,1], Value: [0,1]
      Returns:    An array [Red, Green, Blue]
      Note:       See http://en.wikipedia.org/wiki/HSL_and_HSV#From_HSL for
                  calculations.
    */
    function HSVtoRGB(hue, sat, val) {
        var h;  // h-prime
        var c;  // chroma
        var x;  // 2nd component of color
        var m;  // match lightness
        var rgb = {};
            
        h = hue / 60;
        c = val * sat;
        x = c * (1  - Math.abs(h % 2 - 1));
        m = val - c;
        
        if (0 <= h && h < 1) {
            rgb = [c, x, 0];
        } else if (1 <= h && h < 2) {
            rgb = [x, c, 0];
        } else if (2 <= h && h < 3) {
            rgb = [0, c, x];
        } else if (3 <= h && h < 4) {
            rgb = [0, x, c];
        } else if (4 <= h && h < 5) {
            rgb = [x, 0, c];
        } else if (5 <= h && h < 6) {
            rgb = [c, 0, x];
        } else {
            rgb = [0, 0, 0];
        }
        
        rgb = [rgb[0], rgb[1],rgb[2]];
        
        // round to nearest integer
        for (var i in rgb) {
            rgb[i] = Math.round(255 * (rgb[i] + m));
        };
                
        return rgb;
    }

    /*
      Summary:    Calculates HSV from RGB
      Parameters: Red, green, and blue: [0, 255]
      Returns:    A dictionary {hue, sat, val} for hue, saturation, and value in
                  [0, 360), [0,1], [0,1].
      Note:       See http://en.wikipedia.org/wiki/HSL_and_HSV for calculations.
    */    
    function RGBtoHSV(r,g,b) {
        
        // force values to [0, 255]
        var clean = function(n) {
            return Math.min(Math.max(n,0),255);
        }
        
        // convert to [0,1]        
        r = (r != 0 ? clean(r) / 255.0 : 0);
        g = (g != 0 ? clean(g) / 255.0 : 0);
        b = (b != 0 ? clean(b) / 255.0 : 0);
        
        var c, hPrime, h, v, s;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        c = max - min;
        
        // hue
        if (c == 0) {
            hPrime = max;
        } else if (max == r) {
            hPrime = (Math.abs(g - b) / c % 6);
        } else if (max == g) {
            hPrime = (Math.abs(b - r) / c + 2);
        } else if (max == b) {
            hPrime = (Math.abs(r - g) / c + 4);
        };
        
        h = hPrime * 60;
        
        // value
        v = max;
        
        // saturation
        if (c == 0) {
            s = 0;
        } else {
            s = c / v;
        }
        
        return {hue: h, sat: s, val: v};
    }
    
    /*
      Summary:    Extracts the RGB integers from a CSS RGB(x,y,z[,a]) tag
      Parameters: A CSS RGB string. Eg. "RGB(255,255,255,1)", "RGB(255,255,255)"
      Returns:    An array containing r, g, b, & a values (if 'a' is present)
    */
    function getRGBFromCSS(css) {
      var rgb = String(css).match(/(\d+)(\.)(\d+)|(\d+)/g);
      return rgb;
    }
        
    var methods = {
        init: function( args ) {

          // load CSS
          $('head').append('<link>');
          css = $('head').children(':last');
          css.attr({
            rel: 'stylesheet',
            type: 'text/css',
            href: c.cssFile
          });
          
          // load html
          $('body').append(c.html);
          $(c.name).hide();
          
          // process args
          if (args.show && typeof args.show == 'function') {
            methods.onShow = args.show;
          }
          
          if(args.change && typeof args.change == 'function') {
            methods.onColorChange = args.change;
          }
          
          if(args.close && typeof args.close == 'function') {
            methods.onClose = args.close;
          }
          
          // bind events
          // saturation/value and hue box events
          $(c.sv.box + ',' + c.hue.box).bind({
            mousedown: mouseDown,
            click: mouseMove
          });
          
          // main window events
          $(c.name).bind({
            click: function(e) {
              e.stopPropagation();
            },
            mousedown: mouseDown
          });
          
          // previous color reset
          $(c.color.old).bind({
            click: function(e) {
              var rgb = getRGBFromCSS($(this).css('background-color'));
              setSelectorColor(rgb[0], rgb[1], rgb[2]); 
            }
          });
          
          // OK/Select
          $(c.select.box).bind({
            click: function(e) {
              e.preventDefault();
              methods.hide();
            },
            mouseover: function(e) {
              e.preventDefault();
              $(this).addClass(c.select.hover);
            },
            mouseout: function(e) {
              e.preventDefault();
              $(this).removeClass(c.select.hover);
            }
          });
          
          // window
          $(window).bind({
            click: function(e) {
              methods.hide();
            },
            mouseup: function(e) {
              $(window).unbind('mousemove');
              clickObj.mousedown = false;
            }
          });
                    
          return this.each(function(){
            // bind mouse events to elements
            $(this).bind({
              click: function(e) {
                if (!$(c.name).hasClass('open')) {
                  c.currentEle = this;
                  e.stopPropagation();
                  methods.show();
                } else {
                  methods.hide();
                }
              }
            });
          });
        },
        
        getColor: function() {
          return c.rgbText;
        },
        
        setColor: function(cssColor) {
          var rgb = getRGBFromCSS(cssColor);
          setSelectorColor(rgb[0], rgb[1], rgb[2]);
          $(c.color.old).css('background-color', cssColor);
        },
        
        show: function() {
          methods.onShow.call(c.currentEle);
          
          // position center and fade in
          $(c.name).css('left', $(window).width() / 2 - $(c.name).width() / 2 + 'px');
          $(c.name).css('top', $(window).height() / 2 - $(c.name).height() / 2 + 'px');
          $(c.name).fadeIn('fast');
          $(c.name).addClass('open');
        },
        
        hide: function() {
          $(c.name).fadeOut('fast');
          $(c.name).removeClass('open');
          methods.onClose.call(c.currentEle);
        },
        
        update: function(rgbText) {
          c.rgbText = rgbText;
          methods.onColorChange.call(c.currentEle);
        },
        
        destroy: function() {
            return this.each(function(){
                $(window).unbind('.colormebad');
            })
        },
        
        onShow: function(args) {
        },
        
        onColorChange: function(args) {
        },
        
        onClose: function(args) {
        }
    };
    
    $.fn.colormebad = function( method ) {
      if ( methods[ method ] ) {
        return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
      } else if ( typeof method === 'object' || ! method ) {
        return methods.init.apply( this, arguments );
      } else {
        $.error( 'Method ' + method + ' does not exists on Jquery.colormebad' );
      };
      
      return true;
    };
})( jQuery );