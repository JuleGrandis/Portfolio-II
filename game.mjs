import { print, askQuestion, clearScreen } from "./io.mjs"
import { debug, DEBUG_LEVELS } from "./debug.mjs";
import { ANSI } from "./ansi.mjs";
import DICTIONARY from "./language.mjs";
import showColorizedSplashScreen from "./splash.mjs";

const GAME_BOARD_SIZE = 3;
const PLAYER_1 = 1;
const PLAYER_2 = -1;

const MENU_CHOICES = {
    MENU_CHOICE_START_GAME_PVP: 1,
    MENU_CHOICE_START_GAME_PVC: 2,
    MENU_CHOICE_SHOW_SETTINGS: 3,
    MENU_CHOICE_EXIT_GAME: 4
};

const SETTINGS_CHOICES = {
    SETTINGS_NO_TEXT: 1,
    SETTINGS_EN_TEXT:2,
    SETTINGS_BACK: 3
}

const NO_CHOICE = -1;

let language = DICTIONARY.en;
let gameboard;
let currentPlayer;
let takenPosition = new Set();


clearScreen();
showColorizedSplashScreen();
setTimeout(start, 4800); 



//#region game functions -----------------------------

async function start() {
    let chosenAction = NO_CHOICE;
   
    do {
        chosenAction = await showMainMenu();

        if (chosenAction == MENU_CHOICES.MENU_CHOICE_START_GAME_PVP) {
            await runGame(MENU_CHOICES.MENU_CHOICE_START_GAME_PVP);
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_START_GAME_PVC){
            await runGame(MENU_CHOICES.MENU_CHOICE_START_GAME_PVC);
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_SHOW_SETTINGS) {
            await showSettings();
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_EXIT_GAME) {
            clearScreen();
            process.exit();
        }

    } while (true);

}

async function runGame(gameMode) {
    let isPlaying = true;

    while (isPlaying) {  
        initializeGame();
        
        isPlaying = await playGame(gameMode);
    }
}

async function showMainMenu() {
    let choice = -1;  
    let validChoice = false;    

    while (!validChoice) {
        clearScreen();
        print(ANSI.COLOR.YELLOW + language.MENU_MSG + ANSI.RESET);
        print(language.PLAY_GAME_PVP_MSG);
        print(language.PLAY_GAME_PVC_MSG);
        print(language.SETTINGS_MSG);
        print(language.EXIT_GAME_MSG);

        choice = await askQuestion("");

        if ([MENU_CHOICES.MENU_CHOICE_START_GAME_PVP, MENU_CHOICES.MENU_CHOICE_START_GAME_PVC, MENU_CHOICES.MENU_CHOICE_SHOW_SETTINGS, MENU_CHOICES.MENU_CHOICE_EXIT_GAME].includes(Number(choice))) {
            validChoice = true;
        }
    }

    return Number(choice);
}

async function showSettings() {
    let choice = -1;
    let validChoice = false;

    while(!validChoice) {
        clearScreen();
        print(ANSI.COLOR.YELLOW + language.SETTING_MENU_MSG + ANSI.RESET);
        print(language.SETTINGS_NO_TEXT);
        print(language.SETTINGS_EN_TEXT);
        print(language.SETTINGS_BACK);

        choice = await askQuestion("");

        if([SETTINGS_CHOICES.SETTINGS_NO_TEXT].includes(Number(choice))) {
            validChoice = true;
            language = DICTIONARY.no;
        } else if ([SETTINGS_CHOICES.SETTINGS_EN_TEXT].includes(Number(choice))){
            validChoice = true;
            language = DICTIONARY.en;
        } else if ([SETTINGS_CHOICES.SETTINGS_BACK].includes(Number(choice))) {}
            return;
        }
}

