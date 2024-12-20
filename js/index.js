const diaSemana = document.getElementById("dia-semana");  // Exibe o dia da semana no cabeçalho
const dataAtual = document.getElementById("data-atual");  // Exibe a data atual no cabeçalho
const horaAtual = document.getElementById("hora-atual");  // Exibe a hora atual no cabeçalho

const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");  // Botão que abre o dialog de registro
const dialogPonto = document.getElementById("dialog-ponto");  // Dialog para registrar ponto
const dialogData = document.getElementById("dialog-data");  // Exibe a data atual no dialog
const dialogHora = document.getElementById("dialog-hora");  // Exibe a hora atual no dialog
const selectRegisterType = document.getElementById("register-type");  // Seleciona o tipo de registro
const btnDialogRegister = document.getElementById("btn-dialog-register");  // Botão para confirmar o registro no dialog
const alertaSucesso = document.getElementById("alerta-ponto-registrado");  // Alerta de sucesso após registrar ponto
const dialogUltimoRegistro = document.getElementById("dialog-ultimo-registro");  // Exibe o último registro no dialog
const btnDialogFechar = document.getElementById("dialog-fechar");  // Botão para fechar o dialog de registro de ponto
const observacaoRegister = document.getElementById("obs-dialog-ponto");

const pontoAnterior = document.getElementById("ponto-anterior");  // Dialog para exibir o ponto anterior
const btnPontoAnterior = document.getElementById("btn-ponto-anterior");  // Botão que abre o dialog de ponto anterior
const btnDialogFecharAnt = document.getElementById("dialog-fechar-anterior");  // Botão para fechar o dialog de ponto anterior

const btnJustificativa = document.getElementById("btn-justificativa");
const justificativa = document.getElementById("justificativa");
const dialogFecharJustificativa = document.getElementById("dialog-fechar-justificativa");
const obsJustificativa = document.getElementById("obs-justificativa");
const arqvJustificativa = document.getElementById("arqv-justificativa");
const btnEnviarJustificativa = document.getElementById("btn-enviar-justificativa");

const registros = document.getElementById("registros");

dataAtual.textContent = "Data: " + getCurrentDate();  // Define a data atual no elemento HTML
diaSemana.textContent = getWeekDay();  // Define o dia da semana no elemento HTML
dialogData.textContent = getCurrentDate();  // Mostra a data no dialog
dialogHora.textContent = getCurrentTime();  // Mostra a hora no dialog
updateContentHour();  // Atualiza a hora no campo relevante
setInterval(updateContentHour, 1000);  // Atualiza a hora a cada segundo


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

btnJustificativa.addEventListener("click", () => {
    justificativa.showModal();
    dialogPonto.close();
});

dialogFecharJustificativa.addEventListener("click", () => {
    justificativa.close();
    dialogPonto.showModal();
});

btnEnviarJustificativa.addEventListener("click", () => {
    // Verifica se a observação está preenchida
    if (!obsJustificativa.value) {
        alert("Por favor, escreva o motivo da sua falta antes de enviar.");
        return; // Interrompe a função se a observação estiver vazia
    }

    // Cria um array para armazenar os arquivos
    const arquivos = Array.from(arqvJustificativa.files).map(file => file.name);

    // Cria um objeto para armazenar a justificativa
    const justificativaData = {
        observacao: obsJustificativa.value,
        arquivos: arquivos // Armazena os nomes dos arquivos
    };

    // Salva a justificativa no localStorage
    localStorage.setItem("justificativa", JSON.stringify(justificativaData));

    alert("Justificativa enviada com sucesso");
    justificativa.close();
    dialogPonto.showModal();
});

// Abre o dialog de registro de ponto
function register() {
    let lastRegister = JSON.parse(localStorage.getItem("lastRegister"));  // Obtém o último registro do localStorage

    if (lastRegister) {  // Se houver um último registro, exibe suas informações
        if (lastRegister.isPrevious == false) {
            let lastDateRegister = lastRegister.date;
            let lastTimeRegister = lastRegister.time;
            let lastRegisterType = lastRegister.type;

            dialogUltimoRegistro.textContent = "Último registro: " + lastDateRegister + " às " + lastTimeRegister + ". Tipo de registro: " + lastRegisterType;
        } else {
            let lastDateRegister = lastRegister.date;
            let lastRegisterType = lastRegister.type;

            dialogUltimoRegistro.textContent = "Último registro (marcado em data anterior): " + lastDateRegister + ". Tipo de registro: " + lastRegisterType;
        }
    }

    // Esconde a mensagem de sucesso 
    alertaSucesso.classList.remove("show");
    alertaSucesso.classList.add("hidden");

    clearTimeout();  // Limpa qualquer timeout pendente
    dialogPonto.showModal();  // Abre o dialog de registro de ponto
}

