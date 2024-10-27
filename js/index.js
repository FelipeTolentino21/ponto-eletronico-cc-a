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
const btnDialogFechar = document.getElementById("dialog-fechar");  // Botão para fechar o dialog de registro de ponto

// *** Elementos HTML relacionados ao dialog de registro anterior ***

const pontoAnterior = document.getElementById("ponto-anterior");  // Dialog para exibir o ponto anterior
const btnPontoAnterior = document.getElementById("btn-ponto-anterior");  // Botão que abre o dialog de ponto anterior
const btnDialogFecharAnt = document.getElementById("dialog-fechar-anterior");  // Botão para fechar o dialog de ponto anterior



// *** Elementos HTML relacionados a pagina registros.html ***
const registros = document.getElementById("registros");

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
// Abre o dialog de ponto anterior e fechar o dialog ponto
btnPontoAnterior.addEventListener("click", () => {
    pontoAnterior.showModal();
    dialogPonto.close();
});
// Fecha o dialog de ponto anterior
btnDialogFecharAnt.addEventListener("click", () => {
    pontoAnterior.close();
    dialogPonto.showModal();
});

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

    // Esconde a mensagem de sucesso 
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
// Array com a sequência de registros permitidos
const sequenciaRegistros = ["entrada", "intervalo", "volta-intervalo", "saida"];
let estadoAtual = 0; // Índice do próximo registro permitido

document.getElementById("register-type").addEventListener("change", function() {
    const tipoSelecionado = this.value;

    // Verifica se o tipo selecionado é o próximo na sequência
    if (tipoSelecionado === sequenciaRegistros[estadoAtual]) {
        document.getElementById("btn-dialog-register").disabled = false; // Ativa o botão
    } else {
        alert("Selecione o próximo tipo de registro na sequência.");
        this.value = ""; // Reseta a seleção para forçar o usuário a escolher a opção correta
        document.getElementById("btn-dialog-register").disabled = true; // Desativa o botão
    }
});

// Atualiza o estado após o registro
document.getElementById("btn-dialog-register").addEventListener("click", function() {
    if (estadoAtual < sequenciaRegistros.length - 1) {
        estadoAtual++; // Avança para o próximo tipo de registro
    } else {
        alert("Todos os registros foram concluídos.");
        estadoAtual = 0; // Reinicia a sequência
    }
    document.getElementById("register-type").value = ""; // Limpa a seleção do dropdown
    document.getElementById("btn-dialog-register").disabled = true; // Desativa o botão até nova seleção
});

// *** Funções auxiliares ***
// Obtém a localização do usuário e nega o registro caso a permissão de localização não seja autorizada
function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }),
            error => {
                if (error.code === 1) {
                    reject("Permissão de localização negada pelo usuário.");
                    alert("Registro negado! Por favor autorize o site a ver sua localização.");
                } else {
                    reject("Erro ao obter localização: " + error.message);
                }
            }
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
function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return '${dia}-${mes}-${ano}';
}
// Registra uma data anterior e valida se realmente é anterior ao dia de hoje ou se é uma data futura
const today = new Date();   
const registroDataAnt = document.getElementById("data-ant");
const btnRegistrarAnterior = document.getElementById("btn-registrar-anterior");
btnRegistrarAnterior.addEventListener("click", registerAntDate);
registroDataAnt.max = formatarData(today);

function registerAntDate(){

    const selectedDate = new Date(registroDataAnt.value);
    const todayDate = new Date();

    if(selectedDate > todayDate){
        alert("A data selecionada é inválida, por favor selecione uma data válida");
    } else{
        const dataFormatada = registroDataAnt.value;

        localStorage.setItem('registeredAntDate', dataFormatada);

        alert("Data anterior registrada com sucesso");

        dialogUltimoRegistro.textContent = "último Registro(registrado em data anterior)" + selectedDate;
    }
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
// (X) A fazer 8, corrigir bug quando o ponto é registrado com sucesso
// (X) A fazer 9, adicionar um caso de erro para se o usuário tentar registrar ponto sem a localização
// (X) A fazer 10, botar negrito os textos do código
// (X) A fazer 11, garantir que o usuário apenas registre entrada seguido de intervalo seguido de saída do intervalo seguido de saída
//      ( ) A fazer 11.5, garantir que isso se aplique para pontos anteriores
// * ( ) A fazer 12, após isso, juntar esses 4 tipos em um "relatório", que vai estar na página separada
// ( ) A fazer 13, trocar a cor dos textos para branco e colocar uma div na big-div para ser um "template" (fundinho)
// *** ( ) A fazer 14, adicionar todas as funcionalidades do código no JS
// ( ) A fazer 15, concertar o rodapé, concertar responsividade e concertar o fundo-pagina-inicial