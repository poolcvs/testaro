/*
  menuNav
  This test reports nonstandard keyboard navigation among menu items.
  Standards are based on https://www.w3.org/TR/wai-aria-practices-1.1/#menu.
  A prior version of this test covered all menus and, before operating on their menu items, set
  their display style property to revert, their visibility style properties to visible, their
  opacity style property to 1, the tabIndex style properties of the menu item to be operated on
  to 0, and the tabIndex style properties of the other menu items to -1.
*/

// ########## IMPORTS

// Module to get locator data.
const {getLocatorData} = require('../procs/getLocatorData');

// ########## FUNCTIONS

// Returns an adjacent index, with wrapping.
const wrap = (groupSize, startIndex, increment) => {
  let newIndex = startIndex + increment;
  if (newIndex < 0) {
    newIndex = groupSize - 1;
  }
  else if (newIndex > groupSize - 1) {
    newIndex = 0;
  }
  return newIndex;
};
// Returns the index of the menu item that is focused or pseudofocused.
const getFocus = async groupLoc => {
  const focus = await groupLoc.evaluateAll(elements => {
    const focEl = document.activeElement;
    console.log(`Active element: ${focEl ? focEl.tagName + '/' + focEl.id : 'NONE'}`);
    let focus = elements.indexOf(focEl);
    const focID = focEl.getAttribute('aria-activedescendant');
    if (focID) {
      console.log(`Effectively focused element ID: ${focID}`);
      const elIDs = elements.map(element => element.id);
      const pseudoFocus = elIDs.indexOf(focID);
      if (pseudoFocus) {
        focus = pseudoFocus;
      }
    }
    return focus;
  });
  return focus;
};
exports.reporter = async (page, withItems) => {
  // Initialize the result.
  const data = {};
  const totals = [0, 0, 0, 0];
  const standardInstances = [];
  // Get locators for all menu items.
  const locAll = page.locator('[role=menuitem]');
  const locsAll = await locAll.all();
  // Get data on the menu items.
  const elDataAll = [];
  for (const loc of locsAll) {
    const elData = await getLocatorData(loc);
    elDataAll.push(elData);
  }
  // Get the keys nonstandardly responded to by all menu items.
  const badKeyArrays = await locsAll.evaluate(menuItems => {
    // FUNCTION DEFINITION START
    // Returns whether a menu item standardly responds to a key.
    const test = async (key, menuItems, index, peerIndexes) => {
      // Get data on the menu item.
      const {menuItem, menu} = allData[index];
      const hasPopupVal = await menuItem.getAttribute('aria-haspopup');
      const hasPopup = ['menu', true].includes(hasPopupVal);
      const menuRole = await menu.getAttribute('role');
      let orientation = await menu.getAttribute('aria-orientation');
      if (! orientation) {
        orientation = menuRole === 'menubar' ? 'horizontal' : 'vertical';
      }
      // Focus the menu item and press the key.
      menuItem.focus();
      const keydown = new KeyboardEvent('keydown', {key});
      menuItem.dispatchEvent(keydown);
      const keyup = new KeyboardEvent('keyup', {key});
      menuItem.dispatchEvent(keyup);
      document.
      if (key === 'Home') {
        return 0;
      }
      else if (key === 'End') {
        return groupLocs.length - 1;
      }
      else if (key === 'Tab') {
        return -1;
      }
      else if (isHorizontal) {
        if (key === 'ArrowLeft') {
          return wrap(groupLocs.length, startIndex, -1);
        }
        else if (key === 'ArrowRight') {
          return wrap(groupLocs.length, startIndex, 1);
        }
        else if (['ArrowUp', 'ArrowDown'].includes(key)) {
          return hasPopup ? -1 : startIndex;
        }
        else {
          return startIndex;
        }
      }
      else {
        if (key === 'ArrowUp') {
          return wrap(groupLocs.length, startIndex, -1);
        }
        else if (key === 'ArrowDown') {
          return wrap(groupLocs.length, startIndex, 1);
        }
        else if (['ArrowLeft', 'ArrowRight'].includes(key)) {
          return hasPopup ? -1 : startIndex;
        }
        else {
          return startIndex;
        }
      }
    };
    // FUNCTION DEFINITION END
    // Initialize the result.
    const allData = [];
    // Get the menu that each menu item belongs to.
    menuItems.forEach(menuItem => {
      const menu = menuItem.closest('[role=menu], [role=menubar]');
      allData.push({
        menuItem,
        menu,
        badKeys: []
      });
    });
    // For each menu item:
    menuItems.forEach((menuItem, index) => {
      // Get its peers.
      const {menu} = allData[index];
      const peerIndexes = [];
      allData.forEach((menuItemData, index) => {
        if (menuItemData.menu === menu) {
          peerIndexes.push(index);
        }
      });
      // If it has at least 1 peer:
      if (peerIndexes.length > 1) {
        // For each navigation key:
        ['Home', 'End', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].forEach(key => {
          // Get whether it misbehaves.
          const isOK = test(key, allData, index, peerIndexes);
          if (! isOK) {
            allData[index].badKeys.push(key);
          }
        });
      }
    });
      let menuIndex = menus.indexOf(menu);
      if (menuIndex === -1) {
        menus.push(menu);
        menuIndex = menus.length - 1;
      }
      data = {menuIndex}
      ['Home', 'End', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].forEach(key => {

      })
    });
  });
  // For each of them:
  for (const menuLoc of menuLocsAll) {
    // Get its orientation.
    const menuRole = await menuLoc.getAttribute('role');
    let orientation = await menuLoc.getAttribute('aria-orientation');
    if (! orientation) {
      orientation = menuRole === 'menubar' ? 'horizontal' : 'vertical';
    }
    // Get locators for its direct menu items.
    const menuItemLocAll = menuLoc.locator(
      ':scope [role=menuitem]:not([role=menu] [role=menuitem]):not([role=menubar] [role=menuitem])'
    );
    const menuItemLocsAll = await menuItemLocAll.all();
    // If there are at least 2 of them:
    console.log(`Menu item count: ${menuItemLocsAll.length}`);
    if (menuItemLocsAll.length > 1) {
      // Get whether they respond nonstandardly to each navigation key.
      const 
      // For each of them:
      for (const index in menuItemLocsAll) {
        const indexNum = Number.parseInt(index);
        const loc = menuItemLocsAll[index];
        // Get data on the element.
        const elData = await getLocatorData(loc);
        console.log(elData.id);
        // For each navigation key:
        for (
          // const key of ['Home', 'End', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
          const key of ['ArrowLeft', 'ArrowRight']
        ) {
          // Isolate the move from previous moves by reloading the page.
          await page.goto(page.url());
          // Focus the menu item and press the key.
          await loc.press(key);
          // Get the index of the menu item expected to be focused.
          const okFocus = await getNewFocus(
            orientation === 'horizontal', menuItemLocsAll, indexNum, key
          );
          console.log(`Focus index should be ${okFocus}`);
          // Get the index of the menu item actually focused.
          const actualFocus = await getFocus(menuItemLocAll);
          console.log(`Actual focus index is ${actualFocus}`);
          // If they differ:
          if (actualFocus !== okFocus) {
            console.log('ERROR!');
            // Add to the totals.
            totals[0]++;
            // If itemization is required:
            if (withItems) {
              // Add an instance to the result.
              standardInstances.push({
                ruleID: 'menuNav',
                what: `Menu item responds nonstandardly to the ${key} key`,
                ordinalSeverity: 0,
                tagName: elData.tagName,
                id: elData.id,
                location: elData.location,
                excerpt: elData.excerpt
              });
            }
          }
        }
      }
    }
  }
  // If itemization is not required and there are any instances:
  if (! withItems && totals[0]) {
    // Add a summary instance to the result.
    standardInstances.push({
      ruleID: 'menuNav',
      what: 'Menu items respond nonstandardly to navigation keys',
      count: totals[0],
      ordinalSeverity: 0,
      tagName: '',
      id: '',
      location: {
        doc: '',
        type: '',
        spec: ''
      },
      excerpt: ''
    });
  }
  // Reload the page.
  try {
    await page.reload({timeout: 15000});
  }
  catch(error) {
    console.log('ERROR: page reload timed out');
  }
  return {
    data,
    totals,
    standardInstances
  };
};
