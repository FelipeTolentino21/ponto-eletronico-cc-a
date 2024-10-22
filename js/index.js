// Constantes para definir os elementos 'de horário' e o botão de 'registrar o ponto'
const diaSemana = document.getElementById("dia-semana");
const dataAtual = document.getElementById("data-atual");
const horaAtual = document.getElementById("hora-atual");
const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");

// Ao clicar no "btnRegistrarPonto" a função "registrar" é chamada
btnRegistrarPonto.addEventListener("click", register);

// Atualização dos textos "dataAtual" e "diaSemana" chamando as funções "getCurrentDate" e "getWeekDay"
dataAtual.textContent = "Data: " + getCurrentDate();
diaSemana.textContent = getWeekDay();

// Constante definindo o dialog "dialog-ponto"
const dialogPonto = document.getElementById("dialog-ponto");

// Constante definindo o botão "dialog-fechar"
const btnDialogFechar = document.getElementById("dialog-fechar");

// Ao clicar no "btnDialogFechar" a função anônima fecha o "dialogPonto"
btnDialogFechar.addEventListener("click", () => {
    dialogPonto.close();
    pontoAnterior.close();
});

// Constantes para os texots "dialog-data" e "dialog-hora"
const dialogData = document.getElementById("dialog-data");
const dialogHora = document.getElementById("dialog-hora");

// "dialogData" e "dialogHora" chamando duas funções para receber a data e hora atual respectivamente
dialogData.textContent = getCurrentDate();
dialogHora.textContent = getCurrentTime();

/*
const btnDialogEntrada = document.getElementById("btn-dialog-entrada");
const btnDialogSaida = document.getElementById("btn-dialog-saida");

btnDialogEntrada.addEventListener("click", () => {
    saveRegisterLocalStorage(getObjetctRegister("entrada"));
});
btnDialogSaida.addEventListener("click", () => {
    saveRegisterLocalStorage(getObjetctRegister("saida"));
});
*/


// Apresentar para o usuário o valor correspondente ao provável tipo de ponto
// EX. se o último ponto do usuário for do tipo entrada, selecionar por padrão a option intervalo
const selectRegisterType = document.getElementById("register-type");

function setRegisterType(){
    let lastType = localStorage.setItem("lastRegisterType");
    if(lastType == "entrada") {
        selectRegisterType.value = "intervalo";
    }
    if(lastType == "intervalo") {
        selectRegisterType.value = "volta-intervalo"
    }
    if(lastType == "volta-intervalo") {
        selectRegisterType.value = "saida"
    }
    if(lastType == "saida") {
        selectRegisterType.value = "entrada"
    }

    dialogHora.textContent = "Hora: " + getCurrentTime();

    let interval = setInterval(() => {
        dialogHora.textContent = "Hora: " + getCurrentTime();
    }, 1000);

}

// Função registrar abre o "dialogPonto"
function register(){
    
    const dialogUltimoRegistro = document.getElementById("dialog-ultimo-registro");
    let lastRegister = JSON.parse(localStorage.getItem("lastRegister"));

    if (lastRegister){
        let lastDateRegister = lastRegister.date;
        let lastTimeRegister = lastRegister.time;
        let lastRegisterType = lastRegister.type;

        dialogUltimoRegistro.textContent = "Último registro: " + lastDateRegister + " às " + lastTimeRegister + " durante o registro " + lastRegisterType;
    }

    const alertaSucesso = document.getElementById("alerta-ponto-registrado");
    alertaSucesso.classList.remove("show");
    alertaSucesso.classList.add("hidden");

    clearTimeout();

    dialogPonto.showModal();
}

btnDialogRegister = document.getElementById("btn-dialog-register");
btnDialogRegister.addEventListener("click", async ()=>{

    let register = await getObjetctRegister(selectRegisterType.value);
    saveRegisterLocalStorage(register);

    localStorage.setItem("lastRegister", JSON.stringify(register))

    const alertaSucesso = document.getElementById("alerta-ponto-registrado");
    alertaSucesso.classList.remove("hidden");
    alertaSucesso.classList.add("show");

    setTimeout(() => {
        alertaSucesso.classList.remove("show");
        alertaSucesso.classList.add("hidden");
    }, 5000);

    dialogPonto.close();
})


function getUserLocation(){
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            let userLocation = {
                "latitude": position.coords.latitude,
                "longitude": position.coords.longitude
            }
            resolve(userLocation);
        }, 
        (error) => {
            reject("Erro " + error);
        });
    });
}

/*
function getUserLocation(){
    navigator.geolocation.getCurrentPosition((position) => {
        let userLocation = {
            "lat": position.coords.latitude,
            "long": position.coords.longitude
        }
        return userLocation;
    });
}
*/

async function getObjetctRegister(registerType){

    const location = await getUserLocation();

    console.log(location);

    ponto = {
        "date": getCurrentDate(),
        "time": getCurrentTime(),
        "location": location,
        "id": 1,
        "type": registerType
    }

    return ponto;
}

let registerLocalStorage = getRegisterLocalStorage("register");

function saveRegisterLocalStorage(register){
    registerLocalStorage.push(register);

    localStorage.setItem("register", JSON.stringify(registerLocalStorage));
}

function getRegisterLocalStorage(key){
    let register = localStorage.getItem(key);

    if(!register) {
        return [];
    }
    return JSON.parse(register);
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

const pontoAnterior = document.getElementById("ponto-anterior");

const btnRegistrarAnterior = document.getElementById("btn-registrar-anterior");

const btnDialogFecharAnt = document.getElementById("dialog-fechar-anterior");

btnRegistrarAnterior.addEventListener("click",() =>{
    pontoAnterior.showModal();
});

btnDialogFecharAnt.addEventListener("click", ()=>{
    pontoAnterior.close();
})

// ( ) A fazer, atualizar a data e o dia da semana se o usuário bater o ponto meia noite
// (X) A fazer 2, usar <dialog> para criar um popup quando se é clicado no botão "Registrar ponto"
// ( ) A fazer 3, formatar a data dependendo do local onde o site é acessado
// (X) A fazer 4, btnDialogEntrada que recupera as informações (data, hora, localização [latitude, longitude], tipo: entrada) e salvar essas infos num objeto JavaScript
// (X) A fazer 5, arrumar a localização que aparece, atualmente, no local storage de forma assíncrona
// (X) A fazer 6, mostrar ao usuário, no dialog, quando foi seu último "input"
// ( ) A fazer 7, organizar o código
// ( ) A fazer 8, corrigir bug quando o ponto é registrado com sucesso
// ( ) A fazer 9, adicionar um caso de erro para se o usuário tentar registrar ponto sem a localização