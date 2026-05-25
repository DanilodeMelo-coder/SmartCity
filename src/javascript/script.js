const sidebar = document.getElementById('sidebar');
const openBtn = document.getElementById('open_btn');
const conteudo = document.getElementById('conteudo');

openBtn.addEventListener('click', () => {
      sidebar.classList.toggle('closed');
});

// ─Mapa
const mapa = L.map('mapa').setView([-23.5505, -46.6333], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
}).addTo(mapa);


const sideItems = document.querySelectorAll('.side-item');

const secoes = {
      'Dashboard':   'cards',
      'Mapa':        'secao_mapa',
      'Ocorrências': 'ocorrencias_recentes',
      'Resposta':    'secao_mapa',
      'Relatórios':  'graficos',
      'Atividade':   'graficos',
};

sideItems.forEach(item => {
      item.addEventListener('click', () => {
            sideItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const nome = item.querySelector('.item-description').textContent.trim();
            const idDestino = secoes[nome];
            if (idDestino) {
                  const destino = document.getElementById(idDestino);
                  if (destino) {
                        destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
            }
      });
});

const API_URL = 'http://localhost:8080/api';

async function carregarDashboard() {

    // Total de ocorrências
    try {
        const resposta = await fetch(`${API_URL}/ocorrencias`);
        const lista = await resposta.json();

        document.getElementById('total_ocorrencias').textContent = lista.length;
        document.getElementById('variacao_total').textContent = '';

        // Tempo médio de resposta
        const tempos = lista.filter(o => o.tempoRespostaMinutos != null);
        if (tempos.length > 0) {
            const media = tempos.reduce((s, o) => s + o.tempoRespostaMinutos, 0) / tempos.length;
            document.getElementById('tempo_resposta').textContent = Math.round(media) + ' min';
        } else {
            document.getElementById('tempo_resposta').textContent = 'N/A';
        }
        document.getElementById('variacao_tempo').textContent = '';

        // Regiões monitoradas (bairros únicos com ocorrências)
        const bairros = new Set(lista.map(o => o.idBairro).filter(b => b != null));
        document.getElementById('regioes').textContent = bairros.size;
        document.getElementById('variacao_regioes').textContent = '';

        // Taxa de resolução
        const resolvidas = lista.filter(o => o.idStatus === 3).length;
        const taxa = lista.length > 0 ? ((resolvidas / lista.length) * 100).toFixed(1) : 0;
        document.getElementById('taxa_resolucao').textContent = taxa + '%';
        document.getElementById('variacao_taxa').textContent = '';

        // Gráfico de ocorrências por região
    try {
    const respostaRegioes = await fetch(`${API_URL}/dashboard/ocorrencias-por-bairro`);
    const dadosRegioes = await respostaRegioes.json();

    const labels = dadosRegioes.map(item => item[0]);
    const valores = dadosRegioes.map(item => item[1]);

    new Chart(document.getElementById('grafico_regioes'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ocorrências',
                data: valores,
                backgroundColor: '#00d4ff',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { ticks: { color: '#8b949e' }, grid: { color: '#21262d' } },
                x: { ticks: { color: '#8b949e' }, grid: { display: false } }
            }
        }
    });
      } catch (erro) {
    console.error("Erro ao carregar gráfico de regiões:", erro);
      }

      // Gráfico de tipos de incidentes
try {
    const respostaTipos = await fetch(`${API_URL}/dashboard/ocorrencias-por-tipo`);
    const dadosTipos = await respostaTipos.json();

    const labelsTipos = dadosTipos.map(item => item[0]);
    const valoresTipos = dadosTipos.map(item => item[1]);

    document.getElementById('total_tipos').textContent = valoresTipos.reduce((a, b) => a + b, 0) + ' total';

    new Chart(document.getElementById('grafico_tipos'), {
        type: 'doughnut',
        data: {
            labels: labelsTipos,
            datasets: [{
                data: valoresTipos,
                backgroundColor: [
                    '#00d4ff', '#ff6384', '#ffce56',
                    '#4bc0c0', '#9966ff', '#ff9f40',
                    '#36a2eb', '#e7e9ed', '#8b949e'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#8b949e', padding: 15 }
                }
            }
        }
    });
} catch (erro) {
    console.error("Erro ao carregar gráfico de tipos:", erro);
}

    } catch (erro) {
        console.error("Erro ao carregar dashboard:", erro);
    }
}

document.addEventListener('DOMContentLoaded', carregarDashboard);

const periodoBtns = document.querySelectorAll('.periodo_btn');

periodoBtns.forEach(btn => {
      btn.addEventListener('click', () => {
            periodoBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
      });
});