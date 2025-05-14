// Selecionando todos os botões e conteúdos das abas
const botoes = document.querySelectorAll(".botao");
const abas = document.querySelectorAll(".aba-conteudo");
const inputsProgresso = document.querySelectorAll(".progresso input");
const botoesConcluir = document.querySelectorAll(".botao-concluir");
const contadores = document.querySelectorAll(".contador");

// Definindo datas alvo (30, 60, 90 dias a partir de hoje)
const tempoObjetivo1 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
const tempoObjetivo2 = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
const tempoObjetivo3 = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
const tempos = [tempoObjetivo1, tempoObjetivo2, tempoObjetivo3];

// Função pra calcular o tempo restante
function calculaTempo(tempoObjetivo) {
    let tempoAtual = new Date();
    let tempoFinal = tempoObjetivo - tempoAtual;
    if (tempoFinal > 0) {
        let dias = Math.floor(tempoFinal / (1000 * 60 * 60 * 24));
        let horas = Math.floor((tempoFinal % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return [dias, horas];
    } else {
        return [0, 0];
    }
}

// Atualiza os contadores a cada segundo
function atualizaCronometro() {
    for (let i = 0; i < contadores.length; i++) {
        let [dias, horas] = calculaTempo(tempos[i]);
        document.getElementById("dias" + i).textContent = dias;
        document.getElementById("horas" + i).textContent = horas;
    }
}

// Inicia o cronômetro
setInterval(atualizaCronometro, 1000);

// Array pra guardar os gráficos
let charts = [];

// Função pra criar gráfico de rosca
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

// Navegação entre abas
for (let i = 0; i < botoes.length; i++) {
    botoes[i].onclick = function () {
        // Remove a classe ativo de todos os botões e abas
        for (let j = 0; j < botoes.length; j++) {
            botoes[j].classList.remove("ativo");
            abas[j].classList.remove("ativo");
        }
        // Adiciona a classe ativo no botão e aba clicados
        botoes[i].classList.add("ativo");
        abas[i].classList.add("ativo");
    };
}

// Carrega progresso salvo e cria gráficos
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
        charts[i].data.datasets[0].data = [valor, 100 - valor];
        charts[i].update();
    };
}

// Botões de concluir
for (let i = 0; i < botoesConcluir.length; i++) {
    botoesConcluir[i].onclick = function () {
        localStorage.setItem("progresso" + i, "100");
        inputsProgresso[i].value = 100;
        charts[i].data.datasets[0].data = [100, 0];
        charts[i].update();
        document.getElementById("dias" + i).textContent = 0;
        document.getElementById("horas" + i).textContent = 0;
        alert("Meta concluída!");
    };
}
