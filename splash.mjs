import { clearInterval } from "timers";
import { ANSI } from "./ansi.mjs";

const ART = `
 ______  ____   __      ______   ____    __      ______   ___     ___
|      ||    | /  ]    |      | /    |  /  ]    |      | /   \\   /  _]
|      | |  | /  /     |      ||  o  | /  /     |      ||     | /  [_
|_|  |_| |  |/  /      |_|  |_||     |/  /      |_|  |_||  O  ||    _]
  |  |   |  /   \\_       |  |  |  _  /   \\_       |  |  |     ||   [_
  |  |   |  \\     |      |  |  |  |  \\     |      |  |  |     ||     |
  |__|  |____\\____|      |__|  |__|__|\\____|      |__|   \\___/ |_____|

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

    console.log(colorCode, ART,  ANSI.RESET);
    
    colorIndex++;
    elapsedTime += intervalDuration;

    if(elapsedTime >= durationInSeconds * 1000) {
      clearInterval(intervalId);
    } 
  }, intervalDuration);
}
showColorizedSplashScreen();
export default showColorizedSplashScreen;

