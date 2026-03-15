const apiKey = ""; // La API Key se inyecta automáticamente en el entorno

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
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }

    appendOperator(operator) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') this.compute();
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
            case '+': computation = prev + current; break;
            case '-': computation = prev - current; break;
            case '*': computation = prev * current; break;
            case '/': 
                if (current === 0) { this.showError("Error"); return; }
                computation = prev / current; 
                break;
            case '%': computation = (prev * current) / 100; break;
            default: return;
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
        this.previousDisplay.innerText = this.operation ? `${this.previousOperand} ${this.operation}` : '';
    }
}

// Inicializar calculadora
const previousDisplay = document.getElementById('previous-display');
const currentDisplay = document.getElementById('current-display');
const calculator = new Calculator(previousDisplay, currentDisplay);

// Asignar eventos a botones numéricos y operadores
document.querySelectorAll('.num-btn').forEach(button => {
    button.addEventListener('click', () => calculator.appendNumber(button.innerText));
});

document.getElementById('btn-ac').addEventListener('click', () => calculator.clear());
document.getElementById('btn-del').addEventListener('click', () => calculator.delete());
document.getElementById('btn-equal').addEventListener('click', () => calculator.compute());

document.getElementById('btn-add').addEventListener('click', () => calculator.appendOperator('+'));
document.getElementById('btn-sub').addEventListener('click', () => calculator.appendOperator('-'));
document.getElementById('btn-mul').addEventListener('click', () => calculator.appendOperator('*'));
document.getElementById('btn-div').addEventListener('click', () => calculator.appendOperator('/'));
document.getElementById('btn-mod').addEventListener('click', () => calculator.appendOperator('%'));

/* --- LÓGICA DE IA GEMINI --- */

async function askGemini() {
    const input = document.getElementById('ai-input').value.trim();
    const output = document.getElementById('ai-output');
    const loader = document.getElementById('ai-loader');
    const btn = document.getElementById('ai-submit');

    if (!input) return;

    loader.style.display = 'block';
    btn.disabled = true;
    output.innerHTML = "Pensando...";

    const systemPrompt = "Eres un asistente matemático. Resuelve el problema. Al final, escribe 'RESULTADO: [valor]'.";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: input }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            })
        });

        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        output.innerHTML = resultText.replace(/\n/g, '<br>');

        // Sincronizar con la calculadora si hay un resultado numérico
        const match = resultText.match(/RESULTADO:\s*([\d.,]+)/i);
        if (match && match[1]) {
            calculator.currentOperand = match[1].replace(',', '');
            calculator.updateDisplay();
        }
    } catch (error) {
        output.innerHTML = "Hubo un error con la IA. Intenta de nuevo.";
    } finally {
        loader.style.display = 'none';
        btn.disabled = false;
    }
}

document.getElementById('ai-submit').addEventListener('click', askGemini);

// Teclado físico
window.addEventListener('keydown', e => {
    if (document.activeElement.tagName === 'TEXTAREA') return;
    if (e.key >= 0 && e.key <= 9) calculator.appendNumber(e.key);
    if (e.key === '.') calculator.appendNumber('.');
    if (e.key === 'Enter') calculator.compute();
    if (e.key === 'Backspace') calculator.delete();
    if (e.key === 'Escape') calculator.clear();
});