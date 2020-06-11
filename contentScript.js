
var FixedTableHeaderExtension   = {
    browser         : ( "object" === typeof chrome ? chrome : browser ),
    cssHasBeenAdded : false,
    target          : null,
    headerRow       : null,
    tr              : null,
    stickyPos       : 0
};

FixedTableHeaderExtension.addCSS = function() {

    let fth_style       = document.createElement("style");
  
    fth_style.type      = "text/css";
    fth_style.innerHTML = ".stickyTableHeader { position: fixed; top: 0; background-color: #EEE; } ";
    
    document.getElementsByTagName("head")[0].appendChild( fth_style );

    FixedTableHeaderExtension.cssHasBeenAdded = true;
    
};

FixedTableHeaderExtension.findParentTable = function( element ) {
  
    if( !( element instanceof window.Node ) ) {
      return false;
    }
    
    let tagName   = element.tagName.trim().toLowerCase();
    let isTable   = ( tagName === "table" );
    let firstRow  = null;
    
    // Walk the DOM -UP- to the closest <tabel> parent element.
    while( !isTable ) {
      
      element     = element.parentElement;
      
      // No parent element found
      if( null === element ) {
  
        return false;
  
      }
      
      tagName     = element.tagName.trim().toLowerCase();
  
      isTable     = ( tagName === "table" );
  
      // Stop walking when the <body> or even the <html> tag has been reached.
      if( tagName === "body" || tagName === "html" ) {
  
        return false;
  
      }
      
    }
    
    firstRow      = element.querySelector( "tr:first-child" );
    
    if( null === firstRow ) {
  
      return false;
  
    }
  
    return firstRow;
    
};

/**
 * Set the current element width (offsetWidth) "in stone"
 * by applying CSS style width with the same value.
 *  This way, even when the nominal width (offsetWidth) changes
 * the diplayed/rendered width still stays the same because of
 * the fix-valued CSS rule.
 * 
 * @param {NodeList} elements List of DOM elements of which the width should be set fix.
 */
FixedTableHeaderExtension.setWidthInStone = function( elements ) {

  if(
      "object" !== typeof elements ||
      !( elements instanceof window.NodeList )
  ) {
    return;
  }

  let i                       = 0;
  let dimElements             = element.length;

  for( i = 0; i < dimElements; i += 1 ) {

    elements[ i ].style.width = elements[ i ].offsetWidth + "px";

  }

};

FixedTableHeaderExtension.executeCommand  = function() {

    if( FixedTableHeaderExtension.target === null  ) {
        return;
    }

    // Only add the CSS <style> block once (per page)
    if( !FixedTableHeaderExtension.cssHasBeenAdded ) {
            FixedTableHeaderExtension.addCSS();
    }

    let firstRow                          = FixedTableHeaderExtension.findParentTable( FixedTableHeaderExtension.target );

    if( false === firstRow ) {
      return;
    }

    FixedTableHeaderExtension.tr          = firstRow;
    FixedTableHeaderExtension.stickyPos   = FixedTableHeaderExtension.tr.offsetTop;





    if( FixedTableHeaderExtension.target.tagName === "TH" ) {
    
        let p1                                  = FixedTableHeaderExtension.target.parentElement;
        let p2                                  = p1.parentElement.parentElement.querySelectorAll( "tbody tr:first-child td" );

        FixedTableHeaderExtension.headerRow     = p1;
        
        if( p1.tagName === "TR" ) {
    
            FixedTableHeaderExtension.tr          = p1;
            FixedTableHeaderExtension.stickyPos   = FixedTableHeaderExtension.tr.offsetTop;

            /***************/
            // Fix width of existing <th> elements
            let ths     = p1.querySelectorAll( "th" );
            let i       = 0;
            let dimThs  = ths.length;
      
            for( i = 0; i < dimThs; i++ ) {
        
              // console.log( ths[i].offsetWidth );
              ths[i].style.width = ths[i].offsetWidth + "px";
        
            }

            // and the tr element
            p1.style.width = p1.offsetWidth + "px";
      
            // the the first row of "normal" table entries
            let dimTds = p2.length;
      
            for( i = 0; i < dimTds; i++ ) {
        
              p2[i].style.width = p2[i].offsetWidth + "px";
        
            }
            /***************/
          
        }
        
    }

};

FixedTableHeaderExtension.checkTablePos = function() {
  
  if( FixedTableHeaderExtension.headerRow === null ) {
    return;
  }

  if( window.pageYOffset > FixedTableHeaderExtension.stickyPos ) {

    FixedTableHeaderExtension.headerRow.classList.add( "stickyTableHeader" );

  } else {
    
    FixedTableHeaderExtension.headerRow.classList.remove( "stickyTableHeader" );

  }
  
};

window.onscroll = function() {
  
  FixedTableHeaderExtension.checkTablePos();

};

  
document.addEventListener( "contextmenu", function( event ) {

    FixedTableHeaderExtension.target = event.target;

});

// https://developer.chrome.com/extensions/messaging
FixedTableHeaderExtension.browser.runtime.onMessage.addListener(
    function( request, sender, sendResponse ) {

        let response = {
            message : "Unknown command requested"
        };

        if( "string" === typeof request.command && request.command === "fixTableHeader" ) {

            FixedTableHeaderExtension.executeCommand();

            response.message = "Command has been executed";

        }

        sendResponse( response );

    }
);