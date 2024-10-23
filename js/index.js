// *** Elementos HTML relacionados ao cabeçalho de data e hora ***

const diaSemana = document.getElementById("dia-semana");  // Exibe o dia da semana no cabeçalho
const dataAtual = document.getElementById("data-atual");  // Exibe a data atual no cabeçalho
const horaAtual = document.getElementById("hora-atual");  // Exibe a hora atual no cabeçalho

// *** Elementos HTML relacionados ao dialog de registro de ponto ***

const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");  // Botão que abre o dialog de registro
const dialogPonto = document.getElementById("dialog-ponto");  // Dialog para registrar ponto
const dialogData = document.getElementById("dialog-data");  // Exibe a data atual no dialog
const dialogHora = document.getElementById("dialog-hora");  // Exibe a hora atual no dialog
const selectRegisterType = document.getElementById("register-type");  // Seleciona o tipo de registro
const btnDialogRegister = document.getElementById("btn-dialog-register");  // Botão para confirmar o registro no dialog
const alertaSucesso = document.getElementById("alerta-ponto-registrado");  // Alerta de sucesso após registrar ponto
const dialogUltimoRegistro = document.getElementById("dialog-ultimo-registro");  // Exibe o último registro no dialog

// *** Elementos HTML relacionados ao dialog de registro anterior ***

const pontoAnterior = document.getElementById("ponto-anterior");  // Dialog para exibir o ponto anterior
const btnRegistrarAnterior = document.getElementById("btn-registrar-anterior");  // Botão que abre o dialog de ponto anterior
const btnDialogFecharAnt = document.getElementById("dialog-fechar-anterior");  // Botão para fechar o dialog de ponto anterior

// *** Elementos HTML para fechamento dos dialogs ***

const btnDialogFechar = document.getElementById("dialog-fechar");  // Botão para fechar o dialog de registro de ponto

// *** Inicializações ***
dataAtual.textContent = "Data: " + getCurrentDate();  // Define a data atual no elemento HTML
diaSemana.textContent = getWeekDay();  // Define o dia da semana no elemento HTML
dialogData.textContent = getCurrentDate();  // Mostra a data no dialog
dialogHora.textContent = getCurrentTime();  // Mostra a hora no dialog
updateContentHour();  // Atualiza a hora no campo relevante
setInterval(updateContentHour, 1000);  // Atualiza a hora a cada segundo

// *** Eventos de clique ***
btnRegistrarPonto.addEventListener("click", register);  // Abre o dialog de registro de ponto
btnDialogFechar.addEventListener("click", () => dialogPonto.close());  // Fecha o dialog de registro de ponto
btnDialogRegister.addEventListener("click", handleDialogRegister);  // Lida com o registro de ponto
btnRegistrarAnterior.addEventListener("click", () => pontoAnterior.showModal());  // Abre o dialog de ponto anterior
btnDialogFecharAnt.addEventListener("click", () => pontoAnterior.close());  // Fecha o dialog de ponto anterior

// *** Funções principais ***

// Abre o dialog de registro de ponto
function register() {
    let lastRegister = JSON.parse(localStorage.getItem("lastRegister"));  // Obtém o último registro do localStorage

    if (lastRegister) {  // Se houver um último registro, exibe suas informações
        let lastDateRegister = lastRegister.date;
        let lastTimeRegister = lastRegister.time;
        let lastRegisterType = lastRegister.type;

        dialogUltimoRegistro.textContent = "Último registro: " + lastDateRegister + " às " + lastTimeRegister + " durante o registro " + lastRegisterType;
    }

    // Esconde a mensagem de sucesso, se estiver visível
    alertaSucesso.classList.remove("show");
    alertaSucesso.classList.add("hidden");

    clearTimeout();  // Limpa qualquer timeout pendente
    dialogPonto.showModal();  // Abre o dialog de registro de ponto
}

// Lida com o registro de ponto no dialog
async function handleDialogRegister() {
    let register = await getObjetctRegister(selectRegisterType.value);  // Cria o objeto de registro
    saveRegisterLocalStorage(register);  // Salva o registro no localStorage
    localStorage.setItem("lastRegister", JSON.stringify(register));  // Armazena o último registro no localStorage

    // Exibe uma mensagem de sucesso temporária
    alertaSucesso.classList.remove("hidden");
    alertaSucesso.classList.add("show");

    setTimeout(() => {
        alertaSucesso.classList.remove("show");
        alertaSucesso.classList.add("hidden");
    }, 5000);

    dialogPonto.close();  // Fecha o dialog de registro de ponto
}

