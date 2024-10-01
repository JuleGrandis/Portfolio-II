const ANSI = {
    RESET: "\x1b[0m",
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    // ... other colors
  };
  
  function changeTextColor(text, newColor) {
    process.stdout.write("\x1b[0G"); // Move cursor to the beginning of the line
    process.stdout.write(newColor + text + ANSI.RESET);
  }
  
  // Example usage:
  let text = "Hello, world!";
  changeTextColor(text, ANSI.RED);
  // After a delay, change the color to green:
  setTimeout(() => {
    changeTextColor(text, ANSI.GREEN);
  }, 2000);