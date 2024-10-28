// Função para exibir os registros na página registros.html
function displayRegisters() {
    const container = document.getElementById("container-registros");
    container.innerHTML = ""; // Limpa o container antes de exibir

    const registros = getRegisterLocalStorage("register");

    registros.forEach(register => {
        const registroDiv = document.createElement("div");
        registroDiv.classList.add("registro");

        registroDiv.innerHTML = `
            <p>Data: ${register.date}</p>
            <p>Hora: ${register.time}</p>
            <p>Tipo: ${register.type}</p>
            <p>Observação: ${register.obs}</p>
            <p>Foi Editado: ${register.isEdited ? "Sim" : "Não"}</p>
            <p>É Anterior: ${register.isPrevious ? "Sim" : "Não"}</p>
            <button onclick="editRegister(${register.id})">Editar</button>
            <button onclick="deleteRegister(${register.id})">Excluir</button>
        `;

        container.appendChild(registroDiv);
    });
}

let registroParaEditar = null;  // Variável para armazenar o registro em edição

// Função para abrir o dialog de edição com os dados do registro
function editRegister(id) {
    const registros = getRegisterLocalStorage("register");
    registroParaEditar = registros.find(r => r.id === id);

    if (registroParaEditar) {
        // Preenche os valores atuais do registro nos inputs do dialog
        document.getElementById("edit-date").value = formatDateToInput(registroParaEditar.date);
        document.getElementById("edit-time").value = registroParaEditar.time;
        document.getElementById("edit-type").value = registroParaEditar.type;
        document.getElementById("edit-obs").value = registroParaEditar.obs;

        // Limita a data a até o dia atual
        document.getElementById("edit-date").max = formatDateToInput(new Date());
        document.getElementById("dialog-edit").showModal();  // Abre o dialog
    }
}

// Função para salvar as alterações
function saveEdit() {
    const dateInput = document.getElementById("edit-date");
    const timeInput = document.getElementById("edit-time");

    // Verifica se os campos de data e hora estão preenchidos
    if (!dateInput.value || !timeInput.value) {
        alert("Por favor, preencha a data e a hora antes de salvar.");
        return;
    }

    if (registroParaEditar) {
        const registros = getRegisterLocalStorage("register");

        // Busca e atualiza o registro em edição usando seu ID único
        const registroIndex = registros.findIndex(r => r.id === registroParaEditar.id);
        if (registroIndex !== -1) {
            registros[registroIndex].date = formatDateToDisplay(dateInput.value);
            registros[registroIndex].time = timeInput.value;
            registros[registroIndex].type = document.getElementById("edit-type").value;
            registros[registroIndex].obs = document.getElementById("edit-obs").value;

            // Salva o array atualizado no localStorage
            registros[registroIndex].isEdited = true;
            localStorage.setItem("register", JSON.stringify(registros));
            displayRegisters();  // Atualiza a exibição dos registros

            document.getElementById("dialog-edit").close();  // Fecha o dialog
        }
    }
}

// Função para formatar data no padrão dd/mm/aaaa
function formatDateToInput(date) {
    const data = typeof date === "string" ? new Date(date.split('/').reverse().join('-')) : date;
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
}

// Função para formatar data de volta ao padrão dd/mm/aaaa
function formatDateToDisplay(date) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}

// Eventos para os botões do dialog
document.getElementById("save-edit").addEventListener("click", saveEdit);
document.getElementById("close-edit").addEventListener("click", () => {
    document.getElementById("dialog-edit").close();
});

// Exibe os registros ao carregar a página
window.onload = displayRegisters;

// Função de exclusão (não funcional)
function deleteRegister(id) {
    alert("Erro! não foi possível excluir, tente novamente mais tarde.");
}

// Função para obter registros do localStorage
function getRegisterLocalStorage(key) {
    let register = localStorage.getItem(key);
    return register ? JSON.parse(register) : [];
}