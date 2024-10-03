import { clearInterval } from "timers";
import { ANSI } from "./ansi.mjs";

const ART = `
  _______ _____ _____    _______       _  __  _______ ____  ______ 
 |__   __|_   _/ ____|  |__   __|/\\   | |/ / |__   __/ __ \\|  ____|
    | |    | || |          | |  /  \\  | ' /     | | | |  | | |__   
    | |    | || |          | | / /\\ \\ |  <      | | | |  | |  __|  
    | |   _| || |____      | |/ ____ \\| . \\     | | | |__| | |____ 
    |_|  |_____\\_____|     |_/_/    \\_\\_|\\_\\    |_|  \\____/|______|
                                                                  
                                                                  

`

const COLORS = [ANSI.COLOR.RED, ANSI.COLOR.BLUE, ANSI.COLOR.YELLOW];

function showColorizedSplashScreen() {
  const durationInSeconds = 4;
  const intervalDuration = 1000;
  
  let colorIndex = 0;
  let elapsedTime = 0;

  const intervalId = setInterval(() => {
    console.clear();
    console.log(ANSI.CLEAR_SCREEN);
    const colorCode = COLORS[colorIndex % COLORS.length];

    console.log(ANSI.BOLD, colorCode, ART,  ANSI.RESET);
    
    colorIndex++;
    elapsedTime += intervalDuration;

    if(elapsedTime >= durationInSeconds * 1000) {
      clearInterval(intervalId);
    } 
  }, intervalDuration);
}

export default showColorizedSplashScreen;

