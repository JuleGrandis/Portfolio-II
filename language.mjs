import { ANSI } from "./ansi.mjs";

const DICTIONARY = {

    en: {
        PLAY_AGAIN_QUESTION: "Play again (YES/no)? ",
        CONFIRM: "y",
        POSITION_TAKEN: "This position is taken.",
        INVALID_INPUT: "This is an invalid input. Please input a numerical value",
        NOT_ON_BOARD: "This position is not on the board.",
        INPUT_TWO_VALUES: "Please input 2 numerical values.",
        PLACE_MARK: "Place your mark at: ",
        PLAYER_1_MSG: "One",
        PLAYER_2_MSG: "Two",
        WINNER_MSG: "Winner is player ",
        GAME_OVER_MSG: "GAME OVER",
        DRAW_MSG: "It's a Draw!",
        PLAYER_MSG: "Player ",
        PLAYER_TURN: " it is your turn",
        MENU_MSG: "MENU",
        PLAY_GAME_PVP_MSG: "1. Play Game (PvP)",
        PLAY_GAME_PVC_MSG: "1. Play Game (PvC)",
        SETTINGS_MSG: "2. Settings",
        EXIT_GAME_MSG: "3. Exit Game",
        PLAYER_VS_MSG: "Player vs",
        CREDITS_MSG: "Credits"
    },
    no: {
        PLAY_AGAIN_QUESTION: "Spille en gang til (Ja/nei)? ",
        CONFIRM: "j",
        POSITION_TAKEN: "Denne posisjonen er tatt.",
        INVALID_INPUT: "Ugyldig. Vennligst skriv inn en numerisk verdi",
        NOT_ON_BOARD: "Denne posisjonen er ikke på brettet",
        INPUT_TWO_VALUES: "Vennligst skriv inn to numeriske verdieer.",
        PLACE_MARK: "Plasser ditt merke på: ",
        PLAYER_1_MSG: "En",
        PLAYER_2_MSG: "To",
        WINNER_MSG: "Vinneren er spiller ",
        GAME_OVER_MSG: "GAME OVER",
        DRAW_MSG: "Det ble uavgjort!",
        PLAYER_MSG: "Spiller ",
        PLAYER_TURN: " det er din tur",
        MENU_MSG: "MENY",
        PLAY_GAME_PVP_MSG: "1. Spill Spillet (PVP)",
        PLAY_GAME_PVC_MSG: "1. Spill Spillet (PvC)",
        SETTINGS_MSG: "2. Innstillinger",
        EXIT_GAME_MSG: "3. Avslutt Spillet",
        PLAYER_VS_MSG: "Spiller vs",
        CREDITS_MSG: "Kreditter"
    }
}

let currentLanguage = "en";

function changeLanguage(newLanguage) {
    if (DICTIONARY.hasOwnProperty(newLanguage)) {
        currentLanguage = newLanguage;
    } else {
        print("Invalid Language: ", newLanguage);
    }
}

function getTranslation(key) {
    return DICTIONARY[currentLanguage][key];
}

function print(text) {
    console.log(text);
}

changeLanguage();
getTranslation();

export {DICTIONARY, changeLanguage, getTranslation};