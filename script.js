let pantalla = document.getElementById("pantalla");

function agregarNumero(numero){
    pantalla.value += numero;
}

function agregarOperacion(operador){
    pantalla.value += operador;
}

function limpiar(){
    pantalla.value = "";
}

function calcular(){
    try{
        pantalla.value = eval(pantalla.value);
    }catch{
        pantalla.value = "Error";
    }
}