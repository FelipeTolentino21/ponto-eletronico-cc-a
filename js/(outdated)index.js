// Obtém os elementos HTML referentes ao dia da semana, data, hora e botão de registrar ponto
const diaSemana = document.getElementById("dia-semana");
const dataAtual = document.getElementById("data-atual");
const horaAtual = document.getElementById("hora-atual");
const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");

// Adiciona um evento de clique no botão "Registrar Ponto", chamando a função "register"
btnRegistrarPonto.addEventListener("click", register);

// Atualiza o conteúdo de "dataAtual" e "diaSemana" com os valores retornados pelas funções "getCurrentDate" e "getWeekDay"
dataAtual.textContent = "Data: " + getCurrentDate();
diaSemana.textContent = getWeekDay();

// Obtém o elemento dialog do ponto
const dialogPonto = document.getElementById("dialog-ponto");

// Obtém o botão para fechar o dialog do ponto
const btnDialogFechar = document.getElementById("dialog-fechar");

// Adiciona um evento de clique no botão de fechar o dialog, fechando os dialogs "dialogPonto" e "pontoAnterior"
btnDialogFechar.addEventListener("click", () => {
    dialogPonto.close();
});

// Obtém os elementos de texto referentes à data e hora no dialog
const dialogData = document.getElementById("dialog-data");
const dialogHora = document.getElementById("dialog-hora");

// Atualiza os elementos "dialogData" e "dialogHora" com a data e hora atual
dialogData.textContent = getCurrentDate();
dialogHora.textContent = getCurrentTime();

// Obtém o elemento select que permite selecionar o tipo de registro (entrada, intervalo, etc.)
const selectRegisterType = document.getElementById("register-type");

// Define o tipo de registro com base no último registro feito pelo usuário
function setRegisterType() {
    let lastType = localStorage.setItem("lastRegisterType");
    
    // Define o próximo tipo de registro com base no último
    if(lastType == "entrada") {
        selectRegisterType.value = "intervalo";
    }
    if(lastType == "intervalo") {
        selectRegisterType.value = "volta-intervalo";
    }
    if(lastType == "volta-intervalo") {
        selectRegisterType.value = "saida";
    }
    if(lastType == "saida") {
        selectRegisterType.value = "entrada";
    }
    
    // Atualiza a hora no dialog
    dialogHora.textContent = "Hora: " + getCurrentTime();

    // Atualiza a hora no dialog a cada segundo
    let interval = setInterval(() => {
        dialogHora.textContent = "Hora: " + getCurrentTime();
    }, 1000);
}

// Função para abrir o dialog de registro de ponto
function register() {
    const dialogUltimoRegistro = document.getElementById("dialog-ultimo-registro");
    let lastRegister = JSON.parse(localStorage.getItem("lastRegister"));

    // Se houver um último registro, exibe suas informações
    if (lastRegister) {
        let lastDateRegister = lastRegister.date;
        let lastTimeRegister = lastRegister.time;
        let lastRegisterType = lastRegister.type;

        dialogUltimoRegistro.textContent = "Último registro: " + lastDateRegister + " às " + lastTimeRegister + " durante o registro " + lastRegisterType;
    }

    // Esconde o alerta de sucesso, caso esteja visível
    const alertaSucesso = document.getElementById("alerta-ponto-registrado");
    alertaSucesso.classList.remove("show");
    alertaSucesso.classList.add("hidden");

    clearTimeout();

    dialogPonto.showModal();
}

// Adiciona um evento ao botão de registrar no dialog para salvar o registro
btnDialogRegister = document.getElementById("btn-dialog-register");
btnDialogRegister.addEventListener("click", async () => {
    let register = await getObjetctRegister(selectRegisterType.value);

    // Salva o registro no localStorage
    saveRegisterLocalStorage(register);
    localStorage.setItem("lastRegister", JSON.stringify(register));

    // Mostra o alerta de sucesso por 5 segundos
    const alertaSucesso = document.getElementById("alerta-ponto-registrado");
    alertaSucesso.classList.remove("hidden");
    alertaSucesso.classList.add("show");

    setTimeout(() => {
        alertaSucesso.classList.remove("show");
        alertaSucesso.classList.add("hidden");
    }, 5000);

    // Fecha o dialog de registro de ponto
    dialogPonto.close();
});

// Função para obter a localização do usuário
function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            let userLocation = {
                "latitude": position.coords.latitude,
                "longitude": position.coords.longitude
            };
            resolve(userLocation);
        }, (error) => {
            reject("Erro " + error);
        });
    });
}

// Função para criar o objeto de registro com as informações necessárias
async function getObjetctRegister(registerType) {
    const location = await getUserLocation();

    // Cria o objeto com a data, hora, localização, id e tipo de registro
    let ponto = {
        "date": getCurrentDate(),
        "time": getCurrentTime(),
        "location": location,
        "id": 1,
        "type": registerType
    };

    return ponto;
}

// Obtém os registros do localStorage
let registerLocalStorage = getRegisterLocalStorage("register");

// Função para salvar o registro no localStorage
function saveRegisterLocalStorage(register) {
    registerLocalStorage.push(register);
    localStorage.setItem("register", JSON.stringify(registerLocalStorage));
}

// Função para obter os registros do localStorage a partir de uma chave específica
function getRegisterLocalStorage(key) {
    let register = localStorage.getItem(key);

    // Se não houver registros, retorna um array vazio
    if (!register) {
        return [];
    }
    return JSON.parse(register);
}

// Atualiza o conteúdo de "horaAtual" e "dialogHora" com a hora atual
function updateContentHour() {
    horaAtual.textContent = getCurrentTime();
    dialogHora.textContent = getCurrentTime();
}

// Retorna a hora atual no formato "hh:mm:ss"
function getCurrentTime() {
    const date = new Date();
    return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0');
}

// Retorna a data atual no formato "dd/mm/aaaa"
function getCurrentDate() {
    const date = new Date();
    let mes = date.getMonth() + 1;
    return String(date.getDate()).padStart(2, '0') + "/" + String(mes).padStart(2, '0') + "/" + date.getFullYear();
}

// Retorna o dia da semana como uma string (domingo a sábado)
function getWeekDay() {
    const date = new Date();
    const dia = date.getDay();
    const semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
    return semana[dia];
}

// Atualiza a hora no site instantaneamente
updateContentHour();

// Atualiza a hora a cada segundo
setInterval(updateContentHour, 1000);

// Obtém o dialog do ponto anterior e os botões para registrar e fechar
const pontoAnterior = document.getElementById("ponto-anterior");
const btnRegistrarAnterior = document.getElementById("btn-registrar-anterior");
const btnDialogFecharAnt = document.getElementById("dialog-fechar-anterior");

// Abre o dialog do ponto anterior ao clicar no botão
btnRegistrarAnterior.addEventListener("click", () => {
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
// ( ) A fazer 10, botar negrito os textos do código
// * ( ) A fazer 11, garantir que o usuário apenas registre entrada seguido de intervalo seguido de saída do intervalo seguido de saída
// * ( ) A fazer 12, após isso, juntar esses 4 tipos em um "relatório", que vai estar na página separada