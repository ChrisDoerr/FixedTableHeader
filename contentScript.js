
var FixedTableHeaderExtension   = {
    cssHasBeenAdded : false,
    target          : null,
    headerRow       : null,
    tr              : null,
    stickyPos       : 0
};

var fth_browserObj              = ( "object" === typeof chrome ? chrome : browser );


FixedTableHeaderExtension.addCSS = function() {

    let fth_style       = document.createElement("style");
  
    fth_style.type      = "text/css";
    fth_style.innerHTML = ".stickyTableHeader { position: fixed; top: 0; background-color: #EEE; } ";
  
    document.getElementsByTagName("head")[0].appendChild( fth_style );

    FixedTableHeaderExtension.cssHasBeenAdded = true;
    
};

FixedTableHeaderExtension.executeCommand  = function() {

    if( FixedTableHeaderExtension.target === null  ) {
        return;
    }

    if( !FixedTableHeaderExtension.cssHasBeenAdded ) {
            FixedTableHeaderExtension.addCSS();
    }

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
  
}

window.onscroll = function() {
  
  FixedTableHeaderExtension.checkTablePos();

};

  
document.addEventListener( "contextmenu", function( event ) {

    FixedTableHeaderExtension.target = event.target;

});

// https://developer.chrome.com/extensions/messaging
fth_browserObj.runtime.onMessage.addListener(
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