// Define o tipo de registro com base no último registro
function setRegisterType() {
    let lastType = localStorage.setItem("lastRegisterType");  // Obtém o último tipo de registro

    // Define o próximo tipo de registro baseado no último
    if (lastType == "entrada") {
        selectRegisterType.value = "intervalo";
    } else if (lastType == "intervalo") {
        selectRegisterType.value = "volta-intervalo";
    } else if (lastType == "volta-intervalo") {
        selectRegisterType.value = "saida";
    } else if (lastType == "saida") {
        selectRegisterType.value = "entrada";
    }

    dialogHora.textContent = "Hora: " + getCurrentTime();  // Atualiza a hora no dialog
    setInterval(() => dialogHora.textContent = "Hora: " + getCurrentTime(), 1000);  // Atualiza a hora a cada segundo
}

// *** Funções auxiliares ***

// Obtém a localização do usuário
function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }),
            error => reject("Erro " + error)  // Trata erros ao obter a localização
        );
    });
}

// Cria o objeto de registro com as informações do ponto
async function getObjetctRegister(registerType) {
    const location = await getUserLocation();  // Obtém a localização do usuário
    return {
        date: getCurrentDate(),  // Data atual
        time: getCurrentTime(),  // Hora atual
        location,  // Localização do usuário
        id: 1,  // ID do registro
        type: registerType  // Tipo de registro
    };
}

// Atualiza a hora e a exibe nos campos relevantes
function updateContentHour() {
    const currentTime = getCurrentTime();  // Obtém a hora atual
    horaAtual.textContent = currentTime;  // Define a hora no campo "horaAtual"
    dialogHora.textContent = currentTime;  // Define a hora no dialog
}

// Obtém a hora atual no formato "hh:mm:ss"
function getCurrentTime() {
    const date = new Date();  // Obtém a data e hora atuais
    return String(date.getHours()).padStart(2, '0') + ":" +
           String(date.getMinutes()).padStart(2, '0') + ":" +
           String(date.getSeconds()).padStart(2, '0');  // Formata a hora
}

// Obtém a data atual no formato "dd/mm/aaaa"
function getCurrentDate() {
    const date = new Date();  // Obtém a data atual
    return String(date.getDate()).padStart(2, '0') + "/" +
           String(date.getMonth() + 1).padStart(2, '0') + "/" +
           date.getFullYear();  // Formata a data
}

// Obtém o dia da semana como string (Domingo a Sábado)
function getWeekDay() {
    const diasSemana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
    return diasSemana[new Date().getDay()];  // Retorna o nome do dia da semana
}

// *** LocalStorage ***

// Salva o registro no localStorage
function saveRegisterLocalStorage(register) {
    const registerLocalStorage = getRegisterLocalStorage("register");  // Obtém o array de registros do localStorage
    registerLocalStorage.push(register);  // Adiciona o novo registro ao array
    localStorage.setItem("register", JSON.stringify(registerLocalStorage));  // Salva o array atualizado no localStorage
}

// Obtém os registros do localStorage
function getRegisterLocalStorage(key) {
    let register = localStorage.getItem(key);  // Obtém os registros do localStorage pela chave fornecida
    return register ? JSON.parse(register) : [];  // Retorna os registros ou um array vazio se não houver nenhum
}

// ( ) A fazer, atualizar a data e o dia da semana se o usuário bater o ponto meia noite
// (X) A fazer 2, usar <dialog> para criar um popup quando se é clicado no botão "Registrar ponto"
// ( ) A fazer 3, formatar a data dependendo do local onde o site é acessado
// (X) A fazer 4, btnDialogEntrada que recupera as informações (data, hora, localização [latitude, longitude], tipo: entrada) e salvar essas infos num objeto JavaScript
// (X) A fazer 5, arrumar a localização que aparece, atualmente, no local storage de forma assíncrona
// (X) A fazer 6, mostrar ao usuário, no dialog, quando foi seu último "input"
// (X) A fazer 7, organizar o código
// ( ) A fazer 8, corrigir bug quando o ponto é registrado com sucesso
// ( ) A fazer 9, adicionar um caso de erro para se o usuário tentar registrar ponto sem a localização
// ( ) A fazer 10, botar negrito os textos do código
// * ( ) A fazer 11, garantir que o usuário apenas registre entrada seguido de intervalo seguido de saída do intervalo seguido de saída
// * ( ) A fazer 12, após isso, juntar esses 4 tipos em um "relatório", que vai estar na página separada