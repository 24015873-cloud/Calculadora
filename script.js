class Calculator {
    constructor(previousDisplay, currentDisplay) {
        this.previousDisplay = previousDisplay;
        this.currentDisplay = currentDisplay;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1) || '0';
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;

        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand =
                this.currentOperand.toString() + number.toString();
        }

        this.updateDisplay();
    }

    appendOperator(operator) {
        if (this.currentOperand === '') return;

        if (this.previousOperand !== '') {
            this.compute();
        }

        this.operation = operator;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';

        this.updateDisplay();
    }

    compute() {
        let computation;

        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;

            case '-':
                computation = prev - current;
                break;

            case '*':
                computation = prev * current;
                break;

            case '/':
                if (current === 0) {
                    this.showError("Error");
                    return;
                }
                computation = prev / current;
                break;

            case '%':
                computation = (prev * current) / 100;
                break;

            default:
                return;
        }

        this.currentOperand = parseFloat(computation.toFixed(8)).toString();
        this.operation = undefined;
        this.previousOperand = '';

        this.updateDisplay();
    }

    showError(msg) {
        this.currentOperand = msg;
        this.updateDisplay();

        setTimeout(() => this.clear(), 1500);
    }

    updateDisplay() {
        this.currentDisplay.innerText = this.currentOperand;

        if (this.operation != null) {
            this.previousDisplay.innerText =
                `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousDisplay.innerText = '';
        }
    }
}

/* Inicializar calculadora */

const previousDisplay = document.getElementById('previous-display');
const currentDisplay = document.getElementById('current-display');

const calculator = new Calculator(previousDisplay, currentDisplay);

/* Botones numéricos */

document.querySelectorAll('.num-btn').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
    });
});

/* Botones funcionales */

document.getElementById('btn-ac').addEventListener('click', () => {
    calculator.clear();
});

document.getElementById('btn-del').addEventListener('click', () => {
    calculator.delete();
});

document.getElementById('btn-equal').addEventListener('click', () => {
    calculator.compute();
});

document.getElementById('btn-add').addEventListener('click', () => {
    calculator.appendOperator('+');
});

document.getElementById('btn-sub').addEventListener('click', () => {
    calculator.appendOperator('-');
});

document.getElementById('btn-mul').addEventListener('click', () => {
    calculator.appendOperator('*');
});

document.getElementById('btn-div').addEventListener('click', () => {
    calculator.appendOperator('/');
});

document.getElementById('btn-mod').addEventListener('click', () => {
    calculator.appendOperator('%');
});

/* Teclado físico */

window.addEventListener('keydown', e => {

    if (e.key >= 0 && e.key <= 9) {
        calculator.appendNumber(e.key);
    }

    if (e.key === '.') {
        calculator.appendNumber('.');
    }

    if (e.key === 'Enter') {
        calculator.compute();
    }

    if (e.key === 'Backspace') {
        calculator.delete();
    }

    if (e.key === 'Escape') {
        calculator.clear();
    }

});
