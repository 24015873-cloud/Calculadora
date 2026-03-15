let current = "0"
let previous = ""
let operator = null

const currentDisplay = document.getElementById("current")
const previousDisplay = document.getElementById("previous")

function updateDisplay(){

currentDisplay.textContent = current

if(operator){
previousDisplay.textContent = previous + " " + operator
}else{
previousDisplay.textContent = ""
}

}

document.querySelectorAll(".number").forEach(btn=>{

btn.addEventListener("click",()=>{

if(btn.textContent === "." && current.includes(".")) return

if(current === "0" && btn.textContent !== "."){
current = btn.textContent
}else{
current += btn.textContent
}

updateDisplay()

})

})

document.querySelectorAll(".operator").forEach(btn=>{

btn.addEventListener("click",()=>{

if(operator !== null) compute()

operator = btn.dataset.op
previous = current
current = "0"

updateDisplay()

})

})

document.getElementById("equals").onclick=compute

function compute(){

const a = parseFloat(previous)
const b = parseFloat(current)

if(isNaN(a)||isNaN(b)) return

let result

switch(operator){

case "+": result=a+b; break
case "-": result=a-b; break
case "*": result=a*b; break
case "/": result=b===0?"Error":a/b; break
case "%": result=a*b/100; break

}

current = result.toString()
operator=null
previous=""

updateDisplay()

}

document.getElementById("clear").onclick=()=>{

current="0"
previous=""
operator=null
updateDisplay()

}

document.getElementById("delete").onclick=()=>{

current=current.slice(0,-1)||"0"
updateDisplay()

}

/* teclado */

window.addEventListener("keydown",e=>{

if(e.key>=0 && e.key<=9){

if(current==="0") current=e.key
else current+=e.key

updateDisplay()

}

if(e.key==="."){

if(!current.includes(".")){
current+="."
updateDisplay()
}

}

if(["+","-","*","/","%"].includes(e.key)){

operator=e.key
previous=current
current="0"
updateDisplay()

}

if(e.key==="Enter") compute()

if(e.key==="Backspace"){

current=current.slice(0,-1)||"0"
updateDisplay()

}

if(e.key==="Escape"){

current="0"
previous=""
operator=null
updateDisplay()

}

})
