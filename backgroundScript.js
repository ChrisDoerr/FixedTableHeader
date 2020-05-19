
const FIXED_TABLE_HEADER_CONTEXT_MENU_ID  = "FIXED_TABLE_HEADER_MENU";
var fth_browserObj                        = ( "object" === typeof chrome ? chrome : browser );

function fixTableHeader( info, tab ) {
  
  // console.log( "ITEM WAS CLICKED" );
  
  // Send message to content script
  fth_browserObj.tabs.sendMessage(
    tab.id,
    {
      command : "fixTableHeader"
    },
    function( response ) {
      
      // console.log( response );

    }
  );
  
}

fth_browserObj.contextMenus.create({
  id        : FIXED_TABLE_HEADER_CONTEXT_MENU_ID,
  title     : "Fix Table Header",
  contexts  : [
    "page"
  ]
});
fth_browserObj.contextMenus.onClicked.addListener( fixTableHeader );
