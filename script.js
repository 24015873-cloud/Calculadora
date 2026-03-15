const display = document.getElementById('display')
const history = document.getElementById('history')

let currentVal = '0'
let prevVal = ''
let operation = null
let resetScreen = false

// CAMBIO DE TEMA
window.changeTheme = function(theme){
document.body.className =
'min-h-screen flex flex-col items-center justify-center p-4 theme-' + theme
}

// NUMEROS
window.num = function(n){

if(currentVal === '0' || resetScreen){

currentVal = n
resetScreen = false

}else{

if(n === '.' && currentVal.includes('.')) return
currentVal += n

}

display.innerText = currentVal

}

// ACCIONES
window.action = function(op){

if(op === 'C'){

currentVal = '0'
prevVal = ''
operation = null
history.innerText = ''

}

else if(op === 'DEL'){

currentVal =
currentVal.length > 1
? currentVal.slice(0,-1)
: '0'

}

else{

if(operation) calculate()

prevVal = currentVal
operation = op

history.innerText = prevVal + ' ' + op

resetScreen = true

}

display.innerText = currentVal

}

// CALCULAR
window.calculate = function(){

if(!operation || resetScreen) return

let result

const p = parseFloat(prevVal)
const c = parseFloat(currentVal)

switch(operation){

case '+': result = p + c; break
case '-': result = p - c; break
case '*': result = p * c; break
case '/': result = p / c; break
case '%': result = p % c; break

}

history.innerText = `${p} ${operation} ${c} =`

currentVal = result.toString()

operation = null
resetScreen = true

display.innerText = currentVal

}
