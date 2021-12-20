
let calc = (function () {
  document.addEventListener('DOMContentLoaded', init);
  //variable to store the text input for the dispaly
  let displayELem;
  const CHAR_LIMIT = 10; //maximum input is
  const MAX = 9999999999;

  //calculator object to keep track of the states
  let calculator_base = {
    isCurrentEntryFloat: false,
    isLastInputOperator: false,
    isCalculateReady: true,
    operator: '',
    currentValue: '',
    prevValue: '',
    clearEntry () {
      this.isCurrentEntryFloat = false;
      this.currentValue = '';
      this.prevValue = '';
      displayELem.value = '0';
    }
  };

  //map keys to button ids
  const keyMap = new Map([
    [13, 'equal'],
    [187, 'equal'],
    [107, 'add'],
    [106, 'multiply'],
    [109, 'subtract'],
    [189, 'subtract'],
    [111, 'divide'],
    [191, 'divide'],
    [27, 'clear-all'],
    [9, 'pos-neg'],
    [110, 'decimal'],
    [190, 'decimal'],
    [97, '1'],
    [98, '2'],
    [99, '3'],
    [100, '4'],
    [101, '5'],
    [102, '6'],
    [103, '7'],
    [104, '8'],
    [105, '9'],
    [96, '0'],
    [49, '1'],
    [50, '2'],
    [51, '3'],
    [52, '4'],
    [53, '5'],
    [54, '6'],
    [55, '7'],
    [56, '8'],
    [57, '9'],
    [48, '0'],
    [53, 'mod'],
    [187, 'add']
  ]);

  const KeyMapShift = new Map([
    [53, 'mod'],
    [187, 'add']
  ])

  let calculator = Object.create(calculator_base);

  function init () {
    //get the display.
    displayELem = document.getElementById('display');
    displayELem.value = 0;

    //get the number and operator buttons and add event listeners
    let numberBtns = document.getElementsByClassName('number');
    let operatorBtns = document.getElementsByClassName('operator');

    for (const btn of numberBtns) {
      btn.addEventListener('click', numberCallback);
    }

    for (const btn of operatorBtns) {
      btn.addEventListener('click', operatorCallback);
    }

    document.getElementById('equal').addEventListener('click', equal);
    document.getElementById('clear-all').addEventListener('click', clearAll);
    document.getElementById('clear-entry').addEventListener('click', calculator.clearEntry);
    document.getElementById('pos-neg').addEventListener('click', toggleSign);
    document.addEventListener('keydown', keydownCallback);
    document.addEventListener('keyup', keyupCallback);

  }
  //reset state
  function clearAll () {
    calculator = Object.create(calculator_base)
    if (this.id === 'clear-all') {
      displayELem.value = '0';
    }
  }

  function keydownCallback (evt) {
    console.log(evt.keyCode);
    // evt.preventDefault();
    if (keyMap.has(evt.keyCode)) {
      let button = document.getElementById(keyMap.get(evt.keyCode));
      button.click();
      button.classList.add('active');
      button.classList.add('focus');
    }
  }

  function keyupCallback (evt) {
    let button = document.getElementById(keyMap.get(evt.keyCode));
    if (button) {
      button.classList.remove('active');
      button.classList.remove('focus');
    }
  }

  //append to end of display element
  function numberCallback () {
    console.log('Entry: ' + this.id);
    calculator.isCalculateReady = true;

    //reset display to 0 if last input was an operator or display is not a number
    if (calculator.isLastInputOperator || isNaN(displayELem.value)) {
      calculator.isLastInputOperator = false;
      displayELem.value = '0';
    }

    if (displayELem.value.length >= CHAR_LIMIT) {
      console.log('maximum number of characters is: ' + CHAR_LIMIT);
      return;
    }

    calculator.currentValue = '';

    //ignore decimal button if the current entry is a float.
    if (this.id === 'decimal') {
      if (!calculator.isCurrentEntryFloat) {
        calculator.isCurrentEntryFloat = true;

      } else {
        return;
      }
    }

    //ignore repeating leading zeroes.
    if (displayELem.value === '0') {
      if (this.id === '0') {
        return;
      } else if (this.id !== 'decimal') {
        displayELem.value = this.textContent;
        return;
      }
    }

    displayELem.value = displayELem.value + this.textContent;
  }

  //toggle negative/positive sign
  function toggleSign () {
    if (isNaN(displayELem.value)) return;
    displayELem.value = (Number(displayELem.value)) * -1;
  }
  //helper for assigning value for current and prev value in calculator orbject
  function assignValue (target, input) {
    if (isNaN(input)) return;
    calculator[target] = Number(input);

  }

  //operator buttons callback
  //check the state of the calculator and apply the selected operation if requirements
  //meet
  function operatorCallback () {
    console.log('Operator: ' + this.id)
    if (isNaN(displayELem.value)) return;

    calculator.isCurrentEntryFloat = false;
    calculator.isCalculateReady = false;
    if (calculator.operator === '') {
      calculator.isLastInputOperator = true;
      calculator.operator = this.id;
      assignValue('prevValue', displayELem.value);
      return;
    }

    if (calculator.isLastInputOperator) {
      calculator.operator = this.id;
      return;
    }

    if (!isNaN(calculator.prevValue)) {
      assignValue('currentValue', displayELem.value);
      calculator.isLastInputOperator = true;
      calculate();
      calculator.operator = this.id;
    } else {
      assignValue('prevValue', displayELem.value);
    }
  }

  //function for equal sign, only trigger if isCalculateReady prob on calculator is true.
  function equal () {
    if (!calculator.isCalculateReady) return;
    calculator.isLastInputOperator = true;
    calculator.isCurrentEntryFloat = false;
    if (calculator.operator === '') {
      if (isNaN(displayELem.value)) return;
      assignValue('prevValue', displayELem.value);
      return;
    }
    if (isNaN(calculator.currentValue) || calculator.currentValue === '') {
      assignValue('currentValue', displayELem.value);
    }
    calculate();
  }

  //calculate answer base on operator currenValue and prevValue on Calculator
  function calculate () {
    let answer;
    let currentValue = Number(calculator.currentValue);
    let prevValue = Number(calculator.prevValue);
    switch (calculator.operator) {
      case 'mod':
        console.log(calculator.operator);
        if (currentValue === 0) {
          displayELem.value = 'NaN';
          clearAll();
          return;
        }
        answer = prevValue % currentValue;
        break;

      case 'add':
        console.log(calculator.operator);
        answer = currentValue + prevValue;
        break;

      case 'subtract':
        console.log(calculator.operator);
        answer = prevValue - currentValue;
        break;

      case 'divide':
        console.log(calculator.operator);
        if (currentValue === 0) {
          displayELem.value = 'INF';
          clearAll();
          return;
        }
        answer = prevValue / currentValue;
        break;

      case 'multiply':
        console.log(calculator.operator);
        answer = currentValue * prevValue;
        break;

      default:
        return;
    }

    if (Math.abs(answer) > MAX) {
      displayELem.value = answer > 0 ? 'MAX' : 'MIN';
      clearAll();
      return;
    }

    if (answer.toString().replace('-', '').length > 10) {
      answer = Number(answer.toString().substring(0, 10));
    }
    displayELem.value = answer;
    assignValue('prevValue', answer);
  }
})();