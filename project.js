// 1. Despot some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. check if the user won
// 6. give the user their winnings
// 7. play again

const prompt = require("prompt-sync")();

// Define the number of rows and columns in the slot machine
const ROWS = 3;
const COLS = 3;

// Define the number of symbols of each type in the slot machine, and their corresponding values
const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

// Function to prompt the user to deposit money
const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a deposit amount: ");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Invalid deposit amount, try again.");
    } else {
      return numberDepositAmount;
    }
  }
};

// Function to prompt the user to select the number of lines to bet on
const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("Enter the number of lines to bet on (1-3): ");
    const numberOfLines = parseFloat(lines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log("Invalid number of lines, try again.");
    } else {
      return numberOfLines;
    }
  }
};

// Function to prompt the user to enter a bet amount
const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("Enter the bet per line: ");
    const numberBet = parseFloat(bet);

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
      console.log("Invalid bet, try again.");
    } else {
      return numberBet;
    }
  }
};

// Function to spin the slot machine and return an array of symbols for each reel
const spin = () => {
  // Create an array of symbols for the slot machine based on the SYMBOLS_COUNT object
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  // Create an array of arrays, where each inner array represents a reel
  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      // Select a random symbol from the array of symbols for each reel
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }

  return reels;
};

// Function to transpose the reels array so that each inner array represents a row
const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
};

// Function to print the rows of symbols in the console
const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

// Function to calculate the user's winnings based on the symbol values and the number of matching symbols on each line
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
  
    for (let row = 0; row < lines; row++) {
      const symbols = rows[row];
      let allSame = true;
  
      // Check if all symbols on the line are the same
      for (const symbol of symbols) {
        if (symbol != symbols[0]) {
          allSame = false;
          break;
        }
      }
  
      // If all symbols are the same, add the corresponding winnings to the total
      if (allSame) {
        winnings += bet * SYMBOL_VALUES[symbols[0]];
      }
    }
  
    return winnings;
  };
  
  // Function to run the game
  const game = () => {
    let balance = deposit();
  
    while (true) {
      console.log("You have a balance of $" + balance);
      const numberOfLines = getNumberOfLines();
      const bet = getBet(balance, numberOfLines);
  
      // Reduce the user's balance by the total bet amount
      balance -= bet * numberOfLines;
  
      const reels = spin();
      const rows = transpose(reels);
  
      // Print the rows of symbols in the console
      printRows(rows);
  
      // Calculate the user's winnings and add them to the balance
      const winnings = getWinnings(rows, bet, numberOfLines);
      balance += winnings;
      console.log("You won, $" + winnings.toString());
  
      // Check if the user has run out of money
      if (balance <= 0) {
        console.log("You ran out of money!");
        break;
      }
  
      // Prompt the user to play again
      const playAgain = prompt("Do you want to play again (y/n)? ");
  
      if (playAgain != "y") break;
    }
  };
  
  // Call the game function to start the game
  game();
  