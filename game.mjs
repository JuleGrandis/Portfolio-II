import { print, askQuestion } from "./io.mjs"
import { debug, DEBUG_LEVELS } from "./debug.mjs";
import { ANSI } from "./ansi.mjs";
import DICTIONARY from "./language.mjs";
import showColorizedSplashScreen from "./splash.mjs";

const GAME_BOARD_SIZE = 3;
const PLAYER_1 = 1;
const PLAYER_2 = -1;

// These are the valid choices for the menu.
const MENU_CHOICES = {
    MENU_CHOICE_START_GAME: 1,
    MENU_CHOICE_SHOW_SETTINGS: 2,
    MENU_CHOICE_EXIT_GAME: 3
};

const NO_CHOICE = -1;

const GAME_OUTPUT = {
    PLAYER_INPUT: "",


}

const MESSAGES = {
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
    PLAY_GAME_MSG: "1. Play Game",
    SETTINGS_MSG: "2. Settings",
    EXIT_GAME_MSG: "3. Exit Game",



}
let language = DICTIONARY.en;
let gameboard;
let currentPlayer;


clearScreen();
showColorizedSplashScreen();
setTimeout(start, 4800); // This waites 2.5seconds before calling the function. i.e. we get to see the splash screen for 2.5 seconds before the menue takes over. 



//#region game functions -----------------------------

async function start() {

    do {

        let chosenAction = NO_CHOICE;
        chosenAction = await showMenu();

        if (chosenAction == MENU_CHOICES.MENU_CHOICE_START_GAME) {
            await runGame();
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_SHOW_SETTINGS) {
            ///TODO: Needs implementing
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_EXIT_GAME) {
            clearScreen();
            process.exit();
        }

    } while (true)

}

async function runGame() {

    let isPlaying = true;

    while (isPlaying) { // Do the following until the player dos not want to play anymore. 
        initializeGame(); // Reset everything related to playing the game
        isPlaying = await playGame(); // run the actual game 
    }
}

async function showMenu() {

    let choice = -1;  // This variable tracks the choice the player has made. We set it to -1 initially because that is not a valid choice.
    let validChoice = false;    // This variable tells us if the choice the player has made is one of the valid choices. It is initially set to false because the player has made no choices.

    while (!validChoice) {
        // Display our menu to the player.
        clearScreen();
        print(ANSI.COLOR.YELLOW + MESSAGES.MENU_MSG + ANSI.RESET);
        print(MESSAGES.PLAY_GAME_MSG);
        print(MESSAGES.SETTINGS_MSG);
        print(MESSAGES.EXIT_GAME_MSG);

        // Wait for the choice.
        choice = await askQuestion(GAME_OUTPUT.PLAYER_INPUT);

        // Check to see if the choice is valid.
        if ([MENU_CHOICES.MENU_CHOICE_START_GAME, MENU_CHOICES.MENU_CHOICE_SHOW_SETTINGS, MENU_CHOICES.MENU_CHOICE_EXIT_GAME].includes(Number(choice))) {
            validChoice = true;
        }
    }

    return choice;
}

async function playGame() {
    // Play game..
    let outcome;
    do {
        clearScreen();
        showGameBoardWithCurrentState();
        showHUD();
        takenPosition.clear();
        let move = await getGameMoveFromtCurrentPlayer();
        updateGameBoardState(move);
        outcome = evaluateGameState();
        changeCurrentPlayer();
    } while (outcome == 0)

    showGameSummary(outcome);

    return await askWantToPlayAgain();
}

async function askWantToPlayAgain() {
    let answer = await askQuestion(language.PLAY_AGAIN_QUESTION);
    let playAgain = true;
    if (answer && answer.toLowerCase()[0] != language.CONFIRM) {
        playAgain = false;
    }
    return playAgain;
}

function showGameSummary(outcome) {
    clearScreen();
    if (outcome === -2) {
        showGameBoardWithCurrentState();
        print(ANSI.COLOR.BLUE + MESSAGES.DRAW_MSG);
        print(ANSI.RESET);
    } else {
    let winningPlayer = (outcome > 0) ? 1 : 2;
    print(ANSI.COLOR.GREEN + MESSAGES.WINNER_MSG + winningPlayer);
    print(ANSI.RESET);
    showGameBoardWithCurrentState();
    print(ANSI.COLOR.RED + MESSAGES.GAME_OVER_MSG);
    print(ANSI.RESET);
    }
}

function changeCurrentPlayer() {
    currentPlayer *= -1;
}

