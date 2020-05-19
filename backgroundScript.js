
const FIXED_TABLE_HEADER = {
  menuId      : "FIXED_TABLE_HEADER_MENU_ID",
  browser     : ( "object" === typeof chrome ? chrome : browser ),
  sendCommand : function( info, tab ) {
  
    // Send message to content script
    FIXED_TABLE_HEADER.browser.tabs.sendMessage(
      tab.id,
      {
        command : "fixTableHeader"
      },
      function( response ) {
        // console.log( response );
      }
  );
  }
};

FIXED_TABLE_HEADER.browser.contextMenus.create({
  id        : FIXED_TABLE_HEADER.menuId,
  title     : "Fix Table Header",
  contexts  : [
    "page"
  ]
});

FIXED_TABLE_HEADER.browser.contextMenus.onClicked.addListener( FIXED_TABLE_HEADER.sendCommand );
