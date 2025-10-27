// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('.icon');

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    themeIcon.textContent = newTheme === 'light' ? '☀️' : '🌙';
    localStorage.setItem('theme', newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'light' ? '☀️' : '🌙';

// Tab Switching
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Calculator Logic
const displayMain = document.getElementById('displayMain');
const displayTop = document.getElementById('displayTop');
let currentInput = '0';
let expression = '';
let lastResult = null;

function updateDisplay() {
    displayMain.textContent = currentInput || '0';
    displayTop.textContent = expression;
}

function handleNumber(num) {
    if (currentInput === '0' || lastResult !== null) {
        currentInput = num;
        lastResult = null;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

function handleOperator(op) {
    if (currentInput) {
        expression += currentInput + ' ' + op + ' ';
        currentInput = '';
        lastResult = null;
    } else if (expression && !expression.endsWith(' ')) {
        expression += ' ' + op + ' ';
    }
    updateDisplay();
}

function handleDecimal() {
    if (!currentInput.includes('.')) {
        currentInput += currentInput ? '.' : '0.';
        updateDisplay();
    }
}

function handleBracket(bracket) {
    if (bracket === '(') {
        expression += '(';
        currentInput = '';
    } else {
        if (currentInput) {
            expression += currentInput;
            currentInput = '';
        }
        expression += ')';
    }
    updateDisplay();
}

function handlePower() {
    if (currentInput) {
        expression += currentInput + ' ^ ';
        currentInput = '';
    } else if (expression) {
        expression += ' ^ ';
    }
    updateDisplay();
}

function handleSquareRoot() {
    if (currentInput && currentInput !== '0') {
        const value = parseFloat(currentInput);
        if (value >= 0) {
            currentInput = Math.sqrt(value).toString();
            updateDisplay();
        }
    }
}

function handlePercentage() {
    if (currentInput && currentInput !== '0') {
        const value = parseFloat(currentInput);
        currentInput = (value / 100).toString();
        updateDisplay();
    }
}

function handleSquare() {
    if (currentInput && currentInput !== '0') {
        const value = parseFloat(currentInput);
        currentInput = (value * value).toString();
        updateDisplay();
    }
}

function handleInverse() {
    if (currentInput && currentInput !== '0') {
        const value = parseFloat(currentInput);
        if (value !== 0) {
            currentInput = (1 / value).toString();
            updateDisplay();
        }
    }
}

function negate() {
    if (currentInput !== '0') {
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateDisplay();
    }
}

function calculate() {
    try {
        let fullExpression = expression + currentInput;
        fullExpression = fullExpression.replace(/÷/g, '/');
        fullExpression = fullExpression.replace(/×/g, '*');
        fullExpression = fullExpression.replace(/−/g, '-');
        fullExpression = fullExpression.replace(/\^/g, '**');
        
        const result = eval(fullExpression);
        
        if (isFinite(result)) {
            displayTop.textContent = fullExpression + ' =';
            currentInput = result.toString();
            expression = '';
            lastResult = result;
            updateDisplay();
        } else {
            throw new Error('Invalid calculation');
        }
    } catch (error) {
        displayMain.textContent = 'Error';
        currentInput = '';
        expression = '';
    }
}

function clear() {
    currentInput = '0';
    expression = '';
    lastResult = null;
    updateDisplay();
}

function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Button Event Listeners
document.querySelectorAll('.btn.number').forEach(btn => {
    btn.addEventListener('click', () => {
        handleNumber(btn.dataset.num);
    });
});

document.querySelectorAll('.btn.operator').forEach(btn => {
    btn.addEventListener('click', () => {
        handleOperator(btn.dataset.op);
    });
});

document.getElementById('decimal').addEventListener('click', handleDecimal);
document.getElementById('clear').addEventListener('click', clear);
document.getElementById('ce').addEventListener('click', clearEntry);
document.getElementById('backspace').addEventListener('click', backspace);
document.getElementById('negate').addEventListener('click', negate);
document.getElementById('percent').addEventListener('click', handlePercentage);
document.getElementById('inverse').addEventListener('click', handleInverse);
document.getElementById('square').addEventListener('click', handleSquare);
document.getElementById('sqrt').addEventListener('click', handleSquareRoot);
document.getElementById('equals').addEventListener('click', calculate);

// Keyboard Support
document.addEventListener('keydown', (e) => {
    if (document.querySelector('.tab[data-tab="calc"]').classList.contains('active')) {
        if (e.key >= '0' && e.key <= '9') {
            handleNumber(e.key);
        } else if (e.key === '.') {
            handleDecimal();
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            handleOperator(e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key === '-' ? '−' : e.key);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            calculate();
        } else if (e.key === 'Escape') {
            clear();
        } else if (e.key === 'Backspace') {
            backspace();
        } else if (e.key === '%') {
            handlePercentage();
        }
    }
});

// Unit Converter Logic
const conversionData = {
    length: {
        units: ['Meter', 'Kilometer', 'Centimeter', 'Millimeter', 'Mile', 'Yard', 'Foot', 'Inch'],
        toBase: {
            'Meter': 1,
            'Kilometer': 1000,
            'Centimeter': 0.01,
            'Millimeter': 0.001,
            'Mile': 1609.34,
            'Yard': 0.9144,
            'Foot': 0.3048,
            'Inch': 0.0254
        }
    },
    weight: {
        units: ['Kilogram', 'Gram', 'Milligram', 'Ton', 'Pound', 'Ounce'],
        toBase: {
            'Kilogram': 1,
            'Gram': 0.001,
            'Milligram': 0.000001,
            'Ton': 1000,
            'Pound': 0.453592,
            'Ounce': 0.0283495
        }
    },
    volume: {
        units: ['Liter', 'Milliliter', 'Gallon', 'Quart', 'Pint', 'Cup', 'Fluid Ounce'],
        toBase: {
            'Liter': 1,
            'Milliliter': 0.001,
            'Gallon': 3.78541,
            'Quart': 0.946353,
            'Pint': 0.473176,
            'Cup': 0.236588,
            'Fluid Ounce': 0.0295735
        }
    },
    temperature: {
        units: ['Celsius', 'Fahrenheit', 'Kelvin'],
        convert: (value, from, to) => {
            let celsius;
            if (from === 'Celsius') celsius = value;
            else if (from === 'Fahrenheit') celsius = (value - 32) * 5/9;
            else celsius = value - 273.15;
            
            if (to === 'Celsius') return celsius;
            else if (to === 'Fahrenheit') return celsius * 9/5 + 32;
            else return celsius + 273.15;
        }
    },
    area: {
        units: ['Square Meter', 'Square Kilometer', 'Square Centimeter', 'Square Mile', 'Acre', 'Hectare', 'Square Foot', 'Square Inch'],
        toBase: {
            'Square Meter': 1,
            'Square Kilometer': 1000000,
            'Square Centimeter': 0.0001,
            'Square Mile': 2589988,
            'Acre': 4046.86,
            'Hectare': 10000,
            'Square Foot': 0.092903,
            'Square Inch': 0.00064516
        }
    },
    time: {
        units: ['Second', 'Minute', 'Hour', 'Day', 'Week', 'Month', 'Year'],
        toBase: {
            'Second': 1,
            'Minute': 60,
            'Hour': 3600,
            'Day': 86400,
            'Week': 604800,
            'Month': 2592000,
            'Year': 31536000
        }
    }
};

const conversionType = document.getElementById('conversionType');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const fromValue = document.getElementById('fromValue');
const toValue = document.getElementById('toValue');
const swapBtn = document.getElementById('swapBtn');

function populateUnits() {
    const type = conversionType.value;
    const units = conversionData[type].units;
    
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    units.forEach(unit => {
        fromUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
        toUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
    });
    
    if (units.length > 1) {
        toUnit.selectedIndex = 1;
    }
}

function convert() {
    const type = conversionType.value;
    const from = fromUnit.value;
    const to = toUnit.value;
    const value = parseFloat(fromValue.value) || 0;
    
    let result;
    
    if (type === 'temperature') {
        result = conversionData[type].convert(value, from, to);
    } else {
        const toBaseValue = value * conversionData[type].toBase[from];
        result = toBaseValue / conversionData[type].toBase[to];
    }
    
    toValue.value = result.toFixed(6).replace(/\.?0+$/, '');
}

conversionType.addEventListener('change', () => {
    populateUnits();
    convert();
});

fromUnit.addEventListener('change', convert);
toUnit.addEventListener('change', convert);
fromValue.addEventListener('input', convert);

swapBtn.addEventListener('click', () => {
    const tempUnit = fromUnit.value;
    const tempValue = fromValue.value;
    
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;
    fromValue.value = toValue.value;
    
    convert();
});

// Initialize converter
populateUnits();
updateDisplay();
