const botoes = document.querySelectorAll(".botao");
const textos = document.querySelectorAll(".aba-conteudo");
const inputsProgresso = document.querySelectorAll(".progresso input");
const botoesConcluir = document.querySelectorAll(".botao-concluir");

const contadores = document.querySelectorAll(".contador");
const tempoObjetivo1 = new Date("2025-06-15T00:00:00");
const tempoObjetivo2 = new Date("2025-07-15T00:00:00");
const tempoObjetivo3 = new Date("2025-08-15T00:00:00");
const tempos = [tempoObjetivo1, tempoObjetivo2, tempoObjetivo3];

let charts = [];

function calculaTempo(tempoObjetivo) {
    let tempoAtual = new Date();
    let tempoFinal = tempoObjetivo - tempoAtual;
    let segundos = Math.floor(tempoFinal / 1000);
    let minutos = Math.floor(segundos / 60);
    let horas = Math.floor(minutos / 60);
    let dias = Math.floor(horas / 24);
    horas %= 24;
    if (tempoFinal > 0) {
        return [dias, horas];
    } else {
        return [0, 0];
    }
}

function atualizaCronometro() {
    for (let i = 0; i < contadores.length; i++) {
        let tempo = calculaTempo(tempos[i]);
        document.getElementById("dias" + i).textContent = tempo[0];
        document.getElementById("horas" + i).textContent = tempo[1];
    }
}

function comecaCronometro() {
    atualizaCronometro();
    setInterval(atualizaCronometro, 1000);
}

comecaCronometro();

for (let i = 0; i < botoes.length; i++) {
    botoes[i].onclick = function () {
        for (let j = 0; j < botoes.length; j++) {
            botoes[j].classList.remove("ativo");
            textos[j].classList.remove("ativo");
        }
        botoes[i].classList.add("ativo");
        textos[i].classList.add("ativo");
    }
}

function criarGrafico(abaIndex) {
    let progresso = inputsProgresso[abaIndex].value || 0;
    let ctx = document.getElementById("grafico" + abaIndex).getContext("2d");
    let chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Concluído", "Restante"],
            datasets: [{
                data: [progresso, 100 - progresso],
                backgroundColor: ["#1565C0", "#E0E0E0"],
                borderWidth: 0
            }]
        },
        options: {
            cutout: "70%",
            plugins: {
                legend: { display: false }
            }
        }
    });
    charts[abaIndex] = chart;
}

function atualizarGrafico(abaIndex) {
    let progresso = inputsProgresso[abaIndex].value || 0;
    charts[abaIndex].data.datasets[0].data = [progresso, 100 - progresso];
    charts[abaIndex].update();
}

for (let i = 0; i < inputsProgresso.length; i++) {
    let progressoSalvo = localStorage.getItem("progresso" + i);
    if (progressoSalvo) {
        inputsProgresso[i].value = progressoSalvo;
    }
    criarGrafico(i);
    inputsProgresso[i].onchange = function () {
        let valor = Math.max(0, Math.min(100, inputsProgresso[i].value));
        inputsProgresso[i].value = valor;
        localStorage.setItem("progresso" + i, valor);
        atualizarGrafico(i);
    };
}

for (let i = 0; i < botoesConcluir.length; i++) {
    botoesConcluir[i].onclick = function () {
        localStorage.setItem("progresso" + i, "100");
        inputsProgresso[i].value = 100;
        document.getElementById("dias" + i).textContent = 0;
        document.getElementById("horas" + i).textContent = 0;
        atualizarGrafico(i);
        alert("Projeto concluído!");
    };
}
