// --- Modal de Login ---
const modalOverlay = document.getElementById('modal_overlay');
const btnLogin = document.getElementById('btn_login');
const modalFechar = document.getElementById('modal_fechar');

// Abre o modal de login ao clicar no botão de login do topo
if (btnLogin) {
      btnLogin.addEventListener('click', () => {
            modalOverlay.classList.add('aberto');
      });
}

// Fecha o modal de login no botão "X"
if (modalFechar) {
      modalFechar.addEventListener('click', () => {
            modalOverlay.classList.remove('aberto');
      });
}

// --- Modal de Nova Ocorrência ---
const modalOcorrenciaOverlay = document.getElementById('modal_ocorrencia_overlay');
const btnOcorrencia = document.getElementById('btn_ocorrencia');
const btnFecharOcorrencia = document.getElementById('modal_ocorrencia_fechar');
const btnCancelarOcorrencia = document.getElementById('btn_cancelar_ocorrencia');

// Abre o modal de ocorrência
if (btnOcorrencia) {
      btnOcorrencia.addEventListener('click', () => {
            modalOcorrenciaOverlay.classList.add('aberto');
      });
}


// Fecha o modal de ocorrência (botão Cancelar)
if (btnCancelarOcorrencia) {
      btnCancelarOcorrencia.addEventListener('click', () => {
            modalOcorrenciaOverlay.classList.remove('aberto');
      });
}


// --- Lógica de Prioridade (Botões dentro do modal) ---
const prioridadeBtns = document.querySelectorAll('.prioridade_btn');

prioridadeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
            // Remove as classes de ativação de todos os botões
            prioridadeBtns.forEach(b => b.classList.remove('ativo', 'active_media'));
            
            // Adiciona a classe 'ativo' apenas no que foi clicado
            btn.classList.add('ativo');
      });
});

// --- Simulação de preenchimento dos Cards --- 
document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('total_ocorrencias').textContent = '---';
      document.getElementById('variacao_total').textContent = '---';
      document.getElementById('variacao_total').style.color = '#f85149'; // Vermelho (ruim se subir)

      document.getElementById('tempo_resposta').textContent = '---';
      document.getElementById('variacao_tempo').textContent = '---';
      document.getElementById('variacao_tempo').style.color = '#3ecf8e'; // Verde (bom se baixar)

      document.getElementById('regioes').textContent = '---';
      document.getElementById('variacao_regioes').textContent = '---';
      document.getElementById('variacao_regioes').style.color = '#8892b0';

      document.getElementById('taxa_resolucao').textContent = '---';
      document.getElementById('variacao_taxa').textContent = '---';
      document.getElementById('variacao_taxa').style.color = '#3ecf8e';
});

// 1. Inicializa o mapa sem passar coordenadas fixas no início
const mapa = L.map('mapa');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
}).addTo(mapa);

// Raio máximo de visualização
const RAIO_MAXIMO_METROS = 2000;

// setView: true faz o mapa iniciar e focar direto onde o usuário está
// maxZoom: 15 define a aproximação inicial do mapa ao encontrar o usuário
mapa.locate({ setView: true, maxZoom: 15, enableHighAccuracy: true });

// Evento executado assim que a localização é encontrada
mapa.on('locationfound', (e) => {
    const localizacaoUsuario = e.latlng;

    // Ponto onde esta o usuario
    L.marker(localizacaoUsuario)
        .addTo(mapa)
        .bindPopup("<b>Você está aqui</b>")
        .openPopup();

    // Desenha o círculo do raio ao redor do usuário
    L.circle(localizacaoUsuario, {
        color: '#00d4ff',
        fillColor: '#00d4ff',
        fillOpacity: 0.15,
        radius: RAIO_MAXIMO_METROS
    }).addTo(mapa);
});

// Caso o usuário negue a permissão ou o GPS falhe
mapa.on('locationerror', (e) => {
    console.log("Geolocalização negada ou indisponível. Usando posição padrão.");
    
    // Posição no centro de SP caso ele não mude ou negue o GPS
    const posicaoPadrao = [-23.5505, -46.6333];
    mapa.setView(posicaoPadrao, 12);
});