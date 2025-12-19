// Calculator state
        let currentValue = '0';
        let previousValue = '';
        let operation = null;
        let resetScreen = false;

        // DOM elements
        const resultDisplay = document.getElementById('result');
        const calculationDisplay = document.getElementById('calculation');
        const numberButtons = document.querySelectorAll('.number');
        const operatorButtons = document.querySelectorAll('.operator');
        const equalsButton = document.querySelector('[data-action="equals"]');
        const clearButton = document.querySelector('[data-action="clear"]');
        const deleteButton = document.querySelector('[data-action="delete"]');
        const percentButton = document.querySelector('[data-action="percent"]');

        // Update display
        function updateDisplay() {
            resultDisplay.textContent = currentValue;
            calculationDisplay.textContent = previousValue + (operation ? ' ' + getOperationSymbol(operation) : '');
        }

        // Get operation symbol for display
        function getOperationSymbol(op) {
            switch(op) {
                case 'add': return '+';
                case 'subtract': return '−';
                case 'multiply': return '×';
                case 'divide': return '÷';
                default: return '';
            }
        }

        // Reset calculator
        function resetCalculator() {
            currentValue = '0';
            previousValue = '';
            operation = null;
            resetScreen = false;
            updateDisplay();
        }

        // Delete last character
        function deleteLast() {
            if (currentValue.length === 1 || (currentValue.length === 2 && currentValue.startsWith('-'))) {
                currentValue = '0';
            } else {
                currentValue = currentValue.slice(0, -1);
            }
            updateDisplay();
        }

        // Add decimal point
        function addDecimal() {
            if (resetScreen) {
                currentValue = '0.';
                resetScreen = false;
            } else if (!currentValue.includes('.')) {
                currentValue += '.';
            }
            updateDisplay();
        }

        // Handle number input
        function inputNumber(number) {
            if (resetScreen) {
                currentValue = number;
                resetScreen = false;
            } else {
                currentValue = currentValue === '0' ? number : currentValue + number;
            }
            updateDisplay();
        }

        // Handle operator input
        function inputOperator(op) {
            if (operation !== null && !resetScreen) {
                calculate();
            }
            
            previousValue = currentValue;
            operation = op;
            resetScreen = true;
            updateDisplay();
        }

        // Calculate percentage
        function calculatePercentage() {
            currentValue = (parseFloat(currentValue) / 100).toString();
            updateDisplay();
        }

        // Perform calculation
        function calculate() {
            if (operation === null || resetScreen) return;
            
            const prev = parseFloat(previousValue);
            const current = parseFloat(currentValue);
            let result;
            
            switch(operation) {
                case 'add':
                    result = prev + current;
                    break;
                case 'subtract':
                    result = prev - current;
                    break;
                case 'multiply':
                    result = prev * current;
                    break;
                case 'divide':
                    if (current === 0) {
                        result = 'Error';
                    } else {
                        result = prev / current;
                    }
                    break;
                default:
                    return;
            }
            
            // Format result to avoid floating point issues
            if (result !== 'Error') {
                result = Math.round(result * 100000000) / 100000000;
                result = result.toString();
            }
            
            currentValue = result;
            previousValue = '';
            operation = null;
            resetScreen = true;
            updateDisplay();
        }

        // Add event listeners to number buttons
        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                const number = button.getAttribute('data-number');
                if (number === '.') {
                    addDecimal();
                } else {
                    inputNumber(number);
                }
            });
        });

        // Add event listeners to operator buttons
        operatorButtons.forEach(button => {
            const action = button.getAttribute('data-action');
            
            button.addEventListener('click', () => {
                if (action === 'percent') {
                    calculatePercentage();
                } else {
                    inputOperator(action);
                }
            });
        });

        // Add event listeners to control buttons
        equalsButton.addEventListener('click', calculate);
        clearButton.addEventListener('click', resetCalculator);
        deleteButton.addEventListener('click', deleteLast);

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            const key = e.key;
            
            if (key >= '0' && key <= '9') {
                inputNumber(key);
            } else if (key === '.') {
                addDecimal();
            } else if (key === '+') {
                inputOperator('add');
            } else if (key === '-') {
                inputOperator('subtract');
            } else if (key === '*') {
                inputOperator('multiply');
            } else if (key === '/') {
                e.preventDefault();
                inputOperator('divide');
            } else if (key === 'Enter' || key === '=') {
                e.preventDefault();
                calculate();
            } else if (key === 'Escape' || key === 'Delete') {
                resetCalculator();
            } else if (key === 'Backspace') {
                deleteLast();
            } else if (key === '%') {
                calculatePercentage();
            }
        });

        // Initialize calculator
        updateDisplay();
        
        // Add subtle spring animation to calculator container
        document.querySelector('.calculator-container').style.animation = 'none';
        setTimeout(() => {
            document.querySelector('.calculator-container').style.animation = 'springAppear 0.8s ease-out';
        }, 100);
        
        // Add CSS animation for spring appearance
        const style = document.createElement('style');
        style.textContent = `
            @keyframes springAppear {
                0% { 
                    opacity: 0; 
                    transform: translateY(30px) scale(0.95); 
                }
                100% { 
                    opacity: 1; 
                    transform: translateY(0) scale(1); 
                }
            }
        `;
        document.head.appendChild(style);