// Lida com o registro de ponto no dialog
async function handleDialogRegister() {
    let register = await getObjectRegister(selectRegisterType.value);  // Cria o objeto de registro
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

// Função para proibir que o registro selecionado seja o próximo do último que foi selecionado
// Array com a sequência de registros permitidos
const sequenciaRegistros = ["entrada", "intervalo", "volta-intervalo", "saida"];
let estadoAtual = 0; // Índice do próximo registro permitido
document.getElementById("register-type").addEventListener("change", async function () {
    const tipoSelecionado = this.value;

    try {
        // Aguarda a localização do usuário antes de prosseguir
        const location = await getUserLocation();

        // Verifica se o tipo selecionado é o próximo na sequência e se a localização foi obtida
        if (tipoSelecionado === sequenciaRegistros[estadoAtual]) {
            document.getElementById("btn-dialog-register").disabled = false; // Ativa o botão
        } else {
            alert("Selecione o próximo tipo de registro na sequência.");
            this.value = ""; // Reseta a seleção para forçar o usuário a escolher a opção correta
            document.getElementById("btn-dialog-register").disabled = true; // Desativa o botão
        }
    } catch (error) {
        this.value = ""; // Reseta a seleção para impedir o registro
        document.getElementById("btn-dialog-register").disabled = true; // Desativa o botão
    }
});

// Atualiza o estado após o registro
document.getElementById("btn-dialog-register").addEventListener("click", function () {
    if (estadoAtual < sequenciaRegistros.length - 1) {
        estadoAtual++; // Avança para o próximo tipo de registro
    } else {
        alert("Todos os registros foram concluídos.");
        estadoAtual = 0; // Reinicia a sequência
    }
    document.getElementById("register-type").value = ""; // Limpa a seleção do dropdown
    document.getElementById("btn-dialog-register").disabled = true; // Desativa o botão até nova seleção
});

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
function getNextId() {
    const registros = getRegisterLocalStorage("register");
    if (registros.length === 0) return 0; // Se não houver registros, inicia com 1
    return Math.max(...registros.map(r => r.id)) + 1; // Retorna o próximo ID
}

// Cria o objeto de registro com as informações do ponto
async function getObjectRegister(registerType) {
    const location = await getUserLocation();  // Obtém a localização do usuário
    return {
        id: getNextId(),  // Atribui o próximo ID
        date: getCurrentDate(),  // Data atual
        time: getCurrentTime(),  // Hora atual
        location,  // Localização do usuário
        type: registerType,  // Tipo de registro
        obs: observacaoRegister.value,
        isPrevious: false,
        isEdited: false
    };
}


// Registra uma data anterior e valida se realmente é anterior ao dia de hoje ou se é uma data futura
const today = new Date();
const registroDataAnt = document.getElementById("data-ant");
const btnRegistrarAnterior = document.getElementById("btn-registrar-anterior");
btnRegistrarAnterior.addEventListener("click", registerAntDate);
registroDataAnt.max = formatarData(today);

// Função que lida com o registro de uma data anterior
async function registerAntDate() {
    const dateInput = document.getElementById("data-ant").value;

    // Verifica se o usuário preencheu data e hora
    if (!dateInput) {
        alert("Por favor, preencha a data e a hora antes de registrar.");
        return; // Interrompe a função se data ou hora estiverem vazios
    }

    const selectedDate = new Date(dateInput);
    const todayDate = new Date();

    // Verifica se a data selecionada é futura
    if (selectedDate > todayDate) {
        alert("A data selecionada é inválida, por favor selecione uma data válida.");
        return; // Interrompe a função se a data for futura
    }

    // Formata a data no padrão dd-mm-aaaa
    const formattedDate = `${String(selectedDate.getDate()).padStart(2, '0')}/${String(selectedDate.getMonth() + 1).padStart(2, '0')}/${selectedDate.getFullYear()}`;

    // Cria o objeto de registro com o indicador de registro anterior
    const register = {
        date: formattedDate,
        time: "",
        location: await getUserLocation(),
        id: getNextId(),
        type: document.getElementById("register-type-ant").value,
        obs: document.getElementById("obs-dialog-ant").value,
        isPrevious: true,
        isEdited: false
    };

    // Salva o registro no localStorage
    saveRegisterLocalStorage(register);

    localStorage.setItem("lastRegister", JSON.stringify(register));

    // Exibe uma mensagem de sucesso temporária
    alertaSucesso.classList.remove("hidden");
    alertaSucesso.classList.add("show");

    setTimeout(() => {
        alertaSucesso.classList.remove("show");
        alertaSucesso.classList.add("hidden");
    }, 5000);

    pontoAnterior.close();
    dialogPonto.close();
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