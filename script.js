const display = document.getElementById("display");
const history = document.getElementById("history");

let currentVal = "0";
let prevVal = "";
let operation = null;
let resetScreen = false;

/* CAMBIO DE TEMA */

function changeTheme(theme) {

document.body.className =
"theme-" +
theme +
" min-h-screen flex flex-col items-center justify-center p-4";

}

/* NUMEROS */

function num(n) {

if (currentVal === "0" || resetScreen) {

currentVal = n;
resetScreen = false;

} else {

if (n === "." && currentVal.includes(".")) return;

currentVal += n;

}

display.innerText = currentVal;

}

/* ACCIONES */

function action(op) {

if (op === "C") {

currentVal = "0";
prevVal = "";
operation = null;
history.innerText = "";

}

else if (op === "DEL") {

currentVal =
currentVal.length > 1
? currentVal.slice(0, -1)
: "0";

}

else {

if (operation) calculate();

prevVal = currentVal;
operation = op;

history.innerText = prevVal + " " + op;

resetScreen = true;

}

display.innerText = currentVal;

}

/* CALCULAR */

function calculate() {

if (!operation || resetScreen) return;

const p = parseFloat(prevVal);
const c = parseFloat(currentVal);

let result;

switch (operation) {

case "+":
result = p + c;
break;

case "-":
result = p - c;
break;

case "*":
result = p * c;
break;

case "/":
result = p / c;
break;

case "%":
result = p % c;
break;

}

history.innerText = `${p} ${operation} ${c} =`;

currentVal = result.toString();
operation = null;
resetScreen = true;

display.innerText = currentVal;

}