function evaluateGameState() {
    let sum = 0;
    let state = 0;
    let isDraw = true;

    for (let row = 0; row < GAME_BOARD_SIZE; row++) {
        for (let col = 0; col < GAME_BOARD_SIZE; col++) {
            sum += gameboard[row][col];
            if (gameboard[row][col] === 0) {
                isDraw = false;
            }
        }

        if (Math.abs(sum) == 3) {
            state = sum;
        }
        sum = 0;
    }

    for (let col = 0; col < GAME_BOARD_SIZE; col++) {
        for (let row = 0; row < GAME_BOARD_SIZE; row++) {
            sum += gameboard[row][col];
            if (gameboard[row][col] === 0) {
                isDraw = false;
            }
        }

      
        if (Math.abs(sum) == 3) {
            state = sum;
        }

        sum = 0;
    }

    for (let i = 0; i < GAME_BOARD_SIZE; i++) {
        sum += gameboard[i][i];
        if (gameboard[i][i] === 0) {
            isDraw = false;
        }
    }
         if (Math.abs(sum) == 3) {
            state = sum;
        }

        sum = 0;

    for (let i = 0; i < GAME_BOARD_SIZE; i++) {
        sum += gameboard[i][GAME_BOARD_SIZE - 1 - i];
        if (gameboard[i][GAME_BOARD_SIZE - 1 - i] === 0) {
            isDraw = false;
        }
    }
        if (Math.abs(sum) == 3) {
         state = sum;
        }

        if (isDraw && state === 0) {
            return -2;
        }

    let draw = -2;
    let winner = state / 3;
    return winner;
}

function updateGameBoardState(move) {
    const ROW_ID = 0;
    const COLUMN_ID = 1;
    gameboard[move[ROW_ID]][move[COLUMN_ID]] = currentPlayer;
}

async function getGameMoveFromtCurrentPlayer() {
    let position = null;
    do {
        let rawInput = await askQuestion(MESSAGES.PLACE_MARK);
        position = rawInput.split(" ");
    } while (isValidPositionOnBoard(position) == false)

    return position
}

let takenPosition = new Set();

function isValidPositionOnBoard(position) {

    if (position.length < 2) {
        // We where not given two numbers or more.
        print(ANSI.COLOR.YELLOW + MESSAGES.INPUT_TWO_VALUES);
        print(ANSI.RESET);
        return false;
    }
  

    let isValidInput = true;
    if (position[0] * 1 != position[0] && position[1] * 1 != position[1]) {
        // Not Numbers
        isValidInput = false;
        print(ANSI.COLOR.YELLOW + MESSAGES.INVALID_INPUT)
        print(ANSI.RESET);
    } else if (position[0] > GAME_BOARD_SIZE && position[1] > GAME_BOARD_SIZE) {
        // Not on board
        isValidInput = false;
        print(ANSI.COLOR.YELLOW + MESSAGES.NOT_ON_BOARD)
        print(ANSI.RESET);
    } else if (takenPosition.has(position.join(','))) {
        // Position taken.
        isValidInput = false;
        print(ANSI.COLOR.YELLOW + MESSAGES.POSITION_TAKEN)
        print(ANSI.RESET);
    }

    if (isValidInput) {
        takenPosition.add(position.join(','));
    }
    
    return isValidInput;
}

function showHUD() {
    let playerDescription = MESSAGES.PLAYER_1_MSG;
    if (PLAYER_2 == currentPlayer) {
        playerDescription = MESSAGES.PLAYER_2_MSG;
    }
    print(MESSAGES.PLAYER_MSG + playerDescription + MESSAGES.PLAYER_TURN);
}

function showGameBoardWithCurrentState() {
    for (let currentRow = 0; currentRow < GAME_BOARD_SIZE; currentRow++) {
        let rowOutput = "";
        for (let currentCol = 0; currentCol < GAME_BOARD_SIZE; currentCol++) {
            let cell = gameboard[currentRow][currentCol];
            if (cell == 0) {
                rowOutput += "_ ";
            }
            else if (cell > 0) {
                rowOutput += "X ";
            } else {
                rowOutput += "O  ";
            }
        }

        print(rowOutput);
    }
}

function initializeGame() {
    gameboard = createGameBoard();
    currentPlayer = PLAYER_1;
}

function createGameBoard() {

    let newBoard = new Array(GAME_BOARD_SIZE);

    for (let currentRow = 0; currentRow < GAME_BOARD_SIZE; currentRow++) {
        let row = new Array(GAME_BOARD_SIZE);
        for (let currentColumn = 0; currentColumn < GAME_BOARD_SIZE; currentColumn++) {
            row[currentColumn] = 0;
        }
        newBoard[currentRow] = row;
    }

    return newBoard;

}

function clearScreen() {
    print(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME, ANSI.RESET);
}


//#endregion