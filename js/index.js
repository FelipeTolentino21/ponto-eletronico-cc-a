navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
});


// Constantes para definir os elementos 'de horário' e o botão de 'registrar o ponto'
const diaSemana = document.getElementById("dia-semana");
const dataAtual = document.getElementById("data-atual");
const horaAtual = document.getElementById("hora-atual");
const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");

// Ao clicar no "btnRegistrarPonto" a função "registrar" é chamada
btnRegistrarPonto.addEventListener("click", register);

// Atualização dos textos "dataAtual" e "diaSemana" chamando as funções "getCurrentDate" e "getWeekDay"
dataAtual.textContent = getCurrentDate();
diaSemana.textContent = getWeekDay();



// Constante definindo o dialog "dialog-ponto"
const dialogPonto = document.getElementById("dialog-ponto");

// Constante definindo o botão "dialog-fechar"
const btnDialogFechar = document.getElementById("dialog-fechar");

// Ao clicar no "btnDialogFechar" a função anônima fecha o "dialogPonto"
btnDialogFechar.addEventListener("click", () => {
    dialogPonto.close();
});

// Constantes para os texots "dialog-data" e "dialog-hora"
const dialogData = document.getElementById("dialog-data");
const dialogHora = document.getElementById("dialog-hora");

// "dialogData" e "dialogHora" chamando duas funções para receber a data e hora atual respectivamente
dialogData.textContent = getCurrentDate();
dialogHora.textContent = getCurrentTime();


const btnDialogEntrada = document.getElementById("btn-dialog-entrada");
const btnDialogSaida = document.getElementById("btn-dialog-saida");

btnDialogEntrada.addEventListener("click", dialogRegister);
btnDialogSaida.addEventListener("click", dialogRegister);

function dialogRegister(){
    console.log(getCurrentDate());
    console.log(getCurrentTime());
}



// Função registrar abre o "dialogPonto"
function register(){
    dialogPonto.showModal();
}
// Função que atualiza o texto "horaAtual" e "dialogHora" com o tempo que a função "getCurrentTime" retorna
function updateContentHour(){
    horaAtual.textContent = getCurrentTime();
    dialogHora.textContent = getCurrentTime();
}

// Função que retorna a hora atual (hora:minuto:segundo)
function getCurrentTime(){
    const date = new Date();  
    return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0');
}

// Função que retorna a data atul (dd/mm/aaaa)
function getCurrentDate(){
    const date = new Date();

    let mes = date.getMonth() + 1;

    return String(date.getDate()).padStart(2, '0') + "/" + String(mes).padStart(2, '0') + "/" + date.getFullYear();
}

// Função que retorna o dia da semana (De domingo a sábado / 0 - 6)
function getWeekDay(){
    const date = new Date();

    const dia = date.getDay();
    const semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
    return semana[dia];
}

// Chamada da função "updateContentHour" para atualizar instantânemante o horário no site
updateContentHour();

// Função que atuliza a função "updateContentHour" a cada 1000 milisegundos
setInterval(updateContentHour, 1000);


// Console logs para mostrar o dia da semana, a data atual e as horas no console
console.log(getWeekDay());
console.log(getCurrentDate());
console.log(getCurrentTime());



// A fazer, atualizar a data e o dia da semana se o usuário bater o ponto meia noite
// A fazer 2, usar <dialog> para criar um popup quando se é clicado no botão "Registrar ponto"
// A fazer 3, formatar a data dependendo do local onde o site é acessado

// btnDialogEntrada que recupera as informações (data, hora, localização [latitude, longitude], tipo: entrada) e salvar essas infos num objeto JavaScript