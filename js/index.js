const diaSemana = document.getElementById("dia-semana");
const dataAtual = document.getElementById("data-atual");
const horaAtual = document.getElementById("hora-atual");

function updateContentHour(){
    diaSemana.textContent = getDayOfTheWeek();
    dataAtual.textContent = getCurrentDate();
    horaAtual.textContent = getCurrentTime();

}

// Retorna a hora atual (hora:minuto:segundo)
function getCurrentTime(){
    const date = new Date();

    if ( ((date.getHours()) < 10) && ((date.getMinutes()) < 10) && ((date.getSeconds()) < 10) ){
        return "0" + date.getHours() + ":" + "0" + date.getMinutes() + ":" + "0" + date.getSeconds();
    } else if ( ((date.getHours()) < 10) && ((date.getMinutes()) < 10) ){
        return "0" + date.getHours() + ":" + "0" + date.getMinutes() + ":" + date.getSeconds();
    } else if ( ((date.getHours()) < 10) && ((date.getSeconds()) < 10) ){
        return "0" + date.getHours() + ":" + date.getMinutes() + ":" + "0" + date.getSeconds();
    } else if ( ((date.getMinutes()) < 10) && ((date.getSeconds()) < 10) ){
        return  date.getHours() + ":" + "0" + date.getMinutes() + ":" + "0" + date.getSeconds();
    } else if ( ((date.getHours()) < 10) ){
        return  "0" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    } else if ( ((date.getMinutes()) < 10) ){
        return  date.getHours() + ":" + "0" + date.getMinutes() + ":" + date.getSeconds();
    } else if ( ((date.getSeconds()) < 10) ){
        return  date.getHours() + ":" + date.getMinutes() + ":" + "0" + date.getSeconds();
    } else {    
        return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }
}

// Retorna a data atul (dd/mm/aaaa)
function getCurrentDate(){
    const date = new Date();
    if ( ((date.getDate()) < 10) && ((date.getMonth()) < 10) ){
        return "0" + date.getDate() + "/" + "0" + (date.getMonth()+1) + "/" + date.getFullYear();
    } else if ( ((date.getDate()) < 10) ){
        return "0" + date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
    } else if ( ((date.getMonth()) < 10) ){
        return date.getDate() + "/" + "0" + (date.getMonth()+1) + "/" + date.getFullYear();
    } else {
        return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
    }
}

// Retorna o dia da semana
function getDayOfTheWeek(){
    const date = new Date();

    if (date.getDay() == 0){
        return "Domingo";
    } else if (date.getDay() == 1){
        return "Segunda-Feira";
    } else if (date.getDay() == 2) {
        return "Terça-Feira";
    } else if (date.getDay() == 3) {
        return "Quarta-Feira";
    } else if (date.getDay() == 4) {
        return "Quinta-Feira";
    } else if (date.getDay() == 5) {
        return "Sexta-Feira";
    } else if (date.getDay() == 6) {
        return "Sábado";
    } else {
        return date.getDay() + "Dia Inválido";
    }
    /*
    switch (date.getDay){
        case 1:
            return "Segunda-Feira";
            break;
        case 2:
            return "Terça-Feira";
            break;
        case 3:
            return "Quarta-Feira";
            break;
        case 4:
            return "Quinta-Feira";
            break;
        case 5:
            return "Sexta-Feira";
            break;
        case 6:
            return "Sábado";
            break;
        case 7:
            return "Domingo";
            break;
        default:
            return date.getDay() + "Dia Inválido";
    }
    */
}

setInterval(updateContentHour, 1000);

console.log(getDayOfTheWeek());
console.log(getCurrentDate());
console.log(getCurrentTime());