async function playGame(gameMode) {
    let outcome;

    const isPvp = gameMode === MENU_CHOICES.MENU_CHOICE_START_GAME_PVP;

    do {
        clearScreen();
        showGameBoardWithCurrentState();

        if (isPvp) {
            showHUD(true);
        } else {
            showHUD(false);
        }

        let move;
        if (isPvp || currentPlayer === PLAYER_1) {
            move = await getGameMoveFromCurrentPlayer();
        } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
            move = getCpuMove();
            print((move[0] + 1) + ", " + (move[1] + 1));
        }

        updateGameBoardState(move);
        outcome = evaluateGameState();
        changeCurrentPlayer();

    } while (outcome === 0);

    showGameSummary();

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
        print(ANSI.COLOR.BLUE + language.DRAW_MSG + ANSI.RESET);
    } else {
        let winningPlayer = (outcome > 0) ? 1 : 2;
        print(ANSI.COLOR.GREEN + language.WINNER_MSG + winningPlayer + ANSI.RESET);
        showGameBoardWithCurrentState();
        print(ANSI.COLOR.RED + language.GAME_OVER_MSG + ANSI.RESET);
    }
}

function changeCurrentPlayer() {
    currentPlayer *= -1;
}

function getCpuMove() {
    let availableMoves = [];

    for (let row = 0; row < GAME_BOARD_SIZE; row++) {
        for (let col = 0; col < GAME_BOARD_SIZE; col++) {
            if (gameboard[row][col] === 0) {
                availableMoves.push([row, col]);
            }
        }
    }

    let randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
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
    const [row, col] = move;
    gameboard[move[ROW_ID]][move[COLUMN_ID]] = currentPlayer;
}

async function getGameMoveFromCurrentPlayer() { 
    let positions = null;
    do {
        let rawInput = await askQuestion(language.PLACE_MARK);
        positions = rawInput.split(" ").filter(Boolean);
        positions[0]--;
        positions[1]--;
    } while (!isValidPositionOnBoard(positions))
    return positions;
}

function isValidPositionOnBoard(position) { 

    if (position.length < 2) {
        // We where not given two numbers or more.
        print(ANSI.COLOR.YELLOW + language.INPUT_TWO_VALUES + ANSI.RESET);
        return false;
    }

    let isValidInput = true;
    if (isNaN(position[0]) || isNaN(position[1])) {
        // Not Numbers
        isValidInput = false;
        print(ANSI.COLOR.YELLOW + language.INVALID_INPUT + ANSI.RESET)
    } else if (position[0] >= GAME_BOARD_SIZE || position[1] >= GAME_BOARD_SIZE) {
        // Not on board
        isValidInput = false;
        print(ANSI.COLOR.YELLOW + language.NOT_ON_BOARD + ANSI.RESET)
    } else if (takenPosition.has(position.join(','))) {
        // Position taken.
        isValidInput = false;
        print(ANSI.COLOR.YELLOW + language.POSITION_TAKEN + ANSI.RESET);
    }

    if (isValidInput) {
        takenPosition.add(position.join(','));
    }
    
    return isValidInput;
}

function showHUD(isPvp) {
    let playerDescription = language.PLAYER_1_MSG;

    if (PLAYER_2 == currentPlayer) {
        playerDescription = isPvp ? language.PLAYER_2_MSG : language.CPU_MOVE_MSG;
    }

    print(ANSI.BOLD + ANSI.COLOR.BLUE + language.PLAYER_MSG + playerDescription + language.PLAYER_TURN + ANSI.RESET);
}

function showGameBoardWithCurrentState() {
    let board = '';

    board += ANSI.BOLD + '    1   2   3\n';
    board += '  -------------\n' + ANSI.RESET;

    for (let currentRow = 0; currentRow < GAME_BOARD_SIZE; currentRow++) {
        let rowOutput = "";

        board += (currentRow + 1) + ' ';

        for (let currentCol = 0; currentCol < GAME_BOARD_SIZE; currentCol++) {
            let cell = gameboard[currentRow][currentCol];

            rowOutput += ANSI.BOLD + '| ' + ANSI.RESET;
            rowOutput += cell === 0 ? ANSI.BOLD + "_ " : cell > 0 ? ANSI.COLOR.RED + "X " + ANSI.RESET : ANSI.COLOR.GREEN + "O " + ANSI.RESET;
    }

        rowOutput += ANSI.BOLD + '| ';
        board += rowOutput + '\n';

        if (currentRow < GAME_BOARD_SIZE) {
        board += '  -------------\n' + ANSI.RESET;
        }
    }
    print(board);
}

function initializeGame() {
    gameboard = createGameBoard();
    currentPlayer = PLAYER_1;
    takenPosition.clear();
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

//#endregion