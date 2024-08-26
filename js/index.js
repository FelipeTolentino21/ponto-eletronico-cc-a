const diaSemana = document.getElementById("dia-semana");
const dataAtual = document.getElementById("data-atual");
const horaAtual = document.getElementById("hora-atual");
const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");

btnRegistrarPonto.addEventListener("click", registrar);

dataAtual.textContent = getCurrentDate();
diaSemana.textContent = getWeekDay();


function registrar(){
    alert("botao ponto!");
}

function updateContentHour(){
    horaAtual.textContent = getCurrentTime();
}

// Retorna a hora atual (hora:minuto:segundo)
function getCurrentTime(){
    const date = new Date();  
    return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0');
}

// Retorna a data atul (dd/mm/aaaa)
function getCurrentDate(){
    const date = new Date();

    let mes = date.getMonth() + 1;

    return String(date.getDate()).padStart(2, '0') + "/" + String(mes).padStart(2, '0') + "/" + date.getFullYear();
}

// Retorna o dia da semana (De domingo a sábado / 0 - 6)
function getWeekDay(){
    const date = new Date();

    const dia = date.getDay();
    const semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
    return semana[dia];
}

updateContentHour();
setInterval(updateContentHour, 1000);

console.log(getWeekDay());
console.log(getCurrentDate());
console.log(getCurrentTime());

// A fazer, atualizar a data e o dia da semana se o usuário bater o ponto meia noite
// A fazer 2, usar <dialog> para criar um popup quando se é clicado no botão "Registrar ponto" 