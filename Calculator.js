const add = (num1, num2) => num1 + num2;
const subtract = (num1, num2) => num1 - num2;
const multiply = (num1, num2) => num1 * num2;
const divide = (num1, num2) => num1 / num2;
const percent = num => num / 100;  

const percentBtn = document.querySelector('#percent');
const numberBtns = document.querySelectorAll('.number');
const operatorBtns = document.querySelectorAll('.operator');
const clearBtn = document.querySelector('#clear');
const negateBtn = document.querySelector('#negate');
const backBtn = document.querySelector('#backspace');
const equalBtn = document.querySelector('#equal');
const display = document.querySelector('#display');

let operator = '';
let input = '0';
let value = 0;
let defaultEqualValue = null;
let chainOngoing = false;
let chainResultShowing = false;
let operatorHighlighted = false;
let equalResultShowing = true;

function operate(operatorName, num1, num2) {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);

    if (operatorName == 'divide' && num2 == 0) return 'ERROR';

    switch (operatorName) {
        case 'plus': return add(num1, num2);
        case 'subtract': return subtract(num1, num2);
        case 'multiply': return multiply(num1, num2);
        case 'divide': return divide(num1, num2);
    }
}

function shorten(num) {
    numStr = String(num);
    let numDecimals;

    var decimalIndex = numStr.indexOf('.');
    if (decimalIndex == -1) numDecimals = 0;
}

function addNumber(char) {
    checkOverflow();
    if (!(char == '.' && input.includes('.'))) {
        if (input === '-0') {
            input = '-' + char;
        } else if (equalResultShowing || input === '0') {
            value = 0;
            input = char;
        } else if (operatorHighlighted) {
            value = parseFloat(input); // start new input
            input = char;
            chainOngoing = true;
        } else {
            input += char;
        }
    display.textContent = input;
    operatorHighlighted = false;
    equalResultShowing = false;
    chainResultShowing = false;
    toggleSelection();
    
    }
}

function selectOperator(opChar) {
    if (chainOngoing) {
        value = operate(operator, value, input);
        input = String(value);
        display.textContent = input;
        chainOngoing = false;
        chainResultShowing = true;
    }

    equalResultShowing = false;
    operatorHighlighted = true;
    toggleSelection(operatorToEnable = opChar);
    operator = opChar;
}

function clear() {
    defaultEqualValue = 0;
    operator = '';
    chainOngoing = false;
    operatorHighlighted = false;
    equalResultShowing = true;
    input = '0';
    value = 0;
    display.textContent = '0';
    toggleSelection();
}

function toggleSelection(operatorToEnable=null) {
    let currentlySelectedOperator = document.querySelector('.selected');
    if (currentlySelectedOperator) {
        currentlySelectedOperator.classList.toggle('selected');
    }
    if (operatorToEnable) {
        let newlyEnabledOperator = document.querySelector(`#${operatorToEnable}`);
        newlyEnabledOperator.classList.toggle('selected');
    }
}

function negate() {
    if (operatorHighlighted && input) {
        value = parseFloat(input);
        input = '-0';
    } else if (input !== '0') {
        if (input[0] === '-') {
            input = input.slice(1);
        } else {
            input = '-' + input;
        }
    }
    display.textContent = input;
}

function backspace() {
    if (input == 'ERROR' || input =='infinity') {
        clear();
    } else if (!equalResultShowing && !chainResultShowing) {
        input = input.slice(0, -1);
    }
    if (input === '') input = '0';

    display.textContent = input;
}

function percentToWhole() {
    input = String(parseFloat(input) / 100);
    display.textContent = input;
    if (equalResultShowing) {
        value /= 100;
    }
}

function setEqual () {
    if (operator) {
        if (equalResultShowing) {
            value = operate(operator, value, defaultEqualValue);
        } else {
            value = operate(operator, value, parseFloat(input));
            defaultEqualValue = parseFloat(input);
        }

        input = String(value);
        display.textContent = input;
        operatorHighlighted = false;
        chainOngoing = false;
        chainResultShowing = false;
        equalResultShowing = true;
        toggleSelection();
    }
}

operatorBtns.forEach(btn => btn.classList.toggle('selected'));
numberBtns.forEach(btn => {btn.addEventListener('click', () => addNumber(btn.textContent))});
clearBtn.addEventListener('click', clear);
operatorBtns.forEach(btn => {btn.addEventListener('click', () => selectOperator(btn.id))});
negateBtn.addEventListener('click', negate);
backBtn.addEventListener('click', backspace);
percentBtn.addEventListener('click', percentToWhole);
equalBtn.addEventListener('click', setEqual);

document.onkeydown = function(e) {
    let keyPressed = e.key;
    console.log(keyPressed);
    switch(keyPressed) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '.':
            addNumber(keyPressed);
            break;
        case '=':
        case 'Enter':
            setEqual();
            break;
        case 'Backspace':
            if (equalResultShowing || chainResultShowing) {
                clear();
            } else {
                backspace();
            }
            break;
        case '*':
            selectOperator('multiply');
            break;
        case '/':
            selectOperator('divide');
            break;
        case '-':
            if (operatorHighlighted) {
                negate();
            } else {
                selectOperator('subtract');
            }
            break;
        case '+':
            selectOperator('plus');
            break;
        case '%':
            percentToWhole();
            break;
    }
}