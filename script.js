const inputValue = document.getElementById("user-input");
const numberButtons = document.querySelectorAll(".numbers");
const operationButtons = document.querySelectorAll(".operations");
const clearButton = document.querySelector(".clear"); // The first C button
const equalsButton = document.querySelector(".calculate"); // The = button
const powerButton = document.querySelector(".power"); // The ON/OFF button

let currentInput = "";
let previousInput = "";
let operator = null;
let shouldResetDisplay = false;
let isCalculatorOn = false;

function updateCalculatorDisplay() {
  // If the number is too long, make it shorter
  if (currentInput.length > 12) {
    inputValue.textContent = currentInput.substring(0, 12) + "...";
    inputValue.style.fontSize = "2.5rem";
  } else {
    // Otherwise, show the full number
    inputValue.textContent = currentInput;
    inputValue.style.fontSize = "3.5rem";
  }
}

numberButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    if (isCalculatorOn === false) {
      return;
    }

    const clickedNumber = button.textContent;

    if (clickedNumber === ".") {
      // If we already have a decimal point, do nothing
      if (currentInput.includes(".")) {
        return;
      }

      if (shouldResetDisplay === true) {
        currentInput = "0.";
        shouldResetDisplay = false;
      }
      // If display shows just "0", change it to "0."
      else if (currentInput === "0") {
        currentInput = "0.";
      }
      // Otherwise, just add "." to the number
      else {
        currentInput = currentInput + ".";
      }

      updateCalculatorDisplay();
      return;
    }

    if (shouldResetDisplay === true || currentInput === "0") {
      // Start a new number
      currentInput = clickedNumber;
      shouldResetDisplay = false;
    } else {
      // Add to existing number (if not too long)
      if (currentInput.length < 12) {
        currentInput = currentInput + clickedNumber;
      }
    }
    updateCalculatorDisplay();
  });
});

// Loop through each operation button (C, %, √, ON/OFF, /, *, +, -, =)
operationButtons.forEach(function (button) {
  // When an operation button is clicked
  button.addEventListener("click", function () {
    // Get which operation was clicked
    const clickedOperation = button.textContent;

    // Handle the ON/OFF button specially (it always works)
    if (clickedOperation === "ON/OFF") {
      toggleCalculatorPower();
      return;
    }

    // If calculator is off, ignore all other buttons
    if (isCalculatorOn === false) {
      return;
    }

    // Handle the equals button (=)
    if (clickedOperation === "=") {
      performCalculation();
      return;
    }

    // Handle the clear button (C)
    if (clickedOperation === "C") {
      clearEverything();
      return;
    }

    // Handle square root (√)
    if (clickedOperation === "√") {
      calculateSquareRoot();
      return;
    }

    // Handle percentage (%)
    if (clickedOperation === "%") {
      calculatePercentage();
      return;
    }

    // Handle regular operations (+, -, *, /)
    // If we already had an operation waiting, calculate it first
    if (operator !== null) {
      performCalculation();
    }

    // Remember the first number and chosen operation
    previousInput = currentInput;
    operator = clickedOperation;
    shouldResetDisplay = true;
  });
});

function performCalculation() {
  // If no operation was chosen, do nothing
  if (operator === null || shouldResetDisplay === true) {
    return;
  }

  // Convert strings to numbers for calculating
  const firstNumber = parseFloat(previousInput);
  const secondNumber = parseFloat(currentInput);
  let calculationResult;

  // Check for division by zero
  if (operator === "/" && secondNumber === 0) {
    currentInput = "Error";
    updateCalculatorDisplay();
    resetCalculationVariables();
    return;
  }

  // Do the calculation based on which operation was chosen
  if (operator === "+") {
    calculationResult = firstNumber + secondNumber;
  } else if (operator === "-") {
    calculationResult = firstNumber - secondNumber;
  } else if (operator === "*") {
    calculationResult = firstNumber * secondNumber;
  } else if (operator === "/") {
    calculationResult = firstNumber / secondNumber;
  } else {
    return; // Not a valid operation
  }

  // Handle numbers with many decimal places
  const resultAsString = calculationResult.toString();
  if (resultAsString.includes(".") && resultAsString.split(".")[1].length > 8) {
    currentInput = calculationResult.toFixed(8).toString();
  } else {
    currentInput = resultAsString;
  }

  // Reset for next calculation
  resetCalculationVariables();
  updateCalculatorDisplay();
}

function calculateSquareRoot() {
  const number = parseFloat(currentInput);

  // Can't take square root of negative numbers
  if (number < 0) {
    currentInput = "Error";
  } else {
    currentInput = Math.sqrt(number).toString();
  }

  shouldResetDisplay = true;
  updateCalculatorDisplay();
}

function calculatePercentage() {
  const number = parseFloat(currentInput);
  currentInput = (number / 100).toString();
  shouldResetDisplay = true;
  updateCalculatorDisplay();
}

function resetCalculationVariables() {
  operator = null;
  previousInput = "";
  shouldResetDisplay = true;
}

function clearEverything() {
  currentInput = "0";
  previousInput = "";
  operator = null;
  shouldResetDisplay = false;
  updateCalculatorDisplay();
}

function toggleCalculatorPower() {
  isCalculatorOn = !isCalculatorOn;
  if (!isCalculatorOn) {
    currentInput = "";
    previousInput = "";
    operator = null;
    shouldResetDisplay = false;
  } else {
    currentInput = "0";
    shouldResetDisplay = false;
  }
  updateCalculatorDisplay();
}

// Initialize the display
updateCalculatorDisplay();
