import { print, askQuestion } from "./io.mjs"
import { debug, DEBUG_LEVELS } from "./debug.mjs";
import { ANSI } from "./ansi.mjs";
import DICTIONARY from "./language.mjs";



const MENU_ACTIONS = [
    makeMenuItem("Play Game (PvC)", function () { startGame(1);}),
    makeMenuItem("Play Game (PvP)", function () { startGame(2); }),
    makeMenuItem("Settings", showSettings), 
    makeMenuItem("Credits", showCredits),
    makeMenuItem("Quit", exitGame),
  ];
  
  const SETTINGS_MENU = [
    makeMenuItem("Change language", function () { print("Change language");}),
    makeMenuItem("Change font", function () { print("Change font");}),
    makeMenuItem("Sound settings", function () { print("Sound settings"); }),
    makeMenuItem("Return", function () { print("Return") }), 
  ];
  
  // The following 4 lines show the menu and make a simulated choice
  let currentMenu = MENU_ACTIONS; // Sett the current menu
  showMenu(currentMenu); // Display the menu
  let menuSelection = getMenuSelection(currentMenu); // simulate the player making a choice 
  currentMenu[menuSelection].action(); // This is where we INVOKE the menu action
  
  // Next three functions are the only three functions we need to support our multi-level menu system
  function makeMenuItem(description, action) {
    return { description, action };
  }
  
  function showMenu(menu) {
    // This function
    for (let i = 0; i < menu.length; i++) {
      print(i + 1 + ". " + menu[i].description); // +1 because we start counting at 0
    }
  }
  
  function getMenuSelection(menu) {
    // This function simulates getting a selection from the player.
    // We assume that this function when fully implemented would only return valid selections for the incoming menu.
    let selection = 3; // Example: Selecting the 3rd item
    return selection - 1; // -1 because we start counting at 0.
  }
  
  // ------- Following are just dummy functions for what the menu could have been doing -------
  
  function startGame(playerCount) {
    print("Player vs " + (playerCount == 1 ? "AI" : "Player"));
  }
  
  function showSettings() {
    currentMenu = SETTINGS_MENU;
    showMenu(currentMenu);
  }
  
  function showCredits() {
    print("Credits screen...");
  }
  
  function exitGame() {
    console.log("Exiting game...");
  }

  function print(text) {
    console.log(text);
